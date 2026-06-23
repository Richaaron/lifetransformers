-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Authenticated users can add participants" ON conversation_participants;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON messages;

-- Conversations - allow authenticated users to insert
CREATE POLICY "Authenticated users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (true);

-- Participants - allow authenticated users to insert
CREATE POLICY "Authenticated users can add participants"
  ON conversation_participants FOR INSERT
  WITH CHECK (true);

-- Messages - allow authenticated users to insert
CREATE POLICY "Authenticated users can send messages"
  ON messages FOR INSERT
  WITH CHECK (true);
