"use client"

import { useRef, useEffect } from "react"
import { useGroupCall, Participant } from "@/hooks/useGroupCall"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils"
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Users, Wifi, WifiOff
} from "lucide-react"

interface GroupCallModalProps {
  groupId: string
  groupName: string
  callType: "voice" | "video"
  currentUser: {
    id: string
    display_name: string
    avatar_url?: string
  }
  onClose: () => void
}

function ParticipantTile({
  participant,
  isLocal = false,
}: {
  participant: Participant & { stream?: MediaStream }
  isLocal?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream
    }
  }, [participant.stream])

  const showVideo = participant.stream && !participant.isVideoOff

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center aspect-video group">
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Avatar className="w-16 h-16 border-2 border-amber-400/60 shadow-lg shadow-amber-500/20">
            <AvatarImage src={participant.avatarUrl || ""} />
            <AvatarFallback className="text-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              {getInitials(participant.displayName)}
            </AvatarFallback>
          </Avatar>
          <p className="text-white font-medium text-sm">{isLocal ? "You" : participant.displayName}</p>
        </div>
      )}

      {/* Name + status bar */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
        <span className="text-white text-xs font-medium truncate">
          {isLocal ? "You" : participant.displayName}
        </span>
        <div className="flex items-center gap-1">
          {participant.isMuted && (
            <div className="bg-red-500/80 rounded-full p-0.5">
              <MicOff className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Speaking indicator glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none ring-2 ring-amber-400/0 group-data-[speaking=true]:ring-amber-400/70 transition-all duration-200" />
    </div>
  )
}

export function GroupCallModal({
  groupId,
  groupName,
  callType,
  currentUser,
  onClose,
}: GroupCallModalProps) {
  const {
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
  } = useGroupCall({ groupId, currentUser, callType, onCallEnded: onClose })

  const localParticipant: Participant & { stream?: MediaStream } = {
    userId: currentUser.id,
    displayName: currentUser.display_name,
    avatarUrl: currentUser.avatar_url,
    stream: localStream ?? undefined,
    isMuted,
    isVideoOff,
  }

  const allParticipants = [localParticipant, ...Array.from(participants.values())]
  const count = allParticipants.length
  const gridCols = count <= 1 ? "grid-cols-1" : count <= 2 ? "grid-cols-2" : count <= 4 ? "grid-cols-2" : "grid-cols-3"

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div>
          <h2 className="text-white font-bold text-lg">{groupName}</h2>
          <div className="flex items-center gap-2 text-sm">
            {isConnecting ? (
              <span className="text-amber-400 flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5 animate-pulse" /> Connecting...
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" /> {formatDuration(callDuration)}
              </span>
            )}
            <span className="text-surface-500">•</span>
            <span className="text-surface-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {count} {count === 1 ? "person" : "people"}
            </span>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wide">
          {callType === "video" ? "Video" : "Voice"} Call
        </div>
      </div>

      {/* Participant Grid */}
      <div className={`flex-1 grid ${gridCols} gap-3 px-4 pb-4 overflow-auto`}>
        {allParticipants.map((p, i) => (
          <ParticipantTile
            key={p.userId}
            participant={p}
            isLocal={i === 0}
          />
        ))}
      </div>

      {/* Control Bar */}
      <div className="px-6 pb-10 pt-4 flex items-center justify-center gap-5">
        {/* Mute */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={toggleMute}
            className={`
              w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200
              ${isMuted
                ? "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
              }
            `}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <span className="text-surface-400 text-xs">{isMuted ? "Unmute" : "Mute"}</span>
        </div>

        {/* Camera (video calls only) */}
        {callType === "video" && (
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={toggleVideo}
              className={`
                w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200
                ${isVideoOff
                  ? "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                  : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                }
              `}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>
            <span className="text-surface-400 text-xs">{isVideoOff ? "Show Video" : "Hide Video"}</span>
          </div>
        )}

        {/* End Call */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 flex items-center justify-center transition-all duration-200 shadow-lg shadow-red-500/40"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
          <span className="text-surface-400 text-xs">End</span>
        </div>
      </div>
    </div>
  )
}
