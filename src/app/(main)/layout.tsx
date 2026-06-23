import Providers from "@/components/providers/Providers"
import { ClientLayoutShell } from "@/components/layout/ClientLayoutShell"
import { DeviceTracker } from "@/components/layout/DeviceTracker"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <DeviceTracker />
      <ClientLayoutShell>
        {children}
      </ClientLayoutShell>
    </Providers>
  )
}
