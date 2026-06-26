import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getGroupManageDetails } from "@/lib/queries/group-admin"
import { getGroupMembers } from "@/lib/queries/group-admin"
import { MemberRow } from "@/components/groups/MemberRow"
import { GroupSettingsForm } from "@/components/groups/GroupSettingsForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Crown, Shield, Users } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Manage Group - Life Transformers",
}

export default async function ManageGroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>
}) {
  const { groupId } = await params

  const [group, members] = await Promise.all([
    getGroupManageDetails(groupId),
    getGroupMembers(groupId),
  ])

  // If not an admin, block access
  if (!group) {
    redirect(`/groups/${groupId}`)
  }

  const owners = members.filter((m: any) => m.id === group.created_by)
  const admins = members.filter((m: any) => m.role === "admin" && m.id !== group.created_by)
  const regularMembers = members.filter((m: any) => m.role === "member")

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href={`/groups/${groupId}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Group</h1>
          <p className="text-surface-400 text-sm">{group.name}</p>
        </div>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm mb-6">
          <TabsTrigger value="members" className="gap-2">
            <Users className="w-4 h-4" />
            Members ({members.length})
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* ── Members Tab ── */}
        <TabsContent value="members" className="space-y-6">
          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs text-surface-400 bg-surface-900 border border-surface-800 rounded-xl p-4">
            <span className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 bg-brand-500/20 text-brand-400 border border-brand-500/30 px-2 py-0.5 rounded-full">
                <Crown className="w-3 h-3" /> Owner
              </span>
              Created the group. Full control.
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 bg-primary-500/20 text-primary-300 border border-primary-500/30 px-2 py-0.5 rounded-full">
                <Shield className="w-3 h-3" /> Admin
              </span>
              Can manage members &amp; content.
            </span>
          </div>

          {/* Owner section */}
          {owners.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-widest mb-2 px-4">Owner</h3>
              <div className="bg-surface-900 border border-surface-800 rounded-xl overflow-hidden divide-y divide-surface-800">
                {owners.map((m: any) => (
                  <MemberRow
                    key={m.id}
                    member={m}
                    groupId={groupId}
                    currentUserId={group.current_user_id}
                    isCurrentUserOwner={group.current_user_is_owner}
                    groupOwnerId={group.created_by}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Admins section */}
          <div>
            <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-widest mb-2 px-4">
              Admins ({admins.length})
            </h3>
            <div className="bg-surface-900 border border-surface-800 rounded-xl overflow-hidden divide-y divide-surface-800">
              {admins.length === 0 ? (
                <p className="text-surface-400 text-sm p-4">No other admins yet. Promote a member to give them admin access.</p>
              ) : (
                admins.map((m: any) => (
                  <MemberRow
                    key={m.id}
                    member={m}
                    groupId={groupId}
                    currentUserId={group.current_user_id}
                    isCurrentUserOwner={group.current_user_is_owner}
                    groupOwnerId={group.created_by}
                  />
                ))
              )}
            </div>
          </div>

          {/* Members section */}
          <div>
            <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-widest mb-2 px-4">
              Members ({regularMembers.length})
            </h3>
            <div className="bg-surface-900 border border-surface-800 rounded-xl overflow-hidden divide-y divide-surface-800">
              {regularMembers.length === 0 ? (
                <p className="text-surface-400 text-sm p-4">No regular members yet.</p>
              ) : (
                regularMembers.map((m: any) => (
                  <MemberRow
                    key={m.id}
                    member={m}
                    groupId={groupId}
                    currentUserId={group.current_user_id}
                    isCurrentUserOwner={group.current_user_is_owner}
                    groupOwnerId={group.created_by}
                  />
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── Settings Tab ── */}
        <TabsContent value="settings">
          <GroupSettingsForm group={group} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
