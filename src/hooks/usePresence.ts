"use client"

import { useEffect, useState, useRef } from "react"
import { createBrowserClient } from "@supabase/ssr"

/**
 * usePresence — tracks which users are currently online using Supabase Realtime Presence.
 *
 * Usage:
 *   const { isOnline, onlineUsers } = usePresence(currentUserId)
 *
 * Returns:
 *   onlineUsers: Set<string> — set of user IDs that are currently online
 *   isOnline: (userId: string) => boolean — helper to check a specific user
 */
export function usePresence(currentUserId: string | null) {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const channelRef = useRef<any>(null)

  useEffect(() => {
    if (!currentUserId) return

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const channel = supabase.channel("global-presence", {
      config: {
        presence: { key: currentUserId },
      },
    })

    channelRef.current = channel

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState()
      const online = new Set(Object.keys(state))
      setOnlineUsers(online)
    })

    channel.subscribe(async (status: string) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ userId: currentUserId, onlineAt: new Date().toISOString() })
      }
    })

    return () => {
      channel.unsubscribe()
    }
  }, [currentUserId])

  const isOnline = (userId: string) => onlineUsers.has(userId)

  return { onlineUsers, isOnline }
}
