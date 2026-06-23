import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/comments?postId=xxx  — fetch comments for a post
export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get("postId")
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: comments, error } = await supabase
    .from("comments")
    .select(`
      id,
      post_id,
      author_id,
      content,
      created_at,
      parent_id,
      author:profiles!comments_author_id_fkey(id, username, display_name, avatar_url),
      comment_likes(user_id)
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const processedComments = (comments || []).map((comment: any) => {
    const likes = comment.comment_likes || []
    const userHasLiked = likes.some((like: any) => like.user_id === user.id)
    return {
      ...comment,
      likes_count: likes.length,
      user_has_liked: userHasLiked,
    }
  })

  return NextResponse.json({ comments: processedComments })
}

// POST /api/comments — add a comment
export async function POST(request: NextRequest) {
  const { postId, content, parentId } = await request.json()

  if (!postId || !content?.trim()) {
    return NextResponse.json({ error: "postId and content required" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: newComment, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      author_id: user.id,
      content: content.trim(),
      parent_id: parentId || null,
    })
    .select("id")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Award XP
  await supabase.rpc("add_xp", {
    p_user_id: user.id,
    p_amount: parentId ? 7 : 5,
    p_reason: parentId ? "reply_created" : "comment_created",
    p_reference_id: postId,
  })

  // Notifications
  if (parentId) {
    const { data: parentComment } = await supabase
      .from("comments")
      .select("author_id")
      .eq("id", parentId)
      .single()

    if (parentComment && parentComment.author_id !== user.id) {
      await supabase.from("notifications").insert({
        user_id: parentComment.author_id,
        actor_id: user.id,
        type: "comment_reply",
        resource_id: postId,
        resource_type: "post",
      })
    }
  } else {
    const { data: post } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", postId)
      .single()

    if (post && post.author_id !== user.id) {
      await supabase.from("notifications").insert({
        user_id: post.author_id,
        actor_id: user.id,
        type: "post_comment",
        resource_id: postId,
        resource_type: "post",
      })
    }
  }

  return NextResponse.json({ success: true, commentId: newComment.id })
}

// POST /api/comments/like — toggle comment like
export async function PATCH(request: NextRequest) {
  const { commentId } = await request.json()
  if (!commentId) return NextResponse.json({ error: "commentId required" }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: existingLike } = await supabase
    .from("comment_likes")
    .select("comment_id")
    .eq("comment_id", commentId)
    .eq("user_id", user.id)
    .single()

  if (existingLike) {
    await supabase.from("comment_likes").delete().eq("comment_id", commentId).eq("user_id", user.id)
    return NextResponse.json({ liked: false })
  } else {
    await supabase.from("comment_likes").insert({ comment_id: commentId, user_id: user.id })
    return NextResponse.json({ liked: true })
  }
}
