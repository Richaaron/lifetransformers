"use client"

import { Menu, Bell, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useNotifications } from "@/components/providers/NotificationProvider"

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { unreadCount } = useNotifications()

  return (
    <header
      className="h-[64px] flex items-center justify-between px-4 sticky top-0 z-20 border-b border-white/5"
      style={{
        background: "rgba(10,10,20,0.95)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Mobile — Logo + Hamburger */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={onMenuClick}
          className="w-10 h-10 rounded-full flex items-center justify-center text-surface-300 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-brand-500/30 shadow-[0_0_12px_rgba(234,179,8,0.2)]">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-cover w-full h-full" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-brand-400">Life</span>
            <span className="text-white"> Transformers</span>
          </span>
        </Link>
      </div>

      {/* Desktop — empty spacer so the right side stays aligned */}
      <div className="hidden md:block" />

      {/* Right Controls */}
      <div className="flex items-center gap-1">
        {/* Search shortcut */}
        <Link
          href="/search"
          className="w-10 h-10 rounded-full flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <Search className="w-5 h-5" />
        </Link>

        {/* Notification Bell */}
        <Link
          href="/notifications"
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-surface-400 hover:text-brand-400 hover:bg-brand-500/10 transition-all duration-200"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <>
              {/* Glow pulse */}
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-brand-500 shadow-[0_0_10px_rgba(234,179,8,0.9)]" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-brand-400 animate-ping opacity-70" />
              {/* Count badge */}
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            </>
          )}
        </Link>
      </div>
    </header>
  )
}
