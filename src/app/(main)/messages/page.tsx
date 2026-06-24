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
import { Suspense } from "react"
import { useChat } from "@/components/providers/ChatProvider"
import { decryptMessagesAction } from "@/lib/actions/messages"

function MessagesPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const targetUserId = searchParams.get("user")
  const { openChat } = useChat()
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const { isOnline } = usePresence(currentUserId)

  useEffect(() => {
    const supabase = createClient()
    let channel: any
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
        if (targetUserId) {
          startConversation(targetUserId)
        } else {
          loadConversations()
        }

        // Subscribe to realtime changes
        channel = supabase
          .channel('realtime-messages')
          .on('postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'messages',
            },
            () => {
              // Reload conversations when messages change
              loadConversations()
            }
          )
          .subscribe()
      }
    }
    init()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [targetUserId])

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
            openChat(c.conversation_id)
            setCreating(false)
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
        openChat(newConvo.id)
        setCreating(false)
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

      const convoIds = myConvos.map(c => c.conversation_id)

      // Batch fetch all other participants and their profiles
      const { data: otherParticipants } = await supabase
        .from("conversation_participants")
        .select(`
          conversation_id,
          user_id,
          profiles (
            id,
            display_name,
            avatar_url
          )
        `)
        .in("conversation_id", convoIds)
        .neq("user_id", user.id)

      // Fetch last messages in parallel
      const resultPromises = convoIds.map(async (convoId) => {
        const participant = otherParticipants?.find(p => p.conversation_id === convoId)
        if (!participant || !participant.profiles) return null

        const { data: lastMsg } = await supabase
          .from("messages")
          .select("content, sender_id, created_at")
          .eq("conversation_id", convoId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        return {
          id: convoId,
          other_user: participant.profiles,
          last_message: lastMsg,
        }
      })

      let result = (await Promise.all(resultPromises)).filter(Boolean) as any[]

      // Decrypt last message previews
      result = await Promise.all(
        result.map(async (convo) => {
          if (!convo.last_message?.content) return convo
          const { data: decrypted } = await decryptMessagesAction(
            [convo.last_message],
            convo.id
          )
          return {
            ...convo,
            last_message: decrypted?.[0] ?? convo.last_message,
          }
        })
      )

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
              <button 
                key={convo.id} 
                onClick={() => openChat(convo.id)}
                className="w-full flex items-center gap-4 p-4 hover:bg-surface-800 transition-colors text-left"
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
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    }>
      <MessagesPageInner />
    </Suspense>
  )
}
