const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envText = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const env = {};
envText.split(/\r?\n/).forEach((line) => {
  const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
  if (match) env[match[1]] = match[2];
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function clearTable(table) {
  const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) {
    throw error;
  }
  console.log(`Cleared ${table}`);
}

async function insertRows(table, rows) {
  const { error } = await supabase.from(table).insert(rows);
  if (error) {
    throw error;
  }
  console.log(`Inserted ${rows.length} rows into ${table}`);
}

(async () => {
  const tablesToClear = [
    'promise_match_pairs',
    'promise_match_challenges',
    'family_tree_connections',
    'family_tree_challenges',
    'bible_bee_words',
    'bible_bee_challenges',
    'trivia_floor_questions',
    'trivia_floors',
    'trivia_towers',
    'story_questions',
    'story_quizzes',
    'bookshelf_books',
    'bookshelf_challenges',
    'who_said_it_questions',
    'who_said_it_quizzes',
    'verse_memory_questions',
    'verse_memory_challenges',
  ];

  for (const table of tablesToClear) {
    await clearTable(table);
  }

  await insertRows('verse_memory_challenges', [
    { id: 'a1000000-0000-0000-0000-000000000001', title: 'Psalm 23 Memory', difficulty: 'easy', xp_reward: 10 },
    { id: 'a1000000-0000-0000-0000-000000000002', title: 'Proverbs Wisdom', difficulty: 'medium', xp_reward: 15 },
    { id: 'a1000000-0000-0000-0000-000000000003', title: 'New Testament Promises', difficulty: 'hard', xp_reward: 20 },
    { id: 'a1000000-0000-0000-0000-000000000004', title: 'Psalms of Comfort', difficulty: 'medium', xp_reward: 15 },
    { id: 'a1000000-0000-0000-0000-000000000005', title: 'Words of Jesus', difficulty: 'hard', xp_reward: 20 },
  ]);

  await insertRows('verse_memory_questions', [
    { challenge_id: 'a1000000-0000-0000-0000-000000000001', verse_text: 'The Lord is my shepherd; I shall not want.', reference: 'Psalm 23:1', missing_words: ['shepherd', 'want'], order_index: 0 },
    { challenge_id: 'a1000000-0000-0000-0000-000000000001', verse_text: 'He makes me lie down in green pastures.', reference: 'Psalm 23:2', missing_words: ['green', 'pastures'], order_index: 1 },
    { challenge_id: 'a1000000-0000-0000-0000-000000000001', verse_text: 'He leads me beside still waters.', reference: 'Psalm 23:2', missing_words: ['still', 'waters'], order_index: 2 },
    { challenge_id: 'a1000000-0000-0000-0000-000000000001', verse_text: 'He restores my soul.', reference: 'Psalm 23:3', missing_words: ['restores', 'soul'], order_index: 3 },
    { challenge_id: 'a1000000-0000-0000-0000-000000000001', verse_text: 'Even though I walk through the valley of the shadow of death, I will fear no evil.', reference: 'Psalm 23:4', missing_words: ['valley', 'shadow', 'death', 'fear'], order_index: 4 },
    { challenge_id: 'a1000000-0000-0000-0000-000000000002', verse_text: 'Trust in the Lord with all your heart, and do not lean on your own understanding.', reference: 'Proverbs 3:5', missing_words: ['trust', 'heart', 'understanding'], order_index: 0 },
    { challenge_id: 'a1000000-0000-0000-0000-000000000002', verse_text: 'In all your ways acknowledge him, and he will make straight your paths.', reference: 'Proverbs 3:6', missing_words: ['acknowledge', 'straight', 'paths'], order_index: 1 },
    { challenge_id: 'a1000000-0000-0000-0000-000000000003', verse_text: 'For God so loved the world that he gave his only Son.', reference: 'John 3:16', missing_words: ['loved', 'world', 'only Son'], order_index: 0 },
    { challenge_id: 'a1000000-0000-0000-0000-000000000003', verse_text: 'I can do all things through him who strengthens me.', reference: 'Philippians 4:13', missing_words: ['all things', 'strengthens'], order_index: 1 },
    { challenge_id: 'a1000000-0000-0000-0000-000000000004', verse_text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.', reference: 'Psalm 34:18', missing_words: ['close', 'brokenhearted', 'saves'], order_index: 0 },
    { challenge_id: 'a1000000-0000-0000-0000-000000000005', verse_text: 'I am the way, the truth, and the life.', reference: 'John 14:6', missing_words: ['way', 'truth', 'life'], order_index: 0 },
  ]);

  await insertRows('who_said_it_quizzes', [
    { id: 'b1000000-0000-0000-0000-000000000001', title: 'Old Testament Speakers', difficulty: 'easy', xp_reward: 10 },
    { id: 'b1000000-0000-0000-0000-000000000002', title: 'New Testament Speakers', difficulty: 'medium', xp_reward: 15 },
    { id: 'b1000000-0000-0000-0000-000000000003', title: 'Prophets and Kings', difficulty: 'hard', xp_reward: 20 },
    { id: 'b1000000-0000-0000-0000-000000000004', title: 'Women of the Bible', difficulty: 'medium', xp_reward: 15 },
    { id: 'b1000000-0000-0000-0000-000000000005', title: 'Famous Last Words', difficulty: 'hard', xp_reward: 20 },
  ]);

  await insertRows('who_said_it_questions', [
    { quiz_id: 'b1000000-0000-0000-0000-000000000001', quote: 'I am the Lord your God, who brought you out of Egypt.', correct_speaker: 'God', wrong_speakers: ['Moses', 'Abraham', 'David'], reference: 'Exodus 20:2', order_index: 0 },
    { quiz_id: 'b1000000-0000-0000-0000-000000000001', quote: 'The Lord is my rock, my fortress, and my deliverer.', correct_speaker: 'David', wrong_speakers: ['Solomon', 'Moses', 'Joshua'], reference: 'Psalm 18:2', order_index: 1 },
    { quiz_id: 'b1000000-0000-0000-0000-000000000001', quote: 'The Lord will fight for you; you need only to be still.', correct_speaker: 'Moses', wrong_speakers: ['Aaron', 'Joshua', 'Caleb'], reference: 'Exodus 14:14', order_index: 2 },
    { quiz_id: 'b1000000-0000-0000-0000-000000000002', quote: 'I am the way, the truth, and the life.', correct_speaker: 'Jesus', wrong_speakers: ['Paul', 'Peter', 'John'], reference: 'John 14:6', order_index: 0 },
    { quiz_id: 'b1000000-0000-0000-0000-000000000002', quote: 'Love is patient, love is kind.', correct_speaker: 'Paul', wrong_speakers: ['Peter', 'John', 'James'], reference: '1 Corinthians 13:4', order_index: 1 },
    { quiz_id: 'b1000000-0000-0000-0000-000000000002', quote: 'You are the Christ, the Son of the living God.', correct_speaker: 'Peter', wrong_speakers: ['John', 'Andrew', 'Thomas'], reference: 'Matthew 16:16', order_index: 2 },
    { quiz_id: 'b1000000-0000-0000-0000-000000000003', quote: 'Behold, I am doing a new thing; now it springs forth.', correct_speaker: 'Isaiah', wrong_speakers: ['Jeremiah', 'Ezekiel', 'Daniel'], reference: 'Isaiah 43:19', order_index: 0 },
    { quiz_id: 'b1000000-0000-0000-0000-000000000004', quote: 'Where you go I will go, and where you stay I will stay.', correct_speaker: 'Ruth', wrong_speakers: ['Naomi', 'Esther', 'Hannah'], reference: 'Ruth 1:16', order_index: 0 },
    { quiz_id: 'b1000000-0000-0000-0000-000000000005', quote: 'I have fought the good fight, I have finished the race, I have kept the faith.', correct_speaker: 'Paul', wrong_speakers: ['Peter', 'John', 'James'], reference: '2 Timothy 4:7', order_index: 0 },
  ]);

  await insertRows('bookshelf_challenges', [
    { id: 'c1000000-0000-0000-0000-000000000001', title: 'First 5 Books of the Bible', section: 'old_testament', xp_reward: 15 },
    { id: 'c1000000-0000-0000-0000-000000000002', title: 'Gospels in Order', section: 'new_testament', xp_reward: 15 },
    { id: 'c1000000-0000-0000-0000-000000000003', title: 'Major Prophets', section: 'old_testament', xp_reward: 20 },
  ]);

  await insertRows('bookshelf_books', [
    { challenge_id: 'c1000000-0000-0000-0000-000000000001', book_name: 'Genesis', correct_order: 1 },
    { challenge_id: 'c1000000-0000-0000-0000-000000000001', book_name: 'Exodus', correct_order: 2 },
    { challenge_id: 'c1000000-0000-0000-0000-000000000001', book_name: 'Leviticus', correct_order: 3 },
    { challenge_id: 'c1000000-0000-0000-0000-000000000001', book_name: 'Numbers', correct_order: 4 },
    { challenge_id: 'c1000000-0000-0000-0000-000000000001', book_name: 'Deuteronomy', correct_order: 5 },
    { challenge_id: 'c1000000-0000-0000-0000-000000000002', book_name: 'Matthew', correct_order: 1 },
    { challenge_id: 'c1000000-0000-0000-0000-000000000002', book_name: 'Mark', correct_order: 2 },
    { challenge_id: 'c1000000-0000-0000-0000-000000000002', book_name: 'Luke', correct_order: 3 },
    { challenge_id: 'c1000000-0000-0000-0000-000000000002', book_name: 'John', correct_order: 4 },
    { challenge_id: 'c1000000-0000-0000-0000-000000000003', book_name: 'Isaiah', correct_order: 1 },
    { challenge_id: 'c1000000-0000-0000-0000-000000000003', book_name: 'Jeremiah', correct_order: 2 },
    { challenge_id: 'c1000000-0000-0000-0000-000000000003', book_name: 'Lamentations', correct_order: 3 },
  ]);

  await insertRows('story_quizzes', [
    { id: 'd1000000-0000-0000-0000-000000000001', title: 'Famous Bible Stories', difficulty: 'easy', xp_reward: 10 },
    { id: 'd1000000-0000-0000-0000-000000000002', title: 'Miracles of Jesus', difficulty: 'medium', xp_reward: 15 },
    { id: 'd1000000-0000-0000-0000-000000000003', title: 'Old Testament Adventures', difficulty: 'hard', xp_reward: 20 },
  ]);

  await insertRows('story_questions', [
    { quiz_id: 'd1000000-0000-0000-0000-000000000001', emoji_clue: null, description: 'A man and woman ate fruit from a forbidden tree and were expelled from a garden.', correct_story: 'The Fall of Man', wrong_stories: ['Noah Ark', 'David Goliath', 'Jonah Whale'], reference: 'Genesis 3', order_index: 0 },
    { quiz_id: 'd1000000-0000-0000-0000-000000000001', emoji_clue: null, description: 'God sent a great flood to cleanse the earth; one family was saved on a boat.', correct_story: 'Noah Ark', wrong_stories: ['Tower of Babel', 'Sodom Gomorrah', 'Moses Red Sea'], reference: 'Genesis 6-9', order_index: 1 },
    { quiz_id: 'd1000000-0000-0000-0000-000000000002', emoji_clue: null, description: 'Jesus fed a huge crowd with just five loaves and two fish.', correct_story: 'Feeding the 5000', wrong_stories: ['Water to Wine', 'Walking Water', 'Healing Blind'], reference: 'John 6:1-14', order_index: 0 },
    { quiz_id: 'd1000000-0000-0000-0000-000000000003', emoji_clue: null, description: 'A young shepherd defeated a giant warrior with a sling and a stone.', correct_story: 'David and Goliath', wrong_stories: ['Samson Lion', 'Joshua Walls', 'Gideon Fleece'], reference: '1 Samuel 17', order_index: 0 },
  ]);

  await insertRows('trivia_towers', [
    { id: 'e1000000-0000-0000-0000-000000000001', title: 'Beginner Tower', xp_reward_per_floor: 10, total_floors: 5 },
    { id: 'e1000000-0000-0000-0000-000000000002', title: 'Advanced Tower', xp_reward_per_floor: 15, total_floors: 5 },
  ]);

  await insertRows('trivia_floors', [
    { id: 'e2000000-0000-0000-0000-000000000001', tower_id: 'e1000000-0000-0000-0000-000000000001', floor_number: 1, floor_title: 'Creation Floor', difficulty: 'easy', xp_bonus: 5 },
    { id: 'e2000000-0000-0000-0000-000000000002', tower_id: 'e1000000-0000-0000-0000-000000000001', floor_number: 2, floor_title: 'Patriarchs Floor', difficulty: 'medium', xp_bonus: 10 },
    { id: 'e2000000-0000-0000-0000-000000000003', tower_id: 'e1000000-0000-0000-0000-000000000002', floor_number: 1, floor_title: 'Gospels Floor', difficulty: 'medium', xp_bonus: 10 },
  ]);

  await insertRows('trivia_floor_questions', [
    { floor_id: 'e2000000-0000-0000-0000-000000000001', order_index: 1, question: 'Who built the ark?', correct_answer: 'Noah', wrong_answers: ['Moses', 'Abraham', 'Daniel'] },
    { floor_id: 'e2000000-0000-0000-0000-000000000001', order_index: 2, question: 'Who led the Israelites out of Egypt?', correct_answer: 'Moses', wrong_answers: ['Joshua', 'Samuel', 'David'] },
    { floor_id: 'e2000000-0000-0000-0000-000000000002', order_index: 1, question: 'Who was the first king of Israel?', correct_answer: 'Saul', wrong_answers: ['David', 'Solomon', 'Samuel'] },
  ]);

  await insertRows('bible_bee_challenges', [
    { id: 'f1000000-0000-0000-0000-000000000001', title: 'Fruit of the Spirit', difficulty: 'easy', xp_reward_per_word: 5 },
    { id: 'f1000000-0000-0000-0000-000000000002', title: 'Armor of God', difficulty: 'medium', xp_reward_per_word: 8 },
  ]);

  await insertRows('bible_bee_words', [
    { challenge_id: 'f1000000-0000-0000-0000-000000000001', word: 'Love', hint: 'First fruit of the Spirit', order_index: 0 },
    { challenge_id: 'f1000000-0000-0000-0000-000000000001', word: 'Joy', hint: 'Deep gladness from God', order_index: 1 },
    { challenge_id: 'f1000000-0000-0000-0000-000000000001', word: 'Peace', hint: 'Freedom from worry', order_index: 2 },
    { challenge_id: 'f1000000-0000-0000-0000-000000000002', word: 'Belt', hint: 'Holds the armor together', order_index: 0 },
    { challenge_id: 'f1000000-0000-0000-0000-000000000002', word: 'Shield', hint: 'Extinguishes fiery darts', order_index: 1 },
  ]);

  await insertRows('family_tree_challenges', [
    { id: 'c2000000-0000-0000-0000-000000000001', title: 'Abrahams Family', xp_reward_per_connection: 5 },
    { id: 'c2000000-0000-0000-0000-000000000002', title: 'Davids Family', xp_reward_per_connection: 5 },
  ]);

  await insertRows('family_tree_connections', [
    { challenge_id: 'c2000000-0000-0000-0000-000000000001', character1: 'Abraham', relationship: 'father of', character2: 'Isaac', wrong_character2: ['Ishmael', 'Jacob', 'Esau'], reference: 'Genesis 21:3', order_index: 0 },
    { challenge_id: 'c2000000-0000-0000-0000-000000000001', character1: 'Sarah', relationship: 'mother of', character2: 'Isaac', wrong_character2: ['Ishmael', 'Jacob', 'Esau'], reference: 'Genesis 21:2', order_index: 1 },
    { challenge_id: 'c2000000-0000-0000-0000-000000000002', character1: 'Jesse', relationship: 'father of', character2: 'David', wrong_character2: ['Saul', 'Jonathan', 'Samuel'], reference: '1 Samuel 16:10', order_index: 0 },
    { challenge_id: 'c2000000-0000-0000-0000-000000000002', character1: 'David', relationship: 'father of', character2: 'Solomon', wrong_character2: ['Absalom', 'Adonijah', 'Amnon'], reference: '2 Samuel 12:24', order_index: 1 },
  ]);

  await insertRows('promise_match_challenges', [
    { id: 'c3000000-0000-0000-0000-000000000001', title: 'Old Testament Promises', difficulty: 'easy', xp_reward_per_match: 5 },
    { id: 'c3000000-0000-0000-0000-000000000002', title: 'New Testament Promises', difficulty: 'medium', xp_reward_per_match: 8 },
  ]);

  await insertRows('promise_match_pairs', [
    { challenge_id: 'c3000000-0000-0000-0000-000000000001', promise_text: 'I will make you a great nation.', correct_reference: 'Genesis 12:2', wrong_references: ['Genesis 15:1', 'Genesis 17:6', 'Genesis 28:14'], order_index: 0 },
    { challenge_id: 'c3000000-0000-0000-0000-000000000001', promise_text: 'I will never leave you nor forsake you.', correct_reference: 'Deuteronomy 31:6', wrong_references: ['Joshua 1:5', 'Hebrews 13:5', 'Psalm 37:28'], order_index: 1 },
    { challenge_id: 'c3000000-0000-0000-0000-000000000002', promise_text: 'All things work together for good.', correct_reference: 'Romans 8:28', wrong_references: ['Philippians 1:6', '2 Corinthians 4:17', 'James 1:2'], order_index: 0 },
    { challenge_id: 'c3000000-0000-0000-0000-000000000002', promise_text: 'My grace is sufficient for you.', correct_reference: '2 Corinthians 12:9', wrong_references: ['Philippians 4:13', '2 Timothy 1:12', 'Hebrews 4:16'], order_index: 1 },
  ]);

  console.log('Bible game seed completed successfully.');
})().catch((error) => {
  console.error('Bible game seed failed:', error);
  process.exit(1);
});
