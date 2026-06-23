import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const groupId = formData.get("groupId")?.toString()
  const inviteCode = formData.get("inviteCode")?.toString()

  if (!groupId) {
    return NextResponse.redirect(new URL("/groups", request.url))
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verify group or invite
  const { data: group } = await supabase.from("groups").select("privacy").eq("id", groupId).single()
  
  if (!group) return NextResponse.redirect(new URL("/groups", request.url))

  if (group.privacy === "private") {
    if (!inviteCode) {
      return NextResponse.redirect(new URL(`/groups/${groupId}`, request.url)) // Will bounce them or show locked screen
    }
    // Verify invite code
    const { data: invite } = await supabase
      .from("group_invites")
      .select("id")
      .eq("code", inviteCode)
      .eq("group_id", groupId)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (!invite) {
      return NextResponse.redirect(new URL(`/groups/${groupId}`, request.url))
    }
  }

  // Join group
  const { error } = await supabase.from("group_members").insert({
    group_id: groupId,
    user_id: user.id,
    role: "member"
  })

  // Ignore error if it's a unique constraint violation (already joined)
  
  return NextResponse.redirect(new URL(`/groups/${groupId}`, request.url))
}
