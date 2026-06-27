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

-- ========================
-- SEED DATA
-- ========================

-- 1. VERSE MEMORY SEED
insert into verse_memory_challenges (id, title, description, difficulty, xp_reward) values
('a1000000-0000-0000-0000-000000000001', 'Psalm 23 Memory', 'Memorize the beloved Psalm 23 verses.', 'easy', 10),
('a1000000-0000-0000-0000-000000000002', 'Proverbs Wisdom', 'Recall key Proverbs verses about wisdom.', 'medium', 15),
('a1000000-0000-0000-0000-000000000003', 'New Testament Promises', 'Remember powerful New Testament promises.', 'hard', 20),
('a1000000-0000-0000-0000-000000000004', 'Psalms of Comfort', 'Find peace in comforting Psalm verses.', 'medium', 15),
('a1000000-0000-0000-0000-000000000005', 'Words of Jesus', 'Memorize direct quotes from Jesus Christ.', 'hard', 20);

-- Psalm 23 (10 questions)
insert into verse_memory_questions (challenge_id, verse_text, reference, missing_words, order_index) values
('a1000000-0000-0000-0000-000000000001', 'The Lord is my shepherd; I shall not want.', 'Psalm 23:1', '{"shepherd", "want"}', 0),
('a1000000-0000-0000-0000-000000000001', 'He makes me lie down in green pastures.', 'Psalm 23:2', '{"green", "pastures"}', 1),
('a1000000-0000-0000-0000-000000000001', 'He leads me beside still waters.', 'Psalm 23:2', '{"still", "waters"}', 2),
('a1000000-0000-0000-0000-000000000001', 'He restores my soul.', 'Psalm 23:3', '{"restores", "soul"}', 3),
('a1000000-0000-0000-0000-000000000001', 'He leads me in paths of righteousness for his name sake.', 'Psalm 23:3', '{"paths", "righteousness"}', 4),
('a1000000-0000-0000-0000-000000000001', 'Even though I walk through the valley of the shadow of death, I will fear no evil.', 'Psalm 23:4', '{"valley", "shadow", "death", "fear"}', 5),
('a1000000-0000-0000-0000-000000000001', 'For you are with me; your rod and your staff, they comfort me.', 'Psalm 23:4', '{"rod", "staff", "comfort"}', 6),
('a1000000-0000-0000-0000-000000000001', 'You prepare a table before me in the presence of my enemies.', 'Psalm 23:5', '{"prepare", "table", "enemies"}', 7),
('a1000000-0000-0000-0000-000000000001', 'You anoint my head with oil; my cup overflows.', 'Psalm 23:5', '{"anoint", "oil", "overflows"}', 8),
('a1000000-0000-0000-0000-000000000001', 'Surely goodness and mercy shall follow me all the days of my life.', 'Psalm 23:6', '{"goodness", "mercy", "follow"}', 9);

-- Proverbs Wisdom (10 questions)
insert into verse_memory_questions (challenge_id, verse_text, reference, missing_words, order_index) values
('a1000000-0000-0000-0000-000000000002', 'Trust in the Lord with all your heart, and do not lean on your own understanding.', 'Proverbs 3:5', '{"trust", "heart", "understanding"}', 0),
('a1000000-0000-0000-0000-000000000002', 'In all your ways acknowledge him, and he will make straight your paths.', 'Proverbs 3:6', '{"acknowledge", "straight", "paths"}', 1),
('a1000000-0000-0000-0000-000000000002', 'The fear of the Lord is the beginning of wisdom.', 'Proverbs 9:10', '{"fear", "beginning", "wisdom"}', 2),
('a1000000-0000-0000-0000-000000000002', 'A gentle answer turns away wrath, but a harsh word stirs up anger.', 'Proverbs 15:1', '{"gentle", "wrath", "harsh"}', 3),
('a1000000-0000-0000-0000-000000000002', 'The tongue of the wise adorns knowledge, but the mouth of the fool gushes folly.', 'Proverbs 15:2', '{"tongue", "wise", "adorns"}', 4),
('a1000000-0000-0000-0000-000000000002', 'Plans are established by seeking advice; so if you wage war, obtain guidance.', 'Proverbs 20:18', '{"plans", "advice", "guidance"}', 5),
('a1000000-0000-0000-0000-000000000002', 'The wise in heart are called discerning, and pleasant words promote instruction.', 'Proverbs 16:21', '{"wise", "discerning", "pleasant"}', 6),
('a1000000-0000-0000-0000-000000000002', 'Iron sharpens iron, and one person sharpens another.', 'Proverbs 27:17', '{"iron", "sharpens", "another"}', 7),
('a1000000-0000-0000-0000-000000000002', 'Above all else, guard your heart, for everything you do flows from it.', 'Proverbs 4:23', '{"guard", "heart", "flows"}', 8),
('a1000000-0000-0000-0000-000000000002', 'Commit to the Lord whatever you do, and he will establish your plans.', 'Proverbs 16:3', '{"commit", "establish", "plans"}', 9);

-- New Testament Promises (10 questions)
insert into verse_memory_questions (challenge_id, verse_text, reference, missing_words, order_index) values
('a1000000-0000-0000-0000-000000000003', 'For God so loved the world that he gave his only Son.', 'John 3:16', '{"loved", "world", "only Son"}', 0),
('a1000000-0000-0000-0000-000000000003', 'I can do all things through him who strengthens me.', 'Philippians 4:13', '{"all things", "strengthens"}', 1),
('a1000000-0000-0000-0000-000000000003', 'And we know that in all things God works for the good of those who love him.', 'Romans 8:28', '{"works", "good", "love"}', 2),
('a1000000-0000-0000-0000-000000000003', 'But those who hope in the Lord will renew their strength.', 'Isaiah 40:31', '{"hope", "renew", "strength"}', 3),
('a1000000-0000-0000-0000-000000000003', 'The Lord is my light and my salvation; whom shall I fear?', 'Psalm 27:1', '{"light", "salvation", "fear"}', 4),
('a1000000-0000-0000-0000-000000000003', 'Be strong and courageous. Do not be afraid; do not be discouraged.', 'Joshua 1:9', '{"strong", "courageous", "afraid"}', 5),
('a1000000-0000-0000-0000-000000000003', 'No weapon formed against you shall prosper.', 'Isaiah 54:17', '{"weapon", "formed", "prosper"}', 6),
('a1000000-0000-0000-0000-000000000003', 'I will never leave you nor forsake you.', 'Hebrews 13:5', '{"never", "leave", "forsake"}', 7),
('a1000000-0000-0000-0000-000000000003', 'Come to me, all you who are weary and burdened, and I will give you rest.', 'Matthew 11:28', '{"weary", "burdened", "rest"}', 8),
('a1000000-0000-0000-0000-000000000003', 'And my God will meet all your needs according to the riches of his glory.', 'Philippians 4:19', '{"meet", "needs", "riches"}', 9);

