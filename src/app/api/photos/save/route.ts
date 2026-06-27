import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const public_url = form.get("public_url") as string | null
    const public_id = form.get("public_id") as string | null
    const caption = form.get("caption") as string | null

    if (!public_url || !public_id) {
      return new Response(JSON.stringify({ error: "Missing public_url or public_id" }), { status: 400, headers: { "Content-Type": "application/json" } })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } })

    const { data: inserted, error } = await supabase
      .from("user_photos")
      .insert({ user_id: user.id, public_url, public_id, caption })
      .select("*")
      .single()

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } })
    }

    return new Response(JSON.stringify({ photo: inserted }), { headers: { "Content-Type": "application/json" } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}
