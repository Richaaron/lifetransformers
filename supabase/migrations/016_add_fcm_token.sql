-- Add FCM token column to user_devices
ALTER TABLE user_devices
ADD COLUMN IF NOT EXISTS fcm_token TEXT;