-- Psalms of Comfort (10 questions)
insert into verse_memory_questions (challenge_id, verse_text, reference, missing_words, order_index) values
('a1000000-0000-0000-0000-000000000004', 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.', 'Psalm 34:18', '{"close", "brokenhearted", "saves"}', 0),
('a1000000-0000-0000-0000-000000000004', 'Cast your cares on the Lord and he will sustain you.', 'Psalm 55:22', '{"cast", "cares", "sustain"}', 1),
('a1000000-0000-0000-0000-000000000004', 'He heals the brokenhearted and binds up their wounds.', 'Psalm 147:3', '{"heals", "brokenhearted", "binds"}', 2),
('a1000000-0000-0000-0000-000000000004', 'The Lord is my refuge and my fortress; my God, in whom I trust.', 'Psalm 91:2', '{"refuge", "fortress", "trust"}', 3),
('a1000000-0000-0000-0000-000000000004', 'When I am afraid, I put my trust in you.', 'Psalm 56:3', '{"afraid", "trust"}', 4),
('a1000000-0000-0000-0000-000000000004', 'You will keep in perfect peace those whose minds are steadfast.', 'Isaiah 26:3', '{"perfect", "peace", "steadfast"}', 5),
('a1000000-0000-0000-0000-000000000004', 'The Lord is my strength and my shield; my heart trusts in him.', 'Psalm 28:7', '{"strength", "shield", "trusts"}', 6),
('a1000000-0000-0000-0000-000000000004', 'God is our refuge and strength, an ever-present help in trouble.', 'Psalm 46:1', '{"refuge", "strength", "help"}', 7),
('a1000000-0000-0000-0000-000000000004', 'I will lie down and sleep in peace, for you alone, Lord, make me dwell in safety.', 'Psalm 4:8', '{"lie", "sleep", "peace", "safety"}', 8),
('a1000000-0000-0000-0000-000000000004', 'The Lord is my shepherd; I shall not want. He makes me lie down in green pastures.', 'Psalm 23:1-2', '{"shepherd", "want", "green", "pastures"}', 9);

-- Words of Jesus (10 questions)
insert into verse_memory_questions (challenge_id, verse_text, reference, missing_words, order_index) values
('a1000000-0000-0000-0000-000000000005', 'I am the way, the truth, and the life.', 'John 14:6', '{"way", "truth", "life"}', 0),
('a1000000-0000-0000-0000-000000000005', 'Love your neighbor as yourself.', 'Matthew 22:39', '{"love", "neighbor", "yourself"}', 1),
('a1000000-0000-0000-0000-000000000005', 'For where your treasure is, there your heart will be also.', 'Matthew 6:21', '{"treasure", "heart"}', 2),
('a1000000-0000-0000-0000-000000000005', 'I am the light of the world. Whoever follows me will never walk in darkness.', 'John 8:12', '{"light", "world", "follows", "darkness"}', 3),
('a1000000-0000-0000-0000-000000000005', 'Let the little children come to me, and do not hinder them.', 'Matthew 19:14', '{"little", "children", "hinder"}', 4),
('a1000000-0000-0000-0000-000000000005', 'I am the resurrection and the life.', 'John 11:25', '{"resurrection", "life"}', 5),
('a1000000-0000-0000-0000-000000000005', 'Do not let your hearts be troubled. You believe in God; believe also in me.', 'John 14:1', '{"troubled", "believe", "God"}', 6),
('a1000000-0000-0000-0000-000000000005', 'Peace I leave with you; my peace I give you.', 'John 14:27', '{"peace", "leave", "give"}', 7),
('a1000000-0000-0000-0000-000000000005', 'I am the vine; you are the branches.', 'John 15:5', '{"vine", "branches"}', 8),
('a1000000-0000-0000-0000-000000000005', 'By this everyone will know that you are my disciples, if you love one another.', 'John 13:35', '{"know", "disciples", "love"}', 9);

-- 2. WHO SAID IT SEED
insert into who_said_it_quizzes (id, title, description, difficulty, xp_reward) values
('b1000000-0000-0000-0000-000000000001', 'Old Testament Speakers', 'Identify who spoke famous Old Testament quotes.', 'easy', 10),
('b1000000-0000-0000-0000-000000000002', 'New Testament Speakers', 'Match New Testament quotes to their speakers.', 'medium', 15),
('b1000000-0000-0000-0000-000000000003', 'Prophets and Kings', 'Test your knowledge of prophetic and royal speeches.', 'hard', 20),
('b1000000-0000-0000-0000-000000000004', 'Women of the Bible', 'Identify quotes from remarkable women of the Bible.', 'medium', 15),
('b1000000-0000-0000-0000-000000000005', 'Famous Last Words', 'Match the final words of biblical figures.', 'hard', 20);

-- Old Testament Speakers (8 questions)
insert into who_said_it_questions (quiz_id, quote, correct_speaker, wrong_speakers, reference, order_index) values
('b1000000-0000-0000-0000-000000000001', 'I am the Lord your God, who brought you out of Egypt.', 'God', '{"Moses", "Abraham", "David"}', 'Exodus 20:2', 0),
('b1000000-0000-0000-0000-000000000001', 'Here I am; send me.', 'Isaiah', '{"Jeremiah", "Elijah", "Moses"}', 'Isaiah 6:8', 1),
('b1000000-0000-0000-0000-000000000001', 'The Lord is my rock, my fortress, and my deliverer.', 'David', '{"Solomon", "Moses", "Joshua"}', 'Psalm 18:2', 2),
('b1000000-0000-0000-0000-000000000001', 'I can do all things through God who gives me strength.', 'Samson', '{"David", "Gideon", "Joshua"}', 'Judges 16:30', 3),
('b1000000-0000-0000-0000-000000000001', 'Before I formed you in the womb I knew you.', 'God', '{"Jeremiah", "Isaiah", "Moses"}', 'Jeremiah 1:5', 4),
('b1000000-0000-0000-0000-000000000001', 'The Lord will fight for you; you need only to be still.', 'Moses', '{"Aaron", "Joshua", "Caleb"}', 'Exodus 14:14', 5),
('b1000000-0000-0000-0000-000000000001', 'As for me and my household, we will serve the Lord.', 'Joshua', '{"Moses", "David", "Solomon"}', 'Joshua 24:15', 6),
('b1000000-0000-0000-0000-000000000001', 'The Lord is my shepherd; I shall not want.', 'David', '{"Solomon", "Moses", "Asaph"}', 'Psalm 23:1', 7);

-- New Testament Speakers (8 questions)
insert into who_said_it_questions (quiz_id, quote, correct_speaker, wrong_speakers, reference, order_index) values
('b1000000-0000-0000-0000-000000000002', 'I am the way, the truth, and the life.', 'Jesus', '{"Paul", "Peter", "John"}', 'John 14:6', 0),
('b1000000-0000-0000-0000-000000000002', 'Love is patient, love is kind.', 'Paul', '{"Peter", "John", "James"}', '1 Corinthians 13:4', 1),
('b1000000-0000-0000-0000-000000000002', 'For by grace you have been saved through faith.', 'Paul', '{"Peter", "James", "Jesus"}', 'Ephesians 2:8', 2),
('b1000000-0000-0000-0000-000000000002', 'You are the Christ, the Son of the living God.', 'Peter', '{"John", "Andrew", "Thomas"}', 'Matthew 16:16', 3),
('b1000000-0000-0000-0000-000000000002', 'In the beginning was the Word, and the Word was with God.', 'John', '{"Paul", "Peter", "Luke"}', 'John 1:1', 4),
('b1000000-0000-0000-0000-000000000002', 'Repent and be baptized, every one of you.', 'Peter', '{"Paul", "John", "James"}', 'Acts 2:38', 5),
('b1000000-0000-0000-0000-000000000002', 'I have been crucified with Christ and I no longer live.', 'Paul', '{"Peter", "John", "Barnabas"}', 'Galatians 2:20', 6),
('b1000000-0000-0000-0000-000000000002', 'My grace is sufficient for you, for my power is made perfect in weakness.', 'Paul', '{"Peter", "Timothy", "Silas"}', '2 Corinthians 12:9', 7);

-- Prophets and Kings (8 questions)
insert into who_said_it_questions (quiz_id, quote, correct_speaker, wrong_speakers, reference, order_index) values
('b1000000-0000-0000-0000-000000000003', 'Behold, I am doing a new thing; now it springs forth.', 'Isaiah', '{"Jeremiah", "Ezekiel", "Daniel"}', 'Isaiah 43:19', 0),
('b1000000-0000-0000-0000-000000000003', 'For I know the plans I have for you, declares the Lord.', 'God', '{"Jeremiah", "Isaiah", "Ezekiel"}', 'Jeremiah 29:11', 1),
('b1000000-0000-0000-0000-000000000003', 'He has told you, O man, what is good.', 'Micah', '{"Isaiah", "Hosea", "Amos"}', 'Micah 6:8', 2),
('b1000000-0000-0000-0000-000000000003', 'Write the vision and make it plain on tablets.', 'Habakkuk', '{"Haggai", "Zechariah", "Malachi"}', 'Habakkuk 2:2', 3),
('b1000000-0000-0000-0000-000000000003', 'I will raise up for them a prophet like you from among their brothers.', 'God', '{"Moses", "Joshua", "Samuel"}', 'Deuteronomy 18:18', 4),
('b1000000-0000-0000-0000-000000000003', 'The Lord is my strength and my song; he has become my salvation.', 'Moses', '{"Miriam", "Deborah", "Hannah"}', 'Exodus 15:2', 5),
('b1000000-0000-0000-0000-000000000003', 'Is there no balm in Gilead? Is there no physician there?', 'Jeremiah', '{"Ezekiel", "Hosea", "Joel"}', 'Jeremiah 8:22', 6),
('b1000000-0000-0000-0000-000000000003', 'But let justice roll on like a river, righteousness like a never-failing stream.', 'Amos', '{"Micah", "Hosea", "Isaiah"}', 'Amos 5:24', 7);

-- Women of the Bible (8 questions)
insert into who_said_it_questions (quiz_id, quote, correct_speaker, wrong_speakers, reference, order_index) values
('b1000000-0000-0000-0000-000000000004', 'Where you go I will go, and where you stay I will stay.', 'Ruth', '{"Naomi", "Esther", "Hannah"}', 'Ruth 1:16', 0),
('b1000000-0000-0000-0000-000000000004', 'If I perish, I perish.', 'Esther', '{"Ruth", "Deborah", "Abigail"}', 'Esther 4:16', 1),
('b1000000-0000-0000-0000-000000000004', 'The Lord has done remarkable things for me.', 'Hannah', '{"Mary", "Elizabeth", "Sarah"}', '1 Samuel 2:1', 2),
('b1000000-0000-0000-0000-000000000004', 'My soul glorifies the Lord and my spirit rejoices in God my Savior.', 'Mary', '{"Elizabeth", "Hannah", "Ruth"}', 'Luke 1:46-47', 3),
('b1000000-0000-0000-0000-000000000004', 'Blessed are you among women, and blessed is the child you will bear!', 'Elizabeth', '{"Mary", "Sarah", "Rebecca"}', 'Luke 1:42', 4),
('b1000000-0000-0000-0000-000000000004', 'Speak, for your servant is listening.', 'Hannah', '{"Deborah", "Ruth", "Esther"}', '1 Samuel 3:10', 5),
('b1000000-0000-0000-0000-000000000004', 'The Lord has vindicated me; he has shown his justice on my behalf.', 'Hannah', '{"Mary", "Ruth", "Abigail"}', '1 Samuel 2:1', 6),
('b1000000-0000-0000-0000-000000000004', 'Do not be afraid. You will not be put to shame.', 'Isaiah', '{"Mary", "Deborah", "Ruth"}', 'Isaiah 54:4', 7);

-- Famous Last Words (8 questions)
insert into who_said_it_questions (quiz_id, quote, correct_speaker, wrong_speakers, reference, order_index) values
('b1000000-0000-0000-0000-000000000005', 'I have fought the good fight, I have finished the race, I have kept the faith.', 'Paul', '{"Peter", "John", "James"}', '2 Timothy 4:7', 0),
('b1000000-0000-0000-0000-000000000005', 'Father, into your hands I commit my spirit.', 'Jesus', '{"Stephen", "Paul", "Peter"}', 'Luke 23:46', 1),
('b1000000-0000-0000-0000-000000000005', 'It is finished.', 'Jesus', '{"Paul", "Peter", "John"}', 'John 19:30', 2),
('b1000000-0000-0000-0000-000000000005', 'Lord Jesus, receive my spirit.', 'Stephen', '{"Paul", "Peter", "James"}', 'Acts 7:59', 3),
('b1000000-0000-0000-0000-000000000005', 'See, I am coming soon; my reward is with me.', 'Jesus', '{"John", "Paul", "Peter"}', 'Revelation 22:12', 4),
('b1000000-0000-0000-0000-000000000005', 'Now I commit you to God and to the word of his grace.', 'Paul', '{"Peter", "Barnabas", "Timothy"}', 'Acts 20:32', 5),
('b1000000-0000-0000-0000-000000000005', 'The time of my departure has come.', 'Paul', '{"Peter", "John", "Timothy"}', '2 Timothy 4:6', 6),
('b1000000-0000-0000-0000-000000000005', 'Truly, I tell you, today you will be with me in paradise.', 'Jesus', '{"Peter", "Paul", "John"}', 'Luke 23:43', 7);

-- 3. BIBLE BOOKSHELF SEED
insert into bookshelf_challenges (id, title, section, xp_reward) values
('c1000000-0000-0000-0000-000000000001', 'First 5 Books of the Bible', 'old_testament', 15),
('c1000000-0000-0000-0000-000000000002', 'Gospels in Order', 'new_testament', 15),
('c1000000-0000-0000-0000-000000000003', 'Major Prophets', 'old_testament', 20),
('c1000000-0000-0000-0000-000000000004', 'Pauline Epistles', 'new_testament', 20),
('c1000000-0000-0000-0000-000000000005', 'Historical Books', 'old_testament', 25);

-- First 5 Books (5 books)
insert into bookshelf_books (challenge_id, book_name, correct_order) values
('c1000000-0000-0000-0000-000000000001', 'Genesis', 1),
('c1000000-0000-0000-0000-000000000001', 'Exodus', 2),
('c1000000-0000-0000-0000-000000000001', 'Leviticus', 3),
('c1000000-0000-0000-0000-000000000001', 'Numbers', 4),
('c1000000-0000-0000-0000-000000000001', 'Deuteronomy', 5);

-- Gospels (4 books)
insert into bookshelf_books (challenge_id, book_name, correct_order) values
('c1000000-0000-0000-0000-000000000002', 'Matthew', 1),
('c1000000-0000-0000-0000-000000000002', 'Mark', 2),
('c1000000-0000-0000-0000-000000000002', 'Luke', 3),
('c1000000-0000-0000-0000-000000000002', 'John', 4);

-- Major Prophets (5 books)
insert into bookshelf_books (challenge_id, book_name, correct_order) values
('c1000000-0000-0000-0000-000000000003', 'Isaiah', 1),
('c1000000-0000-0000-0000-000000000003', 'Jeremiah', 2),
('c1000000-0000-0000-0000-000000000003', 'Lamentations', 3),
('c1000000-0000-0000-0000-000000000003', 'Ezekiel', 4),
('c1000000-0000-0000-0000-000000000003', 'Daniel', 5);

-- Pauline Epistles (7 books)
insert into bookshelf_books (challenge_id, book_name, correct_order) values
('c1000000-0000-0000-0000-000000000004', 'Romans', 1),
('c1000000-0000-0000-0000-000000000004', '1 Corinthians', 2),
('c1000000-0000-0000-0000-000000000004', '2 Corinthians', 3),
('c1000000-0000-0000-0000-000000000004', 'Galatians', 4),
('c1000000-0000-0000-0000-000000000004', 'Ephesians', 5),
('c1000000-0000-0000-0000-000000000004', 'Philippians', 6),
('c1000000-0000-0000-0000-000000000004', 'Colossians', 7);

-- Historical Books (9 books)
insert into bookshelf_books (challenge_id, book_name, correct_order) values
('c1000000-0000-0000-0000-000000000005', 'Joshua', 1),
('c1000000-0000-0000-0000-000000000005', 'Judges', 2),
('c1000000-0000-0000-0000-000000000005', 'Ruth', 3),
('c1000000-0000-0000-0000-000000000005', '1 Samuel', 4),
('c1000000-0000-0000-0000-000000000005', '2 Samuel', 5),
('c1000000-0000-0000-0000-000000000005', '1 Kings', 6),
('c1000000-0000-0000-0000-000000000005', '2 Kings', 7),
('c1000000-0000-0000-0000-000000000005', '1 Chronicles', 8),
('c1000000-0000-0000-0000-000000000005', '2 Chronicles', 9);

-- 4. NAME THAT STORY SEED
insert into story_quizzes (id, title, description, difficulty, xp_reward) values
('d1000000-0000-0000-0000-000000000001', 'Famous Bible Stories', 'Identify well-known Bible stories from clues.', 'easy', 10),
('d1000000-0000-0000-0000-000000000002', 'Miracles of Jesus', 'Guess the miracle from the description.', 'medium', 15),
('d1000000-0000-0000-0000-000000000003', 'Old Testament Adventures', 'Identify stories from the Old Testament.', 'hard', 20),
('d1000000-0000-0000-0000-000000000004', 'Parables of Jesus', 'Identify the parable from the description.', 'medium', 15),
('d1000000-0000-0000-0000-000000000005', 'Heroes of Faith', 'Identify the hero of faith from the story.', 'hard', 20);

-- Famous Bible Stories (8 questions)
insert into story_questions (quiz_id, emoji_clue, description, correct_story, wrong_stories, reference, order_index) values
('d1000000-0000-0000-0000-000000000001', '🍎🐍', 'A man and woman ate fruit from a forbidden tree and were expelled from a garden.', 'The Fall of Man', '{"Noah Ark", "David Goliath", "Jonah Whale"}', 'Genesis 3', 0),
('d1000000-0000-0000-0000-000000000001', '🌍🌊', 'God sent a great flood to cleanse the earth; one family was saved on a boat.', 'Noah Ark', '{"Tower of Babel", "Sodom Gomorrah", "Moses Red Sea"}', 'Genesis 6-9', 1),
('d1000000-0000-0000-0000-000000000001', '⭐👶', 'Three wise men followed a star to visit a newborn king in Bethlehem.', 'The Nativity', '{"Abraham Sacrifice", "Jacob Ladder", "Joseph Dreams"}', 'Matthew 2', 2),
('d1000000-0000-0000-0000-000000000001', '🎸⚔️', 'A young shepherd defeated a giant warrior with a sling and a stone.', 'David and Goliath', '{"Samson Lion", "Joshua Walls", "Gideon Fleece"}', '1 Samuel 17', 3),
('d1000000-0000-0000-0000-000000000001', '🔥🔥', 'God spoke to Moses through a burning bush in the desert.', 'The Burning Bush', '{"Tower of Babel", "Jacob Ladder", "Manna Heaven"}', 'Exodus 3', 4),
('d1000000-0000-0000-0000-000000000001', '🧱🧱', 'A great city walls collapsed when the Israelites marched and blew trumpets.', 'Fall of Jericho', '{"Sodom Gomorrah", "Red Sea Crossing", "Jordan River"}', 'Joshua 6', 5),
('d1000000-0000-0000-0000-000000000001', '🎂🌙', 'Joseph interpreted the dreams of Pharaoh about seven years of plenty and famine.', 'Joseph Dreams', '{"Daniel Lions", "Moses Plagues", "Elijah Ravens"}', 'Genesis 41', 6),
('d1000000-0000-0000-0000-000000000001', '🦁🙏', 'Daniel was thrown into a lions den but emerged unharmed.', 'Daniel in Lions Den', '{"Shadrach Fire", "Joseph Pit", "Moses Bush"}', 'Daniel 6', 7);

-- Miracles of Jesus (8 questions)
insert into story_questions (quiz_id, emoji_clue, description, correct_story, wrong_stories, reference, order_index) values
('d1000000-0000-0000-0000-000000000002', '🍞🐟', 'Jesus fed a huge crowd with just five loaves and two fish.', 'Feeding the 5000', '{"Water to Wine", "Walking Water", "Healing Blind"}', 'John 6:1-14', 0),
('d1000000-0000-0000-0000-000000000002', '🌊🚶', 'Jesus walked on the Sea of Galilee during a storm.', 'Walking on Water', '{"Calming Storm", "Raising Lazarus", "Transfiguration"}', 'Matthew 14:22-33', 1),
('d1000000-0000-0000-0000-000000000002', '🍷💧', 'Jesus turned water into wine at a wedding in Cana.', 'Water to Wine', '{"Feeding 5000", "Healing Leper", "Cursing Fig Tree"}', 'John 2:1-11', 2),
('d1000000-0000-0000-0000-000000000002', '👁️💡', 'Jesus restored sight to a man who was born blind.', 'Healing the Blind Man', '{"Healing Deaf", "Healing Lame", "Cleansing Leper"}', 'John 9:1-7', 3),
('d1000000-0000-0000-0000-000000000002', '🌊🌬️', 'Jesus calmed a violent storm on the Sea of Galilee with a word.', 'Calming the Storm', '{"Walking Water", "Feeding 5000", "Healing Sick"}', 'Mark 4:35-41', 4),
('d1000000-0000-0000-0000-000000000002', '🧟‍♂️💤', 'Jesus raised Lazarus from the dead after four days in the tomb.', 'Raising Lazarus', '{"Healing Sick", "Cleansing Leper", "Transfiguration"}', 'John 11:1-44', 5),
('d1000000-0000-0000-0000-000000000002', '🐟🪙', 'Jesus told Peter to find a coin in the mouth of a fish to pay the temple tax.', 'Coin in Fish Mouth', '{"Feeding 5000", "Water to Wine", "Walking Water"}', 'Matthew 17:24-27', 6),
('d1000000-0000-0000-0000-000000000002', '🍕👥', 'Jesus multiplied seven loaves and a few small fish to feed four thousand.', 'Feeding the 4000', '{"Feeding 5000", "Water to Wine", "Healing Blind"}', 'Matthew 15:32-39', 7);

-- Old Testament Adventures (8 questions)
insert into story_questions (quiz_id, emoji_clue, description, correct_story, wrong_stories, reference, order_index) values
('d1000000-0000-0000-0000-000000000003', '🔥🧑‍🤝‍🧑', 'Three men were thrown into a fiery furnace but were protected by God.', 'Shadrach Meshach Abednego', '{"Daniel Lions", "Jonah Whale", "Job Suffering"}', 'Daniel 3', 0),
('d1000000-0000-0000-0000-000000000003', '🐋🚶', 'A prophet was swallowed by a great fish for three days and nights.', 'Jonah and the Whale', '{"Moses Red Sea", "David Lion", "Elijah Ravens"}', 'Jonah 1-2', 1),
('d1000000-0000-0000-0000-000000000003', '🚪🐑', 'An angel passed over the homes of the Israelites marked with blood.', 'The Passover', '{"Plagues Egypt", "Red Sea", "Manna Heaven"}', 'Exodus 12', 2),
('d1000000-0000-0000-0000-000000000003', '⛰️📜', 'God gave Moses the Ten Commandments on a mountain.', 'The Ten Commandments', '{"Golden Calf", "Tabernacle", "Ark Covenant"}', 'Exodus 20', 3),
('d1000000-0000-0000-0000-000000000003', '🌙☀️', 'God made the sun stand still for Joshua to complete a battle.', 'Sun Stand Still', '{"Moon Gideon", "Elijah Fire", "Joshua Walls"}', 'Joshua 10:12-14', 4),
('d1000000-0000-0000-0000-000000000003', '🧸🐻', 'Elisha cursed some boys who mocked him, and two bears came out.', 'Elisha and the Bears', '{"Elijah Ravens", "Samson Lion", "Daniel Lions"}', '2 Kings 2:23-25', 5),
('d1000000-0000-0000-0000-000000000003', '🏰🎺', 'Gideon defeated the Midianites with only 300 men and trumpets.', 'Gideon Army', '{"Samson Lion", "David Goliath", "Joshua Walls"}', 'Judges 7', 6),
('d1000000-0000-0000-0000-000000000003', '🗡️💀', 'Samson pushed down the pillars of a temple, killing himself and his enemies.', 'Samson and Delilah', '{"David Goliath", "Joshua Walls", "Gideon Army"}', 'Judges 16:23-30', 7);

-- Parables of Jesus (8 questions)
insert into story_questions (quiz_id, emoji_clue, description, correct_story, wrong_stories, reference, order_index) values
('d1000000-0000-0000-0000-000000000004', '🌱🌾', 'A farmer sowed seeds that fell on different types of ground.', 'The Parable of the Sower', '{"Mustard Seed", "Good Samaritan", "Prodigal Son"}', 'Matthew 13:3-9', 0),
('d1000000-0000-0000-0000-000000000004', '🧑‍⚖️⚖️', 'A woman searched her house for a lost coin and celebrated when she found it.', 'The Parable of the Lost Coin', '{"Prodigal Son", "Good Samaritan", "Talents"}', 'Luke 15:8-10', 1),
('d1000000-0000-0000-0000-000000000004', '🧑‍🦽🤕', 'A traveler was helped by a Samaritan after being robbed and beaten.', 'The Good Samaritan', '{"Prodigal Son", "Sheep Lost", "Wise Foolish"}', 'Luke 10:25-37', 2),
('d1000000-0000-0000-0000-000000000004', '👦💰', 'A son demanded his inheritance, squandered it, and returned home repentant.', 'The Prodigal Son', '{"Good Samaritan", "Lost Sheep", "Talents"}', 'Luke 15:11-32', 3),
('d1000000-0000-0000-0000-000000000004', '🌱🌳', 'A mustard seed grew into a large tree where birds could nest.', 'The Parable of the Mustard Seed', '{"Sower", "Yeast", "Fig Tree"}', 'Matthew 13:31-32', 4),
('d1000000-0000-0000-0000-000000000004', '🧑‍🌾🌾', 'A landowner hired workers at different hours but paid them all the same.', 'The Workers in the Vineyard', '{"Talents", "Sower", "Sheep Goats"}', 'Matthew 20:1-16', 5),
('d1000000-0000-0000-0000-000000000004', '🧑‍⚖️🐑', 'The king separated the sheep from the goats at the final judgment.', 'The Sheep and the Goats', '{"Workers Vineyard", "Talents", "Wise Foolish"}', 'Matthew 25:31-46', 6),
('d1000000-0000-0000-0000-000000000004', '🧑‍🏫💰', 'A master gave three servants different amounts of money to manage.', 'The Parable of the Talents', '{"Sheep Goats", "Workers Vineyard", "Prodigal Son"}', 'Matthew 25:14-30', 7);

-- Heroes of Faith (8 questions)
insert into story_questions (quiz_id, emoji_clue, description, correct_story, wrong_stories, reference, order_index) values
('d1000000-0000-0000-0000-000000000005', '⭐👴', 'An old man believed God would give him a son in his old age.', 'Abraham', '{"Moses", "Noah", "David"}', 'Genesis 15:5-6', 0),
('d1000000-0000-0000-0000-000000000005', '🚢🌍', 'A man built an ark to save his family and the animals from a flood.', 'Noah', '{"Abraham", "Moses", "Joshua"}', 'Genesis 6:13-22', 1),
('d1000000-0000-0000-0000-000000000005', '🔥🔥', 'A prophet challenged 450 prophets of Baal and called down fire from heaven.', 'Elijah', '{"Elisha", "Isaiah", "Jeremiah"}', '1 Kings 18:20-39', 2),
('d1000000-0000-0000-0000-000000000005', '🦇🪨', 'A young man defeated a giant with a sling and a stone.', 'David', '{"Samson", "Gideon", "Joshua"}', '1 Samuel 17:45-50', 3),
('d1000000-0000-0000-0000-000000000005', '🦁⚔️', 'A man killed a lion with his bare hands and later killed a thousand men.', 'Samson', '{"David", "Gideon", "Joshua"}', 'Judges 14:5-6', 4),
('d1000000-0000-0000-0000-000000000005', '🚶🌊', 'A man led the Israelites across the Jordan River on dry ground.', 'Joshua', '{"Moses", "Caleb", "Gideon"}', 'Joshua 3:14-17', 5),
('d1000000-0000-0000-0000-000000000005', '👧📖', 'A young Jewish girl became queen and saved her people from destruction.', 'Esther', '{"Ruth", "Deborah", "Hannah"}', 'Esther 4:14-16', 6),
('d1000000-0000-0000-0000-000000000005', '👩‍👦🙏', 'A barren woman prayed for a son and dedicated him to the Lord.', 'Hannah', '{"Sarah", "Rebecca", "Rachel"}', '1 Samuel 1:9-20', 7);

-- 5. BIBLE TRIVIA TOWER SEED
insert into trivia_towers (id, title, xp_reward_per_floor, total_floors) values
('e1000000-0000-0000-0000-000000000001', 'Beginner Tower', 10, 5),
('e1000000-0000-0000-0000-000000000002', 'Advanced Tower', 15, 5),
('e1000000-0000-0000-0000-000000000003', 'Master Tower', 20, 5);

insert into trivia_floors (tower_id, floor_number, floor_title, difficulty, xp_bonus) values
('e1000000-0000-0000-0000-000000000001', 1, 'Creation Floor', 'easy', 5),
('e1000000-0000-0000-0000-000000000001', 2, 'Patriarchs Floor', 'medium', 10),
('e1000000-0000-0000-0000-000000000001', 3, 'Exodus Floor', 'hard', 15),
('e1000000-0000-0000-0000-000000000001', 4, 'Judges Floor', 'medium', 10),
('e1000000-0000-0000-0000-000000000001', 5, 'Kings Floor', 'hard', 15),
('e1000000-0000-0000-0000-000000000002', 1, 'Gospels Floor', 'medium', 10),
('e1000000-0000-0000-0000-000000000002', 2, 'Acts Floor', 'medium', 10),
('e1000000-0000-0000-0000-000000000002', 3, 'Epistles Floor', 'hard', 15),
('e1000000-0000-0000-0000-000000000002', 4, 'Letters Floor', 'hard', 15),
('e1000000-0000-0000-0000-000000000002', 5, 'Prophecy Floor', 'expert', 20),
('e1000000-0000-0000-0000-000000000003', 1, 'OT Survey Floor', 'medium', 10),
('e1000000-0000-0000-0000-000000000003', 2, 'NT Survey Floor', 'hard', 15),
('e1000000-0000-0000-0000-000000000003', 3, 'Theology Floor', 'expert', 20),
('e1000000-0000-0000-0000-000000000003', 4, 'Church History Floor', 'expert', 20),
('e1000000-0000-0000-0000-000000000003', 5, 'Masters Challenge', 'master', 25);

-- Beginner Tower Questions
-- Floor 1: Creation (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 1), 'How many days did God take to create the world?', 'Six', '{"Seven", "Five", "Four"}', 'Genesis 1', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 1), 'What did God create on the first day?', 'Light', '{"Sky", "Land", "Animals"}', 'Genesis 1:3', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 1), 'Who was the first man?', 'Adam', '{"Noah", "Abraham", "Moses"}', 'Genesis 2:7', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 1), 'What did God create on the fourth day?', 'Sun, moon, and stars', '{"Animals", "Land", "Sea creatures"}', 'Genesis 1:14-19', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 1), 'What did God create on the sixth day?', 'Land animals and humans', '{"Fish", "Birds", "Plants"}', 'Genesis 1:24-31', 4);

