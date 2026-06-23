"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function MessageBadge() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    let channel: any
    
    const fetchUnreadCount = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Count conversations where the participant's last_read_at is less than the conversation's updated_at
      const { data: convos } = await supabase
        .from("conversation_participants")
        .select(`
          last_read_at,
          conversation:conversations ( updated_at )
        `)
        .eq("user_id", user.id)

      let count = 0
      if (convos) {
        for (const c of convos) {
          const updated_at = (c.conversation as any)?.updated_at
          if (updated_at) {
            if (!c.last_read_at || new Date(c.last_read_at) < new Date(updated_at)) {
              count++
            }
          }
        }
      }
      setUnreadCount(count)

      // Subscribe to real-time changes
      channel = supabase
        .channel("realtime_messages_badge")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages", // when new messages are inserted
          },
          () => fetchUnreadCount()
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conversation_participants", // when last_read_at is updated
            filter: `user_id=eq.${user.id}`,
          },
          () => fetchUnreadCount()
        )
        .subscribe()
    }

    fetchUnreadCount()

    return () => {
      if (channel) {
        createClient().removeChannel(channel)
      }
    }
  }, [])

  if (unreadCount === 0) return null

  return (
    <span className="bg-brand-500 text-surface-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  )
}
