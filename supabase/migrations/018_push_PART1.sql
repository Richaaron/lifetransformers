-- PART 1: Tables + RLS (safe to re-run)
-- Run this first, then Part 2

-- 1. VERSE MEMORY
create table if not exists verse_memory_challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  xp_reward integer default 10 not null,
  created_at timestamptz default now() not null
);

create table if not exists verse_memory_questions (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references verse_memory_challenges(id) on delete cascade not null,
  verse_text text not null,
  reference text,
  missing_words text[] not null,
  order_index integer not null default 0
);

create table if not exists verse_memory_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  challenge_id uuid references verse_memory_challenges(id) on delete cascade not null,
  score integer not null,
  total_questions integer not null,
  completed_at timestamptz default now() not null
);

-- 2. WHO SAID IT
create table if not exists who_said_it_quizzes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  xp_reward integer default 10 not null,
  created_at timestamptz default now() not null
);

create table if not exists who_said_it_questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references who_said_it_quizzes(id) on delete cascade not null,
  quote text not null,
  correct_speaker text not null,
  wrong_speakers text[] not null,
  reference text,
  order_index integer not null default 0
);

create table if not exists who_said_it_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  quiz_id uuid references who_said_it_quizzes(id) on delete cascade not null,
  score integer not null,
  total_questions integer not null,
  completed_at timestamptz default now() not null
);

-- 3. BOOKSHELF
create table if not exists bookshelf_challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  section text not null check (section in ('old_testament', 'new_testament', 'both')),
  xp_reward integer default 15 not null,
  created_at timestamptz default now() not null
);

create table if not exists bookshelf_books (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references bookshelf_challenges(id) on delete cascade not null,
  book_name text not null,
  correct_order integer not null
);

create table if not exists bookshelf_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  challenge_id uuid references bookshelf_challenges(id) on delete cascade not null,
  score integer not null,
  total_books integer not null,
  completed_at timestamptz default now() not null
);

-- 4. STORY QUIZ
create table if not exists story_quizzes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  xp_reward integer default 10 not null,
  created_at timestamptz default now() not null
);

create table if not exists story_questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references story_quizzes(id) on delete cascade not null,
  emoji_clue text,
  description text not null,
  correct_story text not null,
  wrong_stories text[] not null,
  reference text,
  order_index integer not null default 0
);

create table if not exists story_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  quiz_id uuid references story_quizzes(id) on delete cascade not null,
  score integer not null,
  total_questions integer not null,
  completed_at timestamptz default now() not null
);

-- 5. TRIVIA TOWER
create table if not exists trivia_towers (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  xp_reward_per_floor integer default 10 not null,
  total_floors integer not null,
  created_at timestamptz default now() not null
);

create table if not exists trivia_floors (
  id uuid default gen_random_uuid() primary key,
  tower_id uuid references trivia_towers(id) on delete cascade not null,
  floor_number integer not null,
  floor_title text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard', 'expert', 'master')),
  xp_bonus integer default 5 not null
);

create table if not exists trivia_floor_questions (
  id uuid default gen_random_uuid() primary key,
  floor_id uuid references trivia_floors(id) on delete cascade not null,
  question text not null,
  correct_answer text not null,
  wrong_answers text[] not null,
  reference text,
  order_index integer not null default 0
);

create table if not exists trivia_tower_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  tower_id uuid references trivia_towers(id) on delete cascade not null,
  highest_floor_reached integer not null,
  total_questions_answered integer not null,
  total_xp_earned integer not null,
  completed_at timestamptz default now() not null
);

-- 6. BIBLE BEE
create table if not exists bible_bee_challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  xp_reward_per_word integer default 5 not null,
  created_at timestamptz default now() not null
);

create table if not exists bible_bee_words (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references bible_bee_challenges(id) on delete cascade not null,
  word text not null,
  hint text not null,
  order_index integer not null default 0
);

create table if not exists bible_bee_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  challenge_id uuid references bible_bee_challenges(id) on delete cascade not null,
  score integer not null,
  total_words integer not null,
  completed_at timestamptz default now() not null
);