-- Floor 2: Patriarchs (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 2), 'Who was called the father of many nations?', 'Abraham', '{"Isaac", "Jacob", "David"}', 'Genesis 17:4', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 2), 'Who had a coat of many colors?', 'Joseph', '{"Benjamin", "Judah", "Levi"}', 'Genesis 37:3', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 2), 'Who wrestled with God?', 'Jacob', '{"Moses", "Abraham", "Isaac"}', 'Genesis 32:24', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 2), 'Who was sacrificed on Mount Moriah?', 'Isaac', '{"Jacob", "Joseph", "Benjamin"}', 'Genesis 22:1-14', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 2), 'Who did Abraham send away at age 100?', 'Ishmael', '{"Isaac", "Jacob", "Esau"}', 'Genesis 21:14', 4);

-- Floor 3: Exodus (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 3), 'What sea did Moses part?', 'Red Sea', '{"Jordan River", "Sea of Galilee", "Mediterranean"}', 'Exodus 14:21', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 3), 'How many plagues did God send on Egypt?', 'Ten', '{"Seven", "Three", "Five"}', 'Exodus 7-12', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 3), 'How many commandments were given?', 'Ten', '{"Seven", "Twelve", "Five"}', 'Exodus 20', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 3), 'What did the Israelites eat in the wilderness?', 'Manna', '{"Bread", "Fish", "Meat"}', 'Exodus 16', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 3), 'What was the golden idol the Israelites made?', 'Golden Calf', '{"Golden Snake", "Golden Lion", "Golden Eagle"}', 'Exodus 32', 4);

