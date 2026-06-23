import { Metadata } from "next"
import { getFeed } from "@/lib/queries/feed"
import { PostComposer } from "@/components/feed/PostComposer"
import { PostCard } from "@/components/feed/PostCard"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Feed - Life Transformers",
}

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, avatar_url, display_name")
    .eq("id", user.id)
    .single()

  const feed = await getFeed()

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
            Home Feed
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

      <div className="space-y-6 pt-4 animate-fade-up delay-200">
        {feed.length === 0 ? (
          <div className="glass-strong border border-surface-800 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Welcome to the network!</h3>
            <p className="text-surface-400">No posts yet. Start the conversation by sharing something above.</p>
          </div>
        ) : (
          feed.map((post: any, i: number) => (
            <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 100, 500)}ms` }}>
              <PostCard post={post} currentUserId={user.id} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
