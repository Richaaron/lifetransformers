import { createClient } from "@/lib/supabase/server"

export async function search(query: string) {
  if (!query || query.trim().length === 0) {
    return { people: [], groups: [] }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { people: [], groups: [] }

  const cleanQuery = query.trim()

  // Search people
  const { data: people } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio")
    .or(`display_name.ilike.%${cleanQuery}%,username.ilike.%${cleanQuery}%`)
    .eq('status', 'active')
    .neq('id', user.id) // Exclude self
    .limit(10)

  // Search groups (only public groups)
  const { data: groups } = await supabase
    .from("groups")
    .select(`
      id, name, description, cover_url, privacy, created_at,
      members:group_members(count)
    `)
    .eq('privacy', 'public')
    .or(`name.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%`)
    .limit(10)

  // Process group member counts
  const formattedGroups = groups?.map((g: any) => ({
    ...g,
    member_count: g.members[0]?.count || 0
  })) || []

  return {
    people: people || [],
    groups: formattedGroups
  }
}
