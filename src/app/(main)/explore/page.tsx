import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { InfiniteExploreFeed } from "@/components/explore/InfiniteExploreFeed"
import { ExploreSearchInput } from "@/components/explore/ExploreSearchInput"

export const metadata: Metadata = {
  title: "Explore - Life Transformers",
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/login")

  const params = await searchParams
  const tag = typeof params.tag === "string" ? params.tag.replace(/^#/, '') : undefined

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="bg-surface-900 border border-surface-800 p-6 rounded-2xl relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Explore</h1>
          <p className="text-surface-400 mb-6 max-w-lg">
            Discover trending topics, connect with new people, and explore the global community.
          </p>
          
          <ExploreSearchInput initialTag={tag} />
        </div>
      </div>

      <InfiniteExploreFeed initialTag={tag} currentUserId={user.id} />
    </div>
  )
}
