import { Metadata } from "next"
import { getNotifications } from "@/lib/queries/notifications"
import { NotificationList } from "@/components/notifications/NotificationList"

export const metadata: Metadata = {
  title: "Notifications - Life Transformers",
}

export default async function NotificationsPage() {
  const notifications = await getNotifications()

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Notifications</h1>
      </div>

      <NotificationList notifications={notifications} />
    </div>
  )
}
