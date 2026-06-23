"use client"

import { useState, useRef, useEffect } from "react"
import { toggleReaction, REACTIONS, type ReactionType } from "@/lib/actions/reactions"

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
        // Remove the old reaction count
        newCounts[prev.userReaction] = Math.max(0, (newCounts[prev.userReaction] || 0) - 1)
        newTotal--
      }

      if (prev.userReaction === type) {
        // Toggle off — already handled by removing above
        newUserReaction = null
      } else {
        // Add new reaction
        newCounts[type] = (newCounts[type] || 0) + 1
        newTotal++
      }

      return { counts: newCounts, userReaction: newUserReaction, total: newTotal }
    })

    await toggleReaction(postId, type)
    setIsPending(false)
  }

  const currentReaction = summary.userReaction ? REACTIONS[summary.userReaction] : null

  // Build top reactions (non-zero counts, sorted by count desc, max 3)
  const topReactions = (Object.keys(summary.counts) as ReactionType[])
    .filter(r => summary.counts[r] > 0)
    .sort((a, b) => summary.counts[b] - summary.counts[a])
    .slice(0, 3)

  return (
    <div className="relative flex items-center gap-2">
      {/* Main reaction trigger button */}
      <button
        ref={triggerRef}
        onClick={() => setShowPicker(prev => !prev)}
        disabled={isPending}
        className={`relative z-20 pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
          currentReaction
            ? "bg-brand-500/15 border-brand-500/30 text-brand-400"
            : "bg-white/[0.04] border-white/[0.08] text-surface-400 hover:text-white hover:bg-white/[0.08]"
        }`}
      >
        <span className="text-base leading-none">
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
        <div className="flex items-center gap-1">
          {topReactions.map(type => (
            <button
              key={type}
              onClick={() => handleReact(type)}
              disabled={isPending}
              title={`${REACTIONS[type].label}: ${summary.counts[type]}`}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all border ${
                summary.userReaction === type
                  ? "bg-brand-500/15 border-brand-500/30"
                  : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.07]"
              }`}
            >
              <span className="text-sm">{REACTIONS[type].emoji}</span>
              <span className="text-surface-400">{summary.counts[type]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Reaction picker popup */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-0 mb-2 z-50 animate-fade-up"
        >
          <div
            className="flex items-center gap-1 p-2 rounded-2xl shadow-2xl border border-white/10"
            style={{
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
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-150 group ${
                    isActive
                      ? "bg-brand-500/20 scale-110"
                      : "hover:bg-white/[0.08] hover:scale-125"
                  }`}
                >
                  <span className="text-2xl leading-none transition-transform duration-150 group-hover:scale-110">
                    {r.emoji}
                  </span>
                  <span className={`text-[10px] font-semibold ${isActive ? r.color : "text-surface-500"}`}>
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
