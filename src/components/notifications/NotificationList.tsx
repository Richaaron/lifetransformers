"use client"

import { useTransition, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getInitials, formatRelativeTime } from "@/lib/utils"
import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions/notifications"
import { UserPlus, UserCheck, Heart, MessageCircle, Users, ShieldAlert, Phone, Video, BellRing } from "lucide-react"
import Link from "next/link"
import { useNotifications } from "@/components/providers/NotificationProvider"

interface NotificationListProps {
  notifications: any[]
}

export function NotificationList({ notifications: initialNotifications }: NotificationListProps) {
  const [isPending, startTransition] = useTransition()
  const [notifications, setNotifications] = useState(initialNotifications)
  const { decrementUnreadCount, markAllAsRead, requestPushNotifications } = useNotifications()

  const handleMarkAllRead = () => {
    startTransition(() => {
      markAllNotificationsRead()
      markAllAsRead()
      // Optimistically update all notifications to read
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    })
  }

  const handleNotificationClick = (id: string, read: boolean) => {
    if (!read) {
      decrementUnreadCount()
      startTransition(() => {
        markNotificationRead(id)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      })
    }
  }

  const getNotificationContent = (type: string, actorName: string) => {
    switch (type) {
      case 'friend_request':
        return {
          icon: <UserPlus className="w-4 h-4 text-brand-500" />,
          text: <span><strong>{actorName}</strong> sent you a friend request.</span>,
          href: "/friends"
        }
      case 'friend_accepted':
        return {
          icon: <UserCheck className="w-4 h-4 text-green-500" />,
          text: <span><strong>{actorName}</strong> accepted your friend request.</span>,
          href: "/friends"
        }
      case 'post_like':
      case 'like':
        return {
          icon: <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />,
          text: <span><strong>{actorName}</strong> liked your post.</span>,
          href: "/feed"
        }
      case 'comment_like':
        return {
          icon: <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />,
          text: <span><strong>{actorName}</strong> liked your comment.</span>,
          href: "/feed"
        }
      case 'post_comment':
      case 'comment':
        return {
          icon: <MessageCircle className="w-4 h-4 text-blue-500" />,
          text: <span><strong>{actorName}</strong> commented on your post.</span>,
          href: "/feed"
        }
      case 'comment_reply':
        return {
          icon: <MessageCircle className="w-4 h-4 text-blue-500" />,
          text: <span><strong>{actorName}</strong> replied to your comment.</span>,
          href: "/feed"
        }
      case 'group_invite':
        return {
          icon: <Users className="w-4 h-4 text-purple-500" />,
          text: <span><strong>{actorName}</strong> invited you to a group.</span>,
          href: "/groups"
        }
      case 'voice_call':
        return {
          icon: <Phone className="w-4 h-4 text-green-500" />,
          text: <span><strong>{actorName}</strong> is calling you (voice).</span>,
          href: "/messages"
        }
      case 'video_call':
        return {
          icon: <Video className="w-4 h-4 text-blue-500" />,
          text: <span><strong>{actorName}</strong> is calling you (video).</span>,
          href: "/messages"
        }
      case 'system':
        return {
          icon: <ShieldAlert className="w-4 h-4 text-orange-500" />,
          text: <span><strong>Security Alert:</strong> New login detected on a new device.</span>,
          href: "/settings/security"
        }
      default:
        return {
          icon: <div className="w-2 h-2 rounded-full bg-surface-500" />,
          text: <span><strong>{actorName}</strong> interacted with you.</span>,
          href: "/"
        }
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-8 text-center text-surface-400">
          <p>You have no notifications.</p>
        </div>
        <Button 
          variant="secondary" 
          onClick={requestPushNotifications}
          className="w-full"
        >
          <BellRing className="w-4 h-4 mr-2" />
          Enable Push Notifications
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="glass-strong border border-white/5 rounded-2xl overflow-hidden shadow-xl animate-fade-in">
        <div className="p-4 border-b border-surface-700/50 flex justify-between items-center bg-surface-900/30">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={requestPushNotifications}
          >
            <BellRing className="w-4 h-4 mr-2" />
            Push Notifications
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleMarkAllRead}
            disabled={isPending || notifications.every(n => n.read)}
          >
            Mark all as read
          </Button>
        </div>
        
        <div className="divide-y divide-surface-800">
          {notifications.map((notification) => {
            const content = getNotificationContent(notification.type, notification.actor?.display_name || 'Someone')
            
            return (
              <Link 
                key={notification.id}
                href={content.href}
                onClick={() => handleNotificationClick(notification.id, notification.read)}
                className={`flex items-start gap-4 p-5 hover:bg-surface-800/60 transition-all ${
                  !notification.read ? 'bg-brand-500/5 hover:bg-brand-500/10' : ''
                }`}
              >
                <Avatar className="w-12 h-12 mt-0.5 shrink-0 border border-surface-700">
                  <AvatarImage src={notification.actor?.avatar_url || ""} />
                  <AvatarFallback>{getInitials(notification.actor?.display_name)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {content.icon}
                    <p className={`text-sm ${!notification.read ? 'text-white' : 'text-surface-200'}`}>
                      {content.text}
                    </p>
                  </div>
                  <p className="text-xs text-surface-400 ml-6">
                    {formatRelativeTime(notification.created_at)}
                  </p>
                </div>
                
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
