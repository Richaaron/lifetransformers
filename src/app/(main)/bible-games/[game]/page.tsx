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
  const { data: challenges } = await supabase
    .from(config.challengeTable)
    .select('*')
    .order('created_at', { ascending: true })

  const { data: items } = await supabase
    .from(config.itemTable)
    .select('*')
    .order(config.itemOrder, { ascending: true })

  let extraItems: any[] = []
  if (config.extraTable && config.extraKey) {
    const { data } = await supabase
      .from(config.extraTable)
      .select('*')
      .order('order_index', { ascending: true })
    extraItems = data || []
  }

  return (
    <BibleGameClient
      gameKey={resolvedParams.game}
      config={config}
      challenges={challenges || []}
      items={items || []}
      extraItems={extraItems}
    />
  )
}
