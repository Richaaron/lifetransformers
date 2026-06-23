import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getGroupDetails } from "@/lib/queries/groups"
import { PostComposer } from "@/components/feed/PostComposer"
import { InfiniteGroupFeed } from "@/components/groups/InfiniteGroupFeed"
import { FeedSkeleton } from "@/components/feed/LoadingSkeleton"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Lock, Users, Settings, UserPlus } from "lucide-react"
import Link from "next/link"
import type { ReactionType } from "@/lib/actions/reactions"

export async function generateMetadata({ params }: { params: Promise<{ groupId: string }> }): Promise<Metadata> {
  const { groupId } = await params
  const group = await getGroupDetails(groupId)
  return {
    title: group ? `${group.name} - Groups` : "Group Not Found",
  }
}

export default async function GroupDetailPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect("/login")

  const group = await getGroupDetails(groupId)
  if (!group) notFound()

  // Get current user profile for the composer
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, avatar_url, display_name")
    .eq("id", user.id)
    .single()

  const isMember = group.is_member
  const isAdmin = group.user_role === "admin"

  // If private and not a member, hide content
  if (group.privacy === "private" && !isMember) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden">
          <div className="h-48 bg-surface-800 relative">
            {group.cover_url ? (
              <img src={group.cover_url} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-600/20 to-surface-800" />
            )}
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-6">
              <Lock className="w-12 h-12 text-surface-400 mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">{group.name}</h1>
              <p className="text-surface-300 max-w-md">This is a private group. You must be invited to join.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Pre-fetch first page of posts
  const limit = 10
  const { data: postsData } = await supabase
    .from("posts")
    .select(`
      id, content, image_url, video_url, created_at, author_id, group_id,
      author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url),
      likes:likes(user_id), comments:comments(id)
    `)
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .limit(limit + 1)

  const hasMoreInitial = (postsData || []).length > limit
  const initialPostsRaw = (postsData || []).slice(0, limit)

  const initialPosts = initialPostsRaw.map((post: any) => ({
    ...post,
    likes_count: post.likes?.length || 0,
    comments_count: post.comments?.length || 0,
    user_has_liked: post.likes?.some((l: any) => l.user_id === user.id) || false,
  }))

  // Pre-fetch reactions
  const postIds = initialPosts.map((p: any) => p.id)
  const reactionMap: Record<string, any> = {}
  if (postIds.length > 0) {
    const { data: rxns } = await supabase
      .from("post_reactions")
      .select("post_id, user_id, reaction_type")
      .in("post_id", postIds)

    for (const r of rxns || []) {
      const pid = r.post_id
      if (!reactionMap[pid]) {
        reactionMap[pid] = { counts: { amen: 0, love: 0, praying: 0, inspired: 0, like: 0 }, userReaction: null, total: 0 }
      }
      reactionMap[pid].counts[r.reaction_type] = (reactionMap[pid].counts[r.reaction_type] || 0) + 1
      reactionMap[pid].total++
      if (r.user_id === user.id) reactionMap[pid].userReaction = r.reaction_type as ReactionType
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Group Header */}
      <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="h-48 sm:h-64 bg-surface-800 relative">
          {group.cover_url ? (
            <img src={group.cover_url} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-600/30 to-brand-900/50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-semibold text-white/90 border border-white/10 flex items-center gap-1.5">
                  {group.privacy === "private" ? <Lock className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                  <span className="capitalize">{group.privacy} Group</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-semibold text-white/90 border border-white/10">
                  {group.member_count} Members
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">{group.name}</h1>
              <p className="text-surface-200 max-w-xl text-sm">{group.description}</p>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              {isAdmin && (
                <Button asChild variant="outline" size="sm" className="bg-black/50 border-white/10 hover:bg-white/10">
                  <Link href={`/groups/${groupId}/settings`}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </Button>
              )}
              {isMember ? (
                <Button asChild variant="outline" size="sm" className="bg-black/50 border-white/10 hover:bg-white/10">
                  <Link href={`/groups/${groupId}/members`}>
                    <Users className="w-4 h-4 mr-2" />
                    Members
                  </Link>
                </Button>
              ) : (
                <form action="/api/groups/join" method="POST">
                  <input type="hidden" name="groupId" value={groupId} />
                  <Button type="submit" size="sm" className="bg-brand-500 hover:bg-brand-400 text-surface-950 font-bold">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Group
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isMember ? (
        <>
          {profile && (
            <div className="animate-fade-up">
              <PostComposer currentUser={profile} groupId={groupId} />
            </div>
          )}

          <div className="pt-4">
            <Suspense fallback={<FeedSkeleton />}>
              <InfiniteGroupFeed
                groupId={groupId}
                initialPosts={initialPosts}
                initialReactionMap={reactionMap}
                currentUserId={user.id}
                hasMoreInitial={hasMoreInitial}
              />
            </Suspense>
          </div>
        </>
      ) : (
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-8 text-center">
          <p className="text-surface-300">Join this group to see and participate in the discussion.</p>
        </div>
      )}
    </div>
  )
}
