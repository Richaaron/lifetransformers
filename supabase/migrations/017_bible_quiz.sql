-- BIBLE QUIZZES
create table bible_quizzes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  xp_reward integer default 10 not null,
  created_at timestamptz default now() not null
);

-- BIBLE QUIZ QUESTIONS
create table bible_quiz_questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references bible_quizzes(id) on delete cascade not null,
  question text not null,
  correct_answer text not null,
  wrong_answers text[] not null,
  reference text, -- Bible verse reference (e.g., "John 3:16")
  order_index integer not null default 0
);

-- USER QUIZ ATTEMPTS
create table user_quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  quiz_id uuid references bible_quizzes(id) on delete cascade not null,
  score integer not null,
  total_questions integer not null,
  completed_at timestamptz default now() not null
);

-- RLS POLICIES
alter table bible_quizzes enable row level security;
alter table bible_quiz_questions enable row level security;
alter table user_quiz_attempts enable row level security;

-- Allow everyone to view quizzes and questions
create policy "Bible quizzes are viewable by everyone" on bible_quizzes for select using (true);
create policy "Bible quiz questions are viewable by everyone" on bible_quiz_questions for select using (true);

-- Users can view their own quiz attempts
create policy "Users can view their own quiz attempts" on user_quiz_attempts for select using (auth.uid() = user_id);
create policy "Users can insert their own quiz attempts" on user_quiz_attempts for insert with check (auth.uid() = user_id);
