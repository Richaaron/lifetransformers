-- Add UPDATE and DELETE policies for storage objects so users can upsert and remove their own media

-- Avatars
CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- Posts
CREATE POLICY "Users can update their own post images"
  ON storage.objects FOR UPDATE
  WITH CHECK (bucket_id = 'posts' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own post images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'posts' AND auth.uid() = owner);

-- Videos
CREATE POLICY "Users can update their own videos"
  ON storage.objects FOR UPDATE
  WITH CHECK (bucket_id = 'videos' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'videos' AND auth.uid() = owner);
