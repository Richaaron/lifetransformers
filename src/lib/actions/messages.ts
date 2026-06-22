"use server"

import { createClient } from "@/lib/supabase/server"
import { ActionResult } from "@/lib/types"

export async function getOrCreateConversation(targetUserId: string): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check if conversation already exists between these two users
  // This is a bit complex in SQL, but we can query conversation_participants
  // where conversation_id has exactly these two users.
  // For simplicity, we find conversations user A is in, then see if user B is in them.
  const { data: existingConvos } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', user.id)

  if (existingConvos && existingConvos.length > 0) {
    const convoIds = existingConvos.map(c => c.conversation_id)
    const { data: targetConvo } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .in('conversation_id', convoIds)
      .eq('user_id', targetUserId)
      .single()

    if (targetConvo) {
      return { data: { id: targetConvo.conversation_id } }
    }
  }

  // Create new conversation
  const { data: newConvo, error: createError } = await supabase
    .from('conversations')
    .insert({})
    .select('id')
    .single()

  if (createError || !newConvo) return { error: "Failed to create conversation" }

  // Add participants
  await supabase.from('conversation_participants').insert([
    { conversation_id: newConvo.id, user_id: user.id },
    { conversation_id: newConvo.id, user_id: targetUserId }
  ])

  return { data: { id: newConvo.id } }
}

export async function sendMessage(conversationId: string, content: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!content.trim()) return { error: "Message cannot be empty" }

  const { containsCurseWords } = await import("@/lib/utils/word-filter")
  let finalContent = content.trim()
  const { hasCurse, filtered } = containsCurseWords(finalContent)
  if (hasCurse) {
    finalContent = filtered
  }

  const { error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: finalContent
    })

  if (error) return { error: error.message }

  // Update last_read_at for sender
  await supabase
    .from('conversation_participants')
    .update({ last_read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .eq('user_id', user.id)

  return {}
}

export async function markConversationRead(conversationId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from('conversation_participants')
    .update({ last_read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return {}
}

export async function sendVoiceMessage(conversationId: string, audioBlob: Blob): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Upload audio to Supabase Storage
  const fileName = `voice-messages/${conversationId}/${Date.now()}.webm`
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('messages')
    .upload(fileName, audioBlob, {
      contentType: 'audio/webm'
    })

  if (uploadError) return { error: uploadError.message }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('messages')
    .getPublicUrl(fileName)

  if (!urlData?.publicUrl) return { error: "Failed to get audio URL" }

  // Insert message with audio URL
  const { error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: '',
      message_type: 'voice',
      audio_url: urlData.publicUrl
    })

  if (error) return { error: error.message }

  // Update last_read_at for sender
  await supabase
    .from('conversation_participants')
    .update({ last_read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .eq('user_id', user.id)

  return {}
}
