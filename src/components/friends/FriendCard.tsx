"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getInitials } from "@/lib/utils"
import Link from "next/link"
import { OnlineIndicator } from "@/components/ui/OnlineIndicator"

interface FriendCardProps {
  profile: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
    bio: string | null
  }
  type: "suggested" | "friend" | "incoming_request" | "outgoing_request"
  friendshipId?: string
  onAction?: (action: string, friendshipId?: string, userId?: string) => void
  isPending?: boolean
  isOnline?: boolean
}

export function FriendCard({ profile, type, friendshipId, onAction, isPending, isOnline = false }: FriendCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-glow-gold/10 hover:border-brand-500/30">
      <CardContent className="p-4 flex items-center justify-between">
        <Link href={`/profile/${profile.username}`} className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative">
            <Avatar className="w-12 h-12 border border-surface-700">
              <AvatarImage src={profile.avatar_url || ""} />
              <AvatarFallback>{getInitials(profile.display_name)}</AvatarFallback>
            </Avatar>
            <OnlineIndicator
              isOnline={isOnline}
              size="sm"
              className="absolute bottom-0 right-0 ring-2 ring-surface-900 rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white truncate">
              {profile.display_name}
            </h3>
            <p className="text-sm text-surface-400 truncate">
              @{profile.username}
            </p>
          </div>
        </Link>
        
        <div className="flex items-center gap-2 ml-4 shrink-0">
          {type === "suggested" && (
            <Button 
              size="sm" 
              onClick={() => onAction?.('add', undefined, profile.id)}
              disabled={isPending}
            >
              Add Friend
            </Button>
          )}
          
          {type === "incoming_request" && (
            <>
              <Button 
                size="sm" 
                onClick={() => onAction?.('accept', friendshipId)}
                disabled={isPending}
              >
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onAction?.('reject', friendshipId)}
                disabled={isPending}
              >
                Decline
              </Button>
            </>
          )}

          {type === "outgoing_request" && (
            <Button 
              size="sm" 
              variant="outline" 
              disabled
            >
              Request Sent
            </Button>
          )}

          {type === "friend" && (
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => onAction?.('unfriend', friendshipId)}
              disabled={isPending}
            >
              Unfriend
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
