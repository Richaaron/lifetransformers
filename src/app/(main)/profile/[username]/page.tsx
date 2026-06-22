import { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getInitials } from "@/lib/utils"
import { LEVEL_NAMES, getXpProgress } from "@/lib/types"
import { Star, Trophy, MessageSquare, Heart, Calendar } from "lucide-react"
import Link from "next/link"

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  return {
    title: `${username} - Life Transformers`,
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", username)
    .single()

  if (!profile) {
    notFound()
  }

  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", profile.id)
    .single()

  const level = progress?.level || 1
  const xp = progress?.xp || 0
  const levelInfo = LEVEL_NAMES[level] || LEVEL_NAMES[1]
  const xpProgress = getXpProgress(xp, level)
  const postsCount = progress?.posts_count || 0
  const commentsCount = progress?.comments_count || 0

  const STAR_COLORS: Record<number, string> = {
    1: "#94a3b8", 2: "#d1d5db", 3: "#34d399", 4: "#38bdf8",
    5: "#60a5fa", 6: "#a78bfa", 7: "#818cf8", 8: "#fb923c",
    9: "#fb7185", 10: "#fbbf24", 11: "#e879f9", 12: "#67e8f9",
  }
  const nameColor = STAR_COLORS[level] || "#94a3b8"

  let filledStars = 0
  if (level >= 10) filledStars = 5
  else if (level >= 8) filledStars = 4
  else if (level >= 6) filledStars = 3
  else if (level >= 4) filledStars = 2
  else if (level >= 2) filledStars = 1
  else filledStars = 1

  return (
    <div className="space-y-6">
      <Card className="bg-surface-900 border-surface-800">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar_url || ""} />
              <AvatarFallback className="text-2xl">{getInitials(profile.display_name)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white">{profile.display_name}</h1>
              <p className="text-surface-400">@{profile.username}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      style={{
                        width: 16,
                        height: 16,
                        color: i < filledStars ? nameColor : "#404040",
                        fill: i < filledStars ? nameColor : "transparent",
                      }}
                    />
                  ))}
                </div>
                <span style={{ color: nameColor, fontSize: 13, fontWeight: 700 }}>
                  {levelInfo.name}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-surface-900 border-surface-800">
          <CardContent className="pt-4 text-center">
            <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{xp.toLocaleString()}</p>
            <p className="text-xs text-surface-400">XP</p>
          </CardContent>
        </Card>
        <Card className="bg-surface-900 border-surface-800">
          <CardContent className="pt-4 text-center">
            <Star className="w-6 h-6 text-brand-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">Level {level}</p>
            <p className="text-xs text-surface-400">{levelInfo.name}</p>
          </CardContent>
        </Card>
        <Card className="bg-surface-900 border-surface-800">
          <CardContent className="pt-4 text-center">
            <MessageSquare className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{postsCount}</p>
            <p className="text-xs text-surface-400">Posts</p>
          </CardContent>
        </Card>
        <Card className="bg-surface-900 border-surface-800">
          <CardContent className="pt-4 text-center">
            <Heart className="w-6 h-6 text-rose-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{commentsCount}</p>
            <p className="text-xs text-surface-400">Comments</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle className="text-sm">Level Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={xpProgress} className="h-3" />
          <p className="text-xs text-surface-400 mt-2">{xpProgress}% to next level</p>
        </CardContent>
      </Card>

      <Card className="bg-surface-900 border-surface-800">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-surface-400 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
