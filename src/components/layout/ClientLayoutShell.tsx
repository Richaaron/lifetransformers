"use client"

import { useState } from "react"
import { Capacitor } from "@capacitor/core"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { MobileNav } from "@/components/layout/MobileNav"
import { BottomNav } from "@/components/layout/BottomNav"
import { RightSidebar } from "@/components/layout/RightSidebar"
import { AndroidLayoutShell } from "@/components/layout/AndroidLayoutShell"

export function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  if (Capacitor.isNativePlatform()) {
    return <AndroidLayoutShell>{children}</AndroidLayoutShell>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950 text-surface-50">
      <Sidebar />
      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
      />
      
      <div className="flex-1 flex min-w-0 overflow-hidden relative">
        {/* Main Content Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar onMenuClick={() => setIsMobileNavOpen(true)} />
          
          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
            <div className="container max-w-3xl mx-auto py-6 px-4 md:px-6">
              {children}
            </div>
          </main>
        </div>

        {/* Right Sidebar Column */}
        <RightSidebar />
      </div>

      <BottomNav />
    </div>
  )
}
