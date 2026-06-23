import { createClient } from "@/lib/supabase/server"

export async function getConversations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // 1. Get conversations the user is part of
  const { data: myConvos, error: convosError } = await supabase
    .from('conversation_participants')
    .select('conversation_id, last_read_at, conversations(created_at)')
    .eq('user_id', user.id)

  if (convosError || !myConvos || myConvos.length === 0) return []

  const convoIds = myConvos.map(c => c.conversation_id)

  // 2. Get the other participants in these conversations
  const { data: otherParticipants, error: partsError } = await supabase
    .from('conversation_participants')
    .select(`
      conversation_id,
      user_id,
      profiles!conversation_participants_user_id_fkey(id, username, display_name, avatar_url, last_active)
    `)
    .in('conversation_id', convoIds)
    .neq('user_id', user.id)

  if (partsError || !otherParticipants) return []

  // 3. Get the latest message for each conversation
  const { data: latestMessages } = await supabase
    .from('messages')
    .select('id, conversation_id, content, created_at, sender_id')
    .in('conversation_id', convoIds)
    .order('created_at', { ascending: false })

  // Map latest message by conversation id
  const messagesByConvo = new Map()
  if (latestMessages) {
    latestMessages.forEach(msg => {
      if (!messagesByConvo.has(msg.conversation_id)) {
        messagesByConvo.set(msg.conversation_id, msg)
      }
    })
  }

  // Map other participant by conversation id
  const partsByConvo = new Map()
  otherParticipants.forEach(p => {
    partsByConvo.set(p.conversation_id, p.profiles)
  })

  // Assemble the result
  const result = myConvos.map(c => {
    const lastMessage = messagesByConvo.get(c.conversation_id)
    const otherUser = partsByConvo.get(c.conversation_id)
    
    // Determine if unread
    let isUnread = false
    if (lastMessage && lastMessage.sender_id !== user.id) {
      if (!c.last_read_at) isUnread = true
      else if (new Date(lastMessage.created_at) > new Date(c.last_read_at)) isUnread = true
    }

    return {
      id: c.conversation_id,
      other_user: otherUser,
      last_message: lastMessage || null,
      is_unread: isUnread
    }
  })

  // Sort by last message date
  return result.sort((a, b) => {
    const dateA = a.last_message ? new Date(a.last_message.created_at).getTime() : 0
    const dateB = b.last_message ? new Date(b.last_message.created_at).getTime() : 0
    return dateB - dateA
  })
}

export async function getMessages(conversationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('messages')
    .select('id, content, created_at, sender_id')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(100)

  if (error || !data) return []

  const messagesWithSenders = await Promise.all(
    data.map(async (msg) => {
      const { data: sender } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .eq('id', msg.sender_id)
        .single()
      return { ...msg, sender }
    })
  )

  return messagesWithSenders
}

export async function getConversationDetails(conversationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: otherParticipant } = await supabase
    .from('conversation_participants')
    .select('user_id')
    .eq('conversation_id', conversationId)
    .neq('user_id', user.id)
    .single()

  if (!otherParticipant) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .eq('id', otherParticipant.user_id)
    .single()

  return profile
}
