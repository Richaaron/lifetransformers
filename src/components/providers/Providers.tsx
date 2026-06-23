import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Toaster } from "sonner"
import { NotificationProvider } from "@/components/providers/NotificationProvider"
import { ChatProvider } from "@/components/providers/ChatProvider"
import { PresenceProvider } from "@/components/providers/PresenceProvider"

export default async function Providers({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <PresenceProvider currentUserId={user?.id || null}>
      <NotificationProvider currentUserId={user?.id || null}>
        <ChatProvider>
          {children}
        </ChatProvider>
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: "glass-strong border border-surface-700/50 text-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
            duration: 5000,
          }}
        />
      </NotificationProvider>
    </PresenceProvider>
  )
}
