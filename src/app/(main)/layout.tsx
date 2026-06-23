import Providers from "@/components/providers/Providers"
import { ClientLayoutShell } from "@/components/layout/ClientLayoutShell"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <ClientLayoutShell>
        {children}
      </ClientLayoutShell>
    </Providers>
  )
}
