-- Group calls tracking table
CREATE TABLE IF NOT EXISTS group_calls (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  started_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  call_type text NOT NULL DEFAULT 'voice', -- 'voice' | 'video'
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

ALTER TABLE group_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view calls"
  ON group_calls FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_calls.group_id
        AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can start calls"
  ON group_calls FOR INSERT
  WITH CHECK (
    auth.uid() = started_by AND
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_calls.group_id
        AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Call starter can end calls"
  ON group_calls FOR UPDATE
  USING (auth.uid() = started_by);
