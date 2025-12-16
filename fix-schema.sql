-- Fix Supabase Schema for FinERP
-- Run this in your Supabase SQL Editor

-- First, check current projects table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;

-- Add missing columns (safe to run multiple times)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'PROGRESSIVE' CHECK (type IN ('PROGRESSIVE', 'PARALLEL'));
ALTER TABLE projects ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'));
ALTER TABLE projects ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_id UUID;

-- Check if we have a 'title' column and rename it to 'name' if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'projects' AND column_name = 'title') THEN
        -- If title exists and name doesn't, rename title to name
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name = 'projects' AND column_name = 'name') THEN
            ALTER TABLE projects RENAME COLUMN title TO name;
        END IF;
    END IF;
END $$;

-- Fill missing data for existing records
UPDATE projects SET
  name = COALESCE(name, 'Untitled Project'),
  type = COALESCE(type, 'PROGRESSIVE'),
  priority = COALESCE(priority, 'MEDIUM'),
  start_date = COALESCE(start_date, CURRENT_DATE),
  end_date = COALESCE(end_date, CURRENT_DATE + INTERVAL '30 days')
WHERE name IS NULL OR type IS NULL OR priority IS NULL OR start_date IS NULL OR end_date IS NULL;

-- For owner_id, if it's null, we'll need to set it later when creating projects
-- For now, make it nullable but add a check for future inserts

-- Drop unnecessary columns if they exist
ALTER TABLE projects DROP COLUMN IF EXISTS status;

-- Verify the final structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'projects'
ORDER BY ordinal_position;
