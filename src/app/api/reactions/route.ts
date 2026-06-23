import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST /api/reactions — toggle a reaction on a post
export async function POST(request: NextRequest) {
  const { postId, reactionType } = await request.json()

  if (!postId || !reactionType) {
    return NextResponse.json({ error: "postId and reactionType required" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Find existing reaction
  const { data: existing } = await supabase
    .from("post_reactions")
    .select("id, reaction_type")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single()

  if (!existing) {
    // No existing reaction — insert new one
    const { error } = await supabase
      .from("post_reactions")
      .insert({ post_id: postId, user_id: user.id, reaction_type: reactionType })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Award XP to the user for reacting
    try {
      await supabase.rpc("add_xp", {
        p_user_id: user.id,
        p_amount: 1,
        p_reason: "post_reacted",
        p_reference_id: postId,
      })
    } catch {}

    // Award XP to post author
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
          p_reason: "reaction_received",
          p_reference_id: postId,
        })
      } catch {}
    }

    return NextResponse.json({ reaction: reactionType })
  }

  if (existing.reaction_type === reactionType) {
    // Same reaction — remove it (toggle off)
    await supabase.from("post_reactions").delete().eq("id", existing.id)
    return NextResponse.json({ reaction: null })
  }

  // Different reaction — update to new type
  await supabase
    .from("post_reactions")
    .update({ reaction_type: reactionType })
    .eq("id", existing.id)

  return NextResponse.json({ reaction: reactionType })
}
