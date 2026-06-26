"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { getInitials, formatRelativeTime } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Heart, MessageCircle, MoreHorizontal, Trash2, Send, ChevronDown, ChevronUp, Flag } from "lucide-react"
import Link from "next/link"
import { deletePost } from "@/lib/actions/posts"
import { RichTextContent } from "@/components/feed/RichTextContent"
import { ReactionBar } from "@/components/feed/ReactionBar"
import type { ReactionType } from "@/lib/actions/reactions"
import ReportModal from "./ReportModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PostCardProps {
  post: any
  currentUserId: string
  reactionSummary?: {
    counts: Record<ReactionType, number>
    userReaction: ReactionType | null
    total: number
  }
}

const DEFAULT_REACTION_SUMMARY = {
  counts: { amen: 0, love: 0, praying: 0, inspired: 0, like: 0 } as Record<ReactionType, number>,
  userReaction: null as ReactionType | null,
  total: 0,
}

export function PostCard({ post, currentUserId, reactionSummary }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [commentsCount, setCommentsCount] = useState(post.comments_count)
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  const [replyToCommentId, setReplyToCommentId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)

  const isAuthor = post.author_id === currentUserId

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      setIsDeleting(true)
      await deletePost(post.id)
    }
  }

  const fetchComments = async () => {
    setIsLoadingComments(true)
    try {
      const res = await fetch(`/api/comments?postId=${post.id}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err)
    } finally {
      setIsLoadingComments(false)
    }
  }

  const handleToggleComments = async () => {
    const next = !showComments
    setShowComments(next)
    if (next && comments.length === 0) {
      await fetchComments()
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || isSubmittingComment) return
    setIsSubmittingComment(true)
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, content: commentText }),
      })
      if (res.ok) {
        setCommentText("")
        setCommentsCount((c: number) => c + 1)
        await fetchComments()
      }
    } catch (err) {
      console.error("Failed to submit comment:", err)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleCommentLike = async (commentId: string) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          const liked = !c.user_has_liked
          return { ...c, user_has_liked: liked, likes_count: liked ? c.likes_count + 1 : Math.max(0, c.likes_count - 1) }
        }
        return c
      })
    )
    try {
      await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      })
    } catch (err) {
      await fetchComments()
    }
  }

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault()
    if (!replyText.trim() || isSubmittingReply) return
    setIsSubmittingReply(true)
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, content: replyText, parentId }),
      })
      if (res.ok) {
        setReplyText("")
        setReplyToCommentId(null)
        setCommentsCount((c: number) => c + 1)
        await fetchComments()
      }
    } catch (err) {
      console.error("Failed to submit reply:", err)
    } finally {
      setIsSubmittingReply(false)
    }
  }

  if (isDeleting) return null

  return (
    <article className="rounded-3xl bg-surface-900/70 border border-white/5 overflow-hidden mb-4">
      <div className="p-5">
        {/* Author Row */}
        <div className="flex items-start justify-between mb-4">
          <Link href={`/profile/${post.author.username}`} className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border border-brand-500/20">
              <AvatarImage src={post.author.avatar_url || ""} />
              <AvatarFallback className="bg-surface-800 text-brand-400 font-bold text-sm">
                {getInitials(post.author.display_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-white text-base leading-tight">
                {post.author.display_name}
              </p>
              <p suppressHydrationWarning className="text-sm text-surface-400 mt-0.5">
                @{post.author.username} · {formatRelativeTime(post.created_at)}
              </p>
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-surface-500 hover:text-white hover:bg-white/10 transition-all duration-200">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-surface-900 border border-white/10 rounded-2xl shadow-2xl">
              <ReportModal
                resourceType="post"
                resourceId={post.id}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer rounded-xl gap-2 px-3 py-2.5">
                    <Flag className="w-4 h-4" />
                    Report Post
                  </DropdownMenuItem>
                }
              />
              {isAuthor && (
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer rounded-xl gap-2 px-3 py-2.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Post
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <RichTextContent
          content={post.content}
          className="text-base text-white/90 mb-4 leading-relaxed"
        />

        {/* Post Image */}
        {post.image_url && (
          <div className="rounded-2xl overflow-hidden border border-white/5 mb-4">
            <img src={post.image_url} alt="Post attachment" className="w-full h-auto object-cover" />
          </div>
        )}

        {/* Post Video */}
        {post.video_url && (
          <div className="rounded-2xl overflow-hidden border border-white/5 mb-4">
            <video src={post.video_url} controls className="w-full" />
          </div>
        )}

        {/* Reaction Row */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
          <ReactionBar
            postId={post.id}
            initialSummary={reactionSummary ?? DEFAULT_REACTION_SUMMARY}
          />

          {/* Comment Toggle Button */}
          <button
            onClick={handleToggleComments}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200",
              showComments
                ? "bg-brand-500/15 text-brand-400"
                : "text-surface-400 hover:bg-white/10 hover:text-surface-200"
            )}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{commentsCount > 0 ? commentsCount : "Comment"}</span>
          </button>
        </div>
      </div>

      {/* Comments Panel */}
      {showComments && (
        <div className="border-t border-white/5 px-5 pb-5 space-y-4 bg-surface-950/50">
          {/* Comment Input */}
          <form onSubmit={handleSubmitComment} className="flex items-center gap-3 pt-4">
            <Avatar className="w-9 h-9 shrink-0 border border-brand-500/20">
              <AvatarFallback className="bg-surface-800 text-brand-400 font-bold text-xs">You</AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment…"
                className="bg-surface-800/60 border-white/10 text-white placeholder:text-surface-500 rounded-full px-4 pr-12 h-11 text-sm focus:border-brand-500/30 focus:bg-surface-800 transition-all"
                disabled={isSubmittingComment}
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmittingComment}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-brand-500 hover:bg-brand-400 text-surface-950 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          {isLoadingComments ? (
            <div className="text-center py-6">
              <p className="text-surface-500 text-sm animate-pulse">Loading comments…</p>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments
                .filter((c: any) => !c.parent_id)
                .map((comment: any) => {
                  const replies = comments.filter((r: any) => r.parent_id === comment.id)
                  const isReplyingToThis = replyToCommentId === comment.id
                  return (
                    <div key={comment.id} className="space-y-3">
                      {/* Main Comment */}
                      <div className="flex items-start gap-3">
                        <Link href={`/profile/${comment.author?.username}`} className="shrink-0 mt-0.5">
                          <Avatar className="w-8 h-8 border border-surface-700 hover:border-brand-500/20 transition-colors">
                            <AvatarImage src={comment.author?.avatar_url || ""} />
                            <AvatarFallback className="bg-surface-800 text-xs text-brand-400 font-bold">
                              {getInitials(comment.author?.display_name)}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1 space-y-1">
                          <div className="bg-surface-800/50 rounded-2xl rounded-tl-sm px-4 py-2.5">
                            <div className="flex items-baseline gap-2 mb-1">
                              <Link href={`/profile/${comment.author?.username}`} className="text-sm font-semibold text-white hover:text-brand-400 transition-colors">
                                {comment.author?.display_name}
                              </Link>
                              <span suppressHydrationWarning className="text-xs text-surface-500">{formatRelativeTime(comment.created_at)}</span>
                            </div>
                            <p className="text-sm text-white/85 leading-relaxed">{comment.content}</p>
                          </div>
                          {/* Comment actions */}
                          <div className="flex items-center gap-3 pl-2 text-xs font-semibold text-surface-500">
                            <button
                              onClick={() => handleCommentLike(comment.id)}
                              className={cn("flex items-center gap-1 transition-colors hover:text-pink-400", comment.user_has_liked ? "text-pink-400" : "")}
                            >
                              <Heart className={cn("w-3.5 h-3.5", comment.user_has_liked ? "fill-pink-400" : "")} />
                              {comment.likes_count > 0 ? comment.likes_count : "Like"}
                            </button>
                            <button
                              onClick={() => { setReplyToCommentId(isReplyingToThis ? null : comment.id); setReplyText("") }}
                              className="hover:text-brand-400 transition-colors"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Inline Reply Form */}
                      {isReplyingToThis && (
                        <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="flex items-center gap-2.5 pl-10">
                          <Avatar className="w-7 h-7 shrink-0 border border-brand-500/20">
                            <AvatarFallback className="bg-surface-800 text-[10px] text-brand-400">You</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 relative">
                            <Input
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to ${comment.author?.display_name}…`}
                              className="bg-surface-800/60 border-white/10 text-white placeholder:text-surface-500 rounded-full px-3 pr-10 h-9 text-xs focus:border-brand-500/30 transition-all"
                              disabled={isSubmittingReply}
                              autoFocus
                            />
                            <button
                              type="submit"
                              disabled={!replyText.trim() || isSubmittingReply}
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-brand-500 hover:bg-brand-400 text-surface-950 flex items-center justify-center transition-all disabled:opacity-40"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Replies */}
                      {replies.length > 0 && (
                        <div className="pl-10 space-y-2.5">
                          {replies.map((reply: any) => (
                            <div key={reply.id} className="flex items-start gap-2.5">
                              <Link href={`/profile/${reply.author?.username}`} className="shrink-0 mt-0.5">
                                <Avatar className="w-7 h-7 border border-surface-700 hover:border-brand-500/20 transition-colors">
                                  <AvatarImage src={reply.author?.avatar_url || ""} />
                                  <AvatarFallback className="bg-surface-800 text-[10px] text-brand-400 font-bold">
                                    {getInitials(reply.author?.display_name)}
                                  </AvatarFallback>
                                </Avatar>
                              </Link>
                              <div className="flex-1 space-y-1">
                                <div className="bg-surface-800/30 rounded-xl rounded-tl-sm px-3 py-2">
                                  <div className="flex items-baseline gap-2 mb-1">
                                    <Link href={`/profile/${reply.author?.username}`} className="text-xs font-semibold text-white hover:text-brand-400 transition-colors">
                                      {reply.author?.display_name}
                                    </Link>
                                    <span suppressHydrationWarning className="text-[11px] text-surface-500">{formatRelativeTime(reply.created_at)}</span>
                                  </div>
                                  <p className="text-xs text-white/80 leading-relaxed">{reply.content}</p>
                                </div>
                                <div className="flex items-center gap-3 pl-1.5 text-[11px] font-semibold text-surface-500">
                                  <button
                                    onClick={() => handleCommentLike(reply.id)}
                                    className={cn("flex items-center gap-1 transition-colors hover:text-pink-400", reply.user_has_liked ? "text-pink-400" : "")}
                                  >
                                    <Heart className={cn("w-3 h-3", reply.user_has_liked ? "fill-pink-400" : "")} />
                                    {reply.likes_count > 0 ? reply.likes_count : "Like"}
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
            <div className="text-center py-8">
              <p className="text-surface-500 text-sm">No comments yet — be the first to respond! 💬</p>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
