"use client"

import { useEffect } from "react"
import { verifyDevice } from "@/lib/actions/device"

export function DeviceTracker() {
  useEffect(() => {
    // Run device verification quietly in the background
    verifyDevice().catch(console.error)
  }, [])

  return null
}
