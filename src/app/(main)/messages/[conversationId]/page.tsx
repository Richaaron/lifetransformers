import { Metadata } from "next"
import { getMessages, getConversationDetails } from "@/lib/queries/messages"
import { MessageThread } from "@/components/messages/MessageThread"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Conversation - Life Transformers",
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [initialMessages, otherUser] = await Promise.all([
    getMessages(conversationId),
    getConversationDetails(conversationId)
  ])

  if (!otherUser) {
    // If the conversation doesn't exist or user isn't part of it, RLS blocks it.
    redirect("/messages")
  }

  return (
    <div className="h-[calc(100vh-6rem)] -mt-6 -mx-4 md:-mx-6 px-0 md:px-0 flex flex-col">
      <div className="flex-1 w-full max-w-4xl mx-auto h-full p-4 md:p-6">
        <MessageThread 
          conversationId={conversationId}
          initialMessages={initialMessages}
          currentUserId={user.id}
          otherUser={otherUser}
        />
      </div>
    </div>
  )
}
