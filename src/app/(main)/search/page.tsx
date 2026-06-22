import { Metadata } from "next"
import { search } from "@/lib/queries/search"
import { FriendCard } from "@/components/friends/FriendCard"
import { GroupCard } from "@/components/groups/GroupCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search as SearchIcon } from "lucide-react"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Search - Life Transformers",
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q || ""
  
  const results = await search(query)

  // Server action to handle search form submission
  async function performSearch(formData: FormData) {
    "use server"
    const searchQuery = formData.get("q") as string
    if (searchQuery && searchQuery.trim()) {
      redirect(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      redirect(`/search`)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Search</h1>
        
        <form action={performSearch} className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <Input 
              name="q"
              defaultValue={query}
              placeholder="Search people and groups..." 
              className="pl-10 h-12 text-lg rounded-xl"
            />
          </div>
          <Button type="submit" className="h-12 px-6 rounded-xl">Search</Button>
        </form>
      </div>

      {query && (
        <div className="space-y-8">
          {/* People Results */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">People</h2>
            {results.people.length === 0 ? (
              <p className="text-surface-400">No people found matching "{query}"</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.people.map((person: any) => (
                  <FriendCard key={person.id} profile={person} type="suggested" />
                ))}
              </div>
            )}
          </section>

          {/* Group Results */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Groups</h2>
            {results.groups.length === 0 ? (
              <p className="text-surface-400">No groups found matching "{query}"</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.groups.map((group: any) => (
                  <GroupCard key={group.id} group={group} type="discover" />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
      
      {!query && (
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-12 text-center text-surface-400">
          <SearchIcon className="w-12 h-12 text-surface-500 mx-auto mb-4 opacity-50" />
          <p>Enter a name or keyword above to search the Life Transformers network.</p>
        </div>
      )}
    </div>
  )
}
