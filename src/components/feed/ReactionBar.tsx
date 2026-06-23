"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

interface ReactionBarProps {
  postId: string
  initialSummary: {
    counts?: Record<string, number>
    userReaction?: string | null
    total?: number
    // Simple likes fallback
    likeCount?: number
    userLiked?: boolean
  }
}

export function ReactionBar({ postId, initialSummary }: ReactionBarProps) {
  const [liked, setLiked] = useState<boolean>(
    initialSummary.userReaction != null || initialSummary.userLiked === true
  )
  const [count, setCount] = useState<number>(
    initialSummary.total ?? initialSummary.likeCount ?? 0
  )
  const [isPending, setIsPending] = useState(false)

  const handleReact = async () => {
    if (isPending) return
    setIsPending(true)

    // Optimistic update
    const newLiked = !liked
    setLiked(newLiked)
    setCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1))

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      })

      if (!res.ok) {
        // Revert on failure
        setLiked(liked)
        setCount(count)
        console.error("Reaction failed:", await res.text())
      }
    } catch (err) {
      setLiked(liked)
      setCount(count)
      console.error("Reaction error:", err)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button
      onClick={handleReact}
      disabled={isPending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
        liked
          ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
          : "bg-white/[0.04] border-white/[0.08] text-surface-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20"
      } ${isPending ? "opacity-70" : ""}`}
    >
      <Heart className={`w-4 h-4 transition-all duration-200 ${liked ? "fill-rose-400 scale-110" : ""}`} />
      <span>{liked ? "Liked" : "Like"}</span>
      {count > 0 && (
        <span className="text-xs font-normal opacity-70">{count}</span>
      )}
    </button>
  )
}
