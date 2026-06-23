import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "0")
  const limit = 10
  const offset = page * limit

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Verify group access
  const { data: group } = await supabase.from("groups").select("privacy").eq("id", groupId).single()
  if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (group.privacy === "private") {
    const { data: member } = await supabase
      .from("group_members")
      .select("role")
      .eq("group_id", groupId)
      .eq("user_id", user.id)
      .single()
    if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      image_url,
      video_url,
      created_at,
      author_id,
      group_id,
      author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url),
      likes:likes(user_id),
      comments:comments(id)
    `)
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const mapped = (posts || []).map((post: any) => ({
    ...post,
    likes_count: post.likes?.length || 0,
    comments_count: post.comments?.length || 0,
    user_has_liked: post.likes?.some((l: any) => l.user_id === user.id) || false,
  }))

  const postIds = mapped.map((p: any) => p.id)
  let reactionData: any[] = []
  if (postIds.length > 0) {
    const { data: rxns } = await supabase
      .from("post_reactions")
      .select("post_id, user_id, reaction_type")
      .in("post_id", postIds)
    reactionData = rxns || []
  }

  const reactionMap: Record<string, any> = {}
  for (const r of reactionData) {
    const pid = r.post_id
    if (!reactionMap[pid]) {
      reactionMap[pid] = { counts: { amen: 0, love: 0, praying: 0, inspired: 0, like: 0 }, userReaction: null, total: 0 }
    }
    reactionMap[pid].counts[r.reaction_type] = (reactionMap[pid].counts[r.reaction_type] || 0) + 1
    reactionMap[pid].total++
    if (r.user_id === user.id) reactionMap[pid].userReaction = r.reaction_type
  }

  const hasMore = (posts || []).length === limit

  return NextResponse.json({ posts: mapped, reactionMap, hasMore, nextPage: page + 1 })
}
