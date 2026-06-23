import Providers from "@/components/providers/Providers"
import { ClientLayoutShell } from "@/components/layout/ClientLayoutShell"
import { DeviceTracker } from "@/components/layout/DeviceTracker"
import { ChatWidgetLoader } from "@/components/messages/ChatWidgetLoader"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <DeviceTracker />
      <ChatWidgetLoader />
      <ClientLayoutShell>
        {children}
      </ClientLayoutShell>
    </Providers>
  )
}
