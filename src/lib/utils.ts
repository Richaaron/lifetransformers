import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'
import { LEVEL_NAMES } from '@/lib/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  return formatDistanceToNow(date, { addSuffix: true })
}

export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString)
  if (isToday(date)) return format(date, 'h:mm a')
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMM d')
}

export function formatFullDate(dateString: string): string {
  return format(new Date(dateString), 'MMMM d, yyyy')
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function getAvatarUrl(avatarUrl: string | null | undefined): string | undefined {
  return avatarUrl || undefined
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '…'
}

export function generateUsername(displayName: string): string {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 30)
}

export function isOnline(lastActive: string | null | undefined): boolean {
  if (!lastActive) return false
  const diff = Date.now() - new Date(lastActive).getTime()
  return diff < 5 * 60 * 1000 // 5 minutes
}

export function getLastActiveLabel(lastActive: string | null | undefined): string {
  if (!lastActive) return 'Offline'
  if (isOnline(lastActive)) return 'Active now'
  return `Active ${formatRelativeTime(lastActive)}`
}

export function buildInviteUrl(inviteCode: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/invite/${inviteCode}`
}

export function getDisplayNameWithLevel(displayName?: string | null, level?: number | null): string {
  const baseName = (displayName || '').trim()
  if (!baseName) return 'User'

  const levelInfo = LEVEL_NAMES[level ?? 1] || LEVEL_NAMES[1]
  const title = levelInfo?.name || 'Follower'

  return `${title} ${baseName}`
}
