"use client"

import { useEffect, useState } from "react"
import { useChat } from "@/components/providers/ChatProvider"
import { MessageThread } from "@/components/messages/MessageThread"
import { createClient } from "@/lib/supabase/client"
import { decryptMessagesAction } from "@/lib/actions/messages"
import { Loader2, X } from "lucide-react"

export function ChatWidget() {
  const { isOpen, activeConversationId, closeChat } = useChat()
  const [initialMessages, setInitialMessages] = useState<any[]>([])
  const [otherUser, setOtherUser] = useState<any>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen && activeConversationId) {
      loadConversation()
    } else {
      // Reset state when closed
      setInitialMessages([])
      setOtherUser(null)
      setError("")
    }
  }, [isOpen, activeConversationId])

  const loadConversation = async () => {
    setLoading(true)
    setError("")
    const supabase = createClient()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("Not authenticated")
        setLoading(false)
        return
      }
      setCurrentUserId(user.id)

      // Fetch other user details
      const { data: participants, error: partError } = await supabase
        .from("conversation_participants")
        .select(`
          user_id,
          profiles (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq("conversation_id", activeConversationId!)
        .neq("user_id", user.id)
        .maybeSingle()

      if (!participants || !participants.profiles) {
        setError("Conversation not found")
        setLoading(false)
        return
      }

      setOtherUser(participants.profiles)

      // Fetch initial messages
      const { data: messagesData } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, display_name, avatar_url)
        `)
        .eq("conversation_id", activeConversationId!)
        .order("created_at", { ascending: true })
        .limit(50)

      const rawMessages = messagesData || []

      // Decrypt messages server-side before displaying
      const { data: decryptedMessages } = await decryptMessagesAction(rawMessages, activeConversationId!)
      setInitialMessages(decryptedMessages || rawMessages)

    } catch (err: any) {
      console.error(err)
      setError("Failed to load conversation")
    }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[380px] h-[550px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6rem)] shadow-2xl rounded-2xl overflow-hidden border border-surface-700 bg-surface-900 flex flex-col transform transition-transform duration-300 animate-in slide-in-from-bottom-10">
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <button 
            onClick={closeChat} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-800 text-surface-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <p className="mt-4 text-surface-400 text-sm">Loading chat...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <button 
            onClick={closeChat} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-800 text-surface-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <p className="text-red-400">{error}</p>
        </div>
      ) : otherUser && currentUserId ? (
        <MessageThread
          conversationId={activeConversationId!}
          initialMessages={initialMessages}
          currentUserId={currentUserId}
          otherUser={otherUser}
          onClose={closeChat}
          isWidget={true}
        />
      ) : null}
    </div>
  )
}
