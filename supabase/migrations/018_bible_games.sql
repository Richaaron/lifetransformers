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
('a1000000-0000-0000-0000-000000000001', 'Psalm 23 Memory', 'Memorize the beloved Psalm 23 verse.', 'easy', 10),
('a1000000-0000-0000-0000-000000000002', 'Proverbs Wisdom', 'Recall key Proverbs verses about wisdom.', 'medium', 15),
('a1000000-0000-0000-0000-000000000003', 'New Testament Promises', 'Remember powerful New Testament promises.', 'hard', 20);

insert into verse_memory_questions (challenge_id, verse_text, reference, missing_words, order_index) values
('a1000000-0000-0000-0000-000000000001', 'The Lord is my shepherd; I shall not want.', 'Psalm 23:1', '{"shepherd", "want"}', 0),
('a1000000-0000-0000-0000-000000000001', 'He makes me lie down in green pastures.', 'Psalm 23:2', '{"green", "pastures"}', 1),
('a1000000-0000-0000-0000-000000000001', 'He leads me beside still waters.', 'Psalm 23:2', '{"still", "waters"}', 2),
('a1000000-0000-0000-0000-000000000001', 'He restores my soul.', 'Psalm 23:3', '{"restores", "soul"}', 3),
('a1000000-0000-0000-0000-000000000001', 'He leads me in paths of righteousness for his name sake.', 'Psalm 23:3', '{"paths", "righteousness"}', 4),

('a1000000-0000-0000-0000-000000000002', 'Trust in the Lord with all your heart, and do not lean on your own understanding.', 'Proverbs 3:5', '{"trust", "heart", "understanding"}', 0),
('a1000000-0000-0000-0000-000000000002', 'In all your ways acknowledge him, and he will make straight your paths.', 'Proverbs 3:6', '{"acknowledge", "straight", "paths"}', 1),
('a1000000-0000-0000-0000-000000000002', 'The fear of the Lord is the beginning of wisdom.', 'Proverbs 9:10', '{"fear", "beginning", "wisdom"}', 2),

('a1000000-0000-0000-0000-000000000003', 'For God so loved the world that he gave his only Son.', 'John 3:16', '{"loved", "world", "only Son"}', 0),
('a1000000-0000-0000-0000-000000000003', 'I can do all things through him who strengthens me.', 'Philippians 4:13', '{"all things", "strengthens"}', 1),
('a1000000-0000-0000-0000-000000000003', 'Be strong and courageous. Do not be frightened.', 'Joshua 1:9', '{"strong", "courageous", "frightened"}', 2),
('a1000000-0000-0000-0000-000000000003', 'No weapon formed against you shall prosper.', 'Isaiah 54:17', '{"weapon", "formed", "prosper"}', 3);

-- 2. WHO SAID IT SEED
insert into who_said_it_quizzes (id, title, description, difficulty, xp_reward) values
('b1000000-0000-0000-0000-000000000001', 'Old Testament Speakers', 'Identify who spoke famous Old Testament quotes.', 'easy', 10),
('b1000000-0000-0000-0000-000000000002', 'New Testament Speakers', 'Match New Testament quotes to their speakers.', 'medium', 15),
('b1000000-0000-0000-0000-000000000003', 'Prophets and Kings', 'Test your knowledge of prophetic and royal speeches.', 'hard', 20);

insert into who_said_it_questions (quiz_id, quote, correct_speaker, wrong_speakers, reference, order_index) values
('b1000000-0000-0000-0000-000000000001', 'I am the Lord your God, who brought you out of Egypt.', 'God', '{"Moses", "Abraham", "David"}', 'Exodus 20:2', 0),
('b1000000-0000-0000-0000-000000000001', 'Here I am; send me.', 'Isaiah', '{"Jeremiah", "Elijah", "Moses"}', 'Isaiah 6:8', 1),
('b1000000-0000-0000-0000-000000000001', 'The Lord is my rock, my fortress, and my deliverer.', 'David', '{"Solomon", "Moses", "Joshua"}', 'Psalm 18:2', 2),

