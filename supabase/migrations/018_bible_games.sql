-- BIBLE GAME CHALLENGES

-- 1. VERSE MEMORY CHALLENGE
create table verse_memory_challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  xp_reward integer default 10 not null,
  created_at timestamptz default now() not null
);

create table verse_memory_questions (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references verse_memory_challenges(id) on delete cascade not null,
  verse_text text not null,
  reference text,
  missing_words text[] not null,
  order_index integer not null default 0
);

create table verse_memory_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  challenge_id uuid references verse_memory_challenges(id) on delete cascade not null,
  score integer not null,
  total_questions integer not null,
  completed_at timestamptz default now() not null
);

-- 2. WHO SAID IT? QUIZ
create table who_said_it_quizzes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  xp_reward integer default 10 not null,
  created_at timestamptz default now() not null
);

create table who_said_it_questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references who_said_it_quizzes(id) on delete cascade not null,
  quote text not null,
  correct_speaker text not null,
  wrong_speakers text[] not null,
  reference text,
  order_index integer not null default 0
);

create table who_said_it_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  quiz_id uuid references who_said_it_quizzes(id) on delete cascade not null,
  score integer not null,
  total_questions integer not null,
  completed_at timestamptz default now() not null
);

-- 3. BIBLE BOOKSHELF
create table bookshelf_challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  section text not null check (section in ('old_testament', 'new_testament', 'both')),
  xp_reward integer default 15 not null,
  created_at timestamptz default now() not null
);

create table bookshelf_books (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references bookshelf_challenges(id) on delete cascade not null,
  book_name text not null,
  correct_order integer not null
);

create table bookshelf_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  challenge_id uuid references bookshelf_challenges(id) on delete cascade not null,
  score integer not null,
  total_books integer not null,
  completed_at timestamptz default now() not null
);

-- 4. NAME THAT BIBLE STORY
create table story_quizzes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  xp_reward integer default 10 not null,
  created_at timestamptz default now() not null
);

create table story_questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references story_quizzes(id) on delete cascade not null,
  emoji_clue text,
  description text not null,
  correct_story text not null,
  wrong_stories text[] not null,
  reference text,
  order_index integer not null default 0
);

create table story_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  quiz_id uuid references story_quizzes(id) on delete cascade not null,
  score integer not null,
  total_questions integer not null,
  completed_at timestamptz default now() not null
);

-- 5. BIBLE TRIVIA TOWER
create table trivia_towers (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  xp_reward_per_floor integer default 10 not null,
  total_floors integer not null,
  created_at timestamptz default now() not null
);

create table trivia_floors (
  id uuid default gen_random_uuid() primary key,
  tower_id uuid references trivia_towers(id) on delete cascade not null,
  floor_number integer not null,
  floor_title text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard', 'expert', 'master')),
  xp_bonus integer default 5 not null
);

create table trivia_floor_questions (
  id uuid default gen_random_uuid() primary key,
  floor_id uuid references trivia_floors(id) on delete cascade not null,
  question text not null,
  correct_answer text not null,
  wrong_answers text[] not null,
  reference text,
  order_index integer not null default 0
);

create table trivia_tower_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  tower_id uuid references trivia_towers(id) on delete cascade not null,
  highest_floor_reached integer not null,
  total_questions_answered integer not null,
  total_xp_earned integer not null,
  completed_at timestamptz default now() not null
);

-- 6. BIBLE BEE
create table bible_bee_challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  xp_reward_per_word integer default 5 not null,
  created_at timestamptz default now() not null
);

create table bible_bee_words (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references bible_bee_challenges(id) on delete cascade not null,
  word text not null,
  hint text not null,
  order_index integer not null default 0
);

create table bible_bee_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  challenge_id uuid references bible_bee_challenges(id) on delete cascade not null,
  score integer not null,
  total_words integer not null,
  completed_at timestamptz default now() not null
);

-- 7. FAMILY TREE BUILDER
create table family_tree_challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  xp_reward_per_connection integer default 5 not null,
  created_at timestamptz default now() not null
);

create table family_tree_connections (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references family_tree_challenges(id) on delete cascade not null,
  character1 text not null,
  relationship text not null,
  character2 text not null,
  wrong_character2 text[] not null,
  reference text,
  order_index integer not null default 0
);

