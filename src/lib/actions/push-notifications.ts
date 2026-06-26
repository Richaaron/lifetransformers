"use server"

import webpush from "web-push"
import { createClient } from "@/lib/supabase/server"

// Initialize Firebase Admin lazily with dynamic import
let firebaseApp: any = null

const getFirebaseApp = async () => {
  if (firebaseApp) {
    return firebaseApp
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const admin = (await import("firebase-admin")).default
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      firebaseApp = admin.initializeApp({
        // @ts-ignore - TypeScript might not recognize credential in dynamic import
        credential: admin.credential.cert(serviceAccount),
      })
      return firebaseApp
    } catch (error) {
      console.error("Error initializing Firebase Admin:", error)
      return null
    }
  }
  return null
}

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
}

webpush.setVapidDetails(
  "mailto:support@lifetransformers.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

export async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  url: string = "/"
) {
  const supabase = await createClient()

  // Get all push subscriptions and FCM tokens for this user
  const { data: userDevices } = await supabase
    .from("user_devices")
    .select("push_subscription, fcm_token, id")
    .eq("user_id", userId)
    .or("push_subscription.is.not.null,fcm_token.is.not.null")

  if (!userDevices || userDevices.length === 0) {
    return
  }

  const webPushPayload = JSON.stringify({
    title,
    body,
    url,
  })

  // Get Firebase app for FCM
  const firebaseApp = await getFirebaseApp()

  // Send notifications to all devices
  const promises = userDevices.map(async (device) => {
    // Send web push notification if subscription exists
    if (device.push_subscription) {
      try {
        await webpush.sendNotification(device.push_subscription, webPushPayload)
      } catch (error) {
        console.error("Error sending web push notification:", error)
        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          error.statusCode === 410
        ) {
          await supabase
            .from("user_devices")
            .update({ push_subscription: null })
            .eq("id", device.id)
        }
      }
    }

    // Send FCM notification if token exists and Firebase is initialized
    if (device.fcm_token && firebaseApp) {
      try {
        await firebaseApp.messaging().send({
          token: device.fcm_token,
          notification: {
            title,
            body,
          },
          data: {
            url,
          },
          android: {
            priority: "high",
            notification: {
              channelId: "notifications",
              clickAction: "com.lifetransformers.app.NOTIFICATION_CLICK",
            },
          },
        })
      } catch (error) {
        console.error("Error sending FCM notification:", error)
      }
    }
  })

  await Promise.all(promises)
}