('b1000000-0000-0000-0000-000000000002', 'I am the way, the truth, and the life.', 'Jesus', '{"Paul", "Peter", "John"}', 'John 14:6', 0),
('b1000000-0000-0000-0000-000000000002', 'Love is patient, love is kind.', 'Paul', '{"Peter", "John", "Jesus"}', '1 Corinthians 13:4', 1),
('b1000000-0000-0000-0000-000000000002', 'For by grace you have been saved through faith.', 'Paul', '{"Peter", "James", "Jesus"}', 'Ephesians 2:8', 2),

('b1000000-0000-0000-0000-000000000003', 'Behold, I am doing a new thing; now it springs forth.', 'Isaiah', '{"Jeremiah", "Ezekiel", "Daniel"}', 'Isaiah 43:19', 0),
('b1000000-0000-0000-0000-000000000003', 'For I know the plans I have for you, declares the Lord.', 'God', '{"Jeremiah", "Isaiah", "Ezekiel"}', 'Jeremiah 29:11', 1),
('b1000000-0000-0000-0000-000000000003', 'He has told you, O man, what is good.', 'Micah', '{"Isaiah", "Hosea", "Amos"}', 'Micah 6:8', 2);

-- 3. BIBLE BOOKSHELF SEED
insert into bookshelf_challenges (id, title, section, xp_reward) values
('c1000000-0000-0000-0000-000000000001', 'First 5 Books of the Bible', 'old_testament', 15),
('c1000000-0000-0000-0000-000000000002', 'Gospels in Order', 'new_testament', 15),
('c1000000-0000-0000-0000-000000000003', 'Major Prophets', 'old_testament', 20);

insert into bookshelf_books (challenge_id, book_name, correct_order) values
('c1000000-0000-0000-0000-000000000001', 'Genesis', 1),
('c1000000-0000-0000-0000-000000000001', 'Exodus', 2),
('c1000000-0000-0000-0000-000000000001', 'Leviticus', 3),
('c1000000-0000-0000-0000-000000000001', 'Numbers', 4),
('c1000000-0000-0000-0000-000000000001', 'Deuteronomy', 5),

('c1000000-0000-0000-0000-000000000002', 'Matthew', 1),
('c1000000-0000-0000-0000-000000000002', 'Mark', 2),
('c1000000-0000-0000-0000-000000000002', 'Luke', 3),
('c1000000-0000-0000-0000-000000000002', 'John', 4),

('c1000000-0000-0000-0000-000000000003', 'Isaiah', 1),
('c1000000-0000-0000-0000-000000000003', 'Jeremiah', 2),
('c1000000-0000-0000-0000-000000000003', 'Lamentations', 3),
('c1000000-0000-0000-0000-000000000003', 'Ezekiel', 4),
('c1000000-0000-0000-0000-000000000003', 'Daniel', 5);

-- 4. NAME THAT STORY SEED
insert into story_quizzes (id, title, description, difficulty, xp_reward) values
('d1000000-0000-0000-0000-000000000001', 'Famous Bible Stories', 'Identify well-known Bible stories from clues.', 'easy', 10),
('d1000000-0000-0000-0000-000000000002', 'Miracles of Jesus', 'Guess the miracle from the description.', 'medium', 15),
('d1000000-0000-0000-0000-000000000003', 'Old Testament Adventures', 'Identify stories from the Old Testament.', 'hard', 20);

insert into story_questions (quiz_id, emoji_clue, description, correct_story, wrong_stories, reference, order_index) values
('d1000000-0000-0000-0000-000000000001', '🍎🐍', 'A man and woman ate fruit from a forbidden tree and were expelled from a garden.', 'The Fall of Man', '{"Noah Ark", "David Goliath", "Jonah Whale"}', 'Genesis 3', 0),
('d1000000-0000-0000-0000-000000000001', '🌍🌊', 'God sent a great flood to cleanse the earth; one family was saved on a boat.', 'Noah Ark', '{"Tower of Babel", "Sodom Gomorrah", "Moses Red Sea"}', 'Genesis 6-9', 1),
('d1000000-0000-0000-0000-000000000001', '⭐👶', 'Three wise men followed a star to visit a newborn king in Bethlehem.', 'The Nativity', '{"Abraham Sacrifice", "Jacob Ladder", "Joseph Dreams"}', 'Matthew 2', 2),

