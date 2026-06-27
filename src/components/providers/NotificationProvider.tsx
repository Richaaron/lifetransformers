"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Bell } from "lucide-react"
import { subscribeToPushNotifications } from "@/lib/push-notifications"
import { playNotificationSound } from "@/lib/sounds"

interface NotificationContextType {
  unreadCount: number
  decrementUnreadCount: () => void
  markAllAsRead: () => void
  requestPushNotifications: () => Promise<boolean>
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  decrementUnreadCount: () => {},
  markAllAsRead: () => {},
  requestPushNotifications: async () => false,
})

export const useNotifications = () => useContext(NotificationContext)

export function NotificationProvider({ 
  children, 
  currentUserId 
}: { 
  children: React.ReactNode
  currentUserId: string | null 
}) {
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  const requestPushNotifications = async () => {
    const success = await subscribeToPushNotifications()
    if (success) {
      toast.success("Push notifications enabled!")
    } else {
      toast.error("Failed to enable push notifications")
    }
    return success
  }

  useEffect(() => {
    if (!currentUserId) return

    // 1. Fetch initial unread count
    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUserId)
        .eq('read', false)
      
      if (!error && count !== null) {
        setUnreadCount(count)
      }
    }
    fetchUnreadCount()

    // 2. Subscribe to realtime inserts and updates on the notifications table
    const channel = supabase
      .channel('realtime-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUserId}`,
        },
        async (payload) => {
          // Increment unread count
          setUnreadCount((prev) => prev + 1)
          
          const newNotification = payload.new

          // Fetch the actor's profile to display their name
          const { data: actor } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', newNotification.actor_id)
            .single()

          const actorName = actor?.display_name || 'Someone'

          // Display toast
          let title = "New Notification"
          let description = ""

          if (newNotification.type === 'comment' || newNotification.type === 'post_comment') {
            title = "New Comment"
            description = `${actorName} commented on your post`
          } else if (newNotification.type === 'comment_reply') {
            title = "New Reply"
            description = `${actorName} replied to your comment`
          } else if (newNotification.type === 'comment_like') {
            title = "Comment Liked"
            description = `${actorName} liked your comment`
          } else if (newNotification.type === 'post_like' || newNotification.type === 'like') {
            title = "Post Liked"
            description = `${actorName} liked your post`
          } else if (newNotification.type === 'message') {
            title = "New Message"
            description = `${actorName} sent you a message`
          } else if (newNotification.type === 'friend_request') {
            title = "Friend Request"
            description = `${actorName} sent you a friend request`
          } else if (newNotification.type === 'friend_accepted') {
            title = "Friend Request Accepted"
            description = `${actorName} accepted your friend request`
          } else if (newNotification.type === 'group_invite') {
            title = "Group Invite"
            description = `${actorName} invited you to a group`
          } else {
            description = `${actorName} interacted with you`
          }

          playNotificationSound()
          toast(title, {
            description,
            icon: <Bell className="w-4 h-4 text-brand-500" />,
            duration: 5000,
            className: "glass-strong border border-surface-700/50 text-white",
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUserId}`,
        },
        async () => {
          // Refetch unread count when a notification is updated (e.g., marked as read)
          const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', currentUserId)
            .eq('read', false)
          
          if (!error && count !== null) {
            setUnreadCount(count)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId, supabase])

  const decrementUnreadCount = () => {
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setUnreadCount(0)
  }

  return (
    <NotificationContext.Provider value={{ unreadCount, decrementUnreadCount, markAllAsRead, requestPushNotifications }}>
      {children}
    </NotificationContext.Provider>
  )
}
