import crypto from "crypto"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return new Response(JSON.stringify({ error: "Cloudinary not configured" }), { status: 500, headers: { "Content-Type": "application/json" } })
    }

    const folder = `profiles/${user.id}`
    const timestamp = Math.floor(Date.now() / 1000)
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
    const signature = crypto.createHash("sha1").update(paramsToSign + apiSecret).digest("hex")

    return new Response(JSON.stringify({ signature, timestamp, api_key: apiKey, cloud_name: cloudName, folder }), { headers: { "Content-Type": "application/json" } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}
