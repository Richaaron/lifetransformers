"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { ActionResult } from "@/lib/types"
import { sendPushNotification } from "./push-notifications"

export async function sendFriendRequest(targetUserId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("friendships")
    .insert({
      user_id: user.id,
      friend_id: targetUserId,
      status: "pending",
    })

  if (error) {
    if (error.code === '23505') { // Unique violation
      return { error: "Friend request already sent or exists." }
    }
    return { error: error.message }
  }

  // Create notification for target user
  await supabase.from("notifications").insert({
    user_id: targetUserId,
    actor_id: user.id,
    type: "friend_request",
  })

  // Get actor's display name for push notification
  const { data: actor } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single()

  // Send push notification
  await sendPushNotification(
    targetUserId,
    "New Friend Request",
    `${actor?.display_name || "Someone"} sent you a friend request!`,
    "/friends"
  )

  revalidatePath("/friends")
  return {}
}

export async function acceptFriendRequest(friendshipId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // First fetch the friendship to know who the requester was
  const { data: friendship, error: fetchError } = await supabase
    .from("friendships")
    .select("*")
    .eq("id", friendshipId)
    .single()

  if (fetchError || !friendship) return { error: "Friendship not found" }
  if (friendship.friend_id !== user.id) return { error: "Unauthorized to accept" }

  const { error } = await supabase
    .from("friendships")
    .update({ status: "accepted" })
    .eq("id", friendshipId)

  if (error) return { error: error.message }

  // Create notification for requester that their request was accepted
  await supabase.from("notifications").insert({
    user_id: friendship.user_id,
    actor_id: user.id,
    type: "friend_accepted",
  })

  // Get actor's display name for push notification
  const { data: actor } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single()

  // Send push notification
  await sendPushNotification(
    friendship.user_id,
    "Friend Request Accepted",
    `${actor?.display_name || "Someone"} accepted your friend request!`,
    "/friends"
  )

  revalidatePath("/friends")
  return {}
}

export async function rejectFriendRequest(friendshipId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("id", friendshipId)
    .eq("friend_id", user.id) // Only recipient can reject

  if (error) return { error: error.message }

  revalidatePath("/friends")
  return {}
}

export async function unfriend(friendshipId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("id", friendshipId)
    // RLS policy ensures only user_id or friend_id can delete

  if (error) return { error: error.message }

  revalidatePath("/friends")
  revalidatePath("/feed")
  return {}
}