-- Floor 4: Judges (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 4), 'Who killed the Canaanite general Sisera?', 'Deborah', '{"Ruth", "Esther", "Hannah"}', 'Judges 4:17-22', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 4), 'Who had a Nazirite vow from birth?', 'Samson', '{"Gideon", "Jephthah", "Samuel"}', 'Judges 13:5', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 4), 'Who tested God with a fleece?', 'Gideon', '{"Samson", "Jephthah", "Samuel"}', 'Judges 6:36-40', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 4), 'Who was a judge and the last prophet of the Old Testament era?', 'Samuel', '{"Gideon", "Samson", "Eli"}', '1 Samuel 3', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 4), 'Who vowed to sacrifice whatever came out of his house?', 'Jephthah', '{"Gideon", "Samson", "Samuel"}', 'Judges 11:30-31', 4);

-- Floor 5: Kings (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 5), 'Who was the first king of Israel?', 'Saul', '{"David", "Solomon", "Samuel"}', '1 Samuel 10:1', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 5), 'Who built the first temple in Jerusalem?', 'Solomon', '{"David", "Saul", "Ahab"}', '1 Kings 6:1', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 5), 'Who was the wisest man who ever lived?', 'Solomon', '{"David", "Daniel", "Isaiah"}', '1 Kings 4:30', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 5), 'Which king was known for his great fall and repentance?', 'David', '{"Saul", "Solomon", "Ahab"}', '2 Samuel 12:1-14', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 5), 'Who was the wicked wife of King Ahab?', 'Jezebel', '{"Bathsheba", "Esther", "Delilah"}', '1 Kings 16:31', 4);

