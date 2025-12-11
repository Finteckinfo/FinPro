# Supabase Database Setup for FinERP

## Quick Setup Guide

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up (free account)
3. Click "New Project"
4. Fill in:
   - **Name**: `finerp-db`
   - **Database Password**: (save securely)
   - **Region**: Choose closest to you
5. Wait 1-2 minutes for project creation

### 2. Get Your Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://[PROJECT-REF].supabase.co`
   - **anon/public key**: (starts with `eyJ...`)

### 3. Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Run this SQL:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  wallet_address VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  budget DECIMAL(18, 2),
  status VARCHAR(50) DEFAULT 'active',
  escrow_address VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  assigned_to UUID REFERENCES users(id),
  payment_amount DECIMAL(18, 2),
  payment_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
```

### 4. Configure Row Level Security (Optional but Recommended)

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on your auth needs)
-- For now, allow all operations (you can restrict later)
CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);
```

### 5. Add to Netlify Environment Variables

In Netlify dashboard → Site settings → Environment variables:

```
VITE_SUPABASE_URL=https://[PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_BACKEND_URL=https://[PROJECT-REF].supabase.co
VITE_API_URL=https://[PROJECT-REF].supabase.co/rest/v1
```

## Using Supabase in Your Code

The Supabase service is already set up in `src/services/supabase.ts`. Use it like this:

```typescript
import { db } from '@/services/supabase';

// Create a user
const { data, error } = await db.users.create({
  email: 'user@example.com',
  wallet_address: '0x...',
  first_name: 'John',
  last_name: 'Doe'
});

// Get user by email
const { data: user } = await db.users.getByEmail('user@example.com');

// Create a project
const { data: project } = await db.projects.create({
  owner_id: user.id,
  title: 'My Project',
  description: 'Project description',
  budget: 10000
});
```

## Free Tier Limits

- **Database**: 500 MB
- **Bandwidth**: 2 GB/month
- **API Requests**: 2 million/month
- **File Storage**: 1 GB
- **Monthly Active Users**: 50,000

Perfect for testing and small projects!

## Next Steps

1. Test database connection in your app
2. Update `projectApi.ts` to use Supabase instead of REST API (optional)
3. Set up authentication if needed
4. Configure RLS policies for production

