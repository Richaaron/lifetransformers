"use client"

import { useState, useRef, useEffect } from "react"
import type { ReactionType } from "@/lib/actions/reactions"
import { useIsNative } from "@/lib/hooks/use-is-native"

const REACTIONS: Record<ReactionType, { emoji: string; label: string; color: string }> = {
  amen:     { emoji: "🙏", label: "Amen",     color: "text-amber-400"  },
  love:     { emoji: "❤️",  label: "Love",     color: "text-rose-400"   },
  praying:  { emoji: "🕊️", label: "Praying",  color: "text-purple-400" },
  inspired: { emoji: "✨",  label: "Inspired", color: "text-yellow-400" },
  like:     { emoji: "👍",  label: "Like",     color: "text-blue-400"   },
}

interface ReactionSummary {
  counts: Record<ReactionType, number>
  userReaction: ReactionType | null
  total: number
}

interface ReactionBarProps {
  postId: string
  initialSummary: ReactionSummary
}

export function ReactionBar({ postId, initialSummary }: ReactionBarProps) {
  const [summary, setSummary] = useState<ReactionSummary>(initialSummary)
  const [isPending, setIsPending] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const isNative = useIsNative()

  // Close picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current && !pickerRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setShowPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleReact = async (type: ReactionType) => {
    if (isPending) return
    setIsPending(true)
    setShowPicker(false)

    // Optimistic update
    setSummary(prev => {
      const newCounts = { ...prev.counts }
      let newTotal = prev.total
      let newUserReaction: ReactionType | null = type

      if (prev.userReaction) {
        newCounts[prev.userReaction] = Math.max(0, (newCounts[prev.userReaction] || 0) - 1)
        newTotal--
      }

      if (prev.userReaction === type) {
        newUserReaction = null
      } else {
        newCounts[type] = (newCounts[type] || 0) + 1
        newTotal++
      }

      return { counts: newCounts, userReaction: newUserReaction, total: newTotal }
    })

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, reactionType: type }),
      })
      if (!res.ok) {
        // Revert optimistic update on failure
        setSummary(initialSummary)
      }
    } catch {
      setSummary(initialSummary)
    } finally {
      setIsPending(false)
    }
  }

  const currentReaction = summary.userReaction ? REACTIONS[summary.userReaction] : null

  // Build top reactions (non-zero counts, sorted by count desc, max 3)
  const topReactions = (Object.keys(summary.counts) as ReactionType[])
    .filter(r => summary.counts[r] > 0)
    .sort((a, b) => summary.counts[b] - summary.counts[a])
    .slice(0, 3)

  return (
    <div className={isNative ? "relative flex items-center gap-1.5" : "relative flex items-center gap-2"}>
      {/* Main reaction trigger button */}
      <button
        ref={triggerRef}
        onClick={() => setShowPicker(prev => !prev)}
        disabled={isPending}
        className={isNative
          ? `flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
              currentReaction
                ? "bg-brand-500/20 border-brand-500/40 text-brand-300"
                : "bg-surface-800/70 border-surface-700/50 text-surface-300 hover:text-white hover:bg-surface-800"
            }`
          : `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
              currentReaction
                ? "bg-brand-500/15 border-brand-500/30 text-brand-400"
                : "bg-white/[0.04] border-white/[0.08] text-surface-400 hover:text-white hover:bg-white/[0.08]"
            }`}
      >
        <span className={isNative ? "text-lg leading-none" : "text-base leading-none"}>
          {currentReaction ? currentReaction.emoji : "🙏"}
        </span>
        <span className={currentReaction ? currentReaction.color : ""}>
          {currentReaction ? currentReaction.label : "React"}
        </span>
        {summary.total > 0 && (
          <span className="text-xs text-surface-500 font-normal ml-0.5">{summary.total}</span>
        )}
      </button>

      {/* Reaction emoji stacks */}
      {topReactions.length > 0 && (
        <div className={isNative ? "flex items-center gap-0.5" : "flex items-center gap-1"}>
          {topReactions.map(type => (
            <button
              key={type}
              onClick={() => handleReact(type)}
              disabled={isPending}
              title={`${REACTIONS[type].label}: ${summary.counts[type]}`}
              className={isNative
                ? `flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs transition-all ${
                    summary.userReaction === type
                      ? "bg-brand-500/20"
                      : "bg-surface-800/50 hover:bg-surface-800"
                  }`
                : `flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all border ${
                    summary.userReaction === type
                      ? "bg-brand-500/15 border-brand-500/30"
                      : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.07]"
                  }`}
            >
              <span className={isNative ? "text-base" : "text-sm"}>{REACTIONS[type].emoji}</span>
              {!isNative && <span className="text-surface-400">{summary.counts[type]}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Reaction picker popup */}
      {showPicker && (
        <div
          ref={pickerRef}
          className={isNative ? "absolute bottom-full left-0 mb-2 z-50" : "absolute bottom-full left-0 mb-2 z-50"}
        >
          <div
            className={isNative
              ? "flex items-center gap-2 p-3 rounded-3xl border border-surface-700/50"
              : "flex items-center gap-1 p-2 rounded-2xl shadow-2xl border border-white/10"
            }
            style={isNative
              ? {
                  background: "rgba(20,18,32,0.98)",
                  backdropFilter: "blur(28px)",
                  boxShadow: "0 12px 50px rgba(0,0,0,0.75)",
                }
              : {
                  background: "rgba(14,12,26,0.96)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
                }}
          >
            {(Object.keys(REACTIONS) as ReactionType[]).map(type => {
              const r = REACTIONS[type]
              const isActive = summary.userReaction === type
              return (
                <button
                  key={type}
                  onClick={() => handleReact(type)}
                  title={r.label}
                  className={isNative
                    ? `flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? "bg-brand-500/25 scale-105"
                          : "hover:bg-surface-800/70 hover:scale-110"
                      }`
                    : `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-150 group ${
                        isActive
                          ? "bg-brand-500/20 scale-110"
                          : "hover:bg-white/[0.08] hover:scale-125"
                      }`}
                >
                  <span className={isNative ? "text-3xl leading-none" : "text-2xl leading-none"}>
                    {r.emoji}
                  </span>
                  <span className={isNative
                    ? `text-[11px] font-semibold ${isActive ? r.color : "text-surface-400"}`
                    : `text-[11px] font-semibold ${isActive ? r.color : "text-surface-500"}`}
                  >
                    {r.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
