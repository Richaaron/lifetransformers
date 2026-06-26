import { Metadata } from "next"
import { getFeed } from "@/lib/queries/feed"
import { createClient } from "@/lib/supabase/server"
import type { ReactionType } from "@/lib/actions/reactions"
import { ClientHomePage } from "@/components/feed/ClientHomePage"

export const metadata: Metadata = {
  title: "Home - Life Transformers",
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, avatar_url, display_name")
    .eq("id", user.id)
    .single()

  // We fetch only the first page server-side
  const limit = 10
  const feed = (await getFeed()).slice(0, limit)
  const hasMoreInitial = (await getFeed()).length > limit

  // Batch-fetch reaction summaries for all posts in one query
  const postIds = feed.map((p: any) => p.id)
  let reactionMap: Record<string, {
    counts: Record<ReactionType, number>
    userReaction: ReactionType | null
    total: number
  }> = {}

  if (postIds.length > 0) {
    const { data: reactions } = await supabase
      .from("post_reactions")
      .select("post_id, user_id, reaction_type")
      .in("post_id", postIds)

    for (const r of reactions || []) {
      const pid = r.post_id
      if (!reactionMap[pid]) {
        reactionMap[pid] = {
          counts: { amen: 0, love: 0, praying: 0, inspired: 0, like: 0 },
          userReaction: null,
          total: 0,
        }
      }
      const entry = reactionMap[pid]
      entry.counts[r.reaction_type as ReactionType] = (entry.counts[r.reaction_type as ReactionType] || 0) + 1
      entry.total++
      if (r.user_id === user.id) {
        entry.userReaction = r.reaction_type as ReactionType
      }
    }
  }

  return (
    <ClientHomePage
      profile={profile}
      feed={feed}
      reactionMap={reactionMap}
      userId={user.id}
      hasMoreInitial={hasMoreInitial}
    />
  )
}
