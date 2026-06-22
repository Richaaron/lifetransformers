-- Add profile fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hobby text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
