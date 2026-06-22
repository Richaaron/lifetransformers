import { Metadata } from "next"
import { getFeed } from "@/lib/queries/feed"
import { PostComposer } from "@/components/feed/PostComposer"
import { PostCard } from "@/components/feed/PostCard"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Feed - Life Transformers",
}

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url, display_name")
    .eq("id", user.id)
    .single()

  const feed = await getFeed()

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Home Feed</h1>
      </div>
      
      {profile && (
        <PostComposer currentUser={profile} />
      )}

      <div className="space-y-4">
        {feed.length === 0 ? (
          <div className="bg-surface-900 border border-surface-800 rounded-xl p-8 text-center text-surface-400">
            <p>No posts yet. Start the conversation or add more friends!</p>
          </div>
        ) : (
          feed.map((post: any) => (
            <PostCard key={post.id} post={post} currentUserId={user.id} />
          ))
        )}
      </div>
    </div>
  )
}
