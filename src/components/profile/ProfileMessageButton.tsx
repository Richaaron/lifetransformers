"use client"

import { useChat } from "@/components/providers/ChatProvider"
import { getOrCreateConversation } from "@/lib/actions/messages"
import { Mail, Loader2 } from "lucide-react"
import { useState } from "react"

export function ProfileMessageButton({ targetUserId }: { targetUserId: string }) {
  const { openChat } = useChat()
  const [loading, setLoading] = useState(false)

  const handleMessage = async () => {
    setLoading(true)
    const { data, error } = await getOrCreateConversation(targetUserId)
    setLoading(false)
    if (data?.id) {
      openChat(data.id)
    } else {
      alert(error || "Failed to start conversation")
    }
  }

  return (
    <button
      onClick={handleMessage}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
      Message
    </button>
  )
}
