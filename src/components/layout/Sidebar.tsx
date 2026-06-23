"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, MessageSquare, Bell, Search, Settings, LogOut, Trophy, User } from "lucide-react"
import { logoutAction } from "@/lib/actions/auth"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { name: "Feed", href: "/feed", icon: Home },
  { name: "Friends", href: "/friends", icon: Users },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Groups", href: "/groups", icon: Users },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Search", href: "/search", icon: Search },
]

export function Sidebar() {
  const pathname = usePathname()
  const [username, setUsername] = useState("")

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from("profiles").select("username").eq("id", user.id).single().then(({ data }) => {
          if (data) setUsername(data.username)
        })
      }
    })
  }, [])

  return (
    <aside className="w-64 border-r border-surface-800 bg-surface-950 flex flex-col h-full hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-surface-800">
        <Link href="/feed" className="text-xl font-bold text-brand-500 tracking-tight">
          Life Transformers
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-500/10 text-brand-500"
                  : "text-surface-200 hover:bg-surface-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
        
        {username && (
          <Link
            href={`/profile/${username}`}
            prefetch={true}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname.startsWith("/profile")
                ? "bg-brand-500/10 text-brand-500"
                : "text-surface-200 hover:bg-surface-800 hover:text-white"
            )}
          >
            <User className="w-5 h-5" />
            Profile
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-surface-800 space-y-1">
        <Link
          href="/profile/edit"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-surface-200 hover:bg-surface-800 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <button
          onClick={() => logoutAction()}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
