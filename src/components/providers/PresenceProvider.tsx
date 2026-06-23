"use client"

import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react"
import { createBrowserClient } from "@supabase/ssr"

interface PresenceContextType {
  onlineUsers: Set<string>
  isOnline: (userId: string) => boolean
}

const PresenceContext = createContext<PresenceContextType>({
  onlineUsers: new Set(),
  isOnline: () => false,
})

export function PresenceProvider({ children, currentUserId }: { children: ReactNode; currentUserId: string | null }) {
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

  return (
    <PresenceContext.Provider value={{ onlineUsers, isOnline }}>
      {children}
    </PresenceContext.Provider>
  )
}

export function usePresenceContext() {
  return useContext(PresenceContext)
}
