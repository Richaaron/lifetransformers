"use client";

import { useNativePushNotifications } from "@/lib/push-native-push";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  // Initialize native push notifications if in Capacitor environment
  useNativePushNotifications();

  return <>{children}</>;
}
