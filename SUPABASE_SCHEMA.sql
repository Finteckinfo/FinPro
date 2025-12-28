-- Supabase Schema for FinERP - CLEAN RECREATION
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STEP 1: Drop all existing tables (if any) to ensure clean recreation
DROP TABLE IF EXISTS task_attachments CASCADE;
DROP TABLE IF EXISTS project_tags CASCADE;
DROP TABLE IF EXISTS project_invites CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- STEP 2: Create tables fresh
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('PROGRESSIVE', 'PARALLEL')),
  priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  escrow_address TEXT,
  escrow_funded BOOLEAN DEFAULT FALSE,
  released_funds DECIMAL(20,2) DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  owner_id UUID NOT NULL,
  wallet_address TEXT,
  user_id UUID,
  is_public BOOLEAN DEFAULT FALSE,
  allow_guests BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('MAJOR', 'MINOR')),
  description TEXT,
  order_index INTEGER NOT NULL,
  is_visible BOOLEAN DEFAULT TRUE,
  color TEXT,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('PROJECT_OWNER', 'PROJECT_MANAGER', 'EMPLOYEE')),
  department_order INTEGER[] DEFAULT '{}',
  department_scope INTEGER[] DEFAULT '{}',
  managed_departments UUID[] DEFAULT '{}',
  accessible_departments UUID[] DEFAULT '{}',
  assigned_tasks UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'APPROVED')),
  archived_at TIMESTAMP WITH TIME ZONE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_role_id UUID REFERENCES user_roles(id) ON DELETE SET NULL,
  priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  estimated_hours DECIMAL(6,2),
  actual_hours DECIMAL(6,2),
  due_date DATE,
  start_date DATE,
  end_date DATE,
  is_all_day BOOLEAN DEFAULT FALSE,
  time_zone TEXT DEFAULT 'UTC',
  progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  checklist_count INTEGER DEFAULT 0,
  checklist_completed INTEGER DEFAULT 0,
  created_by_role_id UUID REFERENCES user_roles(id) ON DELETE SET NULL,
  payment_amount DECIMAL(20,2),
  payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'ALLOCATED', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED')),
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_tx_hash TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE project_invites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('PROJECT_MANAGER', 'EMPLOYEE')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE project_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#615fff',
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, name)
);

CREATE TABLE task_attachments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 3: Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create basic RLS policies (allowing all operations for now - adjust as needed)
CREATE POLICY "Enable all operations on projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations on departments" ON departments FOR ALL USING (true) WITH CHECK (true);
-- Consolidated into Public Users Access in subsequent migrations
-- CREATE POLICY "Enable read access to users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable update for own user data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable all operations on user roles" ON user_roles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations on project invites" ON project_invites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations on project tags" ON project_tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations on task attachments" ON task_attachments FOR ALL USING (true) WITH CHECK (true);

-- STEP 5: Create indexes for better performance
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_is_public ON projects(is_public);
CREATE INDEX idx_departments_project_id ON departments(project_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_department_id ON tasks(department_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_project_id ON user_roles(project_id);

-- STEP 6: Create updated_at trigger function and apply to all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql' SET search_path = public;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
