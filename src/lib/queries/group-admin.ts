import { createClient } from "@/lib/supabase/server"

export async function getGroupMembers(groupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("group_members")
    .select(`
      role,
      joined_at,
      user_id,
      profile:profiles!group_members_user_id_fkey(id, username, display_name, avatar_url, bio)
    `)
    .eq("group_id", groupId)
    .order("joined_at", { ascending: true })

  if (error || !data) return []

  return data.map((m: any) => ({
    ...m.profile,
    role: m.role,
    joined_at: m.joined_at,
    user_id: m.user_id,
  }))
}

export async function getGroupManageDetails(groupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get group details including created_by
  const { data: group, error } = await supabase
    .from("groups")
    .select("id, name, description, cover_url, privacy, created_by, created_at")
    .eq("id", groupId)
    .single()

  if (error || !group) return null

  // Verify current user is at least an admin
  const { data: membership } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .single()

  if (!membership || membership.role !== "admin") return null

  return {
    ...group,
    current_user_id: user.id,
    current_user_is_owner: group.created_by === user.id,
    current_user_role: membership.role,
  }
}
