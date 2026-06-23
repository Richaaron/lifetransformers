"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, MessageSquare, Bell, Search, Settings, LogOut, Trophy, User } from "lucide-react"
import { logoutAction } from "@/lib/actions/auth"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

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
    <aside className="w-64 border-r border-white/5 bg-surface-950/80 backdrop-blur-xl flex flex-col h-full hidden md:flex">
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <Link href="/feed" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-brand-500/40 shadow-glow-gold/20 transition-transform duration-300 group-hover:scale-105">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-cover w-full h-full" />
          </div>
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600 tracking-tight transition-all duration-300 group-hover:from-brand-300 group-hover:to-brand-500">
            Life Transformers
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 group",
                isActive
                  ? "bg-brand-500/15 text-brand-400 shadow-[inset_0_0_0_1px_rgba(234,179,8,0.2)]"
                  : "text-surface-300 hover:bg-surface-800/60 hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
              {item.name}
            </Link>
          )
        })}
        
        {username && (
          <Link
            href={`/profile/${username}`}
            prefetch={true}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 group mt-2",
              pathname.startsWith("/profile")
                ? "bg-brand-500/15 text-brand-400 shadow-[inset_0_0_0_1px_rgba(234,179,8,0.2)]"
                : "text-surface-300 hover:bg-surface-800/60 hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
            )}
          >
            <User className={cn("w-5 h-5 transition-transform duration-200", pathname.startsWith("/profile") ? "scale-110" : "group-hover:scale-110")} />
            Profile
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/profile/edit"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-surface-300 hover:bg-surface-800/60 hover:text-white transition-all duration-200 group"
        >
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          Settings
        </Link>
        <button
          onClick={() => logoutAction()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
