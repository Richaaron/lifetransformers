"use client"

import { usePresenceContext } from "@/components/providers/PresenceProvider"

/**
 * usePresence — tracks which users are currently online using Supabase Realtime Presence.
 * This now uses a global context to prevent multiple subscriptions to the same channel.
 */
export function usePresence(currentUserId: string | null) {
  // We ignore currentUserId here because the context already tracks the active user
  return usePresenceContext()
}
