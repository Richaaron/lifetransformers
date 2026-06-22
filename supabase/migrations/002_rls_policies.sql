-- Enable RLS on all tables
alter table profiles enable row level security;
alter table friendships enable row level security;
alter table groups enable row level security;
alter table group_members enable row level security;
alter table group_invites enable row level security;
alter table posts enable row level security;
alter table likes enable row level security;
alter table comments enable row level security;
alter table conversations enable row level security;
alter table conversation_participants enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;

-- PROFILES
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- FRIENDSHIPS
create policy "Users can view their own friendships"
  on friendships for select
  using ( auth.uid() = user_id or auth.uid() = friend_id );

create policy "Users can insert friendship as requester"
  on friendships for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their friendships"
  on friendships for update
  using ( auth.uid() = user_id or auth.uid() = friend_id );

create policy "Users can delete their friendships"
  on friendships for delete
  using ( auth.uid() = user_id or auth.uid() = friend_id );

-- POSTS
create policy "Posts are viewable by authenticated users"
  on posts for select
  using ( auth.uid() is not null );

create policy "Users can insert their own posts"
  on posts for insert
  with check ( auth.uid() = author_id );

create policy "Users can update their own posts"
  on posts for update
  using ( auth.uid() = author_id );

create policy "Users can delete their own posts"
  on posts for delete
  using ( auth.uid() = author_id );

-- LIKES
create policy "Likes are viewable by authenticated users"
  on likes for select
  using ( auth.uid() is not null );

create policy "Users can insert their own likes"
  on likes for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own likes"
  on likes for delete
  using ( auth.uid() = user_id );

-- COMMENTS
create policy "Comments are viewable by authenticated users"
  on comments for select
  using ( auth.uid() is not null );

create policy "Users can insert their own comments"
  on comments for insert
  with check ( auth.uid() = author_id );

create policy "Users can update their own comments"
  on comments for update
  using ( auth.uid() = author_id );

create policy "Users can delete their own comments"
  on comments for delete
  using ( auth.uid() = author_id );

-- CONVERSATIONS & MESSAGES
create policy "Users can view conversations they are part of"
  on conversations for select
  using (
    exists (
      select 1 from conversation_participants
      where conversation_id = id and user_id = auth.uid()
    )
  );

create policy "Users can view participants in their conversations"
  on conversation_participants for select
  using (
    exists (
      select 1 from conversation_participants cp
      where cp.conversation_id = conversation_id and cp.user_id = auth.uid()
    )
  );

create policy "Users can insert participants"
  on conversation_participants for insert
  with check ( true ); -- Application logic handles this

create policy "Users can view messages in their conversations"
  on messages for select
  using (
    exists (
      select 1 from conversation_participants
      where conversation_id = messages.conversation_id and user_id = auth.uid()
    )
  );

create policy "Users can insert messages in their conversations"
  on messages for insert
  with check ( auth.uid() = sender_id );

-- GROUPS
create policy "Groups are viewable by authenticated users"
  on groups for select
  using ( auth.uid() is not null );

create policy "Users can create groups"
  on groups for insert
  with check ( auth.uid() = created_by );

create policy "Group members viewable by authenticated users"
  on group_members for select
  using ( auth.uid() is not null );

create policy "Users can join public groups"
  on group_members for insert
  with check ( auth.uid() = user_id );

create policy "Users can leave groups"
  on group_members for delete
  using ( auth.uid() = user_id );

create policy "Group admins can update members"
  on group_members for update
  using (
    exists (
      select 1 from group_members
      where group_id = group_members.group_id and user_id = auth.uid() and role = 'admin'
    )
  );

-- NOTIFICATIONS
create policy "Users can view their own notifications"
  on notifications for select
  using ( auth.uid() = user_id );

create policy "System can insert notifications"
  on notifications for insert
  with check ( true ); -- Mostly handled by triggers and server actions

create policy "Users can update their own notifications"
  on notifications for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own notifications"
  on notifications for delete
  using ( auth.uid() = user_id );
