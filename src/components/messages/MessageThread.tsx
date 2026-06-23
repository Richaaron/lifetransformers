"use client"

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react"
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages"
import { sendMessage, sendVoiceMessage } from "@/lib/actions/messages"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getInitials, formatMessageTime } from "@/lib/utils"
import { Send, Loader2, Mic, Phone, Video, X } from "lucide-react"
import { VoiceRecorder } from "./VoiceRecorder"
import { AudioPlayer } from "./AudioPlayer"
import { VoiceCallModal } from "./VoiceCallModal"
import { LanguageSelector } from "./LanguageSelector"
import { TranslateButton } from "./TranslateButton"
import { usePresence } from "@/hooks/usePresence"
import { OnlineIndicator } from "@/components/ui/OnlineIndicator"

interface MessageThreadProps {
  conversationId: string
  initialMessages: any[]
  currentUserId: string
  otherUser: any
  onClose?: () => void
  isWidget?: boolean
}

export function MessageThread({ conversationId, initialMessages, currentUserId, otherUser, onClose, isWidget }: MessageThreadProps) {
  const [messages, setMessages] = useRealtimeMessages(conversationId, initialMessages)
  const [content, setContent] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showCallModal, setShowCallModal] = useState(false)
  const [callType, setCallType] = useState<"voice" | "video">("voice")
  const [targetLanguage, setTargetLanguage] = useState("en")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isOnline } = usePresence(currentUserId)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!content.trim() || isSending) return

    setIsSending(true)
    const result = await sendMessage(conversationId, content)
    setIsSending(false)

    if (result.error) {
      alert("Failed to send message: " + result.error)
      return
    }

    setMessages((prev) => {
      if (!result.data || prev.some((msg) => msg.id === result.data.id)) {
        return prev
      }
      return [...prev, result.data]
    })
    setContent("")
  }

  const handleVoiceRecording = async (blob: Blob) => {
    setIsUploading(true)
    const error = await sendVoiceMessage(conversationId, blob)
    setIsUploading(false)
    setIsRecording(false)

    if (error?.error) {
      alert("Failed to send voice message: " + error.error)
    }
  }

  const handleStartCall = (type: "voice" | "video") => {
    setCallType(type)
    setShowCallModal(true)
  }

  // Handle Enter to send
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend({
        preventDefault: () => {},
      } as FormEvent<HTMLFormElement>)
    }
  }

  return (
    <div className={`flex flex-col h-full bg-surface-900 border-surface-800 overflow-hidden ${!isWidget ? 'border rounded-xl' : ''}`}>
      {/* Header */}
      <div className="h-16 border-b border-surface-800 bg-surface-950 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10 border border-surface-700">
              <AvatarImage src={otherUser.avatar_url || ""} />
              <AvatarFallback>{getInitials(otherUser.display_name)}</AvatarFallback>
            </Avatar>
            <OnlineIndicator
              isOnline={isOnline(otherUser.id)}
              size="sm"
              className="absolute bottom-0 right-0 ring-2 ring-surface-950 rounded-full"
            />
          </div>
          <div>
            <h2 className="font-semibold text-white">{otherUser.display_name}</h2>
            <OnlineIndicator
              isOnline={isOnline(otherUser.id)}
              size="sm"
              showLabel
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {!isWidget && (
            <>
              <LanguageSelector value={targetLanguage} onChange={setTargetLanguage} />
              <Button
                onClick={() => handleStartCall("voice")}
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full text-surface-400 hover:text-green-500 hover:bg-green-500/10"
              >
                <Phone className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => handleStartCall("video")}
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full text-surface-400 hover:text-blue-500 hover:bg-blue-500/10"
              >
                <Video className="w-5 h-5" />
              </Button>
            </>
          )}
          {isWidget && (
            <>
              <Button
                onClick={() => handleStartCall("voice")}
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full text-surface-400 hover:text-green-500 hover:bg-green-500/10"
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleStartCall("video")}
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full text-surface-400 hover:text-blue-500 hover:bg-blue-500/10"
              >
                <Video className="w-4 h-4" />
              </Button>
            </>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="ml-1 h-8 w-8 flex items-center justify-center rounded-full bg-surface-800 hover:bg-red-500/20 text-surface-300 hover:text-red-400 transition-all border border-surface-700 hover:border-red-500/50"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-surface-400 space-y-4">
            <Avatar className="w-20 h-20 opacity-50">
              <AvatarImage src={otherUser.avatar_url || ""} />
              <AvatarFallback>{getInitials(otherUser.display_name)}</AvatarFallback>
            </Avatar>
            <p>This is the beginning of your conversation with {otherUser.display_name}.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id === currentUserId
            const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id
            const isVoiceMessage = msg.message_type === 'voice' && msg.audio_url
            
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="shrink-0 w-8">
                  {showAvatar && !isMe && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={msg.sender?.avatar_url || ""} />
                      <AvatarFallback>{getInitials(msg.sender?.display_name)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                
                <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`px-4 py-3 rounded-2xl ${
                      isMe 
                        ? 'bg-brand-500 text-brand-950 rounded-tr-sm' 
                        : 'bg-surface-800 text-surface-100 rounded-tl-sm'
                    }`}
                  >
                    {isVoiceMessage ? (
                      <AudioPlayer src={msg.audio_url} isOwn={isMe} />
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-[10px] text-surface-500">
                      {formatMessageTime(msg.created_at)}
                    </span>
                    {!isVoiceMessage && msg.content && (
                      <TranslateButton text={msg.content} targetLanguage={targetLanguage} />
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-surface-950 border-t border-surface-800 shrink-0">
        {isRecording ? (
          <VoiceRecorder
            onRecordingComplete={handleVoiceRecording}
            onCancel={() => setIsRecording(false)}
          />
        ) : isUploading ? (
          <div className="flex items-center justify-center gap-2 h-[44px]">
            <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
            <span className="text-sm text-surface-400">Sending voice message...</span>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex gap-2 items-end">
            <Button
              type="button"
              onClick={() => setIsRecording(true)}
              size="icon"
              variant="ghost"
              className="h-[44px] w-[44px] shrink-0 rounded-xl text-surface-400 hover:text-brand-500"
            >
              <Mic className="w-5 h-5" />
            </Button>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a message..."
              className="min-h-[44px] max-h-[120px] resize-none py-3 bg-surface-900 border-surface-700 flex-1"
              disabled={isSending}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-[44px] w-[44px] shrink-0 rounded-xl"
              disabled={!content.trim() || isSending}
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </form>
        )}
      </div>

      {/* Call Modal */}
      {showCallModal && (
        <VoiceCallModal
          conversationId={conversationId}
          otherUser={otherUser}
          callType={callType}
          currentUserId={currentUserId}
          onClose={() => setShowCallModal(false)}
        />
      )}
    </div>
  )
}
