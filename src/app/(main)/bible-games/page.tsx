import Link from 'next/link'
import { Metadata } from 'next'
import { BookOpen, Sparkles, TreeDeciduous, Book, Trophy, Bookmark, Users, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Bible Games - Life Transformers',
  description: 'Open Bible games, memory challenges, stories, and quizzes.',
}

const games = [
  {
    key: 'verse-memory',
    title: 'Verse Memory',
    description: 'Practice Scripture recall with hidden words and memory challenges.',
    href: '/bible-games/verse-memory',
    icon: BookOpen,
  },
  {
    key: 'who-said-it',
    title: 'Who Said It?',
    description: 'Match Bible quotes to the correct speaker.',
    href: '/bible-games/who-said-it',
    icon: Users,
  },
  {
    key: 'bible-bookshelf',
    title: 'Bible Bookshelf',
    description: 'Arrange Bible books and review the order of Scripture.',
    href: '/bible-games/bible-bookshelf',
    icon: Bookmark,
  },
  {
    key: 'name-that-story',
    title: 'Name That Bible Story',
    description: 'Read the clues and identify the Bible story.',
    href: '/bible-games/name-that-story',
    icon: Sparkles,
  },
  {
    key: 'bible-trivia-tower',
    title: 'Bible Trivia Tower',
    description: 'Climb floors of trivia questions and unlock new challenges.',
    href: '/bible-games/bible-trivia-tower',
    icon: Trophy,
  },
  {
    key: 'bible-bee',
    title: 'Bible Bee',
    description: 'Guess the Bible words from hints and strengthen your word knowledge.',
    href: '/bible-games/bible-bee',
    icon: Book,
  },
  {
    key: 'family-tree-builder',
    title: 'Family Tree Builder',
    description: 'Connect Bible characters with their family relationships.',
    href: '/bible-games/family-tree-builder',
    icon: TreeDeciduous,
  },
  {
    key: 'bible-promise-match',
    title: 'Bible Promise Match',
    description: 'Match promises to their Bible references.',
    href: '/bible-games/bible-promise-match',
    icon: ShieldCheck,
  },
]

export default function BibleGamesPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-400 font-semibold mb-2">Bible Games</p>
        <h1 className="text-4xl font-bold text-white">Discover new ways to learn Scripture</h1>
        <p className="text-surface-400 mt-3 max-w-2xl mx-auto">Play verse memory challenges, story quizzes, family trees, promise matches, and more across the Life Transformers Bible games collection.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {games.map((game) => {
          const Icon = game.icon
          return (
            <Card key={game.key} className="p-6 border-white/10 hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-surface-500 font-semibold">{game.title}</p>
                  <p className="mt-2 text-surface-300">{game.description}</p>
                </div>
                <Icon className="w-8 h-8 text-amber-400" />
              </div>
              <div className="flex justify-end">
                <Link href={game.href}>
                  <Button variant="outline">Play</Button>
                </Link>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
