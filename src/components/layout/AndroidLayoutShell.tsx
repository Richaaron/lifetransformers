"use client"

import { useState, useEffect } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { BottomNav } from "@/components/layout/BottomNav"
import { Fab } from "@/components/ui/Fab"
import { usePathname } from "next/navigation"
import { Home, Users, MessageSquare, Trophy, User, Plus, Edit3 } from "lucide-react"

export function AndroidLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isFabExtended, setIsFabExtended] = useState(true)
  const [fabIcon, setFabIcon] = useState<"plus" | "pencil">("plus")
  const [fabLabel, setFabLabel] = useState("New Post")

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsFabExtended(scrollY < 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Customize FAB based on current screen for Android
  useEffect(() => {
    if (pathname === "/home") {
      setFabIcon("plus")
      setFabLabel("New Post")
    } else if (pathname.startsWith("/messages")) {
      setFabIcon("pencil")
      setFabLabel("New Message")
    } else {
      setFabIcon("plus")
      setFabLabel("Create")
    }
  }, [pathname])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-950 text-surface-50">
      {/* Android-style Top App Bar with elevation shadow */}
      <div className="sticky top-0 z-20 bg-surface-950/95 backdrop-blur-xl border-b border-white/5">
        <TopBar onMenuClick={() => {}} />
      </div>

      {/* Main Content with padding for Android safe areas */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-lg mx-auto px-3 py-3">{children}</div>
      </main>

      {/* Android-specific Floating Action Button (Material Design 3!) */}
      {(pathname === "/home" || pathname.startsWith("/messages")) && (
        <Fab
          icon={fabIcon}
          extended={isFabExtended}
          label={fabLabel}
          onClick={() => {
            if (pathname === "/home") {
              window.scrollTo({ top: 0, behavior: "smooth" })
              setTimeout(() => {
                const composer = document.querySelector('textarea')
                if (composer) composer.focus()
              }, 300)
            }
          }}
          className="bottom-24 right-5 z-30"
        />
      )}

      {/* Material Design 3 Bottom Navigation */}
      <div className="border-t border-white/5 bg-surface-950/95 backdrop-blur-xl">
        <BottomNav />
      </div>
    </div>
  )
}
