"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { getInitials } from "@/lib/utils"
import { Trophy, Medal, Crown, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { LeaderboardEntry } from "@/lib/types"
import { LEVEL_NAMES, getXpProgress } from "@/lib/types"

interface LeaderboardPageProps {
  leaderboard: LeaderboardEntry[]
  currentUserId: string
}

function LevelStars({ level }: { level: number }) {
  const levelInfo = LEVEL_NAMES[level] || LEVEL_NAMES[1]
  
  // Number of filled stars based on level (1-3 stars)
  const filledStars = Math.min(3, Math.ceil(level / 4))
  const emptyStars = 3 - filledStars

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: filledStars }).map((_, i) => (
        <Star 
          key={`filled-${i}`} 
          className={`w-3.5 h-3.5 fill-current ${levelInfo.color}`} 
        />
      ))}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star 
          key={`empty-${i}`} 
          className="w-3.5 h-3.5 text-surface-600" 
        />
      ))}
    </div>
  )
}

function LevelBadge({ level }: { level: number }) {
  const levelInfo = LEVEL_NAMES[level] || LEVEL_NAMES[1]

  return (
    <div className="flex items-center gap-1.5">
      <LevelStars level={level} />
      <span className={`text-xs font-semibold bg-gradient-to-r ${levelInfo.textGradient} bg-clip-text text-transparent`}>
        {levelInfo.name}
      </span>
    </div>
  )
}

export function LeaderboardPage({ leaderboard, currentUserId }: LeaderboardPageProps) {
  const [activeTab, setActiveTab] = useState("xp")

  const sortedByPosts = [...leaderboard].sort((a, b) => b.posts_count - a.posts_count)
  const sortedByComments = [...leaderboard].sort((a, b) => b.comments_count - a.comments_count)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />
      case 2: return <Medal className="w-5 h-5 text-gray-400" />
      case 3: return <Medal className="w-5 h-5 text-amber-600" />
      default: return <span className="text-surface-400 text-sm w-5 text-center">{rank}</span>
    }
  }

  const renderLeaderboardList = (entries: LeaderboardEntry[], showMetric: "xp" | "posts" | "comments") => {
    return (
      <div className="space-y-2">
        {entries.map((entry, index) => {
          const rank = index + 1
          const levelInfo = LEVEL_NAMES[entry.level] || LEVEL_NAMES[1]
          const xpProgress = getXpProgress(entry.xp, entry.level)
          const isCurrentUser = entry.user_id === currentUserId

          return (
            <div
              key={entry.user_id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                isCurrentUser 
                  ? "bg-brand-500/10 border border-brand-500/30" 
                  : "bg-surface-900 border border-surface-800 hover:border-surface-700"
              } ${rank <= 3 ? "ring-1 ring-surface-700" : ""}`}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(rank)}
              </div>

              <Link href={`/profile/${entry.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={entry.avatar_url || ""} />
                  <AvatarFallback>{getInitials(entry.display_name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{entry.display_name}</p>
                  <LevelBadge level={entry.level} />
                </div>
              </Link>

              <div className="text-right">
                {showMetric === "xp" && (
                  <div className="space-y-1">
                    <p className={`font-bold ${levelInfo.color}`}>{entry.xp.toLocaleString()} XP</p>
                    <Progress value={xpProgress} className="w-20 h-1.5" />
                  </div>
                )}
                {showMetric === "posts" && (
                  <p className="font-bold text-brand-500">{entry.posts_count}</p>
                )}
                {showMetric === "comments" && (
                  <p className="font-bold text-brand-500">{entry.comments_count}</p>
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
      <div className="flex items-center gap-3">
        <Trophy className="w-8 h-8 text-brand-500" />
        <div>
          <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
          <p className="text-surface-400">Track your spiritual journey and engagement</p>
        </div>
      </div>

      {/* Level Guide */}
      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-500" />
            Spiritual Levels
          </CardTitle>
          <CardDescription>Progress through the ranks as you engage with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Object.entries(LEVEL_NAMES).map(([level, info]) => (
              <div key={level} className="flex items-center gap-2 p-2 rounded-md bg-surface-800/50">
                <span className="text-lg">{info.icon}</span>
                <div>
                  <p className={`text-xs font-semibold bg-gradient-to-r ${info.textGradient} bg-clip-text text-transparent`}>
                    {info.name}
                  </p>
                  <p className="text-xs text-surface-400">{info.minXp.toLocaleString()} XP</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Card className="bg-surface-900 border-surface-800">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="xp" className="gap-2">
                <Star className="w-4 h-4" />
                <span className="hidden sm:inline">By XP</span>
              </TabsTrigger>
              <TabsTrigger value="posts" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">By Posts</span>
              </TabsTrigger>
              <TabsTrigger value="comments" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">By Comments</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="xp">
              {leaderboard.length === 0 ? (
                <p className="text-center text-surface-400 py-8">No data yet. Start posting to earn XP!</p>
              ) : (
                renderLeaderboardList(leaderboard, "xp")
              )}
            </TabsContent>

            <TabsContent value="posts">
              {sortedByPosts.length === 0 ? (
                <p className="text-center text-surface-400 py-8">No data yet. Start posting!</p>
              ) : (
                renderLeaderboardList(sortedByPosts, "posts")
              )}
            </TabsContent>

            <TabsContent value="comments">
              {sortedByComments.length === 0 ? (
                <p className="text-center text-surface-400 py-8">No data yet. Start commenting!</p>
              ) : (
                renderLeaderboardList(sortedByComments, "comments")
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
