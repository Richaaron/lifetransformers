"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Phone, PhoneOff, PhoneCall, Mic, MicOff, Video, VideoOff, X } from "lucide-react"
import { useOneOnOneCall } from "@/hooks/useOneOnOneCall"
import { createCall, updateCallStatus, endCall as endCallServer } from "@/lib/actions/calls"

interface VoiceCallModalProps {
  conversationId: string
  otherUser: any
  callType: "voice" | "video"
  currentUser: {
    id: string
    display_name: string
    avatar_url?: string
  }
  onClose: () => void
}

export function VoiceCallModal({ 
  conversationId, 
  otherUser, 
  callType, 
  currentUser,
  onClose 
}: VoiceCallModalProps) {
  const [callId, setCallId] = useState<string | null>(null)
  const [isCaller, setIsCaller] = useState(true)
  const [isWaitingToAccept, setIsWaitingToAccept] = useState(true)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const {
    callState,
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    callDuration,
    formatDuration,
    toggleMute,
    toggleVideo,
    endCall: endCallWebRTC
  } = useOneOnOneCall({
    callId: callId || "temp",
    currentUser,
    otherUserId: otherUser.id,
    callType,
    isCaller,
    onCallEnded: async () => {
      if (callId) {
        await endCallServer(callId)
      }
      onClose()
    }
  })

  useEffect(() => {
    const initCall = async () => {
      const result = await createCall(otherUser.id, callType)
      if (result.data) {
        setCallId(result.data.id)
        setIsWaitingToAccept(true)
      } else {
        alert("Failed to start call: " + result.error)
        onClose()
      }
    }
    initCall()
  }, [])

  // Update video elements with srcObject
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [localStream, remoteStream])

  const handleAccept = async () => {
    if (callId) {
      await updateCallStatus(callId, "answered")
      setIsWaitingToAccept(false)
    }
  }

  const handleDecline = async () => {
    if (callId) {
      await updateCallStatus(callId, "declined")
    }
    onClose()
  }

  const handleEndCall = async () => {
    if (callId) {
      await endCallServer(callId)
    }
    endCallWebRTC()
  }

  if (isWaitingToAccept && isCaller) {
    // Ringing UI for caller
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="w-full max-w-lg mx-4">
          <div className="bg-surface-900 rounded-2xl p-8 text-center">
            <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-brand-500 animate-pulse">
              <AvatarImage src={otherUser.avatar_url || ""} />
              <AvatarFallback className="text-4xl">{getInitials(otherUser.display_name)}</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-white">{otherUser.display_name}</h3>
            <p className="text-surface-300 mt-2">Ringing...</p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                onClick={handleEndCall}
                size="icon"
                variant="destructive"
                className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
              >
                <PhoneOff className="w-8 h-8" />
              </Button>
              <Button
                onClick={onClose}
                size="icon"
                variant="ghost"
                className="h-14 w-14 rounded-full text-surface-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Call UI
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
            <Avatar className={`w-32 h-32 mx-auto mb-6 border-4 border-brand-500 ${callState !== "active" ? "animate-pulse" : ""}`}>
              <AvatarImage src={otherUser.avatar_url || ""} />
              <AvatarFallback className="text-4xl">{getInitials(otherUser.display_name)}</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-semibold text-white">{otherUser.display_name}</h3>
            <p className="text-surface-300 mt-2">
              {callState === "connecting" && "Connecting..."}
              {callState === "ringing" && "Ringing..."}
              {callState === "active" && formatDuration(callDuration)}
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

          {isWaitingToAccept && !isCaller && (
            <>
              <Button
                onClick={handleDecline}
                size="icon"
                variant="destructive"
                className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
              >
                <PhoneOff className="w-8 h-8" />
              </Button>
              <Button
                onClick={handleAccept}
                size="icon"
                variant="default"
                className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600"
              >
                <PhoneCall className="w-8 h-8" />
              </Button>
            </>
          )}

          {callState !== "ringing" && (
            <Button
              onClick={handleEndCall}
              size="icon"
              variant="destructive"
              className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
            >
              <PhoneOff className="w-8 h-8" />
            </Button>
          )}

          {callState !== "active" && !isWaitingToAccept && (
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
