"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { ActionResult } from "@/lib/types"

export async function createCall(receiverId: string, callType: "voice" | "video"): Promise<ActionResult & { data?: any }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data, error } = await supabase
    .from("call_logs")
    .insert({
      caller_id: user.id,
      receiver_id: receiverId,
      call_type: callType,
      status: "ringing",
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Create notification for receiver
  await supabase
    .from("notifications")
    .insert({
      user_id: receiverId,
      actor_id: user.id,
      type: callType === "video" ? "video_call" : "voice_call",
      resource_id: data.id,
      resource_type: "call",
      read: false,
    })

  revalidatePath("/")
  return { data }
}

export async function updateCallStatus(callId: string, status: "answered" | "declined" | "completed"): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("call_logs")
    .update({ status, ended_at: new Date().toISOString() })
    .eq("id", callId)
    .or(`caller_id.eq.${user.id},receiver_id.eq.${user.id}`)

  if (error) return { error: error.message }

  revalidatePath("/")
  return {}
}

export async function endCall(callId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: call, error: fetchError } = await supabase
    .from("call_logs")
    .select("started_at")
    .eq("id", callId)
    .single()

  if (fetchError) return { error: fetchError.message }

  const duration = Math.floor((Date.now() - new Date(call.started_at).getTime()) / 1000)

  const { error } = await supabase
    .from("call_logs")
    .update({ 
      status: "completed", 
      ended_at: new Date().toISOString(), 
      duration_seconds: Math.floor(duration)
    })
    .eq("id", callId)
    .or(`caller_id.eq.${user.id},receiver_id.eq.${user.id}`)

  if (error) return { error: error.message }

  revalidatePath("/")
  return {}
}
