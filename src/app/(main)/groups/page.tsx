import { Metadata } from "next"
import { getDiscoverGroups, getMyGroups } from "@/lib/queries/groups"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GroupCard } from "@/components/groups/GroupCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Groups - Life Transformers",
}

export default async function GroupsPage() {
  const [discoverGroups, myGroups] = await Promise.all([
    getDiscoverGroups(),
    getMyGroups()
  ])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Groups</h1>
        <Button asChild className="gap-2">
          <Link href="/groups/new">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Group</span>
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="my_groups" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
          <TabsTrigger value="my_groups">My Groups</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="my_groups" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.length === 0 ? (
              <div className="col-span-full bg-surface-900 border border-surface-800 rounded-xl p-8 text-center">
                <p className="text-surface-200 mb-2">You haven't joined any groups yet.</p>
                <p className="text-surface-400 text-sm">Check out the Discover tab to find communities.</p>
              </div>
            ) : (
              myGroups.map((group: any) => (
                <GroupCard key={group.id} group={group} type="my_groups" />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoverGroups.length === 0 ? (
              <div className="col-span-full bg-surface-900 border border-surface-800 rounded-xl p-8 text-center">
                <p className="text-surface-200 mb-2">No public groups available to join.</p>
                <p className="text-surface-400 text-sm">Why not create the first one?</p>
              </div>
            ) : (
              discoverGroups.map((group: any) => (
                <GroupCard key={group.id} group={group} type="discover" />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
