"use client"

import { FriendCard } from "@/components/friends/FriendCard"
import { usePresence } from "@/hooks/usePresence"

interface FriendsListClientProps {
  friends: any[]
  requests: { incoming: any[]; outgoing: any[] }
  suggested: any[]
  currentUserId: string
  onAction: (action: string, friendshipId?: string, userId?: string) => Promise<void>
}

export function FriendsListClient({ friends, requests, suggested, currentUserId, onAction }: FriendsListClientProps) {
  const { isOnline } = usePresence(currentUserId)

  return (
    <>
      {/* Friends with presence */}
      {friends.length === 0 ? (
        <p className="text-center text-surface-400 py-8">No friends yet. Add someone!</p>
      ) : (
        <div className="space-y-3">
          {friends.map((f: any) => (
            <FriendCard
              key={f.id}
              profile={f.friend}
              type="friend"
              friendshipId={f.id}
              onAction={onAction}
              isOnline={isOnline(f.friend.id)}
            />
          ))}
        </div>
      )}
    </>
  )
}

export function SuggestedListClient({ suggested, currentUserId, onAction }: { suggested: any[]; currentUserId: string; onAction: any }) {
  const { isOnline } = usePresence(currentUserId)

  return (
    <div className="space-y-3">
      {suggested.map((profile: any) => (
        <FriendCard
          key={profile.id}
          profile={profile}
          type="suggested"
          onAction={onAction}
          isOnline={isOnline(profile.id)}
        />
      ))}
    </div>
  )
}
