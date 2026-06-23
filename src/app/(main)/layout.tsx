import Providers from "@/components/providers/Providers"
import { ClientLayoutShell } from "@/components/layout/ClientLayoutShell"
import { DeviceTracker } from "@/components/layout/DeviceTracker"
import { ChatWidget } from "@/components/messages/ChatWidget"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <DeviceTracker />
      <ChatWidget />
      <ClientLayoutShell>
        {children}
      </ClientLayoutShell>
    </Providers>
  )
}
