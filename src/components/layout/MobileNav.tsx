"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, MessageSquare, Search, Settings, LogOut, X, Trophy, User, BookOpen, Sparkles } from "lucide-react"
import { logoutAction } from "@/lib/actions/auth"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { playGameLaunchSound } from "@/lib/sounds"
import { useNativeApp } from "@/lib/use-native-app"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Bible Games", href: "/bible-games", icon: BookOpen, badge: "New" },
  { name: "Bible Quiz", href: "/bible-quiz", icon: Sparkles, badge: "New" },
  { name: "Friends", href: "/friends", icon: Users },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Groups", href: "/groups", icon: Users },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Search", href: "/search", icon: Search },
]

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const [username, setUsername] = useState("")
  const { vibrateLight } = useNativeApp()

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Sidebar panel */}
      <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-surface-950 shadow-xl flex flex-col animate-slide-in-right">
        <div className="h-16 flex items-center justify-between px-4 border-b border-surface-800">
          <span className="font-bold text-lg text-brand-500">Menu</span>
          <button onClick={onClose} className="p-2 text-surface-200 hover:text-white" aria-label="Close menu">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                onClick={() => {
                  onClose()
                  if (item.href === "/bible-games" || item.href === "/bible-quiz") {
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem("lt-last-feature-route", JSON.stringify({ name: item.name, href: item.href }))
                    }
                    playGameLaunchSound()
                    void vibrateLight()
                  }
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors",
                  isActive
                    ? "bg-brand-500/10 text-brand-500"
                    : "text-surface-200 hover:bg-surface-800 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
          
          {username && (
            <Link
              href={`/profile/${username}`}
              prefetch={true}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors",
                pathname.startsWith("/profile")
                  ? "bg-brand-500/10 text-brand-500"
                  : "text-surface-200 hover:bg-surface-800 hover:text-white"
              )}
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
          )}
          {username && (
            <a
              href={`/profile/${username}#profile-photos`}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors",
                pathname.startsWith("/profile")
                  ? "bg-brand-500/10 text-brand-500"
                  : "text-surface-200 hover:bg-surface-800 hover:text-white"
              )}
            >
              <Users className="w-5 h-5" />
              Photos
            </a>
          )}
        </nav>

        <div className="p-4 border-t border-surface-800 space-y-1">
          <Link
            href="/profile/edit"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-surface-200 hover:bg-surface-800 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            onClick={() => {
              onClose()
              logoutAction()
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
