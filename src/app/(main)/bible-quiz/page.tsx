import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import BibleQuizClient from './BibleQuizClient';

export const metadata: Metadata = {
  title: 'Bible Quiz - Life Transformers',
  description: 'Test your Bible knowledge and earn XP!',
};

export default async function BibleQuizPage() {
  const supabase = await createClient();

  const { data: quizzes } = await supabase
    .from('bible_quizzes')
    .select('*')
    .order('created_at', { ascending: true });

  const { data: questions } = await supabase
    .from('bible_quiz_questions')
    .select('*')
    .order('order_index', { ascending: true });

  return <BibleQuizClient initialQuizzes={quizzes || []} initialQuestions={questions || []} />;
}
