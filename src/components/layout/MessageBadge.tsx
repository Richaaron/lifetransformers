"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function MessageBadge() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    let channel: any = null

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const fetchCount = async () => {
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
            if (updated_at && (!c.last_read_at || new Date(c.last_read_at) < new Date(updated_at))) {
              count++
            }
          }
        }
        setUnreadCount(count)
      }

      await fetchCount()

      // Subscribe to changes AFTER user is confirmed
      channel = supabase
        .channel("realtime_messages_badge")
        .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, fetchCount)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conversation_participants",
            filter: `user_id=eq.${user.id}`,
          },
          fetchCount
        )
        .subscribe()
    }

    init()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  if (unreadCount === 0) return null

  return (
    <span className="bg-brand-500 text-surface-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  )
}