-- Advanced Tower Questions
-- Floor 1: Gospels (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 1), 'Where was Jesus born?', 'Bethlehem', '{"Nazareth", "Jerusalem", "Capernaum"}', 'Luke 2:4', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 1), 'How many disciples did Jesus choose?', 'Twelve', '{"Ten", "Seven", "Thirteen"}', 'Mark 3:14', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 1), 'What is the shortest verse in the Bible?', 'Jesus wept', '{"Pray without ceasing", "God is love", "Rejoice always"}', 'John 11:35', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 1), 'At what age did Jesus begin his public ministry?', 'Thirty', '{"Thirty-three", "Twenty-five", "Forty"}', 'Luke 3:23', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 1), 'How long did Jesus fast in the wilderness?', 'Forty days', '{"Thirty days", "Twenty days", "Seven days"}', 'Matthew 4:2', 4);

-- Floor 2: Acts (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 2), 'Who wrote the book of Acts?', 'Luke', '{"Paul", "Peter", "John"}', 'Acts 1:1', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 2), 'What happened at Pentecost?', 'Holy Spirit descended', '{"Jesus ascended", "Paul converted", "Peter arrested"}', 'Acts 2:1-4', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 2), 'Who was the first Christian martyr?', 'Stephen', '{"Paul", "Peter", "James"}', 'Acts 7:59-60', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 2), 'What was Saul doing when he was converted?', 'Persecuting Christians', '{"Preaching", "Praying", "Fasting"}', 'Acts 9:1-2', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 2), 'Who was the first Gentile convert?', 'Cornelius', '{"Lydia", "Titus", "Timothy"}', 'Acts 10', 4);

-- Floor 3: Epistles (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 3), 'Who wrote most of the New Testament?', 'Paul', '{"Peter", "John", "James"}', 'Various epistles', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 3), 'What is the fruit of the Spirit?', 'Love, joy, peace...', '{"Faith, hope, charity", "Wisdom, knowledge, truth", "Grace, mercy, forgiveness"}', 'Galatians 5:22', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 3), 'Which city did Paul write Romans from?', 'Corinth', '{"Athens", "Ephesus", "Philippi"}', 'Romans 16:23', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 3), 'Which epistle is known as the epistle of joy?', 'Philippians', '{"Ephesians", "Colossians", "Thessalonians"}', 'Philippians 4:4', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 3), 'What did Paul say about love in 1 Corinthians 13?', 'Love never fails', '{"Love is patient", "Love is kind", "Love is blind"}', '1 Corinthians 13:8', 4);

