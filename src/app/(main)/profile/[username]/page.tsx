import { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LEVEL_NAMES, getXpProgress, type ReactionType } from "@/lib/types"
import { Star, Trophy, MessageSquare, Heart, Calendar, MapPin, Gamepad2, User, Pencil } from "lucide-react"
import Link from "next/link"
import { ProfileAvatarModal } from "@/components/profile/ProfileAvatarModal"
import { ProfileMessageButton } from "@/components/profile/ProfileMessageButton"
import { getProfilePosts } from "@/lib/queries/profile-posts"
import { PostCard } from "@/components/feed/PostCard"
import { PostComposer } from "@/components/feed/PostComposer"

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  return {
    title: `${username} - Life Transformers`,
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }>) {
  const { username } = await params
  const supabase = await createClient()
  
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", username)
    .single()

  if (!profile) {
    notFound()
  }

  const isOwnProfile = currentUser?.id === profile.id

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
  const nameColor = STAR_COLORS[level] || "#a1a1aa"

  let filledStars = 0
  if (level >= 10) filledStars = 5
  else if (level >= 8) filledStars = 4
  else if (level >= 6) filledStars = 3
  else if (level >= 4) filledStars = 2
  else if (level >= 2) filledStars = 1
  else filledStars = 1

  // Fetch user's posts
  const posts = await getProfilePosts(profile.id)

  // Fetch reaction map for posts
  let reactionMap: Record<string, {
    counts: Record<ReactionType, number>
    userReaction: ReactionType | null
    total: number
  }> = {}
  const postIds = posts.map((p: any) => p.id)
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
      if (currentUser && r.user_id === currentUser.id) {
        entry.userReaction = r.reaction_type as ReactionType
      }
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <Card className="bg-surface-900 border-surface-800 overflow-hidden">
        {/* Cover Banner */}
        <div className="h-48 sm:h-64 relative bg-surface-800">
          {profile.cover_url ? (
            <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-600/20 via-surface-800 to-brand-900/40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/40 to-transparent" />
        </div>

        <CardContent className="pt-0 relative px-6 sm:px-10 pb-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 -mt-16 sm:-mt-20 relative z-10">
            <ProfileAvatarModal 
              avatarUrl={profile.avatar_url} 
              displayName={profile.display_name} 
            />
            <div className="flex-1 text-center sm:text-left">
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
            {isOwnProfile ? (
              <Link
                href="/profile/edit"
                className="flex items-center gap-2 px-4 py-2 bg-surface-800 hover:bg-surface-700 rounded-lg text-sm font-medium text-white transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </Link>
            ) : (
              <ProfileMessageButton targetUserId={profile.id} />
            )}
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

      {(profile.bio || profile.location || profile.hobby || profile.date_of_birth) && (
        <Card className="bg-surface-900 border-surface-800">
          <CardHeader>
            <CardTitle className="text-sm">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.bio && (
              <p className="text-surface-200 text-sm">{profile.bio}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-surface-400">
              {profile.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.hobby && (
                <div className="flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4" />
                  <span>{profile.hobby}</span>
                </div>
              )}
              {profile.date_of_birth && (
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{new Date(profile.date_of_birth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Wall / Posts */}
      <div className="space-y-4">
        {isOwnProfile && currentUser && (
          <PostComposer currentUser={{
            id: currentUser.id,
            avatar_url: profile.avatar_url,
            display_name: profile.display_name,
          }} />
        )}
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUser?.id || null}
              reactionCounts={reactionMap[post.id]?.counts || { amen: 0, love: 0, praying: 0, inspired: 0, like: 0 }}
              userReaction={reactionMap[post.id]?.userReaction || null}
              totalReactions={reactionMap[post.id]?.total || 0}
            />
          ))
        ) : (
          <Card className="bg-surface-900 border-surface-800">
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-surface-400">No posts yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
