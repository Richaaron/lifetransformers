"use server"

import { cookies, headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function verifyDevice() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const cookieStore = await cookies()
  const deviceToken = cookieStore.get("device_token")?.value
  
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || "Unknown Device"
  const ip = headersList.get("x-forwarded-for") || "Unknown IP"

  if (deviceToken) {
    // Check if the device is registered
    const { data: existingDevice } = await supabase
      .from("user_devices")
      .select("id")
      .eq("device_token", deviceToken)
      .eq("user_id", user.id)
      .maybeSingle()

    if (existingDevice) {
      // Just update last seen
      await supabase
        .from("user_devices")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", existingDevice.id)
      return
    }
  }

  // Device not recognized. Generate new token
  const newToken = crypto.randomUUID()
  cookieStore.set("device_token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
    path: "/"
  })

  // Insert new device
  await supabase
    .from("user_devices")
    .insert({
      user_id: user.id,
      device_token: newToken,
      user_agent: userAgent,
      ip_address: ip
    })

  // Send "New Device Login" notification to the user
  await supabase
    .from("notifications")
    .insert({
      user_id: user.id,
      actor_id: user.id, // Self-inflicted
      type: "system",
      resource_id: newToken,
      resource_type: "device",
      // We can use a custom message by abusing a field, or we'll format it on the frontend
    })
}
