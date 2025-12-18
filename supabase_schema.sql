-- Aligning with frontend uses 'subtasks' and 'task_attachments'
-- and ensuring all columns support EVM wallet addresses

-- 1. Correct any naming discrepancies and drop conflicting constraints
ALTER TABLE IF EXISTS tasks RENAME TO subtasks;
ALTER TABLE IF EXISTS projects DROP COLUMN IF EXISTS user_id; -- owner_id is our main identifier

-- 2. Drop foreign key constraints that reference users.id (using cascades and IF EXISTS)
ALTER TABLE IF EXISTS user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE IF EXISTS subtasks DROP CONSTRAINT IF EXISTS tasks_assigned_to_fkey;
ALTER TABLE IF EXISTS subtasks DROP CONSTRAINT IF EXISTS subtasks_assigned_to_fkey;
ALTER TABLE IF EXISTS task_attachments DROP CONSTRAINT IF EXISTS task_attachments_uploaded_by_fkey;

-- 3. Alter users table id to TEXT (to store wallet addresses like '0x123...')
ALTER TABLE users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE users ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- 4. Alter referencing columns to TEXT in projects and subtasks
ALTER TABLE projects ALTER COLUMN owner_id TYPE TEXT USING owner_id::text;
ALTER TABLE user_roles ALTER COLUMN user_id TYPE TEXT USING user_id::text;
ALTER TABLE IF EXISTS subtasks ALTER COLUMN assigned_to TYPE TEXT USING assigned_to::text;
ALTER TABLE IF EXISTS task_attachments ALTER COLUMN uploaded_by TYPE TEXT USING uploaded_by::text;

-- 5. Re-add Foreign Key constraints
ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE subtasks ADD CONSTRAINT subtasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE task_attachments ADD CONSTRAINT task_attachments_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL;

-- 6. Additional Tables for FinPro (Migrated from D1)
CREATE TABLE IF NOT EXISTS token_balances (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_type TEXT NOT NULL,
  balance DOUBLE PRECISION NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_token_balances_user_token ON token_balances(user_id, token_type);

CREATE TABLE IF NOT EXISTS swap_transactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_token TEXT NOT NULL,
  to_token TEXT NOT NULL,
  from_amount DOUBLE PRECISION NOT NULL,
  to_amount DOUBLE PRECISION NOT NULL,
  exchange_rate DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_swap_transactions_user ON swap_transactions(user_id);

CREATE TABLE IF NOT EXISTS token_transactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_type TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  transaction_type TEXT NOT NULL,
  reference_id BIGINT,
  reference_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_token_transactions_user ON token_transactions(user_id);

-- Atomic increment function for project funds
CREATE OR REPLACE FUNCTION allocate_project_funds(p_project_id BIGINT, p_amount DOUBLE PRECISION)
RETURNS void AS $$
BEGIN
  UPDATE projects
  SET allocated_funds = allocated_funds + p_amount,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_project_id;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to sync their own wallet addresses
DROP POLICY IF EXISTS "Public Users Access" ON users;
CREATE POLICY "Public Users Access" ON users FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Projects Access" ON projects;
CREATE POLICY "Public Projects Access" ON projects FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Tasks Access" ON subtasks;
CREATE POLICY "Public Tasks Access" ON subtasks FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Token Balances Access" ON token_balances;
CREATE POLICY "Public Token Balances Access" ON token_balances FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Swap Transactions Access" ON swap_transactions;
CREATE POLICY "Public Swap Transactions Access" ON swap_transactions FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Token Transactions Access" ON token_transactions;
CREATE POLICY "Public Token Transactions Access" ON token_transactions FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public User Roles Access" ON user_roles;
CREATE POLICY "Public User Roles Access" ON user_roles FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Task Attachments Access" ON task_attachments;
CREATE POLICY "Public Task Attachments Access" ON task_attachments FOR ALL TO anon USING (true) WITH CHECK (true);
