"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, MessageSquare, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function BottomNav() {
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

  const tabs = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Friends", href: "/friends", icon: Users },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Profile", href: username ? `/profile/${username}` : "/profile/edit", icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface-950 border-t border-surface-800 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href.split("/profile")[0] + "/profile") || 
                          (tab.name === "Home" && pathname === "/home")
          return (
            <Link
              key={tab.name}
              href={tab.href}
              prefetch={true}
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
