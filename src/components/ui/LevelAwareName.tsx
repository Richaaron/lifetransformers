"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { cn, getDisplayNameWithLevel } from "@/lib/utils"

interface LevelAwareNameProps {
  userId?: string | null
  displayName?: string | null
  level?: number | null
  className?: string
  fallback?: string
}

export function LevelAwareName({ userId, displayName, level, className, fallback = "User" }: LevelAwareNameProps) {
  const [resolvedName, setResolvedName] = useState(() => getDisplayNameWithLevel(displayName, level))

  useEffect(() => {
    if (level != null) {
      setResolvedName(getDisplayNameWithLevel(displayName, level))
      return
    }

    if (!userId) {
      setResolvedName(getDisplayNameWithLevel(displayName, null))
      return
    }

    let isActive = true
    const supabase = createClient()

    void (async () => {
      try {
        const { data } = await supabase
          .from("user_progress")
          .select("level")
          .eq("user_id", userId)
          .single()

        if (!isActive) return
        setResolvedName(getDisplayNameWithLevel(displayName, data?.level ?? 1))
      } catch {
        if (!isActive) return
        setResolvedName(getDisplayNameWithLevel(displayName, null))
      }
    })()

    return () => {
      isActive = false
    }
  }, [displayName, level, userId])

  return <span className={cn(className)}>{resolvedName || fallback}</span>
}
