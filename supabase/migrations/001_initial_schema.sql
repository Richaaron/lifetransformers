-- PROFILES (extends auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  cover_url text,
  status text default 'active', -- 'active' | 'pending' (requires admin approval)
  last_active timestamptz default now(),
  created_at timestamptz default now()
);

-- FRIENDSHIPS
create table friendships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  friend_id uuid references profiles(id) on delete cascade not null,
  status text not null default 'pending', -- 'pending' | 'accepted' | 'rejected'
  created_at timestamptz default now(),
  unique(user_id, friend_id),
  check (user_id <> friend_id)
);

-- GROUPS
create table groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  cover_url text,
  privacy text not null default 'public', -- 'public' | 'private'
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- GROUP MEMBERS
create table group_members (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references groups(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  role text not null default 'member', -- 'member' | 'admin'
  joined_at timestamptz default now(),
  unique(group_id, user_id)
);

-- GROUP INVITES
create table group_invites (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references groups(id) on delete cascade not null,
  invite_code text unique not null default encode(gen_random_bytes(12), 'hex'),
  created_by uuid references profiles(id) on delete cascade not null,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- POSTS
create table posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  image_url text,
  group_id uuid references groups(id) on delete cascade,
  created_at timestamptz default now()
);

-- LIKES
create table likes (
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key(post_id, user_id)
);

-- COMMENTS
create table comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- CONVERSATIONS (1:1 DMs)
create table conversations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now()
);

-- CONVERSATION PARTICIPANTS
create table conversation_participants (
  conversation_id uuid references conversations(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  last_read_at timestamptz default now(),
  primary key(conversation_id, user_id)
);

-- MESSAGES
create table messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- NOTIFICATIONS
create table notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  type text not null,
  actor_id uuid references profiles(id) on delete cascade,
  resource_id uuid,
  resource_type text,
  read boolean default false,
  created_at timestamptz default now()
);

-- Supabase Auth Trigger to create profile row automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'display_name', 'New User')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
