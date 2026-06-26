"use client";

import { useEffect } from "react";
import { PushNotifications } from "@capacitor/push-notifications";

export const useNativePushNotifications = () => {
  useEffect(() => {
    const initPush = async () => {
      // Request permission to use push notifications
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === "prompt") {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== "granted") {
        throw new Error("User denied permissions!");
      }

      // Register with Apple/FCM to get a registration token
      await PushNotifications.register();

      // Add listeners for push notifications
      PushNotifications.addListener("registration", async (token) => {
        console.log("Push registration success, token:", token.value);
        // Send this token to your server to store it
        await fetch("/api/push-subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token.value, platform: "android" }),
        });
      });

      PushNotifications.addListener("registrationError", (error) => {
        console.error("Push registration error:", error);
      });

      PushNotifications.addListener("pushNotificationReceived", (notification) => {
        console.log("Push notification received:", notification);
      });

      PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
        console.log("Push notification action performed:", notification);
      });
    };

    initPush();
  }, []);
};