-- Floor 4: Letters (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 4), 'To which church did Paul write about the armor of God?', 'Ephesus', '{"Corinth", "Philippi", "Thessalonica"}', 'Ephesians 6:10-18', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 4), 'Which letter was written to a slave owner?', 'Philemon', '{"Colossians", "Ephesians", "Galatians"}', 'Philemon 1', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 4), 'What was Timothy told about studying the Word?', 'Study to show thyself approved', '{"Preach the Word", "Be instant in season", "Rightly divide the truth"}', '2 Timothy 2:15', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 4), 'Which letter discusses the race of faith?', 'Hebrews', '{"James", "1 Peter", "1 John"}', 'Hebrews 12:1', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 4), 'What does James say about faith without works?', 'It is dead', '{"It is useless", "It is insufficient", "It is incomplete"}', 'James 2:17', 4);

-- Floor 5: Prophecy (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 5), 'How many seals are in Revelation?', 'Seven', '{"Ten", "Five", "Twelve"}', 'Revelation 5-8', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 5), 'What is the new Jerusalem described as?', 'A holy city descending from heaven', '{"A golden temple", "A great mountain", "A river of life"}', 'Revelation 21', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 5), 'Who is the beast in Revelation?', 'A symbol of evil and deception', '{"Satan himself", "The Antichrist", "A fallen angel"}', 'Revelation 13', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 5), 'How many trumpets are in Revelation?', 'Seven', '{"Ten", "Twelve", "Five"}', 'Revelation 8-11', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 5), 'What is the Battle of Armageddon?', 'The final battle between good and evil', '{"A great flood", "The fall of Babylon", "The judgment of the nations"}', 'Revelation 16:16', 4);

-- Master Tower Questions
-- Floor 1: OT Survey (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 1), 'How many books are in the Old Testament?', 'Thirty-nine', '{"Thirty-six", "Forty-two", "Forty-five"}', 'Various', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 1), 'What are the five books of Moses called?', 'The Pentateuch', '{"The Histories", "The Prophets", "The Writings"}', 'Various', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 1), 'Which book comes after Genesis?', 'Exodus', '{"Leviticus", "Numbers", "Deuteronomy"}', 'Various', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 1), 'What is the longest book in the Bible?', 'Psalms', '{"Isaiah", "Jeremiah", "Genesis"}', 'Various', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 1), 'What is the shortest book in the OT?', 'Obadiah', '{"Jonah", "Nahum", "Haggai"}', 'Obadiah 1', 4);

-- Floor 2: NT Survey (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 2), 'How many books are in the New Testament?', 'Twenty-seven', '{"Twenty-six", "Twenty-eight", "Thirty"}', 'Various', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 2), 'Which Gospel is written by a doctor?', 'Luke', '{"Matthew", "Mark", "John"}', 'Colossians 4:14', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 2), 'What book comes after the Gospels?', 'Acts', '{"Romans", "James", "1 Thessalonians"}', 'Various', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 2), 'Which book is the last in the NT?', 'Revelation', '{"Jude", "2 Peter", "1 John"}', 'Various', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 2), 'Which book is known as the Apocalypse?', 'Revelation', '{"Daniel", "Ezekiel", "Isaiah"}', 'Revelation 1:1', 4);

-- Floor 3: Theology (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 3), 'What is the doctrine of the Trinity?', 'God in three persons', '{"Three separate gods", "Three modes of God", "Three aspects of God"}', 'Various', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 3), 'What does justification mean?', 'Being declared righteous', '{"Being made righteous", "Being forgiven", "Being sanctified"}', 'Romans 5:1', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 3), 'What is sanctification?', 'Being set apart for God', '{"Being forgiven", "Being justified", "Being glorified"}', '1 Thessalonians 4:3', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 3), 'What is the Great Commission?', 'To make disciples of all nations', '{"To build churches", "To heal the sick", "To feed the poor"}', 'Matthew 28:19-20', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 3), 'What is the gospel?', 'The good news of salvation', '{"The teachings of Jesus", "The laws of Moses", "The prophecies of old"}', 'Various', 4);

-- Floor 4: Church History (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 4), 'When was the Council of Nicaea?', '325 AD', '{"280 AD", "380 AD", "451 AD"}', 'Church History', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 4), 'Who was the first emperor to legalize Christianity?', 'Constantine', '{"Nero", "Diocletian", "Augustus"}', 'Church History', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 4), 'What was the Protestant Reformation about?', 'Returning to Scripture', '{"Building new churches", "Creating new denominations", "Following tradition"}', 'Church History', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 4), 'Who posted the 95 Theses?', 'Martin Luther', '{"John Calvin", "John Wesley", "Charles Spurgeon"}', 'Church History', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 4), 'What movement emphasized personal conversion and evangelism?', 'Great Awakening', '{"Reformation", "Renaissance", "Enlightenment"}', 'Church History', 4);

-- Floor 5: Masters Challenge (5 questions)
insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 5), 'What is the Hebrew word for God?', 'Elohim', '{"Yahweh", "Adonai", "Jehovah"}', 'Genesis 1:1', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 5), 'What is the Greek word for gospel?', 'Euangelion', '{"Logos", "Agape", "Koinonia"}', 'Various', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 5), 'How many parables did Jesus tell according to some scholars?', 'About forty', '{"About thirty", "About fifty", "About twenty"}', 'Various', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 5), 'What is the central message of Christianity?', 'Jesus is Lord', '{"Love one another", "Follow the commandments", "Be good people"}', 'Romans 10:9', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 5), 'What is the ultimate hope of believers?', 'Eternal life with God', '{"A better world", "Peace on earth", "Personal happiness"}', 'John 3:16', 4);

-- 6. BIBLE BEE SEED
insert into bible_bee_challenges (id, title, difficulty, xp_reward_per_word) values
('f1000000-0000-0000-0000-000000000001', 'Faith Words', 'easy', 5),
('f1000000-0000-0000-0000-000000000002', 'Scripture Terms', 'medium', 8),
('f1000000-0000-0000-0000-000000000003', 'Deep Dive Words', 'hard', 10),
('f1000000-0000-0000-0000-000000000004', 'Names of God', 'medium', 8),
('f1000000-0000-0000-0000-000000000005', 'Spiritual Warfare', 'hard', 10);

-- Faith Words (10 words)
insert into bible_bee_words (challenge_id, word, hint, order_index) values
('f1000000-0000-0000-0000-000000000001', 'Grace', 'Unmerited favor from God', 0),
('f1000000-0000-0000-0000-000000000001', 'Faith', 'The substance of things hoped for', 1),
('f1000000-0000-0000-0000-000000000001', 'Mercy', 'Compassion shown to the guilty', 2),
('f1000000-0000-0000-0000-000000000001', 'Hope', 'Confident expectation', 3),
('f1000000-0000-0000-0000-000000000001', 'Prayer', 'Communication with God', 4),
('f1000000-0000-0000-0000-000000000001', 'Worship', 'Giving God praise and honor', 5),
('f1000000-0000-0000-0000-000000000001', 'Repent', 'Turning from sin to God', 6),
('f1000000-0000-0000-0000-000000000001', 'Forgive', 'To pardon or release from guilt', 7),
('f1000000-0000-0000-0000-000000000001', 'Believe', 'To trust in God and his word', 8),
('f1000000-0000-0000-0000-000000000001', 'Obey', 'To follow God commands', 9);

-- Scripture Terms (10 words)
insert into bible_bee_words (challenge_id, word, hint, order_index) values
('f1000000-0000-0000-0000-000000000002', 'Redemption', 'Being saved or bought back', 0),
('f1000000-0000-0000-0000-000000000002', 'Atonement', 'Making amends for sin', 1),
('f1000000-0000-0000-0000-000000000002', 'Sanctification', 'Being set apart for God', 2),
('f1000000-0000-0000-0000-000000000002', 'Justification', 'Being declared righteous', 3),
('f1000000-0000-0000-0000-000000000002', 'Gospel', 'The good news of Jesus', 4),
('f1000000-0000-0000-0000-000000000002', 'Covenant', 'A binding agreement with God', 5),
('f1000000-0000-0000-0000-000000000002', 'Disciple', 'A follower of Jesus', 6),
('f1000000-0000-0000-0000-000000000002', 'Parable', 'An earthly story with a heavenly meaning', 7),
('f1000000-0000-0000-0000-000000000002', 'Prophecy', 'A prediction or message from God', 8),
('f1000000-0000-0000-0000-000000000002', 'Wisdom', 'The ability to discern right from wrong', 9);

