import { createClient } from '@/lib/supabase/client';

export type GameType = 
  | 'bible_quiz'
  | 'verse_memory'
  | 'who_said_it'
  | 'story_quiz'
  | 'bookshelf'
  | 'trivia_tower'
  | 'bible_bee'
  | 'family_tree'
  | 'promise_match';

/**
 * Check if a user has already played a specific game/challenge today
 * @param userId - The user ID
 * @param gameType - The type of game
 * @param challengeId - The challenge/quiz ID
 * @returns true if user has already played today, false otherwise
 */
export async function hasPlayedToday(
  userId: string,
  gameType: GameType,
  challengeId: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const { data, error } = await supabase
      .from('game_session_limits')
      .select('id')
      .eq('user_id', userId)
      .eq('game_type', gameType)
      .eq('challenge_id', challengeId)
      .eq('last_played_date', today)
      .single();

    if (error) {
      // PGRST116 is \"no rows found\" error (expected when user hasn't played)
      // If we get a different error, it might mean the table doesn't exist yet
      if (error.code === 'PGRST116') {
        return false;
      }
      // Log other errors for debugging but don't block
      console.warn('Play limit check error (this is OK if migration not yet applied):', error.code, error.message);
      // Safely return false to allow play when table doesn't exist
      return false;
    }

    return !!data;
  } catch (error) {
    console.warn('Error checking play limit (allowing play):', error);
    // Return false on error to allow play (safer fallback)
    return false;
  }
}

/**
 * Record that a user has played a game/challenge today
 * @param userId - The user ID
 * @param gameType - The type of game
 * @param challengeId - The challenge/quiz ID
 */
export async function recordGamePlay(
  userId: string,
  gameType: GameType,
  challengeId: string
): Promise<void> {
  try {
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Try to insert, or update if already exists today
    const { error } = await supabase
      .from('game_session_limits')
      .upsert(
        {
          user_id: userId,
          game_type: gameType,
          challenge_id: challengeId,
          last_played_date: today,
          play_count: 1,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,game_type,challenge_id,last_played_date',
        }
      );

    if (error) {
      console.warn('Error recording game play (this is OK if migration not yet applied):', error.code, error.message);
      // Don't throw - silently continue even if table doesn't exist
    }
  } catch (error) {
    console.warn('Error recording game play (allowing play to continue):', error);
    // Don't throw - silently continue
  }
}

/**
 * Get remaining play attempts for a game/challenge today
 * @param userId - The user ID
 * @param gameType - The type of game
 * @param challengeId - The challenge/quiz ID
 * @param maxPlayCount - Maximum allowed plays per day (default: 1)
 * @returns Number of remaining plays (0 if none left)
 */
export async function getRemainingPlayCount(
  userId: string,
  gameType: GameType,
  challengeId: string,
  maxPlayCount: number = 1
): Promise<number> {
  try {
    const played = await hasPlayedToday(userId, gameType, challengeId);
    return played ? 0 : maxPlayCount;
  } catch (error) {
    console.error('Error getting remaining play count:', error);
    return maxPlayCount; // Allow play on error
  }
}
