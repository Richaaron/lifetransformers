"use client"

import { useEffect, useState } from "react"
import { MobileSplashScreen } from "./MobileSplashScreen"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return

    const isMobile = window.matchMedia("(max-width: 1024px)").matches
    if (!isMobile) {
      setShowSplash(false)
      return
    }

    const timer = window.setTimeout(() => setShowSplash(false), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      {showSplash && <MobileSplashScreen onFinish={() => setShowSplash(false)} />}
      <div className="min-h-screen">{children}</div>
    </>
  )
}
