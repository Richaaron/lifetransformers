"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { createBrowserClient } from "@supabase/ssr"

export interface Participant {
  userId: string
  displayName: string
  avatarUrl?: string
  stream?: MediaStream
  isMuted: boolean
  isVideoOff: boolean
}

interface UseGroupCallOptions {
  groupId: string
  currentUser: {
    id: string
    display_name: string
    avatar_url?: string
  }
  callType: "voice" | "video"
  onCallEnded?: () => void
}

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
}

export function useGroupCall({ groupId, currentUser, callType, onCallEnded }: UseGroupCallOptions) {
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map())
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isConnecting, setIsConnecting] = useState(true)
  const [callDuration, setCallDuration] = useState(0)

  const channelRef = useRef<any>(null)
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map())
  const localStreamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const channelName = `group-call:${groupId}`

  const createPeerConnection = useCallback((peerId: string) => {
    const pc = new RTCPeerConnection(ICE_SERVERS)

    // Add local tracks
    localStreamRef.current?.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current!)
    })

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0]
      setParticipants(prev => {
        const next = new Map(prev)
        const existing = next.get(peerId)
        if (existing) {
          next.set(peerId, { ...existing, stream: remoteStream })
        }
        return next
      })
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "peer:ice-candidate",
          payload: {
            from: currentUser.id,
            to: peerId,
            candidate: event.candidate,
          },
        })
      }
    }

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        setIsConnecting(false)
      }
    }

    peersRef.current.set(peerId, pc)
    return pc
  }, [currentUser.id])

  const sendOffer = useCallback(async (peerId: string) => {
    const pc = createPeerConnection(peerId)
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    channelRef.current?.send({
      type: "broadcast",
      event: "peer:offer",
      payload: {
        from: currentUser.id,
        to: peerId,
        offer,
      },
    })
  }, [createPeerConnection, currentUser.id])

  const handleOffer = useCallback(async (fromId: string, offer: RTCSessionDescriptionInit) => {
    const pc = createPeerConnection(fromId)
    await pc.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    channelRef.current?.send({
      type: "broadcast",
      event: "peer:answer",
      payload: {
        from: currentUser.id,
        to: fromId,
        answer,
      },
    })
  }, [createPeerConnection, currentUser.id])

  const handleAnswer = useCallback(async (fromId: string, answer: RTCSessionDescriptionInit) => {
    const pc = peersRef.current.get(fromId)
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer))
    }
  }, [])

  const handleIceCandidate = useCallback(async (fromId: string, candidate: RTCIceCandidateInit) => {
    const pc = peersRef.current.get(fromId)
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate))
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      // Get local media
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video",
      })
      localStreamRef.current = stream
      if (mounted) setLocalStream(stream)

      // Join Supabase Realtime channel with Presence
      const channel = supabase.channel(channelName, {
        config: { presence: { key: currentUser.id } },
      })
      channelRef.current = channel

      // Track who's in the call
      channel.on("presence", { event: "sync" }, () => {
        const state = channel.presenceState()
        const presenceMap = new Map<string, Participant>()

        Object.entries(state).forEach(([userId, presences]: [string, any[]]) => {
          if (userId !== currentUser.id && presences.length > 0) {
            const info = presences[0]
            presenceMap.set(userId, {
              userId,
              displayName: info.displayName || "Member",
              avatarUrl: info.avatarUrl,
              isMuted: info.isMuted ?? false,
              isVideoOff: info.isVideoOff ?? false,
            })
          }
        })

        if (mounted) setParticipants(presenceMap)
      })

      channel.on("presence", { event: "join" }, ({ key, newPresences }: any) => {
        if (key !== currentUser.id && mounted) {
          // Send offer to new participant
          setTimeout(() => sendOffer(key), 500)
        }
      })

      channel.on("presence", { event: "leave" }, ({ key }: any) => {
        // Close peer connection
        const pc = peersRef.current.get(key)
        pc?.close()
        peersRef.current.delete(key)

        setParticipants(prev => {
          const next = new Map(prev)
          next.delete(key)
          return next
        })
      })

      // WebRTC signaling events
      channel.on("broadcast", { event: "peer:offer" }, async ({ payload }: any) => {
        if (payload.to === currentUser.id) {
          await handleOffer(payload.from, payload.offer)
        }
      })

      channel.on("broadcast", { event: "peer:answer" }, async ({ payload }: any) => {
        if (payload.to === currentUser.id) {
          await handleAnswer(payload.from, payload.answer)
        }
      })

      channel.on("broadcast", { event: "peer:ice-candidate" }, async ({ payload }: any) => {
        if (payload.to === currentUser.id) {
          await handleIceCandidate(payload.from, payload.candidate)
        }
      })

      // Listen for mute/video state updates
      channel.on("broadcast", { event: "peer:state" }, ({ payload }: any) => {
        setParticipants(prev => {
          const next = new Map(prev)
          const existing = next.get(payload.userId)
          if (existing) {
            next.set(payload.userId, {
              ...existing,
              isMuted: payload.isMuted,
              isVideoOff: payload.isVideoOff,
            })
          }
          return next
        })
      })

      // Subscribe and track presence
      await channel.subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            displayName: currentUser.display_name,
            avatarUrl: currentUser.avatar_url,
            isMuted: false,
            isVideoOff: false,
          })

          // Start duration timer
          timerRef.current = setInterval(() => {
            setCallDuration(d => d + 1)
          }, 1000)

          setIsConnecting(false)
        }
      })
    }

    init().catch(err => {
      console.error("Group call init error:", err)
      if (mounted) setIsConnecting(false)
    })

    return () => {
      mounted = false
    }
  }, [])

  const toggleMute = useCallback(() => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      const newMuted = !isMuted
      setIsMuted(newMuted)
      channelRef.current?.track({ isMuted: newMuted, isVideoOff })
      channelRef.current?.send({
        type: "broadcast",
        event: "peer:state",
        payload: { userId: currentUser.id, isMuted: newMuted, isVideoOff },
      })
    }
  }, [isMuted, isVideoOff, currentUser.id])

  const toggleVideo = useCallback(() => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      const newVideoOff = !isVideoOff
      setIsVideoOff(newVideoOff)
      channelRef.current?.track({ isMuted, isVideoOff: newVideoOff })
      channelRef.current?.send({
        type: "broadcast",
        event: "peer:state",
        payload: { userId: currentUser.id, isMuted, isVideoOff: newVideoOff },
      })
    }
  }, [isMuted, isVideoOff, currentUser.id])

  const endCall = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    localStreamRef.current?.getTracks().forEach(t => t.stop())
    peersRef.current.forEach(pc => pc.close())
    peersRef.current.clear()
    channelRef.current?.unsubscribe()
    onCallEnded?.()
  }, [onCallEnded])

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0")
    const s = (secs % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  return {
    participants,
    localStream,
    isMuted,
    isVideoOff,
    isConnecting,
    callDuration,
    formatDuration,
    toggleMute,
    toggleVideo,
    endCall,
  }
}
