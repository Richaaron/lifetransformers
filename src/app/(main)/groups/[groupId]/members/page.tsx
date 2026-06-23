import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getGroupDetails } from "@/lib/queries/groups"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ShieldAlert, User, ChevronLeft } from "lucide-react"
import Link from "next/link"

export async function generateMetadata({ params }: { params: Promise<{ groupId: string }> }): Promise<Metadata> {
  const { groupId } = await params
  const group = await getGroupDetails(groupId)
  return {
    title: group ? `Members - ${group.name}` : "Members",
  }
}

export default async function GroupMembersPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect("/login")

  const group = await getGroupDetails(groupId)
  if (!group) notFound()

  // Must be member to view member list
  if (!group.is_member && group.privacy === "private") {
    return redirect(`/groups/${groupId}`)
  }

  const { data: members } = await supabase
    .from("group_members")
    .select(`
      role,
      joined_at,
      user:profiles!group_members_user_id_fkey(id, username, display_name, avatar_url)
    `)
    .eq("group_id", groupId)
    .order("joined_at", { ascending: true })

  const admins = (members || []).filter(m => m.role === "admin")
  const regularMembers = (members || []).filter(m => m.role === "member")

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/groups/${groupId}`} className="text-surface-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-surface-400 text-sm">{group.name} · {group.member_count} members</p>
        </div>
      </div>

      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-brand-400" />
            Admins
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {admins.map((m: any) => (
            <Link key={m.user.id} href={`/profile/${m.user.username}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-800 transition-colors group">
              <Avatar className="w-12 h-12 border border-surface-700">
                <AvatarImage src={m.user.avatar_url || ""} />
                <AvatarFallback>{getInitials(m.user.display_name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-bold text-white group-hover:text-brand-400 transition-colors">
                  {m.user.display_name}
                </p>
                <p className="text-sm text-surface-400">@{m.user.username}</p>
              </div>
              <div className="px-3 py-1 bg-brand-500/10 text-brand-400 rounded-full text-xs font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Admin
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-surface-400" />
            Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {regularMembers.length === 0 ? (
            <p className="text-surface-500 text-sm">No regular members yet.</p>
          ) : (
            regularMembers.map((m: any) => (
              <Link key={m.user.id} href={`/profile/${m.user.username}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-800 transition-colors group">
                <Avatar className="w-10 h-10 border border-surface-700">
                  <AvatarImage src={m.user.avatar_url || ""} />
                  <AvatarFallback>{getInitials(m.user.display_name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-white/90 group-hover:text-brand-400 transition-colors">
                    {m.user.display_name}
                  </p>
                  <p className="text-sm text-surface-500">@{m.user.username}</p>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
