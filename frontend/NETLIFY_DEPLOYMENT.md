# Netlify Deployment Guide for FinERP

This guide will help you deploy FinERP frontend to Netlify and set up a free Supabase database.

## Prerequisites

1. A GitHub account (for connecting to Netlify)
2. A Netlify account (free tier is sufficient)
3. A Supabase account (free tier is sufficient)

## Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "New Project"
4. Fill in:
   - **Project Name**: `finerp-db`
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
5. Click "Create new project" (takes 1-2 minutes)

### 1.2 Get Database Connection String

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Copy the **URI** connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
4. Save this for later

### 1.3 Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Run the following SQL to create basic tables:

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
```

### 1.4 Get Supabase API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://[PROJECT-REF].supabase.co`
   - **anon/public key**: (starts with `eyJ...`)
   - **service_role key**: (keep this secret, for server-side only)

## Step 2: Deploy to Netlify

### 2.1 Connect Repository

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your GitHub
5. Select the `FinERP` repository
6. Select the `frontend` folder (or configure build settings)

### 2.2 Configure Build Settings

Netlify should auto-detect these settings, but verify:

- **Base directory**: `frontend` (if deploying from root repo) or leave empty if deploying from frontend folder
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 2.3 Set Environment Variables

In Netlify dashboard, go to **Site settings** → **Environment variables** and add:

#### Network RPC URLs
```
VITE_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
```

#### FIN Token Addresses (after deployment)
```
VITE_FIN_TOKEN_ADDRESS_ETH=
VITE_FIN_TOKEN_ADDRESS_POLYGON=
VITE_FIN_TOKEN_ADDRESS_SEPOLIA=
```

#### Smart Contract Addresses (after deployment)
```
VITE_ESCROW_CONTRACT_ADDRESS=
VITE_DEX_CONTRACT_ADDRESS=
VITE_FAUCET_CONTRACT_ADDRESS=
```

#### WalletConnect
```
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

#### Gelato Relay
```
VITE_GELATO_RELAY_API_KEY=your_gelato_api_key
VITE_USE_GASLESS_FAUCET=true
```

#### Supabase Database
```
VITE_SUPABASE_URL=https://[PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

#### Backend API (use Supabase REST API or your backend URL)
```
VITE_BACKEND_URL=https://[PROJECT-REF].supabase.co
VITE_API_URL=https://[PROJECT-REF].supabase.co/rest/v1
```

#### Block Explorer API Keys
```
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key
VITE_POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

#### Domain Configuration
```
VITE_SSO_PRIMARY_DOMAIN=https://your-netlify-site.netlify.app
VITE_COOKIE_DOMAIN=.netlify.app
```

### 2.4 Deploy

1. Click "Deploy site"
2. Wait for build to complete (usually 2-5 minutes)
3. Your site will be live at `https://[random-name].netlify.app`

### 2.5 Custom Domain (Optional)

1. Go to **Domain settings** → **Add custom domain**
2. Follow Netlify's instructions to configure DNS
3. Update `VITE_SSO_PRIMARY_DOMAIN` and `VITE_COOKIE_DOMAIN` with your custom domain

## Step 3: Set Up Supabase Client in Frontend

### 3.1 Install Supabase Client

```bash
cd frontend
npm install @supabase/supabase-js
```

### 3.2 Create Supabase Service

Create `frontend/src/services/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations
export const db = {
  // Users
  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    return { data, error };
  },

  async createUser(userData: {
    email: string;
    wallet_address?: string;
    first_name?: string;
    last_name?: string;
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    return { data, error };
  },

  // Projects
  async getProjectsByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createProject(projectData: {
    owner_id: string;
    title: string;
    description?: string;
    budget?: number;
    escrow_address?: string;
  }) {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    return { data, error };
  },

  // Tasks
  async getTasksByProject(projectId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    return { data, error };
  },
};
```

### 3.3 Update Project API Service

Update `frontend/src/services/projectApi.ts` to use Supabase instead of mock data.

## Step 4: Enable Row Level Security (RLS)

In Supabase SQL Editor, run:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth requirements)
-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Allow project owners to manage their projects
CREATE POLICY "Owners can manage projects" ON projects
  FOR ALL USING (auth.uid()::text = owner_id::text);

-- Allow users to read tasks from their projects
CREATE POLICY "Users can read project tasks" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.owner_id = auth.uid()::text
    )
  );
```

## Step 5: Test the Deployment

1. Visit your Netlify site URL
2. Test wallet connection
3. Test project creation (should save to Supabase)
4. Check Supabase dashboard → **Table Editor** to verify data

## Troubleshooting

### Build Fails
- Check Netlify build logs
- Ensure all environment variables are set
- Verify Node version (should be 18+)

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Verify RLS policies allow your operations

### CORS Errors
- Supabase handles CORS automatically
- If using custom backend, configure CORS headers

## Free Tier Limits

### Netlify
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

### Supabase
- 500 MB database
- 2 GB bandwidth
- 50,000 monthly active users
- 2 million API requests/month

## Next Steps

1. Deploy smart contracts to testnet
2. Update contract addresses in Netlify environment variables
3. Test full workflow: wallet → project → escrow → payment
4. Set up custom domain
5. Configure monitoring and error tracking (Sentry, etc.)

## Support

- Netlify Docs: https://docs.netlify.com
- Supabase Docs: https://supabase.com/docs
- FinERP Issues: GitHub Issues

