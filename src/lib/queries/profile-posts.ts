import { createClient } from "@/lib/supabase/server"

export async function getProfilePosts(userId: string) {
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  // Get all posts by this user (group_id is null)
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
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error || !posts) return []

  // Map to UI structure, check if current user liked the posts
  return posts.map((post: any) => ({
    ...post,
    likes_count: post.likes?.length || 0,
    comments_count: post.comments?.length || 0,
    user_has_liked: post.likes?.some((like: any) => like.user_id === currentUser?.id) || false
  }))
}
