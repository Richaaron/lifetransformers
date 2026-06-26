"use client";

import { useNativePushNotifications } from "@/lib/push-native-push";
import { useNativeApp } from "@/lib/use-native-app";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  // Initialize native push notifications if in Capacitor environment
  useNativePushNotifications();
  // Initialize other native Android features
  useNativeApp();

  return <>{children}</>;
}
