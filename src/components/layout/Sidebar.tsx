"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, MessageSquare, Bell, Search, Settings, LogOut, Trophy, User, Zap, BookOpen } from "lucide-react"
import { logoutAction } from "@/lib/actions/auth"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import Image from "next/image"
import { NotificationBadge } from "@/components/layout/NotificationBadge"
import { MessageBadge } from "@/components/layout/MessageBadge"
import { ThemeToggle } from "@/components/theme/ThemeToggle"

const navItems = [
  { name: "Home",          href: "/home",          icon: Home },
  { name: "Bible Games",   href: "/bible-games",   icon: BookOpen },
  { name: "Bible Quiz",    href: "/bible-quiz",    icon: BookOpen },
  { name: "Friends",       href: "/friends",       icon: Users },
  { name: "Messages",      href: "/messages",      icon: MessageSquare },
  { name: "Groups",        href: "/groups",        icon: Users },
  { name: "Leaderboard",   href: "/leaderboard",   icon: Trophy },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Explore",       href: "/explore",       icon: Search },
]

export function Sidebar() {
  const pathname = usePathname()
  const [profile, setProfile] = useState<any>(null)
  const [totalXp, setTotalXp] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url")
          .eq("id", user.id)
          .single()
          .then(({ data }) => { if (data) setProfile(data) })

        supabase
          .from("user_progress")
          .select("xp")
          .eq("user_id", user.id)
          .single()
          .then(({ data }) => { if (data) setTotalXp(data.xp || 0) })
      }
    })
  }, [])

  // Compute community tier from XP
  const getTier = (xp: number) => {
    if (xp >= 1000) return { label: "Pillar",      color: "text-yellow-300", min: 1000, max: 2000 }
    if (xp >= 500)  return { label: "Contributor", color: "text-indigo-400",  min: 500,  max: 1000 }
    if (xp >= 200)  return { label: "Member",      color: "text-emerald-400", min: 200,  max: 500  }
    return                  { label: "Newcomer",   color: "text-surface-300", min: 0,    max: 200  }
  }
  const tier = getTier(totalXp)
  const progress = Math.min(100, Math.round(((totalXp - tier.min) / (tier.max - tier.min)) * 100))

  return (
    <aside className="w-64 border-r border-white/5 flex flex-col h-full hidden md:flex relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, rgba(8,8,18,0.98) 0%, rgba(10,10,22,0.98) 100%)" }}>
      
      {/* Subtle warm glow top-left */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)" }} />

      {/* Logo */}
      <div className="h-[70px] flex items-center px-5 border-b border-white/[0.06] shrink-0">
        <Link href="/home" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-brand-500/30 shadow-[0_0_16px_rgba(234,179,8,0.2)] transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(234,179,8,0.4)] group-hover:scale-105">
            <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-cover w-full h-full" />
          </div>
          <span className="text-[17px] font-bold tracking-tight leading-tight">
            <span className="text-gradient-gold">Life</span>
            <span className="text-white"> Transformers</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const isNotif = item.href === "/notifications"
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className={cn(
                "nav-link relative",
                isActive ? "active" : "text-surface-300 hover:text-white"
              )}
            >
              <div className="relative">
                <item.icon className={cn(
                  "w-[18px] h-[18px] transition-all duration-200 shrink-0",
                  isActive ? "text-brand-400" : "group-hover:text-white"
                )} />
                {isNotif && <NotificationBadge />}
                {item.href === "/messages" && <MessageBadge />}
              </div>
              <span>{item.name}</span>

              {/* Active left bar indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-gradient-to-b from-brand-400 to-brand-600" />
              )}
            </Link>
          )
        })}

        {profile?.username && (
          <Link
            href={`/profile/${profile.username}`}
            prefetch={true}
            className={cn(
              "nav-link relative",
              pathname.startsWith("/profile") && !pathname.includes("/edit") ? "active" : "text-surface-300 hover:text-white"
            )}
          >
            <User className={cn("w-[18px] h-[18px] shrink-0", pathname.startsWith("/profile") && !pathname.includes("/edit") ? "text-brand-400" : "")} />
            <span>Profile</span>
            {pathname.startsWith("/profile") && !pathname.includes("/edit") && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-gradient-to-b from-brand-400 to-brand-600" />
            )}
          </Link>
        )}
      </nav>

      {/* Community Impact Widget & Bottom Actions */}
      {profile && (
        <div className="mx-3 mb-3">
          <div className="rounded-2xl p-4 glass-warm border border-brand-500/10 relative overflow-hidden mb-3">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none -translate-y-8 translate-x-8"
              style={{ background: "radial-gradient(circle, rgba(234,179,8,0.1) 0%, transparent 70%)" }} />
            
            <div className="flex items-center gap-3 mb-3">
              <div className="relative shrink-0">
                <Avatar className="w-9 h-9 border-2 border-brand-500/40 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                  <AvatarImage src={profile.avatar_url || ""} />
                  <AvatarFallback className="bg-surface-700 text-xs text-brand-400 font-bold">
                    {getInitials(profile.display_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-surface-900" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{profile.display_name}</p>
                <p className={cn("text-[10px] font-semibold uppercase tracking-wider", tier.color)}>{tier.label}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-surface-400 font-medium flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-brand-500" />
                  Community Impact
                </span>
                <span className="text-[10px] font-bold text-brand-400">{totalXp.toLocaleString()} pts</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[9px] text-surface-500 text-right">{tier.max - totalXp > 0 ? `${(tier.max - totalXp).toLocaleString()} pts to next tier` : "Max tier reached!"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="px-3 pb-4 border-t border-white/[0.05] pt-3 flex flex-col gap-1">
        <Link
          href="/profile/edit"
          className="nav-link text-surface-400 hover:text-white"
        >
          <Settings className="w-[18px] h-[18px] transition-transform duration-300 group-hover:rotate-45" />
          <span>Settings</span>
        </Link>
        <button
          onClick={() => logoutAction()}
          className="nav-link w-full text-left text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Sign Out</span>
        </button>
        <div className="mt-2 flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
