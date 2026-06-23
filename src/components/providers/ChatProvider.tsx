"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface ChatContextType {
  isOpen: boolean
  activeConversationId: string | null
  openChat: (conversationId: string) => void
  closeChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  const openChat = (conversationId: string) => {
    setActiveConversationId(conversationId)
    setIsOpen(true)
  }

  const closeChat = () => {
    setIsOpen(false)
    setTimeout(() => setActiveConversationId(null), 300) // Clear after animation
  }

  return (
    <ChatContext.Provider value={{ isOpen, activeConversationId, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