-- 7. FAMILY TREE
create table if not exists family_tree_challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  xp_reward_per_connection integer default 5 not null,
  created_at timestamptz default now() not null
);

create table if not exists family_tree_connections (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references family_tree_challenges(id) on delete cascade not null,
  character1 text not null,
  relationship text not null,
  character2 text not null,
  wrong_character2 text[] not null,
  reference text,
  order_index integer not null default 0
);

create table if not exists family_tree_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  challenge_id uuid references family_tree_challenges(id) on delete cascade not null,
  score integer not null,
  total_connections integer not null,
  completed_at timestamptz default now() not null
);

-- 8. PROMISE MATCH
create table if not exists promise_match_challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  xp_reward_per_match integer default 5 not null,
  created_at timestamptz default now() not null
);

create table if not exists promise_match_pairs (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references promise_match_challenges(id) on delete cascade not null,
  promise_text text not null,
  correct_reference text not null,
  wrong_references text[] not null,
  order_index integer not null default 0
);

create table if not exists promise_match_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  challenge_id uuid references promise_match_challenges(id) on delete cascade not null,
  score integer not null,
  total_pairs integer not null,
  completed_at timestamptz default now() not null
);

-- RLS
alter table verse_memory_challenges enable row level security;
alter table verse_memory_questions enable row level security;
alter table verse_memory_attempts enable row level security;
alter table who_said_it_quizzes enable row level security;
alter table who_said_it_questions enable row level security;
alter table who_said_it_attempts enable row level security;
alter table bookshelf_challenges enable row level security;
alter table bookshelf_books enable row level security;
alter table bookshelf_attempts enable row level security;
alter table story_quizzes enable row level security;
alter table story_questions enable row level security;
alter table story_attempts enable row level security;
alter table trivia_towers enable row level security;
alter table trivia_floors enable row level security;
alter table trivia_floor_questions enable row level security;
alter table trivia_tower_attempts enable row level security;
alter table bible_bee_challenges enable row level security;
alter table bible_bee_words enable row level security;
alter table bible_bee_attempts enable row level security;
alter table family_tree_challenges enable row level security;
alter table family_tree_connections enable row level security;
alter table family_tree_attempts enable row level security;
alter table promise_match_challenges enable row level security;
alter table promise_match_pairs enable row level security;
alter table promise_match_attempts enable row level security;

do $$ begin
  create policy "Everyone can view vm challenges" on verse_memory_challenges for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Everyone can view vm questions" on verse_memory_questions for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can insert own vm attempts" on verse_memory_attempts for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can view own vm attempts" on verse_memory_attempts for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Everyone can view wsi quizzes" on who_said_it_quizzes for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Everyone can view wsi questions" on who_said_it_questions for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can insert own wsi attempts" on who_said_it_attempts for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can view own wsi attempts" on who_said_it_attempts for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Everyone can view bs challenges" on bookshelf_challenges for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Everyone can view bs books" on bookshelf_books for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can insert own bs attempts" on bookshelf_attempts for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can view own bs attempts" on bookshelf_attempts for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Everyone can view sq quizzes" on story_quizzes for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Everyone can view sq questions" on story_questions for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can insert own sq attempts" on story_attempts for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can view own sq attempts" on story_attempts for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Everyone can view tt towers" on trivia_towers for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Everyone can view tt floors" on trivia_floors for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Everyone can view tt fquestions" on trivia_floor_questions for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can insert own tt attempts" on trivia_tower_attempts for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can view own tt attempts" on trivia_tower_attempts for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Everyone can view bb challenges" on bible_bee_challenges for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Everyone can view bb words" on bible_bee_words for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can insert own bb attempts" on bible_bee_attempts for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can view own bb attempts" on bible_bee_attempts for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Everyone can view ft challenges" on family_tree_challenges for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Everyone can view ft connections" on family_tree_connections for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can insert own ft attempts" on family_tree_attempts for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can view own ft attempts" on family_tree_attempts for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Everyone can view pm challenges" on promise_match_challenges for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Everyone can view pm pairs" on promise_match_pairs for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can insert own pm attempts" on promise_match_attempts for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Users can view own pm attempts" on promise_match_attempts for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- DONE. Now run Part 2 for seed data.
