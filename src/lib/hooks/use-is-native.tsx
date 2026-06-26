"use client"

import { Capacitor } from "@capacitor/core"

export function useIsNative() {
  return Capacitor.isNativePlatform()
}