('d1000000-0000-0000-0000-000000000002', '🍞🐟', 'Jesus fed a huge crowd with just five loaves and two fish.', 'Feeding the 5000', '{"Water to Wine", "Walking Water", "Healing Blind"}', 'John 6:1-14', 0),
('d1000000-0000-0000-0000-000000000002', '🌊🚶', 'Jesus walked on the Sea of Galilee during a storm.', 'Walking on Water', '{"Calming Storm", "Raising Lazarus", "Transfiguration"}', 'Matthew 14:22-33', 1),
('d1000000-0000-0000-0000-000000000002', '🍷💧', 'Jesus turned water into wine at a wedding in Cana.', 'Water to Wine', '{"Feeding 5000", "Healing Leper", "Cursing Fig Tree"}', 'John 2:1-11', 2),

('d1000000-0000-0000-0000-000000000003', '🦁🚫', 'Daniel was thrown into a lions den but emerged unharmed.', 'Daniel in Lions Den', '{"Shadrach Fire", "Joseph Pit", "Moses Bush"}', 'Daniel 6', 0),
('d1000000-0000-0000-0000-000000000003', '🔥🧑‍🤝‍🧑', 'Three men were thrown into a fiery furnace but were protected by God.', 'Shadrach Meshach Abednego', '{"Daniel Lions", "Jonah Whale", "Job Suffering"}', 'Daniel 3', 1),
('d1000000-0000-0000-0000-000000000003', '🐋🚶', 'A prophet was swallowed by a great fish for three days and nights.', 'Jonah and the Whale', '{"Moses Red Sea", "David Lion", "Elijah Ravens"}', 'Jonah 1-2', 2);

-- 5. BIBLE TRIVIA TOWER SEED
insert into trivia_towers (id, title, xp_reward_per_floor, total_floors) values
('e1000000-0000-0000-0000-000000000001', 'Beginner Tower', 10, 3),
('e1000000-0000-0000-0000-000000000002', 'Advanced Tower', 15, 3);

insert into trivia_floors (tower_id, floor_number, floor_title, difficulty, xp_bonus) values
('e1000000-0000-0000-0000-000000000001', 1, 'Creation Floor', 'easy', 5),
('e1000000-0000-0000-0000-000000000001', 2, 'Patriarchs Floor', 'medium', 10),
('e1000000-0000-0000-0000-000000000001', 3, 'Exodus Floor', 'hard', 15),
('e1000000-0000-0000-0000-000000000002', 1, 'Gospels Floor', 'medium', 10),
('e1000000-0000-0000-0000-000000000002', 2, 'Epistles Floor', 'hard', 15),
('e1000000-0000-0000-0000-000000000002', 3, 'Prophecy Floor', 'expert', 20);

insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 1), 'How many days did God take to create the world?', 'Six', '{"Seven", "Five", "Four"}', 'Genesis 1', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 1), 'What did God create on the first day?', 'Light', '{"Sky", "Land", "Animals"}', 'Genesis 1:3', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 1), 'Who was the first man?', 'Adam', '{"Noah", "Abraham", "Moses"}', 'Genesis 2:7', 2),

((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 2), 'Who was called the father of many nations?', 'Abraham', '{"Isaac", "Jacob", "David"}', 'Genesis 17:4', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 2), 'Who had a coat of many colors?', 'Joseph', '{"Benjamin", "Judah", "Levi"}', 'Genesis 37:3', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 2), 'Who wrestled with God?', 'Jacob', '{"Moses", "Abraham", "Isaac"}', 'Genesis 32:24', 2),

((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 3), 'What sea did Moses part?', 'Red Sea', '{"Jordan River", "Sea of Galilee", "Mediterranean"}', 'Exodus 14:21', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 3), 'What did God rain down on Egypt?', 'Plagues', '{"Fire", "Hail only", "Frogs only"}', 'Exodus 7-12', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 3), 'How many commandments were given?', 'Ten', '{"Seven", "Twelve", "Five"}', 'Exodus 20', 2),

