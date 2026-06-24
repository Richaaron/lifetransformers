"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { ActionResult } from "@/lib/types"

export async function createReport(data: {
  resourceType: "post" | "comment" | "message" | "profile"
  resourceId: string
  reason: string
  description?: string
}): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("reports")
    .insert({
      reporter_id: user.id,
      resource_type: data.resourceType,
      resource_id: data.resourceId,
      reason: data.reason,
      description: data.description,
    })

  if (error) return { error: error.message }

  revalidatePath("/")
  return {}
}
