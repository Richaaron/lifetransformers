-- DAILY PLAY LIMITS FOR BIBLE GAMES AND QUIZ
-- Tracks which users have already completed a game/quiz level today

create table if not exists game_session_limits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  game_type text not null check (game_type in (
    'bible_quiz',
    'verse_memory',
    'who_said_it',
    'story_quiz',
    'bookshelf',
    'trivia_tower',
    'bible_bee',
    'family_tree',
    'promise_match'
  )),
  challenge_id uuid not null,
  last_played_date date not null default current_date,
  play_count integer not null default 1,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  -- One play per user per challenge per day
  unique(user_id, game_type, challenge_id, last_played_date)
);

-- RLS POLICIES
alter table game_session_limits enable row level security;

-- Users can view their own play limits
create policy "Users can view their own game session limits" on game_session_limits
  for select using (auth.uid() = user_id);

-- Users can insert their own play limits
create policy "Users can insert their own game session limits" on game_session_limits
  for insert with check (auth.uid() = user_id);

-- Users can update their own play limits
create policy "Users can update their own game session limits" on game_session_limits
  for update using (auth.uid() = user_id);

-- INDEX for faster queries
create index if not exists idx_game_session_limits_user_date
  on game_session_limits(user_id, last_played_date);

create index if not exists idx_game_session_limits_game_date
  on game_session_limits(game_type, challenge_id, last_played_date);
