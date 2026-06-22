"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getInitials, formatRelativeTime } from "@/lib/utils"
import { Heart, MessageCircle, MoreHorizontal, Trash2, Send } from "lucide-react"
import Link from "next/link"
import { toggleLike, deletePost, addComment, getComments } from "@/lib/actions/posts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PostCardProps {
  post: any
  currentUserId: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.user_has_liked)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [isLiking, setIsLiking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [commentsCount, setCommentsCount] = useState(post.comments_count)

  const isAuthor = post.author_id === currentUserId

  const handleLike = async () => {
    if (isLiking) return
    
    // Optimistic update
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
    setIsLiking(true)
    
    await toggleLike(post.id)
    setIsLiking(false)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      setIsDeleting(true)
      await deletePost(post.id)
    }
  }

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      const fetchedComments = await getComments(post.id)
      setComments(fetchedComments)
    }
    setShowComments(!showComments)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || isSubmittingComment) return

    setIsSubmittingComment(true)
    const result = await addComment(post.id, commentText)
    
    if (!result.error) {
      // Refresh comments
      const fetchedComments = await getComments(post.id)
      setComments(fetchedComments)
      setCommentText("")
      setCommentsCount(commentsCount + 1)
    }
    
    setIsSubmittingComment(false)
  }

  if (isDeleting) return null

  return (
    <div className="bg-surface-900 border border-surface-800 rounded-xl p-4 sm:p-6 transition-all hover:border-surface-700">
      <div className="flex items-center justify-between mb-4">
        <Link href={`/profile/${post.author.username}`} className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author.avatar_url || ""} />
            <AvatarFallback>{getInitials(post.author.display_name)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-white hover:underline">{post.author.display_name}</h4>
            <p className="text-xs text-surface-400">{formatRelativeTime(post.created_at)}</p>
          </div>
        </Link>
        
        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-surface-400">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-surface-800 border-surface-700">
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <div className="space-y-4">
        <p className="text-surface-100 whitespace-pre-wrap">{post.content}</p>
        
        {post.image_url && (
          <div className="rounded-lg overflow-hidden border border-surface-800 mt-3">
            <img 
              src={post.image_url} 
              alt="Post attachment" 
              className="w-full h-auto object-cover max-h-96"
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-surface-800/50">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 ${isLiked ? 'text-brand-500 hover:text-brand-400' : 'text-surface-400 hover:text-white'}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount > 0 ? likesCount : 'Like'}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-surface-400 hover:text-white"
            onClick={handleToggleComments}
          >
            <MessageCircle className="w-5 h-5" />
            <span>{commentsCount > 0 ? commentsCount : 'Comment'}</span>
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-surface-800/50 space-y-4">
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="bg-surface-800 border-surface-700 text-white placeholder:text-surface-500"
                disabled={isSubmittingComment}
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost"
                disabled={!commentText.trim() || isSubmittingComment}
                className="text-brand-500 hover:text-brand-400"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment: any) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.author?.avatar_url || ""} />
                    <AvatarFallback>{getInitials(comment.author?.display_name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-surface-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/profile/${comment.author?.username}`} className="text-sm font-semibold text-white hover:underline">
                        {comment.author?.display_name}
                      </Link>
                      <span className="text-xs text-surface-500">{formatRelativeTime(comment.created_at)}</span>
                    </div>
                    <p className="text-sm text-surface-200">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-surface-500 text-sm py-2">No comments yet. Be the first!</p>
          )}
        </div>
      )}
    </div>
  )
}
