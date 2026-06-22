import { createClient } from "@/lib/supabase/server"

export async function getFeed() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Using a raw query for the feed to get posts from self + friends
  // In a production app, a Postgres view or RPC function is better for performance.
  
  // 1. Get friend IDs
  const { data: friendships } = await supabase
    .from('friendships')
    .select('user_id, friend_id')
    .eq('status', 'accepted')
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

  const authorIds = [user.id]
  if (friendships) {
    friendships.forEach(f => {
      authorIds.push(f.user_id === user.id ? f.friend_id : f.user_id)
    })
  }

  // 2. Get posts by those authors (where group_id is null)
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      content,
      image_url,
      created_at,
      author_id,
      author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url),
      likes:likes(user_id),
      comments:comments(id)
    `)
    .is('group_id', null)
    .in('author_id', authorIds)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error || !posts) return []

  // 3. Map to UI structure
  return posts.map((post: any) => ({
    ...post,
    likes_count: post.likes?.length || 0,
    comments_count: post.comments?.length || 0,
    user_has_liked: post.likes?.some((like: any) => like.user_id === user.id) || false
  }))
}
