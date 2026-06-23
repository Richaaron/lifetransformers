"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { getInitials, formatRelativeTime } from "@/lib/utils"
import { Heart, MessageCircle, MoreHorizontal, Trash2, Send, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { deletePost, addComment, getComments, toggleCommentLike } from "@/lib/actions/posts"
import { RichTextContent } from "@/components/feed/RichTextContent"
import { ReactionBar } from "@/components/feed/ReactionBar"
import type { ReactionType } from "@/lib/actions/reactions"
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

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      const fetched = await getComments(post.id)
      setComments(fetched)
    }
    setShowComments(!showComments)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || isSubmittingComment) return
    setIsSubmittingComment(true)
    const result = await addComment(post.id, commentText)
    if (!result.error) {
      const fetched = await getComments(post.id)
      setComments(fetched)
      setCommentText("")
      setCommentsCount(commentsCount + 1)
    }
    setIsSubmittingComment(false)
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
    const result = await toggleCommentLike(commentId)
    if (result?.error) {
      const fetched = await getComments(post.id)
      setComments(fetched)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault()
    if (!replyText.trim() || isSubmittingReply) return
    setIsSubmittingReply(true)
    const result = await addComment(post.id, replyText, parentId)
    if (!result.error) {
      const fetched = await getComments(post.id)
      setComments(fetched)
      setReplyText("")
      setReplyToCommentId(null)
      setCommentsCount(commentsCount + 1)
    }
    setIsSubmittingReply(false)
  }

  if (isDeleting) return null

  return (
    <article
      className="group relative rounded-2xl transition-all duration-300"
      style={{
        background: "linear-gradient(160deg, rgba(14,12,26,0.88) 0%, rgba(10,10,20,0.75) 100%)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
      }}
    >
      {/* Hover top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/0 to-transparent transition-all duration-500 group-hover:via-brand-500/40" />

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ boxShadow: "inset 0 0 0 1px rgba(234,179,8,0.1)" }}
      />

      <div className="relative z-10 p-5 sm:p-6">
        {/* Author Row */}
        <div className="flex items-start justify-between mb-4">
          <Link href={`/profile/${post.author.username}`} className="flex items-center gap-3 group/author">
            <div className="relative shrink-0">
              <Avatar className="w-11 h-11 border-2 border-transparent transition-all duration-300 group-hover/author:border-brand-500/40"
                style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}>
                <AvatarImage src={post.author.avatar_url || ""} />
                <AvatarFallback className="bg-surface-700 text-brand-400 font-bold text-sm">
                  {getInitials(post.author.display_name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="font-bold text-white text-[15px] group-hover/author:text-brand-400 transition-colors duration-200 leading-tight">
                {post.author.display_name}
              </p>
              <p suppressHydrationWarning className="text-[12px] text-surface-400 font-medium mt-0.5">
                @{post.author.username} · {formatRelativeTime(post.created_at)}
              </p>
            </div>
          </Link>

          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-xl flex items-center justify-center text-surface-500 hover:text-white hover:bg-white/[0.07] transition-all duration-200 opacity-0 group-hover:opacity-100 press-effect">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-surface-800/95 backdrop-blur-xl border-surface-700/60 rounded-xl shadow-2xl">
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer rounded-lg gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Content — hashtags and @mentions rendered as clickable links */}
        <RichTextContent
          content={post.content}
          className="text-[15px] text-white/85 mb-4"
        />

        {/* Post Image */}
        {post.image_url && (
          <div className="rounded-xl overflow-hidden border border-white/[0.07] mb-4 shadow-lg">
            <img src={post.image_url} alt="Post attachment" className="w-full h-auto object-cover max-h-[480px]" />
          </div>
        )}

        {/* Post Video */}
        {post.video_url && (
          <div className="rounded-xl overflow-hidden border border-white/[0.07] mb-4 shadow-lg">
            <video src={post.video_url} controls className="w-full max-h-[480px]" />
          </div>
        )}

        {/* Reaction Row */}
        <div className="flex items-center gap-2 pt-4 border-t border-white/[0.05] flex-wrap pointer-events-auto">
          {/* Faith Reactions */}
          <ReactionBar
            postId={post.id}
            initialSummary={reactionSummary ?? DEFAULT_REACTION_SUMMARY}
          />

          {/* Comment Toggle Button */}
          <button
            onClick={handleToggleComments}
            className={`relative z-20 pointer-events-auto btn-reaction ${showComments ? "commented" : "default"}`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{commentsCount > 0 ? commentsCount : "Comment"}</span>
            {commentsCount > 0 && (
              showComments
                ? <ChevronUp className="w-3 h-3 opacity-60" />
                : <ChevronDown className="w-3 h-3 opacity-60" />
            )}
          </button>
        </div>
      </div>

      {/* Comments Panel */}
      {showComments && (
        <div className="relative z-10 border-t border-white/[0.05] px-5 sm:px-6 py-5 space-y-5 animate-fade-in rounded-b-2xl"
          style={{ background: "rgba(0,0,0,0.15)" }}>

          {/* Comment Input */}
          <form onSubmit={handleSubmitComment} className="flex items-center gap-3">
            <Avatar className="w-8 h-8 shrink-0 border border-brand-500/25">
              <AvatarFallback className="bg-surface-700 text-brand-400 font-bold text-xs">You</AvatarFallback>
            </Avatar>
            <div className="flex-1 relative">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment…"
                className="bg-surface-900/60 border-surface-700/50 text-white placeholder:text-surface-500 rounded-full pl-4 pr-11 h-10 text-sm focus:border-brand-500/40 focus:bg-surface-800/70 transition-all input-warm"
                disabled={isSubmittingComment}
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmittingComment}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-brand-500/15 hover:bg-brand-500/25 text-brand-400 flex items-center justify-center transition-all press-effect disabled:opacity-30"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-5">
              {comments
                .filter((c: any) => !c.parent_id)
                .map((comment: any, i: number) => {
                  const replies = comments.filter((r: any) => r.parent_id === comment.id)
                  const isReplyingToThis = replyToCommentId === comment.id
                  return (
                    <div key={comment.id} className="animate-fade-up space-y-3" style={{ animationDelay: `${i * 40}ms` }}>
                      {/* Main Comment */}
                      <div className="flex items-start gap-2.5">
                        <Link href={`/profile/${comment.author?.username}`} className="shrink-0 mt-0.5">
                          <Avatar className="w-7.5 h-7.5 border border-surface-700 hover:border-brand-500/30 transition-colors">
                            <AvatarImage src={comment.author?.avatar_url || ""} />
                            <AvatarFallback className="bg-surface-700 text-[10px] text-brand-400 font-bold">
                              {getInitials(comment.author?.display_name)}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1 space-y-1">
                          <div
                            className="rounded-2xl rounded-tl-sm px-4 py-3"
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.07)",
                            }}
                          >
                            <div className="flex items-baseline gap-2 mb-1.5">
                              <Link href={`/profile/${comment.author?.username}`} className="text-[13px] font-bold text-white hover:text-brand-400 transition-colors">
                                {comment.author?.display_name}
                              </Link>
                              <span className="text-[11px] text-surface-500">{formatRelativeTime(comment.created_at)}</span>
                            </div>
                            <p className="text-[13.5px] text-white/80 leading-relaxed">{comment.content}</p>
                          </div>
                          {/* Comment actions */}
                          <div className="flex items-center gap-3 pl-2 text-[11px] font-semibold text-surface-500">
                            <button
                              onClick={() => handleCommentLike(comment.id)}
                              className={`flex items-center gap-1 transition-colors hover:text-pink-400 ${comment.user_has_liked ? "text-pink-400" : ""}`}
                            >
                              <Heart className={`w-3 h-3 ${comment.user_has_liked ? "fill-pink-400" : ""}`} />
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
                        <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="flex items-center gap-2.5 pl-10 animate-fade-in">
                          <Avatar className="w-6 h-6 shrink-0 border border-brand-500/20">
                            <AvatarFallback className="bg-surface-700 text-[9px] text-brand-400">You</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 relative">
                            <Input
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to ${comment.author?.display_name}…`}
                              className="bg-surface-900/60 border-surface-700/50 text-white placeholder:text-surface-500 rounded-full pl-3.5 pr-9 h-8 text-xs focus:border-brand-500/40 transition-all"
                              disabled={isSubmittingReply}
                              autoFocus
                            />
                            <button
                              type="submit"
                              disabled={!replyText.trim() || isSubmittingReply}
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5.5 h-5.5 rounded-full text-brand-400 flex items-center justify-center disabled:opacity-30"
                            >
                              <Send className="w-3 h-3" />
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Replies */}
                      {replies.length > 0 && (
                        <div className="pl-10 space-y-2.5 relative">
                          <div className="absolute left-[18px] top-0 bottom-0 w-[1.5px] rounded-full"
                            style={{ background: "linear-gradient(180deg, rgba(234,179,8,0.2) 0%, transparent 100%)" }} />
                          {replies.map((reply: any) => (
                            <div key={reply.id} className="flex items-start gap-2.5">
                              <Link href={`/profile/${reply.author?.username}`} className="shrink-0 mt-0.5">
                                <Avatar className="w-6 h-6 border border-surface-700 hover:border-brand-500/30 transition-colors">
                                  <AvatarImage src={reply.author?.avatar_url || ""} />
                                  <AvatarFallback className="bg-surface-700 text-[9px] text-brand-400 font-bold">
                                    {getInitials(reply.author?.display_name)}
                                  </AvatarFallback>
                                </Avatar>
                              </Link>
                              <div className="flex-1 space-y-1">
                                <div
                                  className="rounded-xl rounded-tl-sm px-3.5 py-2.5"
                                  style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.05)",
                                  }}
                                >
                                  <div className="flex items-baseline gap-2 mb-1">
                                    <Link href={`/profile/${reply.author?.username}`} className="text-[12px] font-bold text-white hover:text-brand-400 transition-colors">
                                      {reply.author?.display_name}
                                    </Link>
                                    <span className="text-[10px] text-surface-500">{formatRelativeTime(reply.created_at)}</span>
                                  </div>
                                  <p className="text-[12.5px] text-white/75 leading-relaxed">{reply.content}</p>
                                </div>
                                <div className="flex items-center gap-3 pl-1.5 text-[10px] font-semibold text-surface-500">
                                  <button
                                    onClick={() => handleCommentLike(reply.id)}
                                    className={`flex items-center gap-1 transition-colors hover:text-pink-400 ${reply.user_has_liked ? "text-pink-400" : ""}`}
                                  >
                                    <Heart className={`w-2.5 h-2.5 ${reply.user_has_liked ? "fill-pink-400" : ""}`} />
                                    {reply.likes_count > 0 ? reply.likes_count : "Like"}
                                  </button>
                                  <button
                                    onClick={() => { setReplyToCommentId(comment.id); setReplyText(`@${reply.author?.username} `) }}
                                    className="hover:text-brand-400 transition-colors"
                                  >
                                    Reply
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
            <div className="text-center py-4">
              <p className="text-surface-500 text-sm">No comments yet — be the first to respond! 💬</p>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
