"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, X } from "lucide-react"

interface VoiceCallModalProps {
  conversationId: string
  otherUser: any
  callType: "voice" | "video"
  currentUserId: string
  onClose: () => void
}

export function VoiceCallModal({ 
  conversationId, 
  otherUser, 
  callType, 
  currentUserId,
  onClose 
}: VoiceCallModalProps) {
  const [callState, setCallState] = useState<"connecting" | "ringing" | "active" | "ended">("connecting")
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [duration, setDuration] = useState(0)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize call
  useEffect(() => {
    const initCall = async () => {
      try {
        // Get local media
        const constraints: MediaStreamConstraints = {
          audio: true,
          video: callType === "video"
        }
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        localStreamRef.current = stream

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Create peer connection (using Google's STUN server for demo)
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
          ]
        })

        peerConnectionRef.current = pc

        // Add local tracks to peer connection
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream)
        })

        // Handle remote stream
        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0]
          }
        }

        // Simulate call connection (in real app, use Supabase Realtime for signaling)
        setTimeout(() => {
          setCallState("ringing")
        }, 1000)

        setTimeout(() => {
          setCallState("active")
          // Start duration timer
          timerRef.current = setInterval(() => {
            setDuration(prev => prev + 1)
          }, 1000)
        }, 3000)

      } catch (err) {
        console.error('Error initializing call:', err)
        alert('Could not access camera/microphone')
        onClose()
      }
    }

    initCall()

    return () => {
      // Cleanup
      if (timerRef.current) clearInterval(timerRef.current)
      localStreamRef.current?.getTracks().forEach(track => track.stop())
      peerConnectionRef.current?.close()
    }
  }, [callType, onClose])

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!isMuted)
      }
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOff(!isVideoOff)
      }
    }
  }

  const endCall = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    localStreamRef.current?.getTracks().forEach(track => track.stop())
    peerConnectionRef.current?.close()
    setCallState("ended")
    setTimeout(onClose, 500)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4">
        {/* Video Container */}
        {callType === "video" && (
          <div className="relative w-full aspect-video bg-surface-900 rounded-2xl overflow-hidden mb-4">
            {/* Remote Video (full screen) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Local Video (picture-in-picture) */}
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-surface-800 rounded-lg overflow-hidden border-2 border-surface-700">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>

            {/* Call Status Overlay */}
            {callState !== "active" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-brand-500">
                    <AvatarImage src={otherUser.avatar_url || ""} />
                    <AvatarFallback className="text-3xl">{getInitials(otherUser.display_name)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-white">{otherUser.display_name}</h3>
                  <p className="text-surface-300 mt-1">
                    {callState === "connecting" ? "Connecting..." : "Ringing..."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Voice Call UI */}
        {callType === "voice" && (
          <div className="bg-surface-900 rounded-2xl p-8 text-center">
            <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-brand-500 animate-pulse">
              <AvatarImage src={otherUser.avatar_url || ""} />
              <AvatarFallback className="text-4xl">{getInitials(otherUser.display_name)}</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-white">{otherUser.display_name}</h3>
            <p className="text-surface-300 mt-2">
              {callState === "connecting" && "Connecting..."}
              {callState === "ringing" && "Ringing..."}
              {callState === "active" && formatDuration(duration)}
              {callState === "ended" && "Call ended"}
            </p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {callState === "active" && (
            <>
              <Button
                onClick={toggleMute}
                size="icon"
                variant={isMuted ? "destructive" : "secondary"}
                className="h-14 w-14 rounded-full"
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>

              {callType === "video" && (
                <Button
                  onClick={toggleVideo}
                  size="icon"
                  variant={isVideoOff ? "destructive" : "secondary"}
                  className="h-14 w-14 rounded-full"
                >
                  {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </Button>
              )}
            </>
          )}

          <Button
            onClick={endCall}
            size="icon"
            variant="destructive"
            className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="w-8 h-8" />
          </Button>

          {callState !== "active" && (
            <Button
              onClick={onClose}
              size="icon"
              variant="ghost"
              className="h-14 w-14 rounded-full text-surface-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </Button>
          )}
        </div>

        {/* Info Text */}
        <p className="text-center text-surface-500 text-sm mt-4">
          {callType === "video" ? "Video" : "Voice"} call with {otherUser.display_name}
        </p>
      </div>
    </div>
  )
}
