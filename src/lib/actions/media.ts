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
    
    // We use the authenticated client instead of the service role key.
    // This requires the user session.
    const supabase = await createClient()

    const ext = file.name.split(".").pop()
    const path = `${userId}/${Date.now()}.${ext}`

    // WARNING: Do NOT use `upsert: true` here.
    // Supabase requires an UPDATE RLS policy if upsert is true, even for new files.
    // Since our filenames are unique (Date.now()), we can safely use upsert: false.
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false
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
