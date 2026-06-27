"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, Trophy, User, BookOpen, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { playGameLaunchSound } from "@/lib/sounds"
import { useNativeApp } from "@/lib/use-native-app"

export function BottomNav() {
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

  const tabs = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Games", href: "/bible-games", icon: BookOpen },
    { name: "Quiz", href: "/bible-quiz", icon: Sparkles },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Profile", href: username ? `/profile/${username}` : "/profile/edit", icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-24 border-t border-white/5 bg-surface-900/95 px-2 pb-2 pt-1 backdrop-blur-xl">
        {tabs.map((tab) => {
          const isActive =
            tab.name === "Profile"
              ? pathname.startsWith("/profile")
              : tab.href === "/home"
                ? pathname === "/home" || pathname.startsWith("/home")
                : pathname.startsWith(tab.href)

          return (
            <Link
              key={tab.name}
              href={tab.href}
              prefetch={true}
              onClick={() => {
                if (tab.href === "/bible-games" || tab.href === "/bible-quiz") {
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem("lt-last-feature-route", JSON.stringify({ name: tab.name, href: tab.href }))
                  }
                  playGameLaunchSound()
                  void vibrateLight()
                }
              }}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 transition-all duration-300",
                isActive
                  ? "scale-[1.02] text-brand-400"
                  : "text-surface-400 hover:text-surface-200"
              )}
            >
              <div className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
                isActive && "bg-brand-500/15 shadow-[0_0_18px_rgba(59,130,246,0.18)]"
              )}>
                <tab.icon className={cn("h-5 w-5", isActive && "fill-brand-400/20")} />
              </div>
              <span className="text-[11px] font-medium">{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
