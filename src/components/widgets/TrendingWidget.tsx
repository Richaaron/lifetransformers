"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Hash, TrendingUp } from "lucide-react"

export function TrendingWidget() {
  const [trends, setTrends] = useState<{tag: string, count: number}[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrends = async () => {
      const supabase = createClient()
      
      // We don't have a dedicated hashtag table yet, so we will extract them 
      // from recent posts. In a real production app with massive scale, 
      // this would be done by a background worker aggregating into a trending table.
      
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data: posts } = await supabase
        .from("posts")
        .select("content")
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(100)

      if (posts) {
        const tagCounts: Record<string, number> = {}
        const hashtagRegex = /#[\w\u0590-\u05ff]+/g

        posts.forEach(post => {
          const content = post.content || ""
          const matches = content.match(hashtagRegex)
          if (matches) {
            // Use a Set to only count a tag once per post
            const uniqueTags = new Set<string>(matches.map((t: string) => t.toLowerCase()))
            uniqueTags.forEach((tag: string) => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1
            })
          }
        })

        // Sort by count
        const sorted = Object.entries(tagCounts)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        setTrends(sorted)
      }
      setLoading(false)
    }

    fetchTrends()
  }, [])

  if (loading) {
    return (
      <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5">
        <h3 className="font-bold text-white flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-brand-500" />
          Trending Now
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-800" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-surface-800 rounded w-24" />
                <div className="h-2 bg-surface-800 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (trends.length === 0) return null

  return (
    <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5">
      <h3 className="font-bold text-white flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-brand-500" />
        Trending Now
      </h3>
      <div className="space-y-4">
        {trends.map((trend, index) => (
          <Link 
            key={trend.tag} 
            href={`/explore?tag=${encodeURIComponent(trend.tag)}`}
            className="flex items-start gap-3 group"
          >
            <div className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center text-surface-400 group-hover:bg-brand-500/10 group-hover:text-brand-400 transition-colors shrink-0">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-surface-100 group-hover:text-brand-400 transition-colors text-sm">
                {trend.tag.replace('#', '')}
              </p>
              <p className="text-[11px] text-surface-500">
                {trend.count} {trend.count === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
