import { createClient } from "@/lib/supabase/client"

export type UploadBucket = "avatars" | "posts" | "videos"

const MAX_SIZES: Record<UploadBucket, number> = {
  avatars: 5 * 1024 * 1024,
  posts: 10 * 1024 * 1024,
  videos: 50 * 1024 * 1024,
}

const ALLOWED_TYPES: Record<UploadBucket, string[]> = {
  avatars: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  posts: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  videos: ["video/mp4", "video/webm", "video/quicktime"],
}

export function validateFile(file: File, bucket: UploadBucket): { valid: boolean; error?: string } {
  if (file.size > MAX_SIZES[bucket]) {
    const maxMB = MAX_SIZES[bucket] / (1024 * 1024)
    return { valid: false, error: `File must be less than ${maxMB}MB` }
  }

  if (!ALLOWED_TYPES[bucket].includes(file.type)) {
    return { valid: false, error: "File type not allowed" }
  }

  return { valid: true }
}

export async function uploadFile(
  file: File,
  bucket: UploadBucket,
  userId: string
): Promise<{ url: string | null; error?: string }> {
  const validation = validateFile(file, bucket)
  if (!validation.valid) {
    return { url: null, error: validation.error }
  }

  const supabase = createClient()
  
  const ext = file.name.split(".").pop()
  const path = `${userId}/${Date.now()}.${ext}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    })

  if (error) {
    return { url: null, error: error.message }
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return { url: urlData.publicUrl }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}
