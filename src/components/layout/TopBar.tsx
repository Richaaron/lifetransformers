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
      className="h-[62px] flex items-center justify-between px-4 sticky top-0 z-20 border-b border-white/[0.05]"
      style={{
        background: "rgba(6,6,15,0.88)",
        backdropFilter: "blur(28px) saturate(160%)",
        WebkitBackdropFilter: "blur(28px) saturate(160%)",
      }}
    >
      {/* Mobile — Logo + Hamburger */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={onMenuClick}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-300 hover:text-white hover:bg-white/[0.07] transition-all duration-200 press-effect"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/feed" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-brand-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
            <Image src="/logo.png" alt="Logo" width={28} height={28} className="object-cover w-full h-full" />
          </div>
          <span className="text-[15px] font-bold tracking-tight">
            <span className="text-gradient-gold">Life</span>
            <span className="text-white"> Transformers</span>
          </span>
        </Link>
      </div>

      {/* Desktop — empty spacer so the right side stays aligned */}
      <div className="hidden md:block" />

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Search shortcut */}
        <Link
          href="/search"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/[0.07] transition-all duration-200 press-effect"
        >
          <Search className="w-4.5 h-4.5" />
        </Link>

        {/* Notification Bell */}
        <Link
          href="/notifications"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-brand-400 hover:bg-brand-500/10 transition-all duration-200 press-effect"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <>
              {/* Glow pulse */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(234,179,8,0.9)]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-400 animate-ping opacity-70" />
              {/* Count badge (only if > 1) */}
              {unreadCount > 1 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-[9px] font-bold flex items-center justify-center shadow-md">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </>
          )}
        </Link>
      </div>
    </header>
  )
}
