import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { extractMentions, extractHashtags } from "@/lib/utils/content-parser"

export async function POST(request: NextRequest) {
  const { content, mediaUrl, mediaType, groupId, mentions = [], hashtags = [] } = await request.json()

  if (!content && !mediaUrl) {
    return NextResponse.json({ error: "Post content cannot be empty" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const finalContent = content || ""

  // Parse mentions/hashtags server-side too (don't trust client exclusively)
  const serverMentions = extractMentions(finalContent)
  const allMentions = [...new Set([...mentions, ...serverMentions])]

  const postData: Record<string, unknown> = {
    author_id: user.id,
    content: finalContent,
    group_id: groupId || null,
  }

  if (mediaUrl) {
    if (mediaType === "video") {
      postData.video_url = mediaUrl
    } else {
      postData.image_url = mediaUrl
    }
  }

  const { data: newPost, error } = await supabase
    .from("posts")
    .insert(postData)
    .select("id")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // ── Award XP for creating a post ──
  await supabase.rpc("add_xp", {
    p_user_id: user.id,
    p_amount: 10,
    p_reason: "post_created",
    p_reference_id: newPost.id,
  })

  // ── Fire @mention notifications ──
  if (allMentions.length > 0) {
    const { data: mentionedProfiles } = await supabase
      .from("profiles")
      .select("id, username")
      .in("username", allMentions)
      .neq("id", user.id) // Don't notify yourself

    if (mentionedProfiles && mentionedProfiles.length > 0) {
      const notificationRows = mentionedProfiles.map((profile) => ({
        user_id: profile.id,
        actor_id: user.id,
        type: "mention",
        resource_id: newPost.id,
        resource_type: "post",
      }))

      await supabase.from("notifications").insert(notificationRows)
    }
  }

  return NextResponse.json({ success: true, postId: newPost.id })
}
