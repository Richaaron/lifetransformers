import { createClient } from "@/lib/supabase/server"
import type { LeaderboardEntry } from "@/lib/types"

export async function getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: progress } = await supabase
    .from("user_progress")
    .select(`
      user_id,
      xp,
      level,
      posts_count,
      comments_count,
      likes_received,
      profile:profiles!user_progress_user_id_fkey(id, username, display_name, avatar_url)
    `)
    .order("xp", { ascending: false })
    .limit(limit)

  if (!progress) return []

  return progress.map((p: any) => ({
    user_id: p.user_id,
    username: p.profile?.username || "",
    display_name: p.profile?.display_name || "Unknown",
    avatar_url: p.profile?.avatar_url || null,
    xp: p.xp,
    level: p.level,
    posts_count: p.posts_count,
    comments_count: p.comments_count,
    likes_received: p.likes_received,
  }))
}

export async function getUserProgress(userId: string) {
  const supabase = await createClient()

  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single()

  return progress
}
