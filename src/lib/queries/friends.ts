import { createClient } from "@/lib/supabase/server"

export async function getFriends() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Query friendships where status is accepted and the user is either the requester or recipient
  const { data, error } = await supabase
    .from('friendships')
    .select(`
      id,
      status,
      created_at,
      user_id,
      friend_id,
      requester:profiles!friendships_user_id_fkey(id, username, display_name, avatar_url, bio),
      recipient:profiles!friendships_friend_id_fkey(id, username, display_name, avatar_url, bio)
    `)
    .eq('status', 'accepted')
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

  if (error || !data) return []

  // Map the data to a uniform structure so the UI doesn't have to check if they are requester or recipient
  return data.map((f: any) => {
    const isRequester = f.user_id === user.id
    const friendProfile = isRequester ? f.recipient : f.requester
    return {
      friendship_id: f.id,
      profile: friendProfile,
      since: f.created_at
    }
  })
}

export async function getPendingRequests() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { incoming: [], outgoing: [] }

  const { data, error } = await supabase
    .from('friendships')
    .select(`
      id,
      status,
      created_at,
      user_id,
      friend_id,
      requester:profiles!friendships_user_id_fkey(id, username, display_name, avatar_url),
      recipient:profiles!friendships_friend_id_fkey(id, username, display_name, avatar_url)
    `)
    .eq('status', 'pending')
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

  if (error || !data) return { incoming: [], outgoing: [] }

  const incoming: any[] = []
  const outgoing: any[] = []

  data.forEach((f: any) => {
    if (f.friend_id === user.id) {
      incoming.push({
        friendship_id: f.id,
        profile: f.requester,
        sent_at: f.created_at
      })
    } else {
      outgoing.push({
        friendship_id: f.id,
        profile: f.recipient,
        sent_at: f.created_at
      })
    }
  })

  return { incoming, outgoing }
}

export async function getSuggestedFriends() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // For V1, suggested friends are just 5 random active profiles the user is not friends with
  // A true mutual friends query would be done via a Postgres function
  const { data: existingFriendships } = await supabase
    .from('friendships')
    .select('user_id, friend_id')
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

  const excludedIds = [user.id]
  if (existingFriendships) {
    existingFriendships.forEach(f => {
      excludedIds.push(f.user_id)
      excludedIds.push(f.friend_id)
    })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, bio')
    .eq('status', 'active')
    .not('id', 'in', `(${excludedIds.join(',')})`)
    .limit(10)

  if (error || !data) return []
  return data
}
