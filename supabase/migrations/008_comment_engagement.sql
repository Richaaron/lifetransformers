-- Add parent_id column to comments table to allow replies
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES comments(id) ON DELETE CASCADE;

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE NOT null,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT null,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (comment_id, user_id)
);

-- Enable RLS on comment_likes
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Comment likes RLS policies
CREATE POLICY "Comment likes are viewable by authenticated users"
  ON comment_likes FOR SELECT
  USING (auth.uid() IS NOT null);

CREATE POLICY "Users can insert their own comment likes"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comment likes"
  ON comment_likes FOR DELETE
  USING (auth.uid() = user_id);
