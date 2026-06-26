-- Add push subscription support to user_devices
ALTER TABLE user_devices 
ADD COLUMN IF NOT EXISTS push_subscription JSONB;
