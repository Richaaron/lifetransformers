import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const { content, mediaUrl, mediaType, groupId } = await request.json()

  if (!content && !mediaUrl) {
    return NextResponse.json({ error: "Post content cannot be empty" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const finalContent = content || ""

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

  const { error } = await supabase
    .from("posts")
    .insert(postData)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.rpc("add_xp", {
    p_user_id: user.id,
    p_amount: 10,
    p_reason: "post_created",
    p_reference_id: null,
  })

  return NextResponse.json({ success: true })
}
