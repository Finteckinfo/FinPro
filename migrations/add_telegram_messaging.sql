-- Migration: Add Telegram Users and Messaging Support
-- This migration adds tables for Telegram user mapping and in-app messaging

-- 1. Create telegram_users table
CREATE TABLE IF NOT EXISTS telegram_users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  telegram_id BIGINT UNIQUE NOT NULL,
  telegram_username TEXT,
  telegram_first_name TEXT,
  telegram_last_name TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'assignee' CHECK (role IN ('admin', 'assignee')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  from_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id BIGINT REFERENCES projects(id) ON DELETE SET NULL,
  subtask_id BIGINT REFERENCES subtasks(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_telegram_users_user_id ON telegram_users(user_id);
CREATE INDEX IF NOT EXISTS idx_telegram_users_telegram_id ON telegram_users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_messages_from_user ON messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_user ON messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_project ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);

-- 4. Enable Row Level Security
ALTER TABLE telegram_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for telegram_users
DROP POLICY IF EXISTS "Public Telegram Users Access" ON telegram_users;
CREATE POLICY "Public Telegram Users Access" 
  ON telegram_users 
  FOR ALL 
  TO anon 
  USING (true) 
  WITH CHECK (true);

-- 6. Create RLS policies for messages
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
CREATE POLICY "Users can view their own messages" 
  ON messages 
  FOR SELECT 
  TO anon 
  USING ((SELECT current_setting('request.jwt.claims', true))::json->>'user_id' = from_user_id 
         OR (SELECT current_setting('request.jwt.claims', true))::json->>'user_id' = to_user_id);

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" 
  ON messages 
  FOR INSERT 
  TO anon 
  WITH CHECK ((SELECT current_setting('request.jwt.claims', true))::json->>'user_id' = from_user_id);

DROP POLICY IF EXISTS "Users can update their received messages" ON messages;
CREATE POLICY "Users can update their received messages" 
  ON messages 
  FOR UPDATE 
  TO anon 
  USING ((SELECT current_setting('request.jwt.claims', true))::json->>'user_id' = to_user_id)
  WITH CHECK ((SELECT current_setting('request.jwt.claims', true))::json->>'user_id' = to_user_id);

-- 7. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 8. Create trigger for messages table
DROP TRIGGER IF EXISTS update_messages_updated_at_trigger ON messages;
CREATE TRIGGER update_messages_updated_at_trigger
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_messages_updated_at();

-- 9. Create trigger for telegram_users table
DROP TRIGGER IF EXISTS update_telegram_users_updated_at_trigger ON telegram_users;
CREATE TRIGGER update_telegram_users_updated_at_trigger
  BEFORE UPDATE ON telegram_users
  FOR EACH ROW
  EXECUTE FUNCTION update_messages_updated_at();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully: Telegram users and messaging tables created';
END $$;
