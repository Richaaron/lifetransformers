import { createClient } from "@/lib/supabase/server"

export async function getNotifications() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("notifications")
    .select(`
      id,
      type,
      resource_id,
      resource_type,
      read,
      created_at,
      actor:profiles!notifications_actor_id_fkey(id, username, display_name, avatar_url)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error || !data) return []

  return data
}
