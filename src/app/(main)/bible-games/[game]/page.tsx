import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BibleGameClient from '../BibleGameClient'

const GAME_CONFIG: Record<string, {
  title: string
  description: string
  challengeTable: string
  itemTable: string
  itemKey: string
  itemOrder: string
  extraTable?: string
  extraKey?: string
}> = {
  'verse-memory': {
    title: 'Verse Memory Challenge',
    description: 'Practice Scripture by recalling missing words in memory challenges.',
    challengeTable: 'verse_memory_challenges',
    itemTable: 'verse_memory_questions',
    itemKey: 'challenge_id',
    itemOrder: 'order_index',
  },
  'who-said-it': {
    title: 'Who Said It?',
    description: 'Choose the correct Bible speaker for each quote.',
    challengeTable: 'who_said_it_quizzes',
    itemTable: 'who_said_it_questions',
    itemKey: 'quiz_id',
    itemOrder: 'order_index',
  },
  'bible-bookshelf': {
    title: 'Bible Bookshelf',
    description: 'Review the Bible book order for Old and New Testament challenges.',
    challengeTable: 'bookshelf_challenges',
    itemTable: 'bookshelf_books',
    itemKey: 'challenge_id',
    itemOrder: 'correct_order',
  },
  'name-that-story': {
    title: 'Name That Bible Story',
    description: 'Read a description and pick the Bible story it describes.',
    challengeTable: 'story_quizzes',
    itemTable: 'story_questions',
    itemKey: 'quiz_id',
    itemOrder: 'order_index',
  },
  'bible-trivia-tower': {
    title: 'Bible Trivia Tower',
    description: 'Climb floors of trivia questions and explore each level.',
    challengeTable: 'trivia_towers',
    itemTable: 'trivia_floors',
    itemKey: 'tower_id',
    itemOrder: 'floor_number',
    extraTable: 'trivia_floor_questions',
    extraKey: 'floor_id',
  },
  'bible-bee': {
    title: 'Bible Bee',
    description: 'Guess the Bible words from a helpful hint.',
    challengeTable: 'bible_bee_challenges',
    itemTable: 'bible_bee_words',
    itemKey: 'challenge_id',
    itemOrder: 'order_index',
  },
  'family-tree-builder': {
    title: 'Family Tree Builder',
    description: 'Match characters and relationships in the Bible family tree.',
    challengeTable: 'family_tree_challenges',
    itemTable: 'family_tree_connections',
    itemKey: 'challenge_id',
    itemOrder: 'order_index',
  },
  'bible-promise-match': {
    title: 'Bible Promise Match',
    description: 'Match the promise text to the correct Bible reference.',
    challengeTable: 'promise_match_challenges',
    itemTable: 'promise_match_pairs',
    itemKey: 'challenge_id',
    itemOrder: 'order_index',
  },
}

