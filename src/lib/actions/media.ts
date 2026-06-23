"use server"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

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
    
    // Create admin client using service role key to bypass storage RLS
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.id === bucket)
    if (!bucketExists) {
      await supabase.storage.createBucket(bucket, { public: true })
    }

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
