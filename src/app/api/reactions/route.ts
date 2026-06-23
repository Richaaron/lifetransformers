import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST /api/reactions — toggle a like on a post (uses existing 'likes' table)
export async function POST(request: NextRequest) {
  const { postId } = await request.json()

  if (!postId) {
    return NextResponse.json({ error: "postId required" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Check if already liked
  const { data: existing } = await supabase
    .from("likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existing) {
    // Already liked — remove (toggle off)
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id)
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ liked: false })
  } else {
    // Not liked — add like
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: user.id })
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Notify post author
    const { data: post } = await supabase
      .from("posts").select("author_id").eq("id", postId).single()

    if (post && post.author_id !== user.id) {
      try {
        await supabase.from("notifications").insert({
          user_id: post.author_id,
          actor_id: user.id,
          type: "post_like",
          resource_id: postId,
          resource_type: "post",
        })
        await supabase.rpc("add_xp", {
          p_user_id: post.author_id,
          p_amount: 2,
          p_reason: "like_received",
          p_reference_id: postId,
        })
      } catch {} // non-blocking
    }

    return NextResponse.json({ liked: true })
  }
}

// GET /api/reactions?postId=xxx — get like count and user's like status
export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get("postId")
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: likes, error } = await supabase
    .from("likes")
    .select("user_id")
    .eq("post_id", postId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const count = likes?.length ?? 0
  const userLiked = likes?.some(l => l.user_id === user.id) ?? false

  return NextResponse.json({ count, userLiked })
}