const FALLBACK_GAME_DATA: Record<string, { challenges: any[]; items: any[]; extraItems?: any[] }> = {
  'verse-memory': {
    challenges: [
      {
        id: 'verse-memory-demo',
        title: 'Verse Memory Starter',
        description: 'Fill in the missing words from a familiar verse.',
        difficulty: 'easy',
        xp_reward: 50,
      },
    ],
    items: [
      {
        id: 'verse-memory-q1',
        challenge_id: 'verse-memory-demo',
        verse_text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
        missing_words: ['loved', 'one', 'eternal'],
        reference: 'John 3:16',
      },
    ],
  },
  'who-said-it': {
    challenges: [
      {
        id: 'who-said-it-demo',
        title: 'Who Said It? Starter',
        description: 'Choose the speaker of each Bible quote.',
        difficulty: 'easy',
        xp_reward: 60,
      },
    ],
    items: [
      {
        id: 'who-said-it-q1',
        quiz_id: 'who-said-it-demo',
        quote: 'The Lord is my shepherd; I shall not want.',
        correct_speaker: 'David',
        wrong_speakers: ['Moses', 'Paul', 'Solomon'],
      },
      {
        id: 'who-said-it-q2',
        quiz_id: 'who-said-it-demo',
        quote: 'I can do all things through Christ who strengthens me.',
        correct_speaker: 'Paul',
        wrong_speakers: ['Peter', 'Joshua', 'Isaiah'],
      },
    ],
  },
  'bible-bookshelf': {
    challenges: [
      {
        id: 'bookshelf-demo',
        title: 'Bookshelf Basics',
        description: 'Arrange the first books of the Bible in order.',
        difficulty: 'medium',
        xp_reward: 40,
      },
    ],
    items: [
      { id: 'bookshelf-1', challenge_id: 'bookshelf-demo', book_name: 'Genesis', correct_order: 1 },
      { id: 'bookshelf-2', challenge_id: 'bookshelf-demo', book_name: 'Exodus', correct_order: 2 },
      { id: 'bookshelf-3', challenge_id: 'bookshelf-demo', book_name: 'Leviticus', correct_order: 3 },
      { id: 'bookshelf-4', challenge_id: 'bookshelf-demo', book_name: 'Numbers', correct_order: 4 },
      { id: 'bookshelf-5', challenge_id: 'bookshelf-demo', book_name: 'Deuteronomy', correct_order: 5 },
    ],
  },
  'name-that-story': {
    challenges: [
      {
        id: 'name-that-story-demo',
        title: 'Story Clues',
        description: 'Read the clue and choose the Bible story.',
        difficulty: 'easy',
        xp_reward: 60,
      },
    ],
    items: [
      {
        id: 'story-q1',
        quiz_id: 'name-that-story-demo',
        description: 'A man trusted God and walked through water on a dry path.',
        correct_story: 'Crossing the Red Sea',
        wrong_stories: ['David and Goliath', 'The Feeding of the 5,000', 'The Burning Bush'],
      },
      {
        id: 'story-q2',
        quiz_id: 'name-that-story-demo',
        description: 'A young shepherd defeated a giant with a sling and five stones.',
        correct_story: 'David and Goliath',
        wrong_stories: ['Jonah and the Whale', 'Joseph in Egypt', 'The Last Supper'],
      },
    ],
  },
  'bible-trivia-tower': {
    challenges: [
      {
        id: 'trivia-tower-demo',
        title: 'Trivia Tower Starter',
        description: 'Climb a short tower of Bible trivia questions.',
        difficulty: 'easy',
        xp_reward_per_floor: 25,
      },
    ],
    items: [
      {
        id: 'trivia-floor-1',
        tower_id: 'trivia-tower-demo',
        floor_number: 1,
        floor_title: 'The Beginning',
        difficulty: 'easy',
      },
      {
        id: 'trivia-floor-2',
        tower_id: 'trivia-tower-demo',
        floor_number: 2,
        floor_title: 'Great Leaders',
        difficulty: 'medium',
      },
    ],
    extraItems: [
      {
        id: 'trivia-q1',
        floor_id: 'trivia-floor-1',
        order_index: 1,
        question: 'Who built the ark?',
        correct_answer: 'Noah',
        wrong_answers: ['Moses', 'Abraham', 'Daniel'],
      },
      {
        id: 'trivia-q2',
        floor_id: 'trivia-floor-2',
        order_index: 1,
        question: 'Who led the Israelites out of Egypt?',
        correct_answer: 'Moses',
        wrong_answers: ['Joshua', 'Samuel', 'David'],
      },
    ],
  },
  'bible-bee': {
    challenges: [
      {
        id: 'bible-bee-demo',
        title: 'Bible Bee Starter',
        description: 'Guess the Bible word from the hint.',
        difficulty: 'easy',
        xp_reward_per_word: 20,
      },
    ],
    items: [
      { id: 'bee-word-1', challenge_id: 'bible-bee-demo', word: 'faith', hint: 'A strong confidence in God and His promises.' },
      { id: 'bee-word-2', challenge_id: 'bible-bee-demo', word: 'mercy', hint: 'Showing compassion instead of judgment.' },
    ],
  },
  'family-tree-builder': {
    challenges: [
      {
        id: 'family-tree-demo',
        title: 'Family Tree Basics',
        description: 'Complete the family relationship prompts.',
        difficulty: 'medium',
        xp_reward_per_connection: 25,
      },
    ],
    items: [
      {
        id: 'family-q1',
        challenge_id: 'family-tree-demo',
        character1: 'Sarah',
        relationship: 'mother of',
        character2: 'Isaac',
        wrong_character2: ['Jacob', 'Joseph', 'Esau'],
      },
      {
        id: 'family-q2',
        challenge_id: 'family-tree-demo',
        character1: 'Mary',
        relationship: 'mother of',
        character2: 'Jesus',
        wrong_character2: ['John', 'Peter', 'James'],
      },
    ],
  },
  'bible-promise-match': {
    challenges: [
      {
        id: 'promise-match-demo',
        title: 'Promise Match Starter',
        description: 'Match the promise text to the Bible reference.',
        difficulty: 'easy',
        xp_reward_per_match: 20,
      },
    ],
    items: [
      {
        id: 'promise-q1',
        challenge_id: 'promise-match-demo',
        promise_text: 'I will never leave you nor forsake you.',
        correct_reference: 'Joshua 1:5',
        wrong_references: ['Psalm 23:1', 'Romans 8:28', 'Matthew 5:16'],
      },
      {
        id: 'promise-q2',
        challenge_id: 'promise-match-demo',
        promise_text: 'Trust in the Lord with all your heart.',
        correct_reference: 'Proverbs 3:5',
        wrong_references: ['Isaiah 40:31', 'John 14:6', 'Hebrews 11:1'],
      },
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const config = GAME_CONFIG[resolvedParams.game]
  if (!config) {
    return { title: 'Bible Game', description: 'Bible game challenge.' }
  }

  return {
    title: `${config.title} - Life Transformers`, 
    description: config.description,
  }
}

export default async function BibleGamePage({ params }: { params: Promise<{ game: string }> }) {
  const resolvedParams = await params
  const config = GAME_CONFIG[resolvedParams.game]
  if (!config) {
    notFound()
  }

  const supabase = await createClient()

  const fetchRows = async (table: string, orderColumn: string) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order(orderColumn, { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.warn(`Bible game fallback: unable to load ${table}`, error)
      return []
    }
  }

  let challenges = await fetchRows(config.challengeTable, 'created_at')
  let items = await fetchRows(config.itemTable, config.itemOrder)
  let extraItems: any[] = []

  if (config.extraTable && config.extraKey) {
    extraItems = await fetchRows(config.extraTable, 'order_index')
  }

  const fallbackData = FALLBACK_GAME_DATA[resolvedParams.game]
  if (fallbackData) {
    const hasChallengeData = challenges.length > 0
    const hasItemData = items.length > 0
    const hasExtraData = config.extraTable ? extraItems.length > 0 : true

    if (!hasChallengeData || !hasItemData || !hasExtraData) {
      challenges = fallbackData.challenges
      items = fallbackData.items
      extraItems = fallbackData.extraItems || []
    }
  }

  return (
    <BibleGameClient
      gameKey={resolvedParams.game}
      config={config}
      challenges={challenges}
      items={items}
      extraItems={extraItems}
    />
  )
}
