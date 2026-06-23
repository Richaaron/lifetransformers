import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// This route auto-creates the post_reactions table on first request
// GET /api/setup/reactions
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Check if table exists by trying to select from it
  const { error } = await supabase.from("post_reactions").select("id").limit(1)
  
  if (!error) {
    return NextResponse.json({ status: "table already exists" })
  }

  // Table doesn't exist - we need to create it via SQL
  // Since we can't run DDL via REST, we'll use the pg endpoint
  const createSQL = `
    CREATE TABLE IF NOT EXISTS public.post_reactions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      reaction_type TEXT NOT NULL CHECK (reaction_type IN ('amen','love','praying','inspired','like')),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (post_id, user_id)
    );
    ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
    CREATE POLICY IF NOT EXISTS "Anyone can view reactions" ON public.post_reactions FOR SELECT USING (true);
    CREATE POLICY IF NOT EXISTS "Users can manage their own reactions" ON public.post_reactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  `

  return NextResponse.json({ 
    status: "table missing",
    message: "Please run the SQL below in your Supabase SQL Editor",
    sql: createSQL
  })
}