-- Deep Dive Words (10 words)
insert into bible_bee_words (challenge_id, word, hint, order_index) values
('f1000000-0000-0000-0000-000000000003', 'Propitiation', 'Sacrifice that satisfies Gods wrath', 0),
('f1000000-0000-0000-0000-000000000003', 'Imputation', 'Christ righteousness credited to us', 1),
('f1000000-0000-0000-0000-000000000003', 'Perseverance', 'Continuing under trial', 2),
('f1000000-0000-0000-0000-000000000003', 'Eschatology', 'The study of end times', 3),
('f1000000-0000-0000-0000-000000000003', 'Soteriology', 'The doctrine of salvation', 4),
('f1000000-0000-0000-0000-000000000003', 'Pneumatology', 'The study of the Holy Spirit', 5),
('f1000000-0000-0000-0000-000000000003', 'Christology', 'The study of Christ', 6),
('f1000000-0000-0000-0000-000000000003', 'Hermeneutics', 'The science of interpretation', 7),
('f1000000-0000-0000-0000-000000000003', 'Exegesis', 'Critical explanation of scripture', 8),
('f1000000-0000-0000-0000-000000000003', 'Epistemology', 'The theory of knowledge', 9);

-- Names of God (10 words)
insert into bible_bee_words (challenge_id, word, hint, order_index) values
('f1000000-0000-0000-0000-000000000004', 'Jehovah', 'The self-existent one', 0),
('f1000000-0000-0000-0000-000000000004', 'Elohim', 'The creator God', 1),
('f1000000-0000-0000-0000-000000000004', 'El Shaddai', 'God Almighty', 2),
('f1000000-0000-0000-0000-000000000004', 'Adonai', 'Lord and master', 3),
('f1000000-0000-0000-0000-000000000004', 'Jehovah Jireh', 'The Lord will provide', 4),
('f1000000-0000-0000-0000-000000000004', 'Jehovah Rapha', 'The Lord who heals', 5),
('f1000000-0000-0000-0000-000000000004', 'Jehovah Shalom', 'The Lord is peace', 6),
('f1000000-0000-0000-0000-000000000004', 'Jehovah Nissi', 'The Lord is my banner', 7),
('f1000000-0000-0000-0000-000000000004', 'Jehovah Rohi', 'The Lord is my shepherd', 8),
('f1000000-0000-0000-0000-000000000004', 'Jehovah Tsidkenu', 'The Lord our righteousness', 9);

-- Spiritual Warfare (10 words)
insert into bible_bee_words (challenge_id, word, hint, order_index) values
('f1000000-0000-0000-0000-000000000005', 'Armor of God', 'Spiritual protection for believers', 0),
('f1000000-0000-0000-0000-000000000005', 'Spiritual gifts', 'Abilities given by the Holy Spirit', 1),
('f1000000-0000-0000-0000-000000000005', 'Fruit of Spirit', 'Character traits produced by the Spirit', 2),
('f1000000-0000-0000-0000-000000000005', 'Word of God', 'The sword of the Spirit', 3),
('f1000000-0000-0000-0000-000000000005', 'Prayer warrior', 'One who fights in prayer', 4),
('f1000000-0000-0000-0000-000000000005', 'Spiritual authority', 'Power given by God to believers', 5),
('f1000000-0000-0000-0000-000000000005', 'Blood of Jesus', 'The means of redemption', 6),
('f1000000-0000-0000-0000-000000000005', 'Name of Jesus', 'Power to cast out demons', 7),
('f1000000-0000-0000-0000-000000000005', 'Holy Spirit', 'The comforter and guide', 8),
('f1000000-0000-0000-0000-000000000005', 'Faith shield', 'Quenching all the fiery darts', 9);

-- 7. FAMILY TREE BUILDER SEED
insert into family_tree_challenges (id, title, xp_reward_per_connection) values
('g1000000-0000-0000-0000-000000000001', 'Abrahams Family', 5),
('g1000000-0000-0000-0000-000000000002', 'Davids Family', 5),
('g1000000-0000-0000-0000-000000000003', 'Jacobs Twelve Sons', 5),
('g1000000-0000-0000-0000-000000000004', 'Jesus Lineage', 5);

-- Abrahams Family (8 connections)
insert into family_tree_connections (challenge_id, character1, relationship, character2, wrong_character2, reference, order_index) values
('g1000000-0000-0000-0000-000000000001', 'Abraham', 'father of', 'Isaac', '{"Ishmael", "Jacob", "Esau"}', 'Genesis 21:3', 0),
('g1000000-0000-0000-0000-000000000001', 'Abraham', 'father of', 'Ishmael', '{"Isaac", "Jacob", "Esau"}', 'Genesis 16:15', 1),
('g1000000-0000-0000-0000-000000000001', 'Isaac', 'father of', 'Jacob', '{"Esau", "Ishmael", "Joseph"}', 'Genesis 25:26', 2),
('g1000000-0000-0000-0000-000000000001', 'Isaac', 'father of', 'Esau', '{"Jacob", "Joseph", "Benjamin"}', 'Genesis 25:25', 3),
('g1000000-0000-0000-0000-000000000001', 'Jacob', 'father of', 'Joseph', '{"Benjamin", "Judah", "Levi"}', 'Genesis 30:24', 4),
('g1000000-0000-0000-0000-000000000001', 'Jacob', 'father of', 'Judah', '{"Joseph", "Levi", "Reuben"}', 'Genesis 29:35', 5),
('g1000000-0000-0000-0000-000000000001', 'Sarah', 'mother of', 'Isaac', '{"Ishmael", "Jacob", "Esau"}', 'Genesis 21:2', 6),
('g1000000-0000-0000-0000-000000000001', 'Hagar', 'mother of', 'Ishmael', '{"Isaac", "Jacob", "Esau"}', 'Genesis 16:15', 7);

-- Davids Family (8 connections)
insert into family_tree_connections (challenge_id, character1, relationship, character2, wrong_character2, reference, order_index) values
('g1000000-0000-0000-0000-000000000002', 'Jesse', 'father of', 'David', '{"Saul", "Jonathan", "Samuel"}', '1 Samuel 16:10', 0),
('g1000000-0000-0000-0000-000000000002', 'David', 'father of', 'Solomon', '{"Absalom", "Adonijah", "Amnon"}', '2 Samuel 12:24', 1),
('g1000000-0000-0000-0000-000000000002', 'David', 'father of', 'Absalom', '{"Solomon", "Adonijah", "Amnon"}', '2 Samuel 3:3', 2),
('g1000000-0000-0000-0000-000000000002', 'Solomon', 'father of', 'Rehoboam', '{"Abijah", "Asa", "Jehoshaphat"}', '1 Kings 11:43', 3),
('g1000000-0000-0000-0000-000000000002', 'David', 'husband of', 'Bathsheba', '{"Michal", "Abigail", "Ahinoam"}', '2 Samuel 11:27', 4),
('g1000000-0000-0000-0000-000000000002', 'Saul', 'father of', 'Jonathan', '{"David", "Solomon", "Absalom"}', '1 Samuel 14:1', 5),
('g1000000-0000-0000-0000-000000000002', 'Rehoboam', 'father of', 'Abijah', '{"Asa", "Jehoshaphat", "Joram"}', '1 Kings 14:31', 6),
('g1000000-0000-0000-0000-000000000002', 'Abijah', 'father of', 'Asa', '{"Jehoshaphat", "Joram", "Ahaziah"}', '1 Kings 15:1', 7);

-- Jacobs Twelve Sons (8 connections)
insert into family_tree_connections (challenge_id, character1, relationship, character2, wrong_character2, reference, order_index) values
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Reuben', '{"Simeon", "Levi", "Judah"}', 'Genesis 29:32', 0),
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Simeon', '{"Reuben", "Levi", "Judah"}', 'Genesis 29:33', 1),
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Levi', '{"Reuben", "Simeon", "Judah"}', 'Genesis 29:34', 2),
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Judah', '{"Reuben", "Simeon", "Levi"}', 'Genesis 29:35', 3),
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Joseph', '{"Benjamin", "Dan", "Naphtali"}', 'Genesis 30:24', 4),
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Benjamin', '{"Joseph", "Dan", "Naphtali"}', 'Genesis 35:18', 5),
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Dan', '{"Naphtali", "Gad", "Asher"}', 'Genesis 30:6', 6),
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Gad', '{"Asher", "Dan", "Naphtali"}', 'Genesis 30:11', 7);

