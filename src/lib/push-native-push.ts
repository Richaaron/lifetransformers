"use client";

import { useEffect } from "react";
import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";

const NOTIFICATION_CHANNEL = "notifications";

async function ensureLocalNotificationPermission() {
  const permission = await LocalNotifications.checkPermissions();
  if (permission.display === "prompt") {
    await LocalNotifications.requestPermissions();
  }
}

async function showForegroundNotification(title: string, body: string, data: any = {}) {
  await ensureLocalNotificationPermission();
  const id = Date.now();

  await LocalNotifications.schedule({
    notifications: [
      {
        id,
        title,
        body,
        extra: data,
        channelId: NOTIFICATION_CHANNEL,
      },
    ],
  });
}

export const useNativePushNotifications = () => {
  useEffect(() => {
    // Only initialize on native platforms (iOS/Android), not web
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const initPush = async () => {
      try {
        console.log("Initializing native push notifications...");

        // Request permission to use push notifications
        let permStatus = await PushNotifications.checkPermissions();
        console.log("Permission status:", permStatus);

        if (permStatus.receive === "prompt") {
          permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== "granted") {
          console.warn("Push notification permission denied");
          return;
        }

        // Register with Apple/FCM to get a registration token
        await PushNotifications.register();
        console.log("Registered for push notifications");

        // Add listeners for push notifications
        PushNotifications.addListener("registration", async (token) => {
          console.log("Push registration success, token:", token.value);
          // Send this token to your server to store it
          try {
            await fetch("/api/push-subscriptions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: token.value, platform: "android" }),
            });
            console.log("FCM token sent to server successfully");
          } catch (error) {
            console.error("Error sending FCM token to server:", error);
          }
        });

        PushNotifications.addListener("registrationError", (error) => {
          console.error("Push registration error:", error);
        });

        PushNotifications.addListener("pushNotificationReceived", async (notification) => {
          console.log("Push notification received:", notification);

          const title = notification.notification?.title ?? notification.title;
          const body = notification.notification?.body ?? notification.body;
          const data = notification.notification?.data ?? notification.data;

          if (typeof document !== "undefined" && document.visibilityState === "visible") {
            await showForegroundNotification(title, body, data);
          }
        });

        PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
          console.log("Push notification action performed:", notification);
          // Extract URL from data payload and navigate
          const url = notification.notification?.data?.url ?? notification.data?.url;
          if (url && typeof window !== 'undefined') {
            window.location.href = url;
          }
        });
      } catch (error) {
        console.error("Error initializing push notifications:", error);
      }
    };

    initPush();
  }, []);
};
