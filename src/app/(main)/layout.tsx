import Providers from "@/components/providers/Providers"
import { ClientLayoutShell } from "@/components/layout/ClientLayoutShell"
import { DeviceTracker } from "@/components/layout/DeviceTracker"
import { ChatWidgetLoader } from "@/components/messages/ChatWidgetLoader"
import ErrorBoundary from "@/components/ui/ErrorBoundary"

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
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </ClientLayoutShell>
    </Providers>
  )
}
