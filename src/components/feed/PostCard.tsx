"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getInitials, formatRelativeTime } from "@/lib/utils"
import { Heart, MessageCircle, MoreHorizontal, Trash2, Send } from "lucide-react"
import Link from "next/link"
import { toggleLike, deletePost, addComment, getComments, toggleCommentLike } from "@/lib/actions/posts"
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
  
  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

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

  const handleCommentLike = async (commentId: string) => {
    // Optimistic update
    setComments(prevComments =>
      prevComments.map(c => {
        if (c.id === commentId) {
          const userHasLiked = !c.user_has_liked
          return {
            ...c,
            user_has_liked: userHasLiked,
            likes_count: userHasLiked ? c.likes_count + 1 : Math.max(0, c.likes_count - 1)
          }
        }
        return c
      })
    )

    const result = await toggleCommentLike(commentId)
    if (result?.error) {
      // Revert/refresh on error
      const fetchedComments = await getComments(post.id)
      setComments(fetchedComments)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault()
    if (!replyText.trim() || isSubmittingReply) return

    setIsSubmittingReply(true)
    const result = await addComment(post.id, replyText, parentId)

    if (!result.error) {
      const fetchedComments = await getComments(post.id)
      setComments(fetchedComments)
      setReplyText("")
      setReplyToCommentId(null)
      setCommentsCount(commentsCount + 1)
    }
    setIsSubmittingReply(false)
  }

  if (isDeleting) return null

  return (
    <div className="glass rounded-2xl p-5 sm:p-7 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-white/10 group">
      <div className="flex items-center justify-between mb-4">
        <Link href={`/profile/${post.author.username}`} className="flex items-center gap-3 group/author">
          <Avatar className="w-12 h-12 border border-surface-700 shadow-sm transition-transform duration-300 group-hover/author:scale-105 group-hover/author:border-brand-500/50">
            <AvatarImage src={post.author.avatar_url || ""} />
            <AvatarFallback>{getInitials(post.author.display_name)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold text-white text-base group-hover/author:text-brand-400 transition-colors">{post.author.display_name}</h4>
            <p className="text-xs text-surface-400 font-medium">{formatRelativeTime(post.created_at)}</p>
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
        <p className="text-surface-100 whitespace-pre-wrap text-[15px] leading-relaxed">{post.content}</p>
        
        {post.image_url && (
          <div className="rounded-xl overflow-hidden border border-surface-700/50 mt-4 shadow-md group-hover:border-white/10 transition-colors">
            <img 
              src={post.image_url} 
              alt="Post attachment" 
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-4 mt-5 border-t border-surface-700/40">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 rounded-full px-4 hover:bg-brand-500/10 transition-colors ${isLiked ? 'text-brand-500' : 'text-surface-300 hover:text-white'}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current animate-scale-in' : ''}`} />
            <span className="font-medium">{likesCount > 0 ? likesCount : 'Like'}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 rounded-full px-4 text-surface-300 hover:text-white hover:bg-surface-800/80 transition-colors"
            onClick={handleToggleComments}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{commentsCount > 0 ? commentsCount : 'Comment'}</span>
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-5 pt-5 border-t border-surface-700/40 space-y-5 animate-fade-in">
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="flex items-center gap-3">
            <Avatar className="w-9 h-9 border border-surface-700">
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2 relative">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="bg-surface-900/50 border-surface-700/60 text-white placeholder:text-surface-500 rounded-full pl-4 pr-12 h-11 focus:border-brand-500/50 focus:bg-surface-800/80 transition-all"
                disabled={isSubmittingComment}
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost"
                disabled={!commentText.trim() || isSubmittingComment}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full text-brand-500 hover:text-brand-400 hover:bg-brand-500/10"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-6 pl-2">
              {comments
                .filter((c: any) => !c.parent_id)
                .map((comment: any, i: number) => {
                  const replies = comments.filter((r: any) => r.parent_id === comment.id)
                  const isReplyingToThis = replyToCommentId === comment.id

                  return (
                    <div key={comment.id} className="space-y-3 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                      {/* Main Comment */}
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8 mt-1 shrink-0 border border-surface-700">
                          <AvatarImage src={comment.author?.avatar_url || ""} />
                          <AvatarFallback>{getInitials(comment.author?.display_name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="bg-surface-800/40 border border-surface-700/30 rounded-2xl rounded-tl-sm p-3.5 shadow-sm">
                            <div className="flex items-baseline gap-2 mb-1.5">
                              <Link href={`/profile/${comment.author?.username}`} className="text-[13px] font-bold text-white hover:text-brand-400 transition-colors">
                                {comment.author?.display_name}
                              </Link>
                              <span className="text-[11px] font-medium text-surface-500">{formatRelativeTime(comment.created_at)}</span>
                            </div>
                            <p className="text-sm text-surface-200 leading-snug">{comment.content}</p>
                          </div>
                          
                          {/* Comment Actions */}
                          <div className="flex items-center gap-4 text-xs font-semibold pl-2 text-surface-400">
                            <button
                              onClick={() => handleCommentLike(comment.id)}
                              className={`flex items-center gap-1 hover:text-pink-500 transition-colors ${comment.user_has_liked ? 'text-pink-500' : ''}`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${comment.user_has_liked ? 'fill-pink-500' : ''}`} />
                              <span>{comment.likes_count > 0 ? comment.likes_count : 'Like'}</span>
                            </button>
                            <button
                              onClick={() => {
                                setReplyToCommentId(isReplyingToThis ? null : comment.id)
                                setReplyText("")
                              }}
                              className="flex items-center gap-1 hover:text-brand-400 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Reply Form */}
                      {isReplyingToThis && (
                        <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="flex items-center gap-3 pl-11 animate-fade-in">
                          <Avatar className="w-7 h-7 border border-surface-700">
                            <AvatarFallback>You</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 flex gap-2 relative">
                            <Input
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to ${comment.author?.display_name}...`}
                              className="bg-surface-900/50 border-surface-700/60 text-white placeholder:text-surface-500 rounded-full pl-4 pr-10 h-9 text-xs focus:border-brand-500/50 focus:bg-surface-800/80 transition-all"
                              disabled={isSubmittingReply}
                              autoFocus
                            />
                            <Button 
                              type="submit" 
                              size="icon" 
                              variant="ghost"
                              disabled={!replyText.trim() || isSubmittingReply}
                              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full text-brand-500 hover:text-brand-400 hover:bg-brand-500/10"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </form>
                      )}

                      {/* Replies List */}
                      {replies.length > 0 && (
                        <div className="pl-11 space-y-3 border-l-2 border-surface-800/60 ml-4">
                          {replies.map((reply: any) => (
                            <div key={reply.id} className="flex items-start gap-2.5">
                              <Avatar className="w-6.5 h-6.5 mt-0.5 shrink-0 border border-surface-700">
                                <AvatarImage src={reply.author?.avatar_url || ""} />
                                <AvatarFallback>{getInitials(reply.author?.display_name)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="bg-surface-800/20 border border-surface-700/20 rounded-xl rounded-tl-sm p-3 shadow-sm">
                                  <div className="flex items-baseline gap-2 mb-1">
                                    <Link href={`/profile/${reply.author?.username}`} className="text-[12px] font-bold text-white hover:text-brand-400 transition-colors">
                                      {reply.author?.display_name}
                                    </Link>
                                    <span className="text-[10px] font-medium text-surface-500">{formatRelativeTime(reply.created_at)}</span>
                                  </div>
                                  <p className="text-xs text-surface-200 leading-normal">{reply.content}</p>
                                </div>

                                {/* Reply Actions */}
                                <div className="flex items-center gap-3.5 text-[10px] font-semibold pl-1.5 text-surface-400">
                                  <button
                                    onClick={() => handleCommentLike(reply.id)}
                                    className={`flex items-center gap-1 hover:text-pink-500 transition-colors ${reply.user_has_liked ? 'text-pink-500' : ''}`}
                                  >
                                    <Heart className={`w-3 h-3 ${reply.user_has_liked ? 'fill-pink-500' : ''}`} />
                                    <span>{reply.likes_count > 0 ? reply.likes_count : 'Like'}</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setReplyToCommentId(comment.id)
                                      setReplyText(`@${reply.author?.username} `)
                                    }}
                                    className="flex items-center gap-1 hover:text-brand-400 transition-colors"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span>Reply</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          ) : (
            <p className="text-center text-surface-500 text-sm py-2">No comments yet. Be the first!</p>
          )}
        </div>
      )}
    </div>
  )
}
