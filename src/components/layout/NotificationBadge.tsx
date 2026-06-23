"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    let channel: any = null

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const fetchCount = async () => {
        const { count, error } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("read", false)

        if (!error && count !== null) {
          setUnreadCount(count)
        }
      }

      await fetchCount()

      // Subscribe AFTER user is confirmed
      channel = supabase
        .channel("notification_badge_channel")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
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
    <span className="bg-brand-500 text-surface-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto animate-pulse">
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  )
}
