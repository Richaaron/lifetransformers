export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ─── Profiles ────────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  cover_url: string | null
  status: 'active' | 'pending'
  last_active: string
  created_at: string
}

// ─── Friendships ─────────────────────────────────────────────────────────────

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected'

export interface Friendship {
  id: string
  user_id: string
  friend_id: string
  status: FriendshipStatus
  created_at: string
}

export interface FriendshipWithProfile extends Friendship {
  profile: Profile
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export interface Post {
  id: string
  author_id: string
  content: string
  image_url: string | null
  group_id: string | null
  created_at: string
}

export interface PostWithDetails extends Post {
  author: Profile
  likes_count: number
  comments_count: number
  user_has_liked: boolean
}

// ─── Likes ────────────────────────────────────────────────────────────────────

export interface Like {
  post_id: string
  user_id: string
  created_at: string
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export interface Comment {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
}

export interface CommentWithAuthor extends Comment {
  author: Profile
}

// ─── Groups ───────────────────────────────────────────────────────────────────

export type GroupPrivacy = 'public' | 'private'
export type GroupRole = 'member' | 'admin'

export interface Group {
  id: string
  name: string
  description: string | null
  cover_url: string | null
  privacy: GroupPrivacy
  created_by: string | null
  created_at: string
}

export interface GroupWithMeta extends Group {
  member_count: number
  user_role: GroupRole | null
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: GroupRole
  joined_at: string
}

export interface GroupMemberWithProfile extends GroupMember {
  profile: Profile
}

export interface GroupInvite {
  id: string
  group_id: string
  invite_code: string
  created_by: string
  expires_at: string | null
  created_at: string
}

// ─── Conversations & Messages ─────────────────────────────────────────────────

export interface Conversation {
  id: string
  created_at: string
}

export interface ConversationParticipant {
  conversation_id: string
  user_id: string
  last_read_at: string
}

export interface ConversationWithDetails extends Conversation {
  other_user: Profile
  last_message: Message | null
  unread_count: number
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'voice' | 'image'
  audio_url: string | null
  created_at: string
}

export interface MessageWithSender extends Message {
  sender: Profile
}

// ─── Notifications ─────────────────────────────────────────────────────────────

export type NotificationType =
  | 'friend_request'
  | 'friend_accepted'
  | 'post_like'
  | 'post_comment'
  | 'group_invite'
  | 'group_join_request'
  | 'group_join_approved'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  actor_id: string | null
  resource_id: string | null
  resource_type: string | null
  read: boolean
  created_at: string
}

export interface NotificationWithActor extends Notification {
  actor: Profile | null
}

// ─── Server Action Results ───────────────────────────────────────────────────

export interface ActionResult<T = void> {
  data?: T
  error?: string
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchResults {
  people: Profile[]
  groups: Group[]
}

// ─── Progress & Leaderboard ──────────────────────────────────────────────────

export interface UserProgress {
  id: string
  user_id: string
  xp: number
  level: number
  posts_count: number
  comments_count: number
  likes_received: number
  updated_at: string
  created_at: string
}

export interface LeaderboardEntry {
  user_id: string
  username: string
  display_name: string
  avatar_url: string | null
  xp: number
  level: number
  posts_count: number
  comments_count: number
  likes_received: number
}

export const LEVEL_NAMES: Record<number, { name: string; icon: string; minXp: number; color: string; textGradient: string }> = {
  1: { name: "Follower", icon: "🙏", minXp: 0, color: "text-stone-400", textGradient: "from-stone-400 to-stone-500" },
  2: { name: "Believer", icon: "✝️", minXp: 50, color: "text-slate-400", textGradient: "from-slate-400 to-slate-500" },
  3: { name: "Disciple", icon: "📖", minXp: 150, color: "text-emerald-400", textGradient: "from-emerald-400 to-emerald-500" },
  4: { name: "Witness", icon: "🕯️", minXp: 350, color: "text-yellow-400", textGradient: "from-yellow-400 to-amber-500" },
  5: { name: "Minister", icon: "⛪", minXp: 700, color: "text-blue-400", textGradient: "from-blue-400 to-blue-500" },
  6: { name: "Elder", icon: "権", minXp: 1200, color: "text-purple-400", textGradient: "from-purple-400 to-purple-500" },
  7: { name: "Deacon", icon: "🔑", minXp: 2000, color: "text-indigo-400", textGradient: "from-indigo-400 to-indigo-500" },
  8: { name: "Pastor", icon: "🐑", minXp: 3200, color: "text-orange-400", textGradient: "from-orange-400 to-orange-500" },
  9: { name: "Bishop", icon: "👑", minXp: 5000, color: "text-red-400", textGradient: "from-red-400 to-rose-500" },
  10: { name: "Apostle", icon: "🌟", minXp: 8000, color: "text-amber-400", textGradient: "from-amber-400 to-yellow-500" },
  11: { name: "Prophet", icon: "🔥", minXp: 12500, color: "text-pink-400", textGradient: "from-pink-400 to-fuchsia-500" },
  12: { name: "Saint", icon: "✨", minXp: 20000, color: "text-cyan-300", textGradient: "from-cyan-300 to-white" },
}

export function getXpForNextLevel(currentLevel: number): number {
  const nextLevel = currentLevel + 1
  if (nextLevel > 12) return LEVEL_NAMES[12].minXp
  return LEVEL_NAMES[nextLevel].minXp
}

export function getXpProgress(currentXp: number, currentLevel: number): number {
  const currentLevelXp = LEVEL_NAMES[currentLevel]?.minXp || 0
  const nextLevelXp = getXpForNextLevel(currentLevel)
  if (nextLevelXp === currentLevelXp) return 100
  return Math.min(100, Math.round(((currentXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100))
}
