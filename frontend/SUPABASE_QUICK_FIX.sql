-- Quick Fix: Drop existing policies and recreate them
-- Run this in Supabase SQL Editor

DROP POLICY IF EXISTS "Allow all operations" ON users;
DROP POLICY IF EXISTS "Allow all operations" ON projects;
DROP POLICY IF EXISTS "Allow all operations" ON tasks;

-- Now recreate them
CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);

