"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { markConversationRead } from "@/lib/actions/messages"

export function useRealtimeMessages(conversationId: string, initialMessages: any[]) {
  const [messages, setMessages] = useState(initialMessages)
  const supabase = createClient()

  useEffect(() => {
    // Mark as read when entering the thread
    markConversationRead(conversationId)

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          // A new message was inserted!
          const newMessage = payload.new

          // Fetch sender profile details to match the initialMessages structure
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, display_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single()

          const formattedMessage = {
            id: newMessage.id,
            content: newMessage.content,
            created_at: newMessage.created_at,
            sender_id: newMessage.sender_id,
            sender: profile
          }

          setMessages((prev) => [...prev, formattedMessage])
          
          // Mark as read again since we are looking at the thread
          markConversationRead(conversationId)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase])

  return messages
}
