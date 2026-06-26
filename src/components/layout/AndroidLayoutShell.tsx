"use client"

import { useState, useEffect } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { BottomNav } from "@/components/layout/BottomNav"
import { Fab } from "@/components/ui/Fab"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function AndroidLayoutShell({ children }: { children: React.ReactNode }) {
  const [isFabExtended, setIsFabExtended] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsFabExtended(scrollY < 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-950 text-surface-50">
      {/* Top App Bar */}
      <TopBar onMenuClick={() => {}} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-xl mx-auto px-4 py-4">{children}</div>
      </main>

      {/* Floating Action Button (Android Classic!) */}
      <Fab
        icon="plus"
        extended={isFabExtended}
        label="New Post"
        onClick={() => router.push("/home")}
        className="bottom-24 right-6 z-30"
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
