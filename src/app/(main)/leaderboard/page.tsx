import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { getLeaderboard } from "@/lib/queries/leaderboard"
import { LeaderboardPage } from "@/components/leaderboard/LeaderboardPage"

export const metadata: Metadata = {
  title: "Leaderboard - Life Transformers",
  description: "Track your spiritual journey and see how you rank",
}

export default async function LeaderboardPageRoute() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const leaderboard = await getLeaderboard(50)

  return (
    <LeaderboardPage 
      leaderboard={leaderboard} 
      currentUserId={user?.id || ""} 
    />
  )
}
