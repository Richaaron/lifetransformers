"use client"

import { Menu, Bell } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="h-16 border-b border-white/5 bg-surface-950/80 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-surface-200 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="md:hidden font-bold text-lg text-brand-500">
          Life Transformers
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="relative">
          <Link href="/notifications">
            <Bell className="w-5 h-5" />
            {/* Hardcoded badge for now, will replace with realtime state */}
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500 animate-glow-pulse shadow-[0_0_10px_rgba(234,179,8,1)]"></span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
