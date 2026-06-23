"use client"

import { useState, useTransition } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils"
import { promoteToAdmin, demoteToMember, removeMember } from "@/lib/actions/group-admin"
import { Shield, ShieldOff, Crown, UserMinus, Loader2 } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MemberRowProps {
  member: any
  groupId: string
  currentUserId: string
  isCurrentUserOwner: boolean
  groupOwnerId: string
}

export function MemberRow({ member, groupId, currentUserId, isCurrentUserOwner, groupOwnerId }: MemberRowProps) {
  const [isPending, startTransition] = useTransition()
  const [localRole, setLocalRole] = useState(member.role)
  const [removed, setRemoved] = useState(false)

  const isOwner = member.id === groupOwnerId
  const isMe = member.id === currentUserId
  const isAdmin = localRole === "admin"

  // What actions can the current user take on this member?
  const canPromote = !isMe && !isOwner && !isAdmin && isCurrentUserOwner
  const canDemote = !isMe && !isOwner && isAdmin && isCurrentUserOwner
  const canRemove = !isMe && !isOwner && (isCurrentUserOwner || (!isAdmin))

  const handlePromote = () => {
    startTransition(async () => {
      const result = await promoteToAdmin(groupId, member.id)
      if (!result?.error) setLocalRole("admin")
      else alert(result.error)
    })
  }

  const handleDemote = () => {
    startTransition(async () => {
      const result = await demoteToMember(groupId, member.id)
      if (!result?.error) setLocalRole("member")
      else alert(result.error)
    })
  }

  const handleRemove = () => {
    if (!confirm(`Remove ${member.display_name} from the group?`)) return
    startTransition(async () => {
      const result = await removeMember(groupId, member.id)
      if (!result?.error) setRemoved(true)
      else alert(result.error)
    })
  }

  if (removed) return null

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-surface-800/50 rounded-lg transition-colors">
      <Link href={`/profile/${member.username}`} className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="w-10 h-10 border border-surface-700 shrink-0">
          <AvatarImage src={member.avatar_url || ""} />
          <AvatarFallback>{getInitials(member.display_name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white truncate">{member.display_name}</span>
            {isOwner && (
              <span className="flex items-center gap-1 text-xs bg-brand-500/20 text-brand-400 border border-brand-500/30 px-2 py-0.5 rounded-full shrink-0">
                <Crown className="w-3 h-3" /> Owner
              </span>
            )}
            {!isOwner && isAdmin && (
              <span className="flex items-center gap-1 text-xs bg-primary-500/20 text-primary-300 border border-primary-500/30 px-2 py-0.5 rounded-full shrink-0">
                <Shield className="w-3 h-3" /> Admin
              </span>
            )}
            {isMe && (
              <span className="text-xs text-surface-400 shrink-0">(you)</span>
            )}
          </div>
          <p className="text-sm text-surface-400 truncate">@{member.username}</p>
        </div>
      </Link>

      {/* Actions dropdown — only shown if there are actions available */}
      {(canPromote || canDemote || canRemove) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="shrink-0 ml-2" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Manage"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-surface-800 border-surface-700 w-52">
            {canPromote && (
              <DropdownMenuItem onClick={handlePromote} className="cursor-pointer gap-2">
                <Shield className="w-4 h-4 text-primary-400" />
                Make Admin
              </DropdownMenuItem>
            )}
            {canDemote && (
              <DropdownMenuItem onClick={handleDemote} className="cursor-pointer gap-2">
                <ShieldOff className="w-4 h-4 text-surface-400" />
                Remove Admin Role
              </DropdownMenuItem>
            )}
            {(canPromote || canDemote) && canRemove && (
              <DropdownMenuSeparator />
            )}
            {canRemove && (
              <DropdownMenuItem
                onClick={handleRemove}
                className="cursor-pointer gap-2 text-destructive-foreground focus:bg-destructive/20 focus:text-destructive-foreground"
              >
                <UserMinus className="w-4 h-4" />
                Remove from Group
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
