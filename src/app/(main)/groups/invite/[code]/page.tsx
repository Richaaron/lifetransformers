import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Lock } from "lucide-react"

export const metadata: Metadata = {
  title: "Group Invite",
}

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect(`/login?returnUrl=/groups/invite/${code}`)

  // Find the invite
  const { data: invite } = await supabase
    .from("group_invites")
    .select(`
      id, group_id, expires_at,
      group:groups(id, name, description, cover_url, privacy, members:group_members(count))
    `)
    .eq("code", code)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (!invite || !invite.group) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-2">Invalid or Expired Invite</h1>
        <p className="text-surface-400">This invite link is no longer active.</p>
      </div>
    )
  }

  const group = invite.group as any
  const memberCount = group.members?.[0]?.count || 0

  // Check if already a member
  const { data: member } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", group.id)
    .eq("user_id", user.id)
    .single()

  if (member) {
    return redirect(`/groups/${group.id}`)
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card className="bg-surface-900 border-surface-800 overflow-hidden shadow-2xl">
        <div className="h-32 bg-surface-800 relative">
          {group.cover_url ? (
            <img src={group.cover_url} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-600/30 to-brand-900/50" />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <CardContent className="pt-6 relative text-center">
          <div className="mx-auto w-16 h-16 bg-surface-900 border-4 border-surface-900 rounded-2xl flex items-center justify-center -mt-14 mb-4 shadow-xl">
            {group.privacy === "private" ? <Lock className="w-6 h-6 text-brand-400" /> : <Users className="w-6 h-6 text-brand-400" />}
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">{group.name}</h1>
          <p className="text-surface-300 text-sm mb-6">{group.description}</p>
          <div className="text-xs text-surface-400 mb-6 font-semibold bg-surface-800 inline-block px-3 py-1 rounded-full">
            {memberCount} Members
          </div>

          <form action="/api/groups/join" method="POST">
            <input type="hidden" name="groupId" value={group.id} />
            <input type="hidden" name="inviteCode" value={code} />
            <Button type="submit" className="w-full bg-brand-500 hover:bg-brand-400 text-surface-950 font-bold">
              Join Group
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
