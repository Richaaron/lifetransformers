"use server"

import { createClient } from "@/lib/supabase/server"

type UploadBucket = "avatars" | "posts" | "videos"

export async function uploadMediaAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File | null
  if (!file) return { error: "No file provided" }

  const bucket = (formData.get("bucket") as UploadBucket) || "posts"
  const userId = formData.get("userId") as string
  if (!userId) return { error: "No user ID provided" }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const supabase = await createClient()

    const ext = file.name.split(".").pop()
    const path = `${userId}/${Date.now()}.${ext}`

    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      return { error: uploadError.message }
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { url: urlData.publicUrl }
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" }
  }
}