((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 1), 'Where was Jesus born?', 'Bethlehem', '{"Nazareth", "Jerusalem", "Capernaum"}', 'Luke 2:4', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 1), 'How many disciples did Jesus choose?', 'Twelve', '{"Ten", "Seven", "Thirteen"}', 'Mark 3:14', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 1), 'What is the shortest verse in the Bible?', 'Jesus wept', '{"Pray without ceasing", "God is love", "Rejoice always"}', 'John 11:35', 2),

((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 2), 'Who wrote most of the New Testament?', 'Paul', '{"Peter", "John", "James"}', 'Various epistles', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 2), 'What is the fruit of the Spirit?', 'Love, joy, peace...', '{"Faith, hope, charity", "Wisdom, knowledge, truth", "Grace, mercy, forgiveness"}', 'Galatians 5:22', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 2), 'Which city did Paul write Romans from?', 'Corinth', '{"Athens", "Ephesus", "Philippi"}', 'Romans 16:23', 2),

((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 3), 'How many seals are in Revelation?', 'Seven', '{"Ten", "Five", "Twelve"}', 'Revelation 5-8', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 3), 'What is the new Jerusalem described as?', 'A holy city descending from heaven', '{"A golden temple", "A great mountain", "A river of life"}', 'Revelation 21', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 3), 'Who is the beast in Revelation?', 'A symbol of evil and deception', '{"Satan himself", "The Antichrist", "A fallen angel"}', 'Revelation 13', 2);

-- 6. BIBLE BEE SEED
insert into bible_bee_challenges (id, title, difficulty, xp_reward_per_word) values
('f1000000-0000-0000-0000-000000000001', 'Faith Words', 'easy', 5),
('f1000000-0000-0000-0000-000000000002', 'Scripture Terms', 'medium', 8),
('f1000000-0000-0000-0000-000000000003', 'Deep Dive Words', 'hard', 10);

insert into bible_bee_words (challenge_id, word, hint, order_index) values
('f1000000-0000-0000-0000-000000000001', 'Grace', 'Unmerited favor from God', 0),
('f1000000-0000-0000-0000-000000000001', 'Faith', 'The substance of things hoped for', 1),
('f1000000-0000-0000-0000-000000000001', 'Mercy', 'Compassion shown to the guilty', 2),
('f1000000-0000-0000-0000-000000000001', 'Hope', 'Confident expectation', 3),

('f1000000-0000-0000-0000-000000000002', 'Redemption', 'Being saved or bought back', 0),
('f1000000-0000-0000-0000-000000000002', 'Atonement', 'Making amends for sin', 1),
('f1000000-0000-0000-0000-000000000002', 'Sanctification', 'Being set apart for God', 2),
('f1000000-0000-0000-0000-000000000002', 'Justification', 'Being declared righteous', 3),

('f1000000-0000-0000-0000-000000000003', 'Propitiation', 'Sacrifice that satisfies Gods wrath', 0),
('f1000000-0000-0000-0000-000000000003', 'Imputation', 'Christ righteousness credited to us', 1),
('f1000000-0000-0000-0000-000000000003', 'Perseverance', 'Continuing under trial', 2),
('f1000000-0000-0000-0000-000000000003', 'Eschatology', 'The study of end times', 3);

-- 7. FAMILY TREE BUILDER SEED
insert into family_tree_challenges (id, title, xp_reward_per_connection) values
('g1000000-0000-0000-0000-000000000001', 'Abrahams Family', 5),
('g1000000-0000-0000-0000-000000000002', 'Davids Family', 5);

