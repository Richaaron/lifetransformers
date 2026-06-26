'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useIsNative } from '@/lib/hooks/use-is-native'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BookOpen, Trophy, Bookmark } from 'lucide-react'

interface GameConfig {
  title: string
  description: string
  challengeTable: string
  itemTable: string
  itemKey: string
  itemOrder: string
  extraTable?: string
  extraKey?: string
}

interface BibleGameClientProps {
  gameKey: string
  config: GameConfig
  challenges: any[]
  items: any[]
  extraItems?: any[]
}

const multipleChoiceGames = [
  'who-said-it',
  'name-that-story',
  'family-tree-builder',
  'bible-promise-match',
]

function shuffleArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5)
}

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

export default function BibleGameClient({ gameKey, config, challenges, items, extraItems = [] }: BibleGameClientProps) {
  const isNative = useIsNative()
  const supabase = createClient()

  const [currentChallengeId, setCurrentChallengeId] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [sessionXpEarned, setSessionXpEarned] = useState(0)

  const [shelfOrder, setShelfOrder] = useState<any[]>([])
  const [shuffledBooks, setShuffledBooks] = useState<any[]>([])
  const [towerFloorIndex, setTowerFloorIndex] = useState(0)
  const [towerQuestionIndex, setTowerQuestionIndex] = useState(0)
  const [towerScore, setTowerScore] = useState(0)
  const [beeAnswer, setBeeAnswer] = useState('')
  const [beeFeedback, setBeeFeedback] = useState<string | null>(null)

  const currentChallenge = challenges.find((challenge) => challenge.id === currentChallengeId)
  const currentItems = useMemo(
    () => items.filter((item) => item[config.itemKey] === currentChallengeId),
    [items, config.itemKey, currentChallengeId]
  )

  const currentQuestion = currentItems[currentQuestionIndex]

  const currentTowerFloor = currentItems[towerFloorIndex]
  const currentTowerQuestions = useMemo(() => {
    if (gameKey !== 'bible-trivia-tower' || !currentTowerFloor) return []
    return extraItems
      .filter((question) => question.floor_id === currentTowerFloor.id)
      .sort((a, b) => a.order_index - b.order_index)
  }, [extraItems, currentTowerFloor, gameKey])

  useEffect(() => {
    if (gameKey !== 'bible-bookshelf' || !currentChallengeId) return
    const books = items.filter((item) => item[config.itemKey] === currentChallengeId)
    setShuffledBooks(shuffleArray(books))
    setShelfOrder([])
  }, [gameKey, currentChallengeId, items, config.itemKey])

  const activeChallengeIndex = useMemo(
    () => challenges.findIndex((challenge) => challenge.id === currentChallengeId),
    [challenges, currentChallengeId]
  )

  const nextChallenge = activeChallengeIndex >= 0 && activeChallengeIndex < challenges.length - 1
    ? challenges[activeChallengeIndex + 1]
    : null

  function goToNextChallenge() {
    if (nextChallenge) {
      startChallenge(nextChallenge.id)
      return
    }
    setCurrentChallengeId(null)
  }

  function startChallenge(challengeId: string) {
    setCurrentChallengeId(challengeId)
    setCurrentQuestionIndex(0)
    setScore(0)
    setShowResults(false)
    setRevealed(false)
    setFeedbackMessage(null)
    setSessionXpEarned(0)
    setShelfOrder([])
    setTowerFloorIndex(0)
    setTowerQuestionIndex(0)
    setTowerScore(0)
    setBeeAnswer('')
    setBeeFeedback(null)
  }

  function getShuffledAnswers(question: any) {
    if (!question) return []
    const answers = [
      question.correct_speaker || question.correct_story || question.correct_reference || question.character2 || question.correct_answer,
      ...(question.wrong_speakers || question.wrong_stories || question.wrong_references || question.wrong_character2 || question.wrong_answers || []),
    ]
    return shuffleArray(answers)
  }

  function getCorrectAnswer(question: any) {
    if (!question) return ''
    return question.correct_speaker || question.correct_story || question.correct_reference || question.character2 || question.correct_answer || ''
  }

  function hideMissingWords(text: string, words: string[]) {
    if (!text || !words?.length) return text
    return words.reduce((current, word) => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return current.replace(new RegExp(`\\b${escaped}\\b`, 'gi'), '_____')
    }, text)
  }

  async function saveAttempt(attemptTable: string, attemptPayload: any, xpAmount: number, reason: string) {
    try {
      const { data } = await supabase.auth.getUser()
      const user = data?.user
      if (!user) return

      await supabase.from(attemptTable).insert({ ...attemptPayload, user_id: user.id })
      if (xpAmount > 0) {
        await supabase.rpc('add_xp', {
          p_user_id: user.id,
          p_amount: xpAmount,
          p_reason: reason,
        })
      }
    } catch (error) {
      console.error('Bible game save error', error)
      toast.error('Could not save your game progress. Please try again.')
    }
  }

  function showCompletionToast(message: string) {
    toast.success(message, {
      duration: 4000,
    })
  }

  async function completeMultipleChoice() {
    if (!currentChallengeId || !currentChallenge) return
    const total = currentItems.length
    const attemptTable = gameKey === 'who-said-it' ? 'who_said_it_attempts'
      : gameKey === 'name-that-story' ? 'story_attempts'
      : gameKey === 'family-tree-builder' ? 'family_tree_attempts'
      : 'promise_match_attempts'

    const payload = gameKey === 'who-said-it' || gameKey === 'name-that-story'
      ? { quiz_id: currentChallengeId, score, total_questions: total }
      : gameKey === 'family-tree-builder'
        ? { challenge_id: currentChallengeId, score, total_connections: total }
        : { challenge_id: currentChallengeId, score, total_pairs: total }

    const xpAmount = gameKey === 'family-tree-builder'
      ? score * (currentChallenge.xp_reward_per_connection ?? 0)
      : gameKey === 'bible-promise-match'
        ? score * (currentChallenge.xp_reward_per_match ?? 0)
        : currentChallenge.xp_reward ?? 0

    await saveAttempt(attemptTable, payload, xpAmount, `Bible Game: ${currentChallenge.title}`)
    const message = `You earned ${xpAmount} XP!`
    setSessionXpEarned(xpAmount)
    setFeedbackMessage(message)
    setShowResults(true)
    showCompletionToast(message)
  }

  async function completeVerseMemory() {
    if (!currentChallengeId || !currentChallenge) return
    const total = currentItems.length
    const xpAmount = currentChallenge.xp_reward ?? 0
    const message = `You earned ${xpAmount} XP for completing the memory challenge!`
    await saveAttempt('verse_memory_attempts', {
      challenge_id: currentChallengeId,
      score: total,
      total_questions: total,
    }, xpAmount, `Verse Memory: ${currentChallenge.title}`)
    setSessionXpEarned(xpAmount)
    setFeedbackMessage(message)
    setShowResults(true)
    showCompletionToast(message)
  }

  async function completeBookshelf() {
    if (!currentChallengeId || !currentChallenge) return
    const correctCount = shelfOrder.filter((book, index) => book.correct_order === index + 1).length
    const xpAmount = correctCount * (currentChallenge.xp_reward ?? 0)
    const message = `You earned ${xpAmount} XP for ${correctCount} correct books!`
    await saveAttempt('bookshelf_attempts', {
      challenge_id: currentChallengeId,
      score: correctCount,
      total_books: currentItems.length,
    }, xpAmount, `Bookshelf: ${currentChallenge.title}`)
    setScore(correctCount)
    setSessionXpEarned(xpAmount)
    setFeedbackMessage(message)
    setShowResults(true)
    showCompletionToast(message)
  }

  async function completeTriviaTower() {
    if (!currentChallengeId || !currentChallenge) return
    const earnedXp = towerScore * (currentChallenge.xp_reward_per_floor ?? 0)
    const message = `You earned ${earnedXp} XP for your trivia tower run!`
    await saveAttempt('trivia_tower_attempts', {
      tower_id: currentChallengeId,
      highest_floor_reached: currentTowerFloor?.floor_number ?? 0,
      total_questions_answered: towerScore,
      total_xp_earned: earnedXp,
    }, earnedXp, `Trivia Tower: ${currentChallenge.title}`)
    setSessionXpEarned(earnedXp)
    setFeedbackMessage(message)
    setShowResults(true)
    showCompletionToast(message)
  }

  async function completeBibleBee() {
    if (!currentChallengeId || !currentChallenge) return
    const xpAmount = score * (currentChallenge.xp_reward_per_word ?? 0)
    const message = `You earned ${xpAmount} XP for answering ${score} words correctly!`
    await saveAttempt('bible_bee_attempts', {
      challenge_id: currentChallengeId,
      score,
      total_words: currentItems.length,
    }, xpAmount, `Bible Bee: ${currentChallenge.title}`)
    setSessionXpEarned(xpAmount)
    setFeedbackMessage(message)
    setShowResults(true)
    showCompletionToast(message)
  }

  async function handleAnswer(selectedAnswer: string) {
    if (!currentQuestion) return
    setLoading(true)

    const correct = getCorrectAnswer(currentQuestion)
    if (selectedAnswer === correct) {
      setScore((prev) => prev + 1)
    }

    if (currentQuestionIndex < currentItems.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setLoading(false)
      return
    }

    await completeMultipleChoice()
    setLoading(false)
  }

  function renderQuestionText(question: any) {
    if (!question) return ''
    switch (gameKey) {
      case 'who-said-it':
        return question.quote
      case 'name-that-story':
        return question.description
      case 'family-tree-builder':
        return `${question.character1} is ${question.relationship} of ...`
      case 'bible-promise-match':
        return question.promise_text
      case 'verse-memory':
        return hideMissingWords(question.verse_text, question.missing_words)
      case 'bible-bee':
        return question.hint
      default:
        return question.question || question.book_name || ''
    }
  }

  function renderAnswerLabel(question: any) {
    if (!question) return 'Answer'
    switch (gameKey) {
      case 'who-said-it':
        return 'Who said this?'
      case 'name-that-story':
        return 'Which story?'
      case 'family-tree-builder':
        return 'Who completes the family connection?'
      case 'bible-promise-match':
        return 'Which reference matches?'
      case 'bible-bee':
        return 'Guess the word:'
      default:
        return 'Answer'
    }
  }

  if (!currentChallengeId) {
    return (
      <div className={isNative ? 'p-4' : 'max-w-4xl mx-auto p-6'}>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">{config.title}</h1>
          <p className="text-surface-400 max-w-2xl mx-auto">{config.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="p-5 border-white/10 hover:border-amber-500/30 transition-all cursor-pointer" onClick={() => startChallenge(challenge.id)}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">{challenge.title}</h2>
                  <p className="text-surface-400 text-sm mt-2">{challenge.description || 'Learn the key Bible details in this challenge.'}</p>
                </div>
                <BookOpen className="w-8 h-8 text-amber-400" />
              </div>
              <div className="flex items-center justify-between text-surface-400 text-sm">
                <span>{challenge.difficulty?.toUpperCase() || 'OPEN'}</span>
                <span>{challenge.xp_reward ?? challenge.xp_reward_per_word ?? challenge.xp_reward_per_match ?? 0} XP</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (multipleChoiceGames.includes(gameKey)) {
    return (
      <div className={isNative ? 'p-4' : 'max-w-3xl mx-auto p-6'}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">{currentChallenge?.title}</h1>
          <p className="text-surface-400">{currentChallenge?.description || config.description}</p>
          <p className="text-sm text-surface-500 mt-2">Question {currentQuestionIndex + 1} of {currentItems.length}</p>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">{renderQuestionText(currentQuestion)}</h2>
          <div className="grid gap-3">
            {getShuffledAnswers(currentQuestion).map((answer, index) => (
              <Button key={index} variant="outline" className="w-full text-left" onClick={() => handleAnswer(answer)} disabled={loading}>
                {answer}
              </Button>
            ))}
          </div>
        </Card>

        {showResults && (
          <Card className="p-6 bg-surface-900 border-white/10">
            <div className="mb-4 rounded-xl bg-amber-500/10 p-4 text-amber-200">
              <p>{feedbackMessage ?? `You earned ${sessionXpEarned} XP!`}</p>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">Challenge Complete</h2>
            <p className="text-amber-300 text-lg mb-3">{score} / {currentItems.length} correct</p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => startChallenge(currentChallengeId!)}>Try Again</Button>
              <Button variant="outline" onClick={goToNextChallenge}>{nextChallenge ? 'Next challenge' : 'Back to challenges'}</Button>
            </div>
          </Card>
        )}
      </div>
    )
  }

  if (gameKey === 'verse-memory') {
    return (
      <div className={isNative ? 'p-4' : 'max-w-3xl mx-auto p-6'}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">{currentChallenge?.title}</h1>
          <p className="text-surface-400">{currentChallenge?.description || config.description}</p>
          <p className="text-sm text-surface-500 mt-2">Verse {currentQuestionIndex + 1} of {currentItems.length}</p>
        </div>

        <Card className="p-6 mb-6">
          <div className="text-surface-300 text-lg leading-relaxed whitespace-pre-wrap mb-4">
            {renderQuestionText(currentQuestion)}
          </div>
          <div className="mb-4 text-surface-500 text-sm">
            Missing words listed as a study prompt.
          </div>
          <Button variant="outline" onClick={() => setRevealed((prev) => !prev)}>
            {revealed ? 'Hide Answer' : 'Reveal Answer'}
          </Button>
          {revealed && (
            <div className="mt-4 p-4 rounded-xl bg-surface-800 text-surface-200">
              <p>{currentQuestion?.verse_text}</p>
              {currentQuestion?.reference && <p className="mt-2 text-surface-500">{currentQuestion.reference}</p>}
            </div>
          )}
        </Card>

        <div className="flex gap-3">
          <Button onClick={async () => {
            if (currentQuestionIndex < currentItems.length - 1) {
              setCurrentQuestionIndex((prev) => prev + 1)
            } else {
              await completeVerseMemory()
            }
          }}>
            {currentQuestionIndex < currentItems.length - 1 ? 'Next Verse' : 'Finish Challenge'}
          </Button>
          <Button variant="outline" onClick={() => startChallenge(currentChallengeId!)}>
            Restart
          </Button>
        </div>

        {showResults && (
          <Card className="mt-6 p-6 bg-surface-900 border-white/10">
            <div className="mb-4 rounded-xl bg-amber-500/10 p-4 text-amber-200">
              <p>{feedbackMessage ?? `You earned ${sessionXpEarned} XP!`}</p>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Memory challenge complete!</h2>
            <p className="text-surface-400">Well done reviewing this Scripture set.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => startChallenge(currentChallengeId!)}>Try Again</Button>
              <Button variant="outline" onClick={goToNextChallenge}>{nextChallenge ? 'Next challenge' : 'Back to challenges'}</Button>
            </div>
          </Card>
        )}
      </div>
    )
  }

  if (gameKey === 'bible-bookshelf') {
    const availableBooks = shuffledBooks.filter((book) => !shelfOrder.some((selected) => selected.id === book.id))
    const selectedCount = shelfOrder.length
    const finished = selectedCount === currentItems.length
    const correctCount = shelfOrder.filter((book, index) => book.correct_order === index + 1).length

    return (
      <div className={isNative ? 'p-4' : 'max-w-4xl mx-auto p-6'}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">{currentChallenge?.title}</h1>
          <p className="text-surface-400">{currentChallenge?.description || config.description}</p>
          <p className="text-sm text-surface-500 mt-2">Select books in the correct order.</p>
        </div>

        <div className="grid gap-3 mb-6 md:grid-cols-2">
          {availableBooks.map((book) => (
            <Card key={book.id} className="p-5 border-white/10 cursor-pointer hover:border-amber-500/30" onClick={() => setShelfOrder((prev) => [...prev, book])}>
              <p className="text-lg font-semibold text-white">{book.book_name}</p>
            </Card>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Your order</h2>
          <div className="grid gap-3">
            {shelfOrder.map((book, index) => (
              <Card key={book.id} className="p-4 border-white/10 bg-surface-950">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-surface-300">{index + 1}</span>
                  <span className="text-white font-semibold">{book.book_name}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button onClick={completeBookshelf} disabled={!finished}>
            Finish Challenge
          </Button>
          <Button variant="outline" onClick={() => startChallenge(currentChallengeId!)}>
            Restart
          </Button>
        </div>

        {showResults && (
          <Card className="mt-6 p-6 bg-surface-900 border-white/10">
            <div className="mb-4 rounded-xl bg-amber-500/10 p-4 text-amber-200">
              <p>{feedbackMessage ?? `You earned ${sessionXpEarned} XP!`}</p>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Bookshelf challenge complete!</h2>
            <p className="text-amber-300 text-lg mb-3">{correctCount} / {currentItems.length} in correct position</p>
            <p className="text-surface-400">Review the order and try again to improve your score.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => startChallenge(currentChallengeId!)}>Try Again</Button>
              <Button variant="outline" onClick={goToNextChallenge}>{nextChallenge ? 'Next challenge' : 'Back to challenges'}</Button>
            </div>
          </Card>
        )}
      </div>
    )
  }

  if (gameKey === 'bible-trivia-tower') {
    const currentQuestion = currentTowerQuestions[towerQuestionIndex]

    async function handleTowerAnswer(answer: string) {
      if (!currentQuestion) return
      setLoading(true)
      const correct = normalizeText(currentQuestion.correct_answer)
      if (normalizeText(answer) === correct) {
        setTowerScore((prev) => prev + 1)
      }

      if (towerQuestionIndex < currentTowerQuestions.length - 1) {
        setTowerQuestionIndex((prev) => prev + 1)
        setLoading(false)
        return
      }

      if (towerFloorIndex < currentItems.length - 1) {
        setTowerFloorIndex((prev) => prev + 1)
        setTowerQuestionIndex(0)
        setLoading(false)
        return
      }

      await completeTriviaTower()
      setLoading(false)
    }

    return (
      <div className={isNative ? 'p-4' : 'max-w-5xl mx-auto p-6'}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">{currentChallenge?.title}</h1>
          <p className="text-surface-400">{currentChallenge?.description || config.description}</p>
          <p className="text-sm text-surface-500 mt-2">Floor {currentTowerFloor?.floor_number} / {currentItems.length}</p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">{currentTowerFloor?.floor_title}</h2>
              <p className="text-surface-500 text-sm">{currentTowerFloor?.difficulty}</p>
            </div>
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-surface-300 text-lg mb-4">{currentQuestion?.question}</p>
          <div className="grid gap-3">
            {getShuffledAnswers(currentQuestion).map((answer, index) => (
              <Button key={index} variant="outline" className="w-full text-left" onClick={() => handleTowerAnswer(answer)} disabled={loading}>
                {answer}
              </Button>
            ))}
          </div>
        </Card>

        {showResults && (
          <Card className="mt-6 p-6 bg-surface-900 border-white/10">
            <div className="mb-4 rounded-xl bg-amber-500/10 p-4 text-amber-200">
              <p>{feedbackMessage ?? `You earned ${sessionXpEarned} XP!`}</p>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Trivia Tower complete!</h2>
            <p className="text-amber-300 text-lg mb-3">{towerScore} correct answers in {currentItems.length} floors</p>
            <p className="text-surface-400">Keep climbing to sharpen your Bible knowledge.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => startChallenge(currentChallengeId!)}>Retry Tower</Button>
              <Button variant="outline" onClick={goToNextChallenge}>{nextChallenge ? 'Next challenge' : 'Back to challenges'}</Button>
            </div>
          </Card>
        )}
      </div>
    )
  }

  if (gameKey === 'bible-bee') {
    const currentWord = currentItems[currentQuestionIndex]

    async function handleBeeSubmit() {
      if (!currentWord) return
      setLoading(true)
      const correct = normalizeText(currentWord.word)
      if (normalizeText(beeAnswer) === correct) {
        setScore((prev) => prev + 1)
        setBeeFeedback('Correct!')
      } else {
        setBeeFeedback(`Not quite — the word is “${currentWord.word}”.`)
      }

      if (currentQuestionIndex < currentItems.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setBeeAnswer('')
        setLoading(false)
        return
      }

      await completeBibleBee()
      setLoading(false)
    }

    return (
      <div className={isNative ? 'p-4' : 'max-w-4xl mx-auto p-6'}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">{currentChallenge?.title}</h1>
          <p className="text-surface-400">{currentChallenge?.description || config.description}</p>
          <p className="text-sm text-surface-500 mt-2">Hint: {currentWord?.hint}</p>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <p className="text-surface-300 text-lg">Guess the Bible word from the hint above.</p>
            </div>
            <input
              value={beeAnswer}
              onChange={(event) => setBeeAnswer(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-surface-950 px-4 py-3 text-white outline-none focus:border-amber-500"
              placeholder="Type your answer"
            />
            <Button onClick={handleBeeSubmit} disabled={loading || !beeAnswer.trim()}>
              Submit Answer
            </Button>
            {beeFeedback && <p className="text-surface-300">{beeFeedback}</p>}
          </div>
        </Card>

        {showResults && (
          <Card className="mt-6 p-6 bg-surface-900 border-white/10">
            <div className="mb-4 rounded-xl bg-amber-500/10 p-4 text-amber-200">
              <p>{feedbackMessage ?? `You earned ${sessionXpEarned} XP!`}</p>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Bible Bee complete!</h2>
            <p className="text-amber-300 text-lg mb-3">{score} / {currentItems.length} correct</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => startChallenge(currentChallengeId!)}>Try Again</Button>
              <Button variant="outline" onClick={goToNextChallenge}>{nextChallenge ? 'Next challenge' : 'Back to challenges'}</Button>
            </div>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className={isNative ? 'p-4' : 'max-w-4xl mx-auto p-6'}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{currentChallenge?.title}</h1>
        <p className="text-surface-400">{currentChallenge?.description || config.description}</p>
      </div>
      <Card className="p-5 border-white/10">
        <p className="text-surface-400">This game is under development. Check back soon for more fun Bible challenges.</p>
      </Card>
    </div>
  )
}
