"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { getInitials } from "@/lib/utils"
import { LevelAwareName } from "@/components/ui/LevelAwareName"
import { Trophy, Medal, Crown, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { LeaderboardEntry } from "@/lib/types"
import { LEVEL_NAMES, getXpProgress } from "@/lib/types"

interface LeaderboardPageProps {
  leaderboard: LeaderboardEntry[]
  currentUserId: string
}

const STAR_COLORS: Record<number, string> = {
  1: "#a1a1aa",  // Zinc - Follower
  2: "#f472b6",  // Pink - Believer
  3: "#4ade80",  // Green - Disciple
  4: "#22d3ee",  // Cyan - Witness
  5: "#3b82f6",  // Blue - Minister
  6: "#a855f7",  // Purple - Elder
  7: "#f97316",  // Orange - Deacon
  8: "#ef4444",  // Red - Pastor
  9: "#eab308",  // Yellow - Bishop
  10: "#10b981", // Emerald - Apostle
  11: "#ec4899", // Hot Pink - Prophet
  12: "#facc15", // Gold - Saint
}

const NAME_COLORS: Record<number, string> = {
  1: "#a1a1aa",  // Zinc
  2: "#f472b6",  // Pink
  3: "#4ade80",  // Green
  4: "#22d3ee",  // Cyan
  5: "#3b82f6",  // Blue
  6: "#a855f7",  // Purple
  7: "#f97316",  // Orange
  8: "#ef4444",  // Red
  9: "#eab308",  // Yellow
  10: "#10b981", // Emerald
  11: "#ec4899", // Hot Pink
  12: "#facc15", // Gold
}

function LevelStars({ level, size = "sm" }: { level: number; size?: "sm" | "md" }) {
  const starSize = size === "md" ? 20 : 16

  let filledStars = 0
  if (level >= 10) filledStars = 5
  else if (level >= 8) filledStars = 4
  else if (level >= 6) filledStars = 3
  else if (level >= 4) filledStars = 2
  else if (level >= 2) filledStars = 1
  else filledStars = 1

  const color = STAR_COLORS[level] || "#94a3b8"

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{
            width: starSize,
            height: starSize,
            color: i < filledStars ? color : "#404040",
            fill: i < filledStars ? color : "transparent",
          }}
        />
      ))}
    </div>
  )
}

