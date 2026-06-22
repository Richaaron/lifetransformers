"use client"

import { useState } from "react"
import { useActionState } from "react"
import { createPost } from "@/lib/actions/posts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Image as ImageIcon, Loader2 } from "lucide-react"
import type { ActionResult } from "@/lib/types"

const initialState: ActionResult = {
  error: "",
}

interface PostComposerProps {
  currentUser: {
    avatar_url: string | null
    display_name: string
  }
  groupId?: string
}

export function PostComposer({ currentUser, groupId }: PostComposerProps) {
  const [state, formAction, isPending] = useActionState(createPost, initialState)
  const [content, setContent] = useState("")

  return (
    <div className="bg-surface-900 border border-surface-800 rounded-xl p-4 transition-all focus-within:shadow-glow-gold/10 focus-within:border-brand-500/30">
      <form 
        action={formAction} 
        className="flex gap-4"
      >
        {groupId && <input type="hidden" name="groupId" value={groupId} />}
        
        <Avatar className="w-10 h-10 mt-1 shrink-0">
          <AvatarImage src={currentUser.avatar_url || ""} />
          <AvatarFallback>{currentUser.display_name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3 min-w-0">
          <Textarea
            name="content"
            placeholder="Share something with your network..."
            className="min-h-[60px] resize-none border-none bg-transparent px-0 py-2 focus-visible:ring-0 text-base"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPending}
          />
          
          <div className="flex items-center justify-between pt-2 border-t border-surface-800">
            <Button type="button" variant="ghost" size="sm" className="text-surface-400 hover:text-brand-500 gap-2">
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Attach Photo</span>
            </Button>
            
            <Button 
              type="submit" 
              disabled={content.trim().length === 0 || isPending}
              className="rounded-full px-6"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Post"
              )}
            </Button>
          </div>
          
          {state?.error && (
            <p className="text-sm text-destructive mt-2">{state.error}</p>
          )}
        </div>
      </form>
    </div>
  )
}
