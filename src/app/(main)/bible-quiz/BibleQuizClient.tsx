'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useIsNative } from '@/lib/hooks/use-is-native';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, BookOpen, ChevronRight, Clock } from 'lucide-react';
import { playCorrectSound, playIncorrectSound, playGameCompleteSound } from '@/lib/sounds';
import { hasPlayedToday, recordGamePlay } from '@/lib/game-session-utils';

interface BibleQuiz {
  id: string;
  title: string;
  description: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  xp_reward: number;
  created_at: string;
}

interface BibleQuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  correct_answer: string;
  wrong_answers: string[];
  reference: string | null;
  order_index: number;
}

interface BibleQuizClientProps {
  initialQuizzes: BibleQuiz[];
  initialQuestions: BibleQuizQuestion[];
}

export default function BibleQuizClient({ initialQuizzes, initialQuestions }: BibleQuizClientProps) {
  const isNative = useIsNative();
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        
        // Load played quizzes for today - don't block UI
        if (user) {
          try {
            const played = new Set<string>();
            for (const quiz of initialQuizzes) {
              try {
                const hasPlayed = await hasPlayedToday(user.id, 'bible_quiz', quiz.id);
                if (hasPlayed) {
                  played.add(quiz.id);
                }
              } catch (error) {
                console.error('Error checking play status for quiz:', quiz.id, error);
                // Continue checking other quizzes even if one fails
              }
            }
            setPlayedToday(played);
          } catch (error) {
            console.error('Error loading played quizzes:', error);
            // Don't block UI on error - user can still see and play quizzes
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    fetchUser();
    // Note: supabase not in deps - createClient is called in component, don't want effect re-running on every render
  }, [initialQuizzes]);

  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string[]>>({});
  const [playedToday, setPlayedToday] = useState<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuiz = initialQuizzes.find((q) => q.id === currentQuizId);
  const currentQuestions = initialQuestions.filter((q) => q.quiz_id === currentQuizId);
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  useEffect(() => {
    if (currentQuizId && !showResults && currentQuestion) {
      startTimer();
    }
    return clearTimer;
  }, [currentQuizId, currentQuestionIndex, showResults, currentQuestion, startTimer, clearTimer]);

  useEffect(() => {
    if (!currentQuestion) return;

    setQuestionAnswers((prev) => {
      const key = `${currentQuestion.id}`;
      if (prev[key]) return prev;

      const answers = [currentQuestion.correct_answer, ...currentQuestion.wrong_answers];
      const shuffled = answers.sort(() => Math.random() - 0.5);
      return {
        ...prev,
        [key]: shuffled,
      };
    });
  }, [currentQuestion]);

  useEffect(() => {
    if (timeLeft === 0 && currentQuizId && !showResults && !loading) {
      handleAnswer('__TIMEOUT__');
    }
  }, [timeLeft, currentQuizId, showResults, loading]);

  async function startQuiz(quizId: string) {
    const alreadyPlayed = await hasPlayedToday(currentUser?.id || '', 'bible_quiz', quizId);
    if (alreadyPlayed) {
      alert('You have already completed this quiz today! Come back tomorrow for another attempt.');
      return;
    }
    
    setCurrentQuizId(quizId);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalQuestions(initialQuestions.filter((q) => q.quiz_id === quizId).length);
    setShowResults(false);
    setQuestionAnswers({});
    startTimer();
  }

  async function handleAnswer(selectedAnswer: string) {
    if (!currentQuestion) return;

    clearTimer();
    setLoading(true);

    if (selectedAnswer === currentQuestion.correct_answer) {
      playCorrectSound();
      setScore((prev) => prev + 1);
    } else {
      playIncorrectSound();
    }

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setLoading(false);
    } else {
      // Quiz complete - submit results and award XP
      await submitQuizResults();
      playGameCompleteSound();
      setShowResults(true);
      setLoading(false);
    }
  }

  async function submitQuizResults() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !currentQuiz) return;

      // Insert quiz attempt
      await supabase.from('user_quiz_attempts').insert({
        user_id: user.id,
        quiz_id: currentQuiz.id,
        score: score,
        total_questions: totalQuestions,
      });

      // Record the play to enforce daily limit
      await recordGamePlay(user.id, 'bible_quiz', currentQuiz.id);
      setPlayedToday(prev => new Set(prev).add(currentQuiz.id));

      // Award XP if score > 0
      if (score > 0) {
        await supabase.rpc('add_xp', {
          p_user_id: user.id,
          p_amount: currentQuiz.xp_reward,
          p_reason: `Bible Quiz: ${currentQuiz.title}`,
        });
      }
    } catch (error) {
      console.error('Error submitting quiz results:', error);
    }
  }

  // Shuffle answers
  function getShuffledAnswers() {
    if (!currentQuestion) return [];
    const answers = [currentQuestion.correct_answer, ...currentQuestion.wrong_answers];
    return answers.sort(() => Math.random() - 0.5);
  }

  if (!currentQuizId) {
    return (
      <div className={isNative ? 'p-4' : 'max-w-3xl mx-auto p-6'}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
            Bible Quiz
          </h1>
          <p className="text-surface-400">Test your knowledge and earn XP!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialQuizzes.map((quiz) => {
            const isCompleted = playedToday.has(quiz.id);
            return (
              <Card
                key={quiz.id}
                className={`p-5 ${isCompleted ? 'cursor-default opacity-60' : 'cursor-pointer hover:border-amber-500/50'} transition-all group`}
                onClick={() => !isCompleted && startQuiz(quiz.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <BookOpen className="w-8 h-8 text-amber-500" />
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                        ✓ Completed
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      quiz.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                      quiz.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {quiz.difficulty.toUpperCase()}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{quiz.title}</h3>
                <p className="text-surface-400 text-sm mb-4">{quiz.description}</p>
                {isCompleted && <p className="text-sm text-emerald-400 mb-3">Come back tomorrow to play again!</p>}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Trophy className="w-4 h-4" />
                    <span className="font-semibold">{quiz.xp_reward} XP</span>
                  </div>
                  {!isCompleted && <ChevronRight className="w-5 h-5 text-surface-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={isNative ? 'p-4' : 'max-w-2xl mx-auto p-6'}>
      {!showResults ? (
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-white">{currentQuiz?.title}</h2>
              <span className="text-surface-400 font-medium">
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </span>
            </div>
            <div className="w-full bg-surface-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center mb-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timeLeft <= 5 ? 'bg-red-500/20 text-red-400 animate-pulse' :
              timeLeft <= 10 ? 'bg-amber-500/20 text-amber-400' :
              'bg-emerald-500/20 text-emerald-400'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="text-2xl font-bold tabular-nums">{timeLeft}s</span>
            </div>
          </div>

          <Card className="p-6 mb-6">
            <h3 className="text-2xl font-semibold text-white mb-6">{currentQuestion?.question}</h3>

            <div className="space-y-3">
              {(questionAnswers[currentQuestion?.id ?? ''] || []).map((answer, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left py-4 px-5 text-lg"
                  onClick={() => handleAnswer(answer)}
                  disabled={loading}
                >
                  {answer}
                </Button>
              ))}
            </div>
          </Card>

          {currentQuestion?.reference && (
            <div className="text-center text-surface-500 text-sm">
              <span>📖 {currentQuestion.reference}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <Trophy className="w-24 h-24 text-amber-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
          <p className="text-2xl text-amber-400 font-semibold mb-2">
            {score} / {totalQuestions} correct
          </p>
          {currentQuiz && score > 0 && (
            <p className="text-xl text-emerald-400 font-semibold mb-8">
              🎉 You earned {currentQuiz.xp_reward} XP!
            </p>
          )}

          <div className="flex gap-4 justify-center">
            <Button onClick={() => setCurrentQuizId(null)} variant="outline">
              Back to Quizzes
            </Button>
            {!playedToday.has(currentQuizId!) && (
              <Button onClick={() => startQuiz(currentQuizId!)}>Try Again</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
