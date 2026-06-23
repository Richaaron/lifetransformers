"use client"

import { useState } from "react"
import { Phone, Video } from "lucide-react"
import { GroupCallModal } from "./GroupCallModal"

interface GroupCallButtonProps {
  groupId: string
  groupName: string
  currentUser: {
    id: string
    display_name: string
    avatar_url?: string
  }
}

export function GroupCallButton({ groupId, groupName, currentUser }: GroupCallButtonProps) {
  const [activeCall, setActiveCall] = useState<"voice" | "video" | null>(null)

  if (activeCall) {
    return (
      <GroupCallModal
        groupId={groupId}
        groupName={groupName}
        callType={activeCall}
        currentUser={currentUser}
        onClose={() => setActiveCall(null)}
      />
    )
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setActiveCall("voice")}
        title="Start voice call"
        className="
          flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
          bg-emerald-500/20 border border-emerald-500/30 text-emerald-400
          hover:bg-emerald-500/30 active:scale-95 transition-all duration-200
        "
      >
        <Phone className="w-4 h-4" />
        <span className="hidden sm:inline">Voice</span>
      </button>

      <button
        onClick={() => setActiveCall("video")}
        title="Start video call"
        className="
          flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
          bg-blue-500/20 border border-blue-500/30 text-blue-400
          hover:bg-blue-500/30 active:scale-95 transition-all duration-200
        "
      >
        <Video className="w-4 h-4" />
        <span className="hidden sm:inline">Video</span>
      </button>
    </div>
  )
}