insert into family_tree_connections (challenge_id, character1, relationship, character2, wrong_character2, reference, order_index) values
('g1000000-0000-0000-0000-000000000001', 'Abraham', 'father of', 'Isaac', '{"Ishmael", "Jacob", "Esau"}', 'Genesis 21:3', 0),
('g1000000-0000-0000-0000-000000000001', 'Abraham', 'father of', 'Ishmael', '{"Isaac", "Jacob", "Esau"}', 'Genesis 16:15', 1),
('g1000000-0000-0000-0000-000000000001', 'Isaac', 'father of', 'Jacob', '{"Esau", "Ishmael", "Joseph"}', 'Genesis 25:26', 2),
('g1000000-0000-0000-0000-000000000001', 'Isaac', 'father of', 'Esau', '{"Jacob", "Joseph", "Benjamin"}', 'Genesis 25:25', 3),
('g1000000-0000-0000-0000-000000000001', 'Jacob', 'father of', 'Joseph', '{"Benjamin", "Judah", "Levi"}', 'Genesis 30:24', 4),

('g1000000-0000-0000-0000-000000000002', 'David', 'father of', 'Solomon', '{"Absalom", "Adonijah", "Amnon"}', '2 Samuel 12:24', 0),
('g1000000-0000-0000-0000-000000000002', 'David', 'father of', 'Absalom', '{"Solomon", "Adonijah", "Amnon"}', '2 Samuel 3:3', 1),
('g1000000-0000-0000-0000-000000000002', 'Solomon', 'father of', 'Rehoboam', '{"Abijah", "Asa", "Jehoshaphat"}', '1 Kings 11:43', 2),
('g1000000-0000-0000-0000-000000000002', 'Jesse', 'father of', 'David', '{"Saul", "Jonathan", "Samuel"}', '1 Samuel 16:10', 3);

-- 8. BIBLE PROMISE MATCH SEED
insert into promise_match_challenges (id, title, description, difficulty, xp_reward_per_match) values
('h1000000-0000-0000-0000-000000000001', 'Old Testament Promises', 'Match promises from the Old Testament to their references.', 'easy', 5),
('h1000000-0000-0000-0000-000000000002', 'New Testament Promises', 'Match promises from the New Testament to their references.', 'medium', 8),
('h1000000-0000-0000-0000-000000000003', 'Comfort Promises', 'Find comfort in these Bible promises.', 'hard', 10);

insert into promise_match_pairs (challenge_id, promise_text, correct_reference, wrong_references, order_index) values
('h1000000-0000-0000-0000-000000000001', 'I will make you a great nation.', 'Genesis 12:2', '{"Genesis 15:1", "Genesis 17:6", "Genesis 28:14"}', 0),
('h1000000-0000-0000-0000-000000000001', 'I will never leave you nor forsake you.', 'Deuteronomy 31:6', '{"Joshua 1:5", "Hebrews 13:5", "Psalm 37:28"}', 1),
('h1000000-0000-0000-0000-000000000001', 'The Lord will fight for you; you need only to be still.', 'Exodus 14:14', '{"Numbers 14:14", "Deuteronomy 20:4", "Isaiah 30:15"}', 2),

('h1000000-0000-0000-0000-000000000002', 'All things work together for good.', 'Romans 8:28', '{"Philippians 1:6", "2 Corinthians 4:17", "James 1:2"}', 0),
('h1000000-0000-0000-0000-000000000002', 'My grace is sufficient for you.', '2 Corinthians 12:9', '{"Philippians 4:13", "2 Timothy 1:12", "Hebrews 4:16"}', 1),
('h1000000-0000-0000-0000-000000000002', 'God will supply every need.', 'Philippians 4:19', '{"Matthew 6:31-33", "Luke 12:30", "Psalm 84:11"}', 2),

('h1000000-0000-0000-0000-000000000003', 'Come to me, all you who are weary and burdened.', 'Matthew 11:28', '{"Psalm 55:22", "1 Peter 5:7", "Isaiah 40:31"}', 0),
('h1000000-0000-0000-0000-000000000003', 'Cast all your anxiety on him because he cares for you.', '1 Peter 5:7', '{"Philippians 4:6-7", "Psalm 37:5", "Proverbs 3:5-6"}', 1),
('h1000000-0000-0000-0000-000000000003', 'He gives strength to the weary.', 'Isaiah 40:29', '{"Psalm 73:26", "2 Corinthians 12:9", "Isaiah 41:10"}', 2);
