"use client"

import { useEffect, useState, useMemo, type Dispatch, type SetStateAction } from "react"
import { createClient } from "@/lib/supabase/client"
import { markConversationRead } from "@/lib/actions/messages"

export function useRealtimeMessages(conversationId: string, initialMessages: any[]) {
  const [messages, setMessages] = useState(initialMessages)
  const supabase = useMemo(() => createClient(), [])

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

          setMessages((prev) => {
            if (prev.some((message) => message.id === newMessage.id)) {
              return prev
            }
            return [...prev, formattedMessage]
          })
          
          // Mark as read again since we are looking at the thread
          markConversationRead(conversationId)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase])

  return [messages, setMessages] as [any[], React.Dispatch<React.SetStateAction<any[]>>]
}
