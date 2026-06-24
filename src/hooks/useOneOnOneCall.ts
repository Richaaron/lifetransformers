"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { createBrowserClient } from "@supabase/ssr"

interface UseOneOnOneCallOptions {
  callId: string
  currentUser: {
    id: string
    display_name: string
    avatar_url?: string
  }
  otherUserId: string
  callType: "voice" | "video"
  isCaller: boolean
  onCallEnded?: () => void
}

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
}

export function useOneOnOneCall({ 
  callId, 
  currentUser, 
  otherUserId, 
  callType, 
  isCaller, 
  onCallEnded 
}: UseOneOnOneCallOptions) {
  const [callState, setCallState] = useState<"ringing" | "connecting" | "active" | "ended">(isCaller ? "ringing" : "connecting")
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  const channelRef = useRef<any>(null)
  const peerRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const channelName = `one-on-one-call:${callId}`

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS)

    // Add local tracks
    localStreamRef.current?.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current!)
    })

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0]
      setRemoteStream(remoteStream)
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "peer:ice-candidate",
          payload: {
            from: currentUser.id,
            candidate: event.candidate,
          },
        })
      }
    }

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        setCallState("active")
        // Start duration timer
        timerRef.current = setInterval(() => {
          setCallDuration(d => d + 1)
        }, 1000)
      } else if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
        endCall()
      }
    }

    peerRef.current = pc
    return pc
  }, [currentUser.id])

  const sendOffer = useCallback(async () => {
    const pc = createPeerConnection()
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    channelRef.current?.send({
      type: "broadcast",
      event: "peer:offer",
      payload: {
        from: currentUser.id,
        offer,
      },
    })
  }, [createPeerConnection, currentUser.id])

  const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    const pc = createPeerConnection()
    await pc.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    channelRef.current?.send({
      type: "broadcast",
      event: "peer:answer",
      payload: {
        from: currentUser.id,
        answer,
      },
    })
  }, [createPeerConnection, currentUser.id])

  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    const pc = peerRef.current
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer))
    }
  }, [])

  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    const pc = peerRef.current
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate))
    }
  }, [])

  const endCall = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    localStreamRef.current?.getTracks().forEach(t => t.stop())
    peerRef.current?.close()
    channelRef.current?.unsubscribe()
    setCallState("ended")
    setTimeout(() => {
      onCallEnded?.()
    }, 500)
  }, [onCallEnded])

  const toggleMute = useCallback(() => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  const toggleVideo = useCallback(() => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      setIsVideoOff(!isVideoOff)
    }
  }, [isVideoOff])

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0")
    const s = (secs % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

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

      // Join Supabase Realtime channel
      const channel = supabase.channel(channelName, {
        config: { presence: { key: currentUser.id } },
      })
      channelRef.current = channel

      // Handle signaling events
      channel.on("broadcast", { event: "peer:offer" }, async ({ payload }: any) => {
        if (payload.from !== currentUser.id) {
          await handleOffer(payload.offer)
        }
      })

      channel.on("broadcast", { event: "peer:answer" }, async ({ payload }: any) => {
        if (payload.from !== currentUser.id) {
          await handleAnswer(payload.answer)
        }
      })

      channel.on("broadcast", { event: "peer:ice-candidate" }, async ({ payload }: any) => {
        if (payload.from !== currentUser.id) {
          await handleIceCandidate(payload.candidate)
        }
      })

      // Subscribe
      await channel.subscribe(async (status: string) => {
        if (status === "SUBSCRIBED" && mounted) {
          if (isCaller) {
            // Wait a sec then send offer
            setTimeout(() => sendOffer(), 500)
          }
        }
      })
    }

    init().catch(err => {
      console.error("One-on-one call init error:", err)
      if (mounted) endCall()
    })

    return () => {
      mounted = false
    }
  }, [])

  return {
    callState,
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    callDuration,
    formatDuration,
    toggleMute,
    toggleVideo,
    endCall,
  }
}
