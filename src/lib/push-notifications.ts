"use client"

import { Capacitor } from "@capacitor/core"

// Convert base64 to ArrayBuffer for VAPID public key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

export async function subscribeToPushNotifications() {
  // If we're on a native platform (Android/iOS), native push notifications
  // are already handled by useNativePushNotifications, so just return true!
  if (Capacitor.isNativePlatform()) {
    console.log("Native platform detected, native push notifications handled separately")
    return true
  }

  // Web push notifications for browser
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported')
    return false
  }

  try {
    // Request notification permission
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.log('Notification permission denied')
      return false
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })

    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      )
    })

    // Send subscription to server
    await fetch('/api/push-subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription })
    })

    return true
  } catch (error) {
    console.error('Error subscribing to push notifications:', error)
    return false
  }
}

export async function unsubscribeFromPushNotifications() {
  if (!('serviceWorker' in navigator)) return

  const registration = await navigator.serviceWorker.getRegistration()
  if (registration) {
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await subscription.unsubscribe()
    }
  }
}
