-- Indexes for frequently queried columns to improve performance

-- Posts indexes
create index idx_posts_author_id on posts(author_id);
create index idx_posts_group_id on posts(group_id);
create index idx_posts_created_at on posts(created_at desc);

-- Comments indexes
create index idx_comments_post_id on comments(post_id);
create index idx_comments_author_id on comments(author_id);
create index idx_comments_created_at on comments(created_at desc);

-- Notifications indexes
create index idx_notifications_user_id on notifications(user_id);
create index idx_notifications_read on notifications(read);
create index idx_notifications_created_at on notifications(created_at desc);

-- Friendships indexes
create index idx_friendships_user_id on friendships(user_id);
create index idx_friendships_friend_id on friendships(friend_id);
create index idx_friendships_status on friendships(status);

-- Messages indexes
create index idx_messages_conversation_id on messages(conversation_id);
create index idx_messages_sender_id on messages(sender_id);
create index idx_messages_created_at on messages(created_at desc);

-- Group members indexes
create index idx_group_members_group_id on group_members(group_id);
create index idx_group_members_user_id on group_members(user_id);

-- Likes indexes
create index idx_likes_post_id on likes(post_id);
create index idx_likes_user_id on likes(user_id);

-- Conversations participants
create index idx_conversation_participants_conversation_id on conversation_participants(conversation_id);
create index idx_conversation_participants_user_id on conversation_participants(user_id);

-- Profiles (for search)
create index idx_profiles_username on profiles(username);
create index idx_profiles_display_name on profiles(display_name);
