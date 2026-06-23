"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { PostCard } from "@/components/feed/PostCard"
import { Loader2, Hash, SearchX } from "lucide-react"

interface InfiniteExploreFeedProps {
  initialTag?: string
  currentUserId: string
}

export function InfiniteExploreFeed({ initialTag, currentUserId }: InfiniteExploreFeedProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [reactionMap, setReactionMap] = useState<Record<string, any>>({})
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [tag, setTag] = useState(initialTag || "")
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Reset and fetch when tag changes
  useEffect(() => {
    setPosts([])
    setReactionMap({})
    setPage(0)
    setHasMore(true)
    setIsInitialLoad(true)
  }, [tag])

  const fetchPosts = useCallback(async (currentPage: number) => {
    if (isLoading || (!hasMore && currentPage > 0)) return
    setIsLoading(true)

    try {
      const url = new URL("/api/explore", window.location.origin)
      url.searchParams.set("page", currentPage.toString())
      if (tag) url.searchParams.set("tag", tag)

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()

      if (data.posts && data.posts.length > 0) {
        if (currentPage === 0) {
          setPosts(data.posts)
          setReactionMap(data.reactionMap)
        } else {
          setPosts(prev => {
            const newPosts = data.posts.filter((p: any) => !prev.some(existing => existing.id === p.id))
            return [...prev, ...newPosts]
          })
          setReactionMap(prev => ({ ...prev, ...data.reactionMap }))
        }
        setPage(data.nextPage)
        setHasMore(data.hasMore)
      } else {
        if (currentPage === 0) setPosts([])
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading explore posts:", error)
    } finally {
      setIsLoading(false)
      setIsInitialLoad(false)
    }
  }, [tag, hasMore, isLoading])

  // Initial load
  useEffect(() => {
    if (isInitialLoad) {
      fetchPosts(0)
    }
  }, [isInitialLoad, fetchPosts])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isInitialLoad) {
          fetchPosts(page)
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    observerRef.current = observer

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [fetchPosts, hasMore, isLoading, page, isInitialLoad])

  return (
    <div className="space-y-6">
      {/* Search Bar UI inside the feed component for immediate reactivity if needed, or controlled by parent */}
      
      {isInitialLoad && posts.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-strong border border-surface-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <SearchX className="w-8 h-8 text-surface-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
          <p className="text-surface-400">
            {tag ? `We couldn't find any public posts with #${tag}.` : "No public posts available right now."}
          </p>
        </div>
      ) : (
        <>
          {tag && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-surface-400">Showing results for:</span>
              <span className="px-3 py-1 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-full text-sm font-semibold flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {tag}
              </span>
            </div>
          )}
          
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

          <div ref={loadMoreRef} className="py-4 flex justify-center h-12">
            {isLoading && !isInitialLoad && (
              <div className="flex items-center gap-2 text-surface-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading more...</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
