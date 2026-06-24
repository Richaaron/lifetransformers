import { Metadata } from "next"
import { getFeed } from "@/lib/queries/feed"
import { PostComposer } from "@/components/feed/PostComposer"
import { InfiniteFeed } from "@/components/feed/InfiniteFeed"
import { FeedSkeleton } from "@/components/feed/LoadingSkeleton"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import type { ReactionType } from "@/lib/actions/reactions"
import Image from "next/image"

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
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Hero Banner */}
      <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden shadow-2xl animate-fade-in group">
        <Image
          src="/feed-banner.png"
          alt="Life Transformers Community"
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/20 to-transparent" />
        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 animate-fade-up delay-200">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
            Home
          </h1>
          <p className="text-surface-200 text-sm sm:text-base font-light max-w-md">
            Connect, share, and grow with the Life Transformers community.
          </p>
        </div>
      </div>
      
      {profile && (
        <div className="animate-fade-up delay-100">
          <PostComposer currentUser={profile} />
        </div>
      )}

      <div className="pt-4">
        <Suspense fallback={<FeedSkeleton />}>
          <InfiniteFeed
            initialPosts={feed}
            initialReactionMap={reactionMap}
            currentUserId={user.id}
            hasMoreInitial={hasMoreInitial}
          />
        </Suspense>
      </div>
    </div>
  )
}
