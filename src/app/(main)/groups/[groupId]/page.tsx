import { Metadata } from "next"
import { getGroupDetails, getGroupFeed } from "@/lib/queries/groups"
import { PostComposer } from "@/components/feed/PostComposer"
import { PostCard } from "@/components/feed/PostCard"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, Lock, Globe, Settings } from "lucide-react"
import Link from "next/link"
import { joinGroup } from "@/lib/actions/groups"

export const metadata: Metadata = {
  title: "Group - Life Transformers",
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>
}) {
  const { groupId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [group, feed] = await Promise.all([
    getGroupDetails(groupId),
    getGroupFeed(groupId)
  ])

  if (!group) {
    return (
      <div className="p-8 text-center bg-surface-900 border border-surface-800 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-2">Group Not Found</h2>
        <p className="text-surface-400">This group doesn't exist or you don't have permission to view it.</p>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, avatar_url, display_name")
    .eq("id", user.id)
    .single()

  const canViewFeed = group.privacy === 'public' || group.is_member

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Group Header */}
      <div className="bg-surface-900 border border-surface-800 rounded-xl overflow-hidden">
        <div className="h-48 bg-surface-800 relative w-full">
          {group.cover_url ? (
            <img src={group.cover_url} alt={group.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-brand opacity-50"></div>
          )}
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{group.name}</h1>
              <div className="flex items-center gap-4 text-sm text-surface-400 mb-4">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {group.member_count} member{group.member_count !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  {group.privacy === 'private' ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
                  {group.privacy === 'private' ? 'Private Group' : 'Public Group'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {group.is_member ? (
                group.user_role === 'admin' && (
                  <Button variant="outline" className="gap-2" asChild>
                    <Link href={`/groups/${groupId}/manage`}>
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:inline">Manage</span>
                    </Link>
                  </Button>
                )
              ) : (
                <form action={async () => {
                  "use server"
                  await joinGroup(groupId)
                  redirect(`/groups/${groupId}`)
                }}>
                  <Button type="submit">Join Group</Button>
                </form>
              )}
            </div>
          </div>
          <p className="text-surface-200">{group.description}</p>
        </div>
      </div>

      {/* Feed Area */}
      {canViewFeed ? (
        <div className="space-y-6 mt-8">
          {group.is_member && profile && (
            <PostComposer currentUser={profile} groupId={group.id} />
          )}

          <div className="space-y-4">
            {feed.length === 0 ? (
              <div className="bg-surface-900 border border-surface-800 rounded-xl p-8 text-center text-surface-400">
                <p>No posts in this group yet.</p>
              </div>
            ) : (
              feed.map((post: any) => (
                <PostCard key={post.id} post={post} currentUserId={user.id} />
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-12 text-center mt-8">
          <Lock className="w-12 h-12 text-surface-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">This group is private</h3>
          <p className="text-surface-400">Join the group to see posts and discussions.</p>
        </div>
      )}
    </div>
  )
}