-- Jesus Lineage (8 connections)
insert into family_tree_connections (challenge_id, character1, relationship, character2, wrong_character2, reference, order_index) values
('g1000000-0000-0000-0000-000000000004', 'Abraham', 'ancestor of', 'David', '{"Moses", "Joshua", "Solomon"}', 'Matthew 1:1-6', 0),
('g1000000-0000-0000-0000-000000000004', 'David', 'ancestor of', 'Joseph', '{"Peter", "James", "John"}', 'Matthew 1:1-16', 1),
('g1000000-0000-0000-0000-000000000004', 'Joseph', 'father of', 'Jesus', '{"Peter", "James", "John"}', 'Matthew 1:16', 2),
('g1000000-0000-0000-0000-000000000004', 'Mary', 'mother of', 'Jesus', '{"Elizabeth", "Hannah", "Ruth"}', 'Luke 1:30-35', 3),
('g1000000-0000-0000-0000-000000000004', 'Jesse', 'ancestor of', 'David', '{"Saul", "Solomon", "Jonathan"}', 'Ruth 4:17-22', 4),
('g1000000-0000-0000-0000-000000000004', 'Jacob', 'ancestor of', 'Joseph', '{"Abraham", "Isaac", "Moses"}', 'Matthew 1:16', 5),
('g1000000-0000-0000-0000-000000000004', 'Boaz', 'ancestor of', 'Jesse', '{"Saul", "Solomon", "Jonathan"}', 'Ruth 4:17-22', 6),
('g1000000-0000-0000-0000-000000000004', 'Obed', 'ancestor of', 'Jesse', '{"Ruth", "Naomi", "Samuel"}', 'Ruth 4:17-22', 7);

-- 8. BIBLE PROMISE MATCH SEED
insert into promise_match_challenges (id, title, description, difficulty, xp_reward_per_match) values
('h1000000-0000-0000-0000-000000000001', 'Old Testament Promises', 'Match promises from the Old Testament to their references.', 'easy', 5),
('h1000000-0000-0000-0000-000000000002', 'New Testament Promises', 'Match promises from the New Testament to their references.', 'medium', 8),
('h1000000-0000-0000-0000-000000000003', 'Comfort Promises', 'Find comfort in these Bible promises.', 'hard', 10),
('h1000000-0000-0000-0000-000000000004', 'Protection Promises', 'God promises to protect his people.', 'medium', 8),
('h1000000-0000-0000-0000-000000000005', 'Provision Promises', 'God promises to provide for his people.', 'hard', 10);

-- Old Testament Promises (6 promises)
insert into promise_match_pairs (challenge_id, promise_text, correct_reference, wrong_references, order_index) values
('h1000000-0000-0000-0000-000000000001', 'I will make you a great nation.', 'Genesis 12:2', '{"Genesis 15:1", "Genesis 17:6", "Genesis 28:14"}', 0),
('h1000000-0000-0000-0000-000000000001', 'I will never leave you nor forsake you.', 'Deuteronomy 31:6', '{"Joshua 1:5", "Hebrews 13:5", "Psalm 37:28"}', 1),
('h1000000-0000-0000-0000-000000000001', 'The Lord will fight for you; you need only to be still.', 'Exodus 14:14', '{"Numbers 14:14", "Deuteronomy 20:4", "Isaiah 30:15"}', 2),
('h1000000-0000-0000-0000-000000000001', 'You shall be my treasured possession.', 'Exodus 19:5', '{"Deuteronomy 7:6", "1 Peter 2:9", "Malachi 3:17"}', 3),
('h1000000-0000-0000-0000-000000000001', 'I will give you rest.', 'Exodus 33:14', '{"Matthew 11:28", "Joshua 1:13", "2 Chronicles 15:2"}', 4),
('h1000000-0000-0000-0000-000000000001', 'A land flowing with milk and honey.', 'Exodus 3:8', '{"Leviticus 20:24", "Numbers 14:8", "Deuteronomy 6:3"}', 5);

-- New Testament Promises (6 promises)
insert into promise_match_pairs (challenge_id, promise_text, correct_reference, wrong_references, order_index) values
('h1000000-0000-0000-0000-000000000002', 'All things work together for good.', 'Romans 8:28', '{"Philippians 1:6", "2 Corinthians 4:17", "James 1:2"}', 0),
('h1000000-0000-0000-0000-000000000002', 'My grace is sufficient for you.', '2 Corinthians 12:9', '{"Philippians 4:13", "2 Timothy 1:12", "Hebrews 4:16"}', 1),
('h1000000-0000-0000-0000-000000000002', 'God will supply every need.', 'Philippians 4:19', '{"Matthew 6:31-33", "Luke 12:30", "Psalm 84:11"}', 2),
('h1000000-0000-0000-0000-000000000002', 'No temptation has overtaken you except what is common.', '1 Corinthians 10:13', '{"James 1:2", "2 Peter 2:9", "Hebrews 2:18"}', 3),
('h1000000-0000-0000-0000-000000000002', 'I can do all things through him who strengthens me.', 'Philippians 4:13', '{"2 Corinthians 12:9", "Isaiah 40:31", "Psalm 37:4"}', 4),
('h1000000-0000-0000-0000-000000000002', 'He who began a good work in you will carry it on to completion.', 'Philippians 1:6', '{"2 Corinthians 5:17", "Romans 8:28", "Ephesians 2:10"}', 5);

-- Comfort Promises (6 promises)
insert into promise_match_pairs (challenge_id, promise_text, correct_reference, wrong_references, order_index) values
('h1000000-0000-0000-0000-000000000003', 'Come to me, all you who are weary and burdened.', 'Matthew 11:28', '{"Psalm 55:22", "1 Peter 5:7", "Isaiah 40:31"}', 0),
('h1000000-0000-0000-0000-000000000003', 'Cast all your anxiety on him because he cares for you.', '1 Peter 5:7', '{"Philippians 4:6-7", "Psalm 37:5", "Proverbs 3:5-6"}', 1),
('h1000000-0000-0000-0000-000000000003', 'He gives strength to the weary.', 'Isaiah 40:29', '{"Psalm 73:26", "2 Corinthians 12:9", "Isaiah 41:10"}', 2),
('h1000000-0000-0000-0000-000000000003', 'The Lord is close to the brokenhearted.', 'Psalm 34:18', '{"Psalm 147:3", "Psalm 55:22", "Isaiah 61:1"}', 3),
('h1000000-0000-0000-0000-000000000003', 'He heals the brokenhearted and binds up their wounds.', 'Psalm 147:3', '{"Psalm 34:18", "Isaiah 61:1", "Jeremiah 30:17"}', 4),
('h1000000-0000-0000-0000-000000000003', 'You will keep in perfect peace those whose minds are steadfast.', 'Isaiah 26:3', '{"Psalm 119:165", "John 14:27", "Philippians 4:7"}', 5);

-- Protection Promises (6 promises)
insert into promise_match_pairs (challenge_id, promise_text, correct_reference, wrong_references, order_index) values
('h1000000-0000-0000-0000-000000000004', 'He will cover you with his feathers.', 'Psalm 91:4', '{"Psalm 91:1", "Psalm 121:7", "Isaiah 54:17"}', 0),
('h1000000-0000-0000-0000-000000000004', 'No weapon formed against you shall prosper.', 'Isaiah 54:17', '{"Psalm 91:4", "Romans 8:31", "2 Timothy 1:7"}', 1),
('h1000000-0000-0000-0000-000000000004', 'The Lord is my refuge and my fortress.', 'Psalm 91:2', '{"Psalm 46:1", "Psalm 121:7", "Isaiah 41:10"}', 2),
('h1000000-0000-0000-0000-000000000004', 'He will command his angels concerning you.', 'Psalm 91:11', '{"Psalm 91:4", "Hebrews 1:14", "Daniel 6:22"}', 3),
('h1000000-0000-0000-0000-000000000004', 'I will be with you when you pass through the waters.', 'Isaiah 43:2', '{"Psalm 23:4", "Joshua 1:9", "Deuteronomy 31:6"}', 4),
('h1000000-0000-0000-0000-000000000004', 'The Lord will keep you from all harm.', 'Psalm 121:7', '{"Psalm 91:3", "Proverbs 2:8", "2 Thessalonians 3:3"}', 5);

-- Provision Promises (6 promises)
insert into promise_match_pairs (challenge_id, promise_text, correct_reference, wrong_references, order_index) values
('h1000000-0000-0000-0000-000000000005', 'My God will meet all your needs.', 'Philippians 4:19', '{"Matthew 6:31-33", "2 Corinthians 9:8", "Psalm 23:1"}', 0),
('h1000000-0000-0000-0000-000000000005', 'The Lord is my shepherd; I shall not want.', 'Psalm 23:1', '{"Psalm 34:10", "Isaiah 55:2", "John 10:10"}', 1),
('h1000000-0000-0000-0000-000000000005', 'Seek first his kingdom and his righteousness.', 'Matthew 6:33', '{"Psalm 37:4", "Proverbs 3:9-10", "Malachi 3:10"}', 2),
('h1000000-0000-0000-0000-000000000005', 'Honor the Lord with your wealth.', 'Proverbs 3:9', '{"Malachi 3:10", "2 Corinthians 9:6", "Deuteronomy 8:18"}', 3),
('h1000000-0000-0000-0000-000000000005', 'Bring the whole tithe into the storehouse.', 'Malachi 3:10', '{"Proverbs 3:9", "2 Corinthians 9:7", "Deuteronomy 14:23"}', 4),
('h1000000-0000-0000-0000-000000000005', 'God is able to bless you abundantly.', '2 Corinthians 9:8', '{"Philippians 4:19", "Ephesians 3:20", "Romans 8:32"}', 5);
