-- Migration: 012_post_reactions.sql
-- Replaces the simple "likes" system with a faith-themed multi-reaction system

-- Create post_reactions table
CREATE TABLE IF NOT EXISTS post_reactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reaction_type text NOT NULL CHECK (reaction_type IN ('amen', 'love', 'praying', 'inspired', 'like')),
  created_at timestamptz DEFAULT now(),
  -- Each user can only leave ONE reaction per post
  UNIQUE (post_id, user_id)
);

-- Enable RLS
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reactions are viewable by authenticated users"
  ON post_reactions FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own reactions"
  ON post_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reactions"
  ON post_reactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
  ON post_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- XP trigger: award XP to post author when they receive a reaction
-- We keep the existing likes table for backwards compatibility
-- but new reactions flow through post_reactions.