create table family_tree_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  challenge_id uuid references family_tree_challenges(id) on delete cascade not null,
  score integer not null,
  total_connections integer not null,
  completed_at timestamptz default now() not null
);

-- 8. BIBLE PROMISE MATCH
create table promise_match_challenges (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  xp_reward_per_match integer default 5 not null,
  created_at timestamptz default now() not null
);

create table promise_match_pairs (
  id uuid default gen_random_uuid() primary key,
  challenge_id uuid references promise_match_challenges(id) on delete cascade not null,
  promise_text text not null,
  correct_reference text not null,
  wrong_references text[] not null,
  order_index integer not null default 0
);

create table promise_match_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  challenge_id uuid references promise_match_challenges(id) on delete cascade not null,
  score integer not null,
  total_pairs integer not null,
  completed_at timestamptz default now() not null
);

-- RLS POLICIES
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

create policy "Verse memory challenges are viewable by everyone" on verse_memory_challenges for select using (true);
create policy "Verse memory questions are viewable by everyone" on verse_memory_questions for select using (true);
create policy "Who said it quizzes are viewable by everyone" on who_said_it_quizzes for select using (true);
create policy "Who said it questions are viewable by everyone" on who_said_it_questions for select using (true);
create policy "Bookshelf challenges are viewable by everyone" on bookshelf_challenges for select using (true);
create policy "Bookshelf books are viewable by everyone" on bookshelf_books for select using (true);
create policy "Story quizzes are viewable by everyone" on story_quizzes for select using (true);
create policy "Story questions are viewable by everyone" on story_questions for select using (true);
create policy "Trivia towers are viewable by everyone" on trivia_towers for select using (true);
create policy "Trivia floors are viewable by everyone" on trivia_floors for select using (true);
create policy "Trivia floor questions are viewable by everyone" on trivia_floor_questions for select using (true);
create policy "Bible bee challenges are viewable by everyone" on bible_bee_challenges for select using (true);
create policy "Bible bee words are viewable by everyone" on bible_bee_words for select using (true);
create policy "Family tree challenges are viewable by everyone" on family_tree_challenges for select using (true);
create policy "Family tree connections are viewable by everyone" on family_tree_connections for select using (true);
create policy "Promise match challenges are viewable by everyone" on promise_match_challenges for select using (true);
create policy "Promise match pairs are viewable by everyone" on promise_match_pairs for select using (true);

create policy "Users can view their own verse memory attempts" on verse_memory_attempts for select using (auth.uid() = user_id);
create policy "Users can insert their own verse memory attempts" on verse_memory_attempts for insert with check (auth.uid() = user_id);
create policy "Users can view their own who said it attempts" on who_said_it_attempts for select using (auth.uid() = user_id);
create policy "Users can insert their own who said it attempts" on who_said_it_attempts for insert with check (auth.uid() = user_id);
create policy "Users can view their own bookshelf attempts" on bookshelf_attempts for select using (auth.uid() = user_id);
create policy "Users can insert their own bookshelf attempts" on bookshelf_attempts for insert with check (auth.uid() = user_id);
create policy "Users can view their own story attempts" on story_attempts for select using (auth.uid() = user_id);
create policy "Users can insert their own story attempts" on story_attempts for insert with check (auth.uid() = user_id);
create policy "Users can view their own trivia tower attempts" on trivia_tower_attempts for select using (auth.uid() = user_id);
create policy "Users can insert their own trivia tower attempts" on trivia_tower_attempts for insert with check (auth.uid() = user_id);
create policy "Users can view their own bible bee attempts" on bible_bee_attempts for select using (auth.uid() = user_id);
create policy "Users can insert their own bible bee attempts" on bible_bee_attempts for insert with check (auth.uid() = user_id);
create policy "Users can view their own family tree attempts" on family_tree_attempts for select using (auth.uid() = user_id);
create policy "Users can insert their own family tree attempts" on family_tree_attempts for insert with check (auth.uid() = user_id);
create policy "Users can view their own promise match attempts" on promise_match_attempts for select using (auth.uid() = user_id);
create policy "Users can insert their own promise match attempts" on promise_match_attempts for insert with check (auth.uid() = user_id);
