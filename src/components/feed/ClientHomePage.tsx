"use client"

import { Capacitor } from "@capacitor/core"
import { PostComposer } from "./PostComposer"
import { InfiniteFeed } from "./InfiniteFeed"
import { FeedSkeleton } from "./LoadingSkeleton"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import { BookOpen, Sparkles } from "lucide-react"
import { playGameLaunchSound } from "@/lib/sounds"
import { useNativeApp } from "@/lib/use-native-app"

interface ClientHomePageProps {
  profile: any
  feed: any[]
  reactionMap: Record<string, any>
  userId: string
  hasMoreInitial: boolean
}

export function ClientHomePage({
  profile,
  feed,
  reactionMap,
  userId,
  hasMoreInitial,
}: ClientHomePageProps) {
  const isNative = Capacitor.isNativePlatform()
  const { vibrateLight } = useNativeApp()
  const featureLinks = [
    { name: "Bible Games", href: "/bible-games", description: "Play new games", icon: BookOpen },
    { name: "Bible Quiz", href: "/bible-quiz", description: "Challenge yourself", icon: Sparkles },
  ]

  return (
    <div className={isNative ? "space-y-4" : "space-y-6 max-w-2xl mx-auto pb-12"}>
      {/* Hero Banner - Only show on web, not on Android! */}
      {!isNative && (
        <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden shadow-2xl animate-fade-in group">
          <Image
            src="/feed-banner.png"
            alt="Life Transformers Community"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/20 to-transparent" />
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 animate-fade-up delay-200">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
              Home
            </h1>
            <p className="text-surface-200 text-sm sm:text-base font-light max-w-md">
              Connect, share, and grow with the Life Transformers community.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-surface-900 to-surface-950 p-3 shadow-[0_0_30px_rgba(234,179,8,0.12)] md:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-400">Featured</p>
            <h2 className="text-sm font-semibold text-white">New ways to play</h2>
          </div>
          <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">
            Spotlight
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {featureLinks.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.name}
                href={feature.href}
                onClick={() => {
                  playGameLaunchSound()
                  void vibrateLight()
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface-950/80 p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-[0_0_24px_rgba(234,179,8,0.18)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.18),transparent_55%)]" />
                <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-amber-400/20 blur-2xl" />
                <div className="relative">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/15 text-brand-400 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-white">{feature.name}</p>
                  <p className="mt-1 text-xs text-surface-400">{feature.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Post Composer - Android-specific styling! */}
      {profile && (
        <div className="animate-fade-up delay-100">
          <PostComposer currentUser={profile} />
        </div>
      )}

      <div className={isNative ? "pt-0" : "pt-4"}>
        <Suspense fallback={<FeedSkeleton />}>
          <InfiniteFeed
            initialPosts={feed}
            initialReactionMap={reactionMap}
            currentUserId={userId}
            hasMoreInitial={hasMoreInitial}
          />
        </Suspense>
      </div>
    </div>
  )
}
