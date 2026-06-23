"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { ActionResult } from "@/lib/types"
import { redirect } from "next/navigation"

// Helper: check if current user is owner or admin of a group
async function assertAdminOrOwner(supabase: any, groupId: string, userId: string) {
  const { data: membership } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .single()

  if (!membership || membership.role !== "admin") {
    throw new Error("Unauthorized: only admins can perform this action")
  }
}

// Helper: check if current user is the OWNER (created_by)
async function assertOwner(supabase: any, groupId: string, userId: string) {
  const { data: group } = await supabase
    .from("groups")
    .select("created_by")
    .eq("id", groupId)
    .single()

  if (!group || group.created_by !== userId) {
    throw new Error("Unauthorized: only the group owner can perform this action")
  }
}

/** Promote a member to admin. Only admins/owners can do this. */
export async function promoteToAdmin(groupId: string, targetUserId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  try {
    await assertAdminOrOwner(supabase, groupId, user.id)
  } catch (e: any) {
    return { error: e.message }
  }

  // Cannot promote yourself
  if (targetUserId === user.id) return { error: "You cannot change your own role." }

  const { error } = await supabase
    .from("group_members")
    .update({ role: "admin" })
    .eq("group_id", groupId)
    .eq("user_id", targetUserId)

  if (error) return { error: error.message }

  revalidatePath(`/groups/${groupId}/manage`)
  return {}
}

/** Demote an admin back to member. Only the OWNER can demote other admins. */
export async function demoteToMember(groupId: string, targetUserId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  try {
    await assertOwner(supabase, groupId, user.id)
  } catch (e: any) {
    return { error: e.message }
  }

  if (targetUserId === user.id) return { error: "You cannot demote yourself." }

  const { error } = await supabase
    .from("group_members")
    .update({ role: "member" })
    .eq("group_id", groupId)
    .eq("user_id", targetUserId)

  if (error) return { error: error.message }

  revalidatePath(`/groups/${groupId}/manage`)
  return {}
}

/** Remove a member from the group. Admins can remove members; only owner can remove admins. */
export async function removeMember(groupId: string, targetUserId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (targetUserId === user.id) return { error: "Use 'Leave Group' to remove yourself." }

  // Check requester role
  const { data: requesterMembership } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .single()

  if (!requesterMembership || requesterMembership.role !== "admin") {
    return { error: "Only admins can remove members." }
  }

  // Check target role — only owner can remove other admins
  const { data: targetMembership } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", targetUserId)
    .single()

  if (targetMembership?.role === "admin") {
    try {
      await assertOwner(supabase, groupId, user.id)
    } catch (e: any) {
      return { error: "Only the group owner can remove other admins." }
    }
  }

  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", targetUserId)

  if (error) return { error: error.message }

  revalidatePath(`/groups/${groupId}/manage`)
  revalidatePath(`/groups/${groupId}`)
  return {}
}

/** Update group details (name, description, privacy). Only admins/owners. */
export async function updateGroupDetails(groupId: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  try {
    await assertAdminOrOwner(supabase, groupId, user.id)
  } catch (e: any) {
    return { error: e.message }
  }

  const name = (formData.get("name") as string)?.trim()
  const description = (formData.get("description") as string)?.trim()
  const privacy = formData.get("privacy") as "public" | "private"

  if (!name) return { error: "Group name is required." }

  const { error } = await supabase
    .from("groups")
    .update({ name, description, privacy })
    .eq("id", groupId)

  if (error) return { error: error.message }

  revalidatePath(`/groups/${groupId}`)
  revalidatePath(`/groups/${groupId}/manage`)
  return {}
}

/** Delete the group entirely. Only the OWNER can do this. */
export async function deleteGroup(groupId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  try {
    await assertOwner(supabase, groupId, user.id)
  } catch (e: any) {
    return { error: e.message }
  }

  const { error } = await supabase
    .from("groups")
    .delete()
    .eq("id", groupId)

  if (error) return { error: error.message }

  revalidatePath("/groups")
  redirect("/groups")
}
