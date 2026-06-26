import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()
    const deviceToken = cookieStore.get("device_token")?.value
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !deviceToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Handle both web push subscription and FCM token
    if (body.subscription) {
      // Web push subscription
      await supabase
        .from("user_devices")
        .update({ push_subscription: body.subscription })
        .eq("device_token", deviceToken)
        .eq("user_id", user.id)
    } else if (body.token && body.platform) {
      // FCM token (native mobile)
      await supabase
        .from("user_devices")
        .update({ fcm_token: body.token })
        .eq("device_token", deviceToken)
        .eq("user_id", user.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error storing push subscription:", error)
    return NextResponse.json({ error: "Failed to store subscription" }, { status: 500 })
  }
}
