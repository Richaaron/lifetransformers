"use server"

import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!
}

webpush.setVapidDetails(
  'mailto:support@lifetransformers.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

export async function sendPushNotification(userId: string, title: string, body: string, url: string = '/') {
  const supabase = await createClient()
  
  // Get all push subscriptions for this user
  const { data: userDevices } = await supabase
    .from('user_devices')
    .select('push_subscription, id')
    .eq('user_id', userId)
    .not('push_subscription', 'is', null)

  if (!userDevices || userDevices.length === 0) {
    return
  }

  const payload = JSON.stringify({
    title,
    body,
    url
  })

  // Send push notifications to all subscriptions
  const promises = userDevices.map(async (device) => {
    try {
      await webpush.sendNotification(device.push_subscription, payload)
    } catch (error) {
      console.error('Error sending push notification:', error)
      // If subscription is invalid, remove it
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 410) {
        await supabase
          .from('user_devices')
          .update({ push_subscription: null })
          .eq('id', device.id)
      }
    }
  })

  await Promise.all(promises)
}
