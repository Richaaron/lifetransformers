"use client"

import dynamic from "next/dynamic"

// Dynamically loaded with SSR disabled to prevent hydration mismatch
const ChatWidget = dynamic(
  () => import("@/components/messages/ChatWidget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false }
)

export function ChatWidgetLoader() {
  return <ChatWidget />
}
