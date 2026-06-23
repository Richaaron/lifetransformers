"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export function ExploreSearchInput({ initialTag }: { initialTag?: string }) {
  const router = useRouter()
  const [query, setQuery] = useState(initialTag ? `#${initialTag}` : "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      router.push("/explore")
      return
    }

    const cleaned = query.trim().replace(/^#/, '')
    router.push(`/explore?tag=${encodeURIComponent(cleaned)}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-surface-500 group-focus-within:text-brand-500 transition-colors" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-12 pr-4 py-4 bg-surface-950 border border-surface-800 rounded-xl leading-5 bg-transparent text-white placeholder-surface-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all text-base sm:text-lg"
        placeholder="Search hashtags... (e.g. #prayer)"
      />
      <button type="submit" className="hidden">Search</button>
    </form>
  )
}
