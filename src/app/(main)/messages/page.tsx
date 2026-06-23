"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials, formatRelativeTime } from "@/lib/utils"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface Conversation {
  id: string
  other_user: {
    id: string
    display_name: string
    avatar_url: string | null
  } | null
  last_message: {
    content: string
    sender_id: string
    created_at: string
  } | null
  is_unread: boolean
}

export default function MessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const targetUserId = searchParams.get("user")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (targetUserId && !creating) {
      createOrOpenConversation(targetUserId)
    }
  }, [targetUserId])

  const loadConversations = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: participantRows } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id)

    if (!participantRows || participantRows.length === 0) {
      setLoading(false)
      return
    }

    const convoIds = participantRows.map((p: any) => p.conversation_id)

    const { data: convos } = await supabase
      .from("conversations")
      .select("*")
      .in("id", convoIds)

    if (!convos) {
      setLoading(false)
      return
    }

    const result: Conversation[] = []

    for (const convo of convos) {
      const { data: participants } = await supabase
        .from("conversation_participants")
        .select("user_id")
        .eq("conversation_id", convo.id)

      const otherId = participants?.find((p: any) => p.user_id !== user.id)?.user_id

      if (!otherId) continue

      const { data: otherProfile } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .eq("id", otherId)
        .single()

      const { data: lastMsg } = await supabase
        .from("messages")
        .select("content, sender_id, created_at")
        .eq("conversation_id", convo.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      const { count: unreadCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", convo.id)
        .neq("sender_id", user.id)

      result.push({
        id: convo.id,
        other_user: otherProfile,
        last_message: lastMsg,
        is_unread: (unreadCount || 0) > 0,
      })
    }

    result.sort((a, b) => {
      if (!a.last_message) return 1
      if (!b.last_message) return -1
      return new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime()
    })

    setConversations(result)
    setLoading(false)
  }

  const createOrOpenConversation = async (otherUserId: string) => {
    if (creating) return
    setCreating(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: myParticipations } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id)

    if (myParticipations) {
      for (const p of myParticipations) {
        const { data: otherParticipant } = await supabase
          .from("conversation_participants")
          .select("user_id")
          .eq("conversation_id", p.conversation_id)
          .neq("user_id", user.id)
          .single()

        if (otherParticipant?.user_id === otherUserId) {
          router.push(`/messages/${p.conversation_id}`)
          return
        }
      }
    }

    const { data: newConvo } = await supabase
      .from("conversations")
      .insert({})
      .select()
      .single()

    if (newConvo) {
      await supabase.from("conversation_participants").insert([
        { conversation_id: newConvo.id, user_id: user.id },
        { conversation_id: newConvo.id, user_id: otherUserId },
      ])
      router.push(`/messages/${newConvo.id}`)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold text-white tracking-tight">Messages</h1>
      </div>

      <div className="flex-1 bg-surface-900 border border-surface-800 rounded-xl overflow-y-auto">
        {loading || creating ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-surface-400">
            <p className="mb-2">No conversations yet.</p>
            <p className="text-sm">Go to a friend's profile to send them a message.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-800">
            {conversations.map((convo) => (
              <Link 
                key={convo.id} 
                href={`/messages/${convo.id}`}
                className={`flex items-center gap-4 p-4 hover:bg-surface-800 transition-colors ${
                  convo.is_unread ? 'bg-surface-800/30' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 border border-surface-700">
                    <AvatarImage src={convo.other_user?.avatar_url || ""} />
                    <AvatarFallback>{getInitials(convo.other_user?.display_name || "")}</AvatarFallback>
                  </Avatar>
                  {convo.is_unread && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full border-2 border-surface-900"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`text-base truncate ${convo.is_unread ? 'font-bold text-white' : 'font-semibold text-surface-100'}`}>
                      {convo.other_user?.display_name}
                    </h3>
                    {convo.last_message && (
                      <span className="text-xs text-surface-400 shrink-0 ml-2">
                        {formatRelativeTime(convo.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm truncate ${convo.is_unread ? 'text-surface-200 font-medium' : 'text-surface-400'}`}>
                    {convo.last_message 
                      ? (convo.last_message.sender_id === convo.other_user?.id ? "" : "You: ") + convo.last_message.content
                      : "Start a conversation"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
