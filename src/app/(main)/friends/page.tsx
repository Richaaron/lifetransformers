import { Metadata } from "next"
import { getFriends, getPendingRequests, getSuggestedFriends } from "@/lib/queries/friends"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FriendCard } from "@/components/friends/FriendCard"
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, unfriend } from "@/lib/actions/friends"
import { revalidatePath } from "next/cache"

export const metadata: Metadata = {
  title: "Friends - Life Transformers",
}

export default async function FriendsPage() {
  const [friends, requests, suggested] = await Promise.all([
    getFriends(),
    getPendingRequests(),
    getSuggestedFriends()
  ])

  // Server actions wrappers
  async function handleAction(action: string, friendshipId?: string, userId?: string) {
    "use server"
    
    if (action === 'add' && userId) {
      await sendFriendRequest(userId)
    } else if (action === 'accept' && friendshipId) {
      await acceptFriendRequest(friendshipId)
    } else if (action === 'reject' && friendshipId) {
      await rejectFriendRequest(friendshipId)
    } else if (action === 'unfriend' && friendshipId) {
      await unfriend(friendshipId)
    }
    revalidatePath("/friends")
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Friends</h1>
      </div>

      <Tabs defaultValue="suggested" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="suggested">Suggested</TabsTrigger>
          <TabsTrigger value="requests">
            Requests 
            {requests.incoming.length > 0 && (
              <span className="ml-2 bg-brand-500 text-brand-950 text-xs font-bold px-2 py-0.5 rounded-full">
                {requests.incoming.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="friends">My Friends ({friends.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="suggested" className="space-y-4">
          <div className="bg-surface-900 border border-surface-800 rounded-xl p-6 text-center mb-4">
            <h3 className="text-lg font-medium text-white mb-1">People You May Know</h3>
            <p className="text-sm text-surface-400">Discover other members in the Life Transformers network.</p>
          </div>
          
          <div className="grid gap-4">
            {suggested.length === 0 ? (
              <p className="text-center text-surface-400 py-8">No suggestions right now.</p>
            ) : (
              suggested.map((user: any) => (
                <FriendCard 
                  key={user.id} 
                  profile={user} 
                  type="suggested" 
                  onAction={handleAction} 
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Incoming Requests</h3>
            <div className="grid gap-4">
              {requests.incoming.length === 0 ? (
                <p className="text-surface-400 text-sm">No incoming friend requests.</p>
              ) : (
                requests.incoming.map((req: any) => (
                  <FriendCard 
                    key={req.friendship_id} 
                    profile={req.profile} 
                    type="incoming_request" 
                    friendshipId={req.friendship_id}
                    onAction={handleAction} 
                  />
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-4 mt-8">Sent Requests</h3>
            <div className="grid gap-4">
              {requests.outgoing.length === 0 ? (
                <p className="text-surface-400 text-sm">No outgoing friend requests.</p>
              ) : (
                requests.outgoing.map((req: any) => (
                  <FriendCard 
                    key={req.friendship_id} 
                    profile={req.profile} 
                    type="outgoing_request" 
                    friendshipId={req.friendship_id}
                    onAction={handleAction} 
                  />
                ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="friends" className="space-y-4">
          <div className="grid gap-4">
            {friends.length === 0 ? (
              <div className="bg-surface-900 border border-surface-800 rounded-xl p-8 text-center">
                <p className="text-surface-200 mb-2">You haven't added any friends yet.</p>
                <p className="text-surface-400 text-sm">Go to the Suggested tab to find people you know.</p>
              </div>
            ) : (
              friends.map((friend: any) => (
                <FriendCard 
                  key={friend.friendship_id} 
                  profile={friend.profile} 
                  type="friend" 
                  friendshipId={friend.friendship_id}
                  onAction={handleAction} 
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
