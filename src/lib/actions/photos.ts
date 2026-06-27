"use server"

import crypto from "crypto"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"

export async function uploadPhotoAction(formData: FormData): Promise<{ photo?: any; error?: string }> {
  const file = formData.get("file") as File | null
  if (!file) return { error: "No file provided" }

  const caption = (formData.get("caption") as string) || null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // Upload to Cloudinary server-side
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    if (!cloudName || !apiKey || !apiSecret) {
      return { error: "Cloudinary not configured" }
    }

    const folder = `photos/${user.id}`
    const timestamp = Math.floor(Date.now() / 1000)
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
    const signature = crypto.createHash("sha1").update(paramsToSign + apiSecret).digest("hex")

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")
    const dataUri = `data:${file.type};base64,${base64}`

    const form = new FormData()
    form.append("file", dataUri)
    form.append("api_key", apiKey)
    form.append("timestamp", String(timestamp))
    form.append("signature", signature)
    form.append("folder", folder)
    form.append("public_id", `${Date.now()}`)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: form,
    })

    if (!res.ok) {
      const txt = await res.text()
      return { error: `Cloudinary upload failed: ${res.status} ${txt}` }
    }

    const json = await res.json()

    // Insert metadata into user_photos table
    const { data: inserted, error: insertError } = await supabase
      .from("user_photos")
      .insert({ user_id: user.id, public_url: json.secure_url, public_id: json.public_id, caption })
      .select("*")
      .single()

    if (insertError) return { error: insertError.message }

    return { photo: inserted }
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" }
  }
}
