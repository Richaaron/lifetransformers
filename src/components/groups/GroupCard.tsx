"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Lock, Globe } from "lucide-react"
import Link from "next/link"
import { joinGroup, leaveGroup } from "@/lib/actions/groups"
import { useState } from "react"

interface GroupCardProps {
  group: any
  type: "discover" | "my_groups"
}

export function GroupCard({ group, type }: GroupCardProps) {
  const [isPending, setIsPending] = useState(false)

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (isPending) return
    
    setIsPending(true)
    if (type === "discover") {
      await joinGroup(group.id)
    } else {
      if (confirm("Are you sure you want to leave this group?")) {
        await leaveGroup(group.id)
      }
    }
    setIsPending(false)
  }

  return (
    <Link href={`/groups/${group.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-glow-gold/10 hover:border-brand-500/30 flex flex-col group/card">
        {/* Cover Image Placeholder */}
        <div className="h-24 bg-surface-800 relative w-full shrink-0">
          {group.cover_url ? (
            <img src={group.cover_url} alt={group.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-brand opacity-50"></div>
          )}
        </div>
        
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-white text-lg line-clamp-1 group-hover/card:text-brand-500 transition-colors">
              {group.name}
            </h3>
          </div>
          
          <p className="text-sm text-surface-400 line-clamp-2 mb-4 flex-1">
            {group.description || "No description provided."}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-800/50 shrink-0">
            <div className="flex items-center gap-3 text-xs text-surface-400">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {group.member_count} member{group.member_count !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1">
                {group.privacy === 'private' ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Globe className="w-3.5 h-3.5" />
                )}
                {group.privacy}
              </span>
            </div>
            
            <Button 
              size="sm" 
              variant={type === "my_groups" ? "secondary" : "default"}
              onClick={handleAction}
              disabled={isPending}
            >
              {type === "discover" ? "Join" : "Leave"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
