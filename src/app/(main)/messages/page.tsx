"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials, formatRelativeTime } from "@/lib/utils"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { usePresence } from "@/hooks/usePresence"
import { OnlineIndicator } from "@/components/ui/OnlineIndicator"

export default function MessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const targetUserId = searchParams.get("user")
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const { isOnline } = usePresence(currentUserId)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id)
    })
    if (targetUserId) {
      startConversation(targetUserId)
    } else {
      loadConversations()
    }
  }, [])

  const startConversation = async (otherUserId: string) => {
    setCreating(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setCreating(false)
      return
    }

    try {
      // Check if conversation already exists
      const { data: myConvos } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user.id)

      if (myConvos) {
        for (const c of myConvos) {
          const { data: other } = await supabase
            .from("conversation_participants")
            .select("user_id")
            .eq("conversation_id", c.conversation_id)
            .neq("user_id", user.id)
            .maybeSingle()

          if (other?.user_id === otherUserId) {
            router.push(`/messages/${c.conversation_id}`)
            return
          }
        }
      }

      // Create new conversation
      const { data: newConvo, error } = await supabase
        .from("conversations")
        .insert({})
        .select()
        .single()

      if (error) {
        console.error("Error creating conversation:", error)
        setCreating(false)
        return
      }

      if (newConvo) {
        await supabase.from("conversation_participants").insert([
          { conversation_id: newConvo.id, user_id: user.id },
          { conversation_id: newConvo.id, user_id: otherUserId },
        ])
        router.push(`/messages/${newConvo.id}`)
      }
    } catch (err) {
      console.error("Error:", err)
      setCreating(false)
    }
  }

  const loadConversations = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data: myConvos } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user.id)

      if (!myConvos || myConvos.length === 0) {
        setConversations([])
        setLoading(false)
        return
      }

      const result: any[] = []

      for (const c of myConvos) {
        const { data: others } = await supabase
          .from("conversation_participants")
          .select("user_id")
          .eq("conversation_id", c.conversation_id)
          .neq("user_id", user.id)

        if (!others || others.length === 0) continue

        const { data: profile } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .eq("id", others[0].user_id)
          .single()

        const { data: lastMsg } = await supabase
          .from("messages")
          .select("content, sender_id, created_at")
          .eq("conversation_id", c.conversation_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        result.push({
          id: c.conversation_id,
          other_user: profile,
          last_message: lastMsg,
        })
      }

      result.sort((a, b) => {
        if (!a.last_message) return 1
        if (!b.last_message) return -1
        return new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime()
      })

      setConversations(result)
    } catch (err) {
      console.error("Error loading conversations:", err)
    }
    setLoading(false)
  }

  if (creating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-surface-400">Starting conversation...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold text-white tracking-tight">Messages</h1>
      </div>

      <div className="flex-1 bg-surface-900 border border-surface-800 rounded-xl overflow-y-auto">
        {loading ? (
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
                className="flex items-center gap-4 p-4 hover:bg-surface-800 transition-colors"
              >
                <div className="relative shrink-0">
                  <Avatar className="w-12 h-12 border border-surface-700">
                    <AvatarImage src={convo.other_user?.avatar_url || ""} />
                    <AvatarFallback>{getInitials(convo.other_user?.display_name || "")}</AvatarFallback>
                  </Avatar>
                  <OnlineIndicator
                    isOnline={isOnline(convo.other_user?.id)}
                    size="md"
                    className="absolute bottom-0 right-0 ring-2 ring-surface-900 rounded-full"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-semibold text-surface-100 truncate">
                      {convo.other_user?.display_name || "Unknown"}
                    </h3>
                    {convo.last_message && (
                      <span className="text-xs text-surface-400 shrink-0 ml-2">
                        {formatRelativeTime(convo.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-surface-400 truncate">
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
