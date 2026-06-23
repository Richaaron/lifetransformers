"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { PostCard } from "@/components/feed/PostCard"
import { PostSkeleton } from "@/components/feed/LoadingSkeleton"
import { Loader2 } from "lucide-react"

interface InfiniteFeedProps {
  initialPosts: any[]
  initialReactionMap: Record<string, any>
  currentUserId: string
  hasMoreInitial: boolean
}

export function InfiniteFeed({ initialPosts, initialReactionMap, currentUserId, hasMoreInitial }: InfiniteFeedProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [reactionMap, setReactionMap] = useState(initialReactionMap)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(hasMoreInitial)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/feed?page=${page}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()

      if (data.posts && data.posts.length > 0) {
        setPosts(prev => {
          // Prevent duplicates
          const newPosts = data.posts.filter((p: any) => !prev.some(existing => existing.id === p.id))
          return [...prev, ...newPosts]
        })
        setReactionMap(prev => ({ ...prev, ...data.reactionMap }))
        setPage(data.nextPage)
        setHasMore(data.hasMore)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading more posts:", error)
    } finally {
      setIsLoading(false)
    }
  }, [page, hasMore, isLoading])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }
    observerRef.current = observer

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [loadMorePosts, hasMore, isLoading])

  if (posts.length === 0 && !isLoading) {
    return (
      <div className="glass-strong border border-surface-800 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <span className="text-2xl">🌱</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Welcome to the network!</h3>
        <p className="text-surface-400">No posts yet. Start the conversation by sharing something above.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post: any, i: number) => (
        <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}>
          <PostCard
            post={post}
            currentUserId={currentUserId}
            reactionSummary={reactionMap[post.id] ?? {
              counts: { amen: 0, love: 0, praying: 0, inspired: 0, like: 0 },
              userReaction: null,
              total: 0,
            }}
          />
        </div>
      ))}

      {/* Intersection Observer Target */}
      <div ref={loadMoreRef} className="py-4 flex justify-center">
        {isLoading && (
          <div className="flex items-center gap-2 text-surface-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading more...</span>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-surface-500 text-sm">You've reached the end of the feed.</p>
        )}
      </div>
    </div>
  )
}
