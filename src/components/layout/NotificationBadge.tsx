"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Bell } from "lucide-react"

export function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    let channel: any
    
    const fetchUnreadCount = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false)

      if (!error && count !== null) {
        setUnreadCount(count)
      }

      // Subscribe to real-time changes
      channel = supabase
        .channel("realtime_notifications")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            // Refetch count on any change (insert/update/delete)
            fetchUnreadCount()
          }
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
    <span className="bg-brand-500 text-surface-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto animate-pulse">
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  )
}