export function LeaderboardPage({ leaderboard, currentUserId }: LeaderboardPageProps) {
  const [activeTab, setActiveTab] = useState("xp")

  const sortedByPosts = [...leaderboard].sort((a, b) => b.posts_count - a.posts_count)
  const sortedByComments = [...leaderboard].sort((a, b) => b.comments_count - a.comments_count)

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: "🥇", label: "1st", glow: "rgba(234,179,8,0.3)",  border: "rgba(234,179,8,0.4)",  bg: "rgba(234,179,8,0.1)"  }
    if (rank === 2) return { icon: "🥈", label: "2nd", glow: "rgba(148,163,184,0.3)", border: "rgba(148,163,184,0.4)", bg: "rgba(148,163,184,0.08)" }
    if (rank === 3) return { icon: "🥉", label: "3rd", glow: "rgba(180,120,60,0.3)",  border: "rgba(180,120,60,0.4)",  bg: "rgba(180,120,60,0.08)"  }
    return null
  }

  const renderLeaderboardList = (entries: LeaderboardEntry[], showMetric: "xp" | "posts" | "comments") => {
    return (
      <div className="space-y-2">
        {entries.map((entry, index) => {
          const rank = index + 1
          const levelInfo = LEVEL_NAMES[entry.level] || LEVEL_NAMES[1]
          const xpProgress = getXpProgress(entry.xp, entry.level)
          const isCurrentUser = entry.user_id === currentUserId
          const nameColor = NAME_COLORS[entry.level] || "#94a3b8"
          const badge = getRankBadge(rank)

          return (
            <div
              key={entry.user_id}
              className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 group/row"
              style={{
                background: isCurrentUser
                  ? "rgba(234,179,8,0.08)"
                  : badge
                  ? badge.bg
                  : "rgba(255,255,255,0.02)",
                border: `1px solid ${isCurrentUser ? "rgba(234,179,8,0.3)" : badge ? badge.border : "rgba(255,255,255,0.06)"}`,
                boxShadow: badge ? `0 0 20px ${badge.glow}` : undefined,
              }}
            >
              {/* Rank */}
              <div className="w-8 flex items-center justify-center shrink-0">
                {badge ? (
                  <span className="text-xl">{badge.icon}</span>
                ) : (
                  <span className="text-sm font-bold text-surface-500">#{rank}</span>
                )}
              </div>

              <Link href={`/profile/${entry.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="w-10 h-10 shrink-0 border border-white/10 group-hover/row:border-brand-500/30 transition-colors">
                  <AvatarImage src={entry.avatar_url || ""} />
                  <AvatarFallback className="bg-surface-700 text-brand-400 font-bold text-sm">{getInitials(entry.display_name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className={`font-bold truncate text-[14px] ${isCurrentUser ? "text-brand-400" : "text-white group-hover/row:text-brand-400"} transition-colors`}>
                    <LevelAwareName displayName={entry.display_name} userId={entry.user_id} className="inline" /> {isCurrentUser && <span className="text-brand-500 text-[11px] font-semibold ml-1">(You)</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <LevelStars level={entry.level} />
                    <span style={{ color: nameColor, fontSize: 11, fontWeight: 700 }}>{levelInfo.name}</span>
                  </div>
                </div>
              </Link>

              <div className="text-right shrink-0">
                {showMetric === "xp" && (
                  <div className="space-y-1.5">
                    <p className="font-bold text-sm text-white">{entry.xp.toLocaleString()}
                      <span className="text-[10px] text-surface-400 font-medium ml-1">pts</span>
                    </p>
                    <div className="progress-bar-track w-20">
                      <div className="progress-bar-fill" style={{ width: `${xpProgress}%` }} />
                    </div>
                  </div>
                )}
                {showMetric === "posts" && (
                  <div>
                    <p className="font-bold text-brand-400 text-sm">{entry.posts_count}</p>
                    <p className="text-[10px] text-surface-500">posts</p>
                  </div>
                )}
                {showMetric === "comments" && (
                  <div>
                    <p className="font-bold text-brand-400 text-sm">{entry.comments_count}</p>
                    <p className="text-[10px] text-surface-500">replies</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_0_24px_rgba(234,179,8,0.3)]"
          style={{ background: "linear-gradient(135deg, rgba(234,179,8,0.2), rgba(251,191,36,0.1))", border: "1px solid rgba(234,179,8,0.3)" }}>
          <Trophy className="w-6 h-6 text-brand-400" />
        </div>
        <div>
          <h1 className="section-header">Community Encouragers</h1>
          <p className="text-surface-400 text-sm mt-0.5">Celebrating those who inspire and build up the community</p>
        </div>
      </div>

      {/* Spiritual Levels Guide */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(12,12,24,0.7)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4.5 h-4.5 text-brand-500" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Spiritual Journey Levels</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {Object.entries(LEVEL_NAMES).map(([level, info]) => {
            const lvl = Number(level)
            const nameColor = NAME_COLORS[lvl] || "#94a3b8"
            return (
              <div
                key={level}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-default"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <LevelStars level={lvl} size="md" />
                <span style={{ color: nameColor, fontSize: 13, fontWeight: 700 }}>{info.name}</span>
                <span className="text-[10px] text-surface-500">{info.minXp.toLocaleString()} pts</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Leaderboard Tabs */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(10,10,20,0.7)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(24px)" }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="p-4 border-b border-white/[0.05]">
            <TabsList className="grid w-full grid-cols-3 bg-white/[0.04] rounded-xl p-1 gap-1">
              <TabsTrigger
                value="xp"
                className="gap-2 rounded-lg data-[state=active]:bg-brand-500/20 data-[state=active]:text-brand-400 data-[state=active]:shadow-none text-surface-400 transition-all"
              >
                <Star className="w-3.5 h-3.5" />
                <span>By XP</span>
              </TabsTrigger>
              <TabsTrigger
                value="posts"
                className="gap-2 rounded-lg data-[state=active]:bg-brand-500/20 data-[state=active]:text-brand-400 data-[state=active]:shadow-none text-surface-400 transition-all"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Posts</span>
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="gap-2 rounded-lg data-[state=active]:bg-brand-500/20 data-[state=active]:text-brand-400 data-[state=active]:shadow-none text-surface-400 transition-all"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Replies</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            <TabsContent value="xp" className="mt-0">
              {leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-10 h-10 text-surface-600 mx-auto mb-3" />
                  <p className="text-surface-400 text-sm">No data yet — start posting to earn XP!</p>
                </div>
              ) : (
                renderLeaderboardList(leaderboard, "xp")
              )}
            </TabsContent>

            <TabsContent value="posts" className="mt-0">
              {sortedByPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-surface-400 text-sm">No data yet — start posting!</p>
                </div>
              ) : (
                renderLeaderboardList(sortedByPosts, "posts")
              )}
            </TabsContent>

            <TabsContent value="comments" className="mt-0">
              {sortedByComments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-surface-400 text-sm">No data yet — start engaging!</p>
                </div>
              ) : (
                renderLeaderboardList(sortedByComments, "comments")
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
