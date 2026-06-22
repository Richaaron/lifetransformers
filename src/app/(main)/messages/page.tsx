import { Metadata } from "next"
import { getConversations } from "@/lib/queries/messages"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials, formatRelativeTime } from "@/lib/utils"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Messages - Life Transformers",
}

export default async function MessagesPage() {
  const conversations = await getConversations()

  return (
    <div className="space-y-6 max-w-3xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold text-white tracking-tight">Messages</h1>
      </div>

      <div className="flex-1 bg-surface-900 border border-surface-800 rounded-xl overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-surface-400">
            <p className="mb-2">No conversations yet.</p>
            <p className="text-sm">Go to a friend's profile to send them a message.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-800">
            {conversations.map((convo: any) => (
              <Link 
                key={convo.id} 
                href={`/messages/${convo.id}`}
                className={`flex items-center gap-4 p-4 hover:bg-surface-800 transition-colors ${
                  convo.is_unread ? 'bg-surface-800/30' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 border border-surface-700">
                    <AvatarImage src={convo.other_user?.avatar_url || ""} />
                    <AvatarFallback>{getInitials(convo.other_user?.display_name)}</AvatarFallback>
                  </Avatar>
                  {convo.is_unread && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full border-2 border-surface-900"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`text-base truncate ${convo.is_unread ? 'font-bold text-white' : 'font-semibold text-surface-100'}`}>
                      {convo.other_user?.display_name}
                    </h3>
                    {convo.last_message && (
                      <span className="text-xs text-surface-400 shrink-0 ml-2">
                        {formatRelativeTime(convo.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm truncate ${convo.is_unread ? 'text-surface-200 font-medium' : 'text-surface-400'}`}>
                    {convo.last_message 
                      ? (convo.last_message.sender_id === convo.other_user?.id ? "" : "You: ") + convo.last_message.content
                      : "Start a conversation"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
