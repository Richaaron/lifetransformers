"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { ActionResult } from "@/lib/types"

export async function createPost(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const content = formData.get("content") as string
  const groupId = formData.get("groupId") as string | null
  const mediaUrl = formData.get("mediaUrl") as string
  const mediaType = formData.get("mediaType") as string
  
  if (!content || content.trim().length === 0) {
    if (!mediaUrl) {
      return { error: "Post content cannot be empty" }
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const finalContent = content?.trim() || ""

  const postData: Record<string, unknown> = {
    author_id: user.id,
    content: finalContent,
    group_id: groupId || null,
  }

  if (mediaUrl) {
    if (mediaType === "video") {
      postData.video_url = mediaUrl
    } else {
      postData.image_url = mediaUrl
    }
  }

  const { error } = await supabase
    .from("posts")
    .insert(postData)

  if (error) return { error: error.message }

  await supabase.rpc("add_xp", {
    p_user_id: user.id,
    p_amount: 10,
    p_reason: "post_created",
    p_reference_id: null,
  })

  if (groupId) {
    revalidatePath(`/groups/${groupId}`)
  } else {
    revalidatePath("/feed")
  }
  
  return {}
}

export async function toggleLike(postId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check if already liked
  const { data: existingLike } = await supabase
    .from("likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single()

  if (existingLike) {
    // Unlike
    await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id)
  } else {
    // Like
    await supabase.from("likes").insert({ post_id: postId, user_id: user.id })
    
    // Notify author and award XP
    const { data: post } = await supabase.from("posts").select("author_id").eq("id", postId).single()
    if (post && post.author_id !== user.id) {
      await supabase.from("notifications").insert({
        user_id: post.author_id,
        actor_id: user.id,
        type: "post_like",
        resource_id: postId,
        resource_type: "post"
      })
      // Award XP to post author for receiving a like
      await supabase.rpc("add_xp", {
        p_user_id: post.author_id,
        p_amount: 2,
        p_reason: "like_received",
        p_reference_id: postId,
      })
    }
  }

  revalidatePath("/feed")
  // Need a way to revalidate specific group/profile paths if we were there, 
  // but next/cache revalidatePath is fairly broad if we just rely on feed right now.
  return {}
}

export async function deletePost(postId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("author_id", user.id) // RLS also enforces this

  if (error) return { error: error.message }

  revalidatePath("/feed")
  return {}
}

export async function addComment(postId: string, content: string): Promise<ActionResult> {
  if (!content || content.trim().length === 0) {
    return { error: "Comment cannot be empty" }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const finalContent = content.trim()

  const { error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      author_id: user.id,
      content: finalContent,
    })

  if (error) return { error: error.message }

  // Award XP for creating a comment
  await supabase.rpc("add_xp", {
    p_user_id: user.id,
    p_amount: 5,
    p_reason: "comment_created",
    p_reference_id: postId,
  })

  // Notify post author
  const { data: post } = await supabase.from("posts").select("author_id").eq("id", postId).single()
  if (post && post.author_id !== user.id) {
    await supabase.from("notifications").insert({
      user_id: post.author_id,
      actor_id: user.id,
      type: "post_comment",
      resource_id: postId,
      resource_type: "post"
    })
  }

  revalidatePath("/feed")
  return {}
}

export async function getComments(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: comments } = await supabase
    .from("comments")
    .select(`
      id,
      post_id,
      author_id,
      content,
      created_at,
      author:profiles!comments_author_id_fkey(id, username, display_name, avatar_url)
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true })

  return comments || []
}
