"use client"

import { Capacitor } from "@capacitor/core"
import { PostComposer } from "./PostComposer"
import { InfiniteFeed } from "./InfiniteFeed"
import { FeedSkeleton } from "./LoadingSkeleton"
import Image from "next/image"
import { Suspense } from "react"

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
