"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { ActionResult } from "@/lib/types"

export type ReactionType = "amen" | "love" | "praying" | "inspired" | "like"

export const REACTIONS: Record<ReactionType, { emoji: string; label: string; color: string }> = {
  amen:     { emoji: "🙏", label: "Amen",     color: "text-amber-400"  },
  love:     { emoji: "❤️",  label: "Love",     color: "text-rose-400"   },
  praying:  { emoji: "🕊️", label: "Praying",  color: "text-purple-400" },
  inspired: { emoji: "✨",  label: "Inspired", color: "text-yellow-400" },
  like:     { emoji: "👍",  label: "Like",     color: "text-blue-400"   },
}

/**
 * Toggle a reaction on a post.
 * - If the user has no reaction yet: insert the new one
 * - If the user has the SAME reaction: remove it (un-react)
 * - If the user has a DIFFERENT reaction: update to the new type
 */
export async function toggleReaction(
  postId: string,
  reactionType: ReactionType
): Promise<ActionResult<{ reaction: ReactionType | null }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

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

    if (error) return { error: error.message }

    // Award XP to post author for receiving a reaction
    const { data: post } = await supabase
      .from("posts").select("author_id").eq("id", postId).single()

    if (post && post.author_id !== user.id) {
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
    }

    revalidatePath("/feed")
    return { data: { reaction: reactionType } }
  }

  if (existing.reaction_type === reactionType) {
    // Same reaction — remove it (toggle off)
    await supabase.from("post_reactions").delete().eq("id", existing.id)
    revalidatePath("/feed")
    return { data: { reaction: null } }
  }

  // Different reaction — update to new type
  await supabase
    .from("post_reactions")
    .update({ reaction_type: reactionType })
    .eq("id", existing.id)

  revalidatePath("/feed")
  return { data: { reaction: reactionType } }
}

/**
 * Fetch the reaction summary for a post.
 * Returns counts per reaction type and the current user's reaction.
 */
export async function getPostReactions(postId: string): Promise<{
  counts: Record<ReactionType, number>
  userReaction: ReactionType | null
  total: number
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: reactions } = await supabase
    .from("post_reactions")
    .select("reaction_type, user_id")
    .eq("post_id", postId)

  const counts: Record<ReactionType, number> = {
    amen: 0, love: 0, praying: 0, inspired: 0, like: 0,
  }
  let userReaction: ReactionType | null = null
  let total = 0

  for (const r of reactions || []) {
    counts[r.reaction_type as ReactionType] = (counts[r.reaction_type as ReactionType] || 0) + 1
    total++
    if (r.user_id === user?.id) {
      userReaction = r.reaction_type as ReactionType
    }
  }

  return { counts, userReaction, total }
}
