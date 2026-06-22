import { createClient } from "@/lib/supabase/server"

export async function getDiscoverGroups() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Get groups where user is NOT a member AND privacy is public
  // This requires querying all public groups, then filtering out ones where user is member
  const { data: userGroups } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', user.id)

  const myGroupIds = userGroups?.map(g => g.group_id) || []

  let query = supabase
    .from('groups')
    .select(`
      id, name, description, cover_url, privacy, created_at,
      members:group_members(count)
    `)
    .eq('privacy', 'public')
    .order('created_at', { ascending: false })
    .limit(20)

  if (myGroupIds.length > 0) {
    // Exclude my groups
    // Note: PostgREST doesn't support 'not.in' easily via JS client in older versions, 
    // but .not('id', 'in', `(${myGroupIds.join(',')})`) works.
    query = query.not('id', 'in', `(${myGroupIds.join(',')})`)
  }

  const { data, error } = await query
  if (error || !data) return []

  return data.map((g: any) => ({
    ...g,
    member_count: g.members[0]?.count || 0
  }))
}

export async function getMyGroups() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('group_members')
    .select(`
      role,
      joined_at,
      group:groups(id, name, description, cover_url, privacy, members:group_members(count))
    `)
    .eq('user_id', user.id)
    .order('joined_at', { ascending: false })

  if (error || !data) return []

  return data.map((m: any) => ({
    ...m.group,
    user_role: m.role,
    member_count: m.group?.members[0]?.count || 0
  }))
}

export async function getGroupDetails(groupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: group, error } = await supabase
    .from('groups')
    .select(`
      id, name, description, cover_url, privacy, created_at,
      members:group_members(count)
    `)
    .eq('id', groupId)
    .single()

  if (error || !group) return null

  // Check if user is member
  const { data: membership } = await supabase
    .from('group_members')
    .select('role')
    .eq('group_id', groupId)
    .eq('user_id', user.id)
    .single()

  return {
    ...group,
    member_count: group.members[0]?.count || 0,
    user_role: membership?.role || null,
    is_member: !!membership
  }
}

export async function getGroupFeed(groupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id, content, image_url, created_at, author_id,
      author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url),
      likes:likes(user_id),
      comments:comments(id)
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error || !posts) return []

  return posts.map((post: any) => ({
    ...post,
    likes_count: post.likes?.length || 0,
    comments_count: post.comments?.length || 0,
    user_has_liked: post.likes?.some((like: any) => like.user_id === user.id) || false
  }))
}
