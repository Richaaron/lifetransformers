"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Users, UserPlus, Loader2 } from "lucide-react"

export function SuggestedUsersWidget() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchSuggestions = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get current friends/follows
      const { data: friends } = await supabase
        .from("friendships")
        .select("user_id, friend_id")
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

      const friendIds = new Set<string>()
      friends?.forEach(f => {
        friendIds.add(f.user_id === user.id ? f.friend_id : f.user_id)
      })

      // Fetch users who are not friends
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .neq("id", user.id)
        .limit(20)

      if (profiles) {
        // Filter out already friends
        const suggested = profiles.filter(p => !friendIds.has(p.id)).slice(0, 3)
        setUsers(suggested)
      }
      setLoading(false)
    }

    fetchSuggestions()
  }, [])

  const handleFollow = async (targetId: string, e: React.MouseEvent) => {
    e.preventDefault() // prevent navigating to profile
    if (following.has(targetId)) return
    
    setFollowing(prev => new Set(prev).add(targetId))
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Create friendship
    await supabase.from("friendships").insert({
      user_id: user.id,
      friend_id: targetId,
      status: "accepted" // Auto accept for simplicity in this version
    })
  }

  if (loading) {
    return (
      <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5">
        <h3 className="font-bold text-white flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-primary-400" />
          Who to follow
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-surface-800 rounded w-20" />
                <div className="h-2 bg-surface-800 rounded w-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (users.length === 0) return null

  return (
    <div className="bg-surface-900 border border-surface-800 rounded-2xl p-5">
      <h3 className="font-bold text-white flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-primary-400" />
        Who to follow
      </h3>
      <div className="space-y-4">
        {users.map(u => {
          const isFollowing = following.has(u.id)
          return (
            <Link key={u.id} href={`/profile/${u.username}`} className="flex items-center gap-3 group">
              <Avatar className="w-10 h-10 border border-surface-700">
                <AvatarImage src={u.avatar_url || ""} />
                <AvatarFallback>{getInitials(u.display_name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-surface-100 group-hover:text-white truncate text-sm">
                  {u.display_name}
                </p>
                <p className="text-xs text-surface-500 truncate">@{u.username}</p>
              </div>
              <button 
                onClick={(e) => handleFollow(u.id, e)}
                disabled={isFollowing}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isFollowing 
                    ? 'bg-surface-800 text-surface-400 cursor-default' 
                    : 'bg-primary-500/10 text-primary-400 hover:bg-primary-500 hover:text-white'
                }`}
              >
                {isFollowing ? <Users className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              </button>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
