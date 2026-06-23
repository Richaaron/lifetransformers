"use client"

import { usePathname } from "next/navigation"
import { TrendingWidget } from "@/components/widgets/TrendingWidget"
import { SuggestedUsersWidget } from "@/components/widgets/SuggestedUsersWidget"

export function RightSidebar() {
  const pathname = usePathname()

  // Don't show right sidebar on messages page
  if (pathname.startsWith("/messages")) {
    return null
  }

  return (
    <aside className="hidden lg:block w-80 shrink-0 h-screen overflow-y-auto border-l border-surface-800 bg-surface-950 px-6 py-8 custom-scrollbar">
      <div className="space-y-6">
        {/* Placeholder for future global search widget if wanted here, 
            though usually it's in the left sidebar or top bar */}
            
        <TrendingWidget />
        <SuggestedUsersWidget />
        
        <div className="pt-4 text-xs text-surface-500 flex flex-wrap gap-x-3 gap-y-2">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <span>© 2026 Life Transformers</span>
        </div>
      </div>
    </aside>
  )
}
