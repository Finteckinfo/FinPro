-- FinPro Database Security & Performance Hardening Script (Updated)
-- Execute this in your Supabase SQL Editor to resolve RLS performance and redundancy warnings.

-- 1. Hardening Functions (search_path fix)
CREATE OR REPLACE FUNCTION public.allocate_project_funds(p_project_id BIGINT, p_amount DOUBLE PRECISION)
RETURNS void AS $$
BEGIN
  UPDATE projects
  SET allocated_funds = allocated_funds + p_amount,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_project_id;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2. Consolidating Redundant Policies (users table)
DROP POLICY IF EXISTS "Enable read access to users" ON users;
-- Note: "Public Users Access" already exists and covers this.

-- 3. Optimizing RLS Policy Performance (messages table)
-- Wrapping current_setting in a subquery prevents re-evaluation for every row.

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

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Hardening completed: Functions secured, users policies consolidated, and messages policies optimized.';
END $$;
