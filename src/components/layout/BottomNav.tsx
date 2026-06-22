"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, MessageSquare, Bell, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { name: "Feed", href: "/feed", icon: Home },
  { name: "Friends", href: "/friends", icon: Users },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Profile", href: "/profile/edit", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface-950 border-t border-surface-800 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors",
                isActive
                  ? "text-brand-500"
                  : "text-surface-400 hover:text-white"
              )}
            >
              <tab.icon className={cn("w-5 h-5", isActive && "fill-current")} />
              <span>{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
