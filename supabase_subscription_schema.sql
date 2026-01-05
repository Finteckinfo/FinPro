-- =====================================================
-- FinPro Subscription & Revenue Schema Extension
-- Add to existing supabase_schema.sql
-- =====================================================

-- 1. Subscription Tiers Table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  max_projects INT, -- NULL means unlimited
  features JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Subscriptions Table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier_id TEXT NOT NULL REFERENCES subscription_tiers(id),
  status TEXT NOT NULL DEFAULT 'active', -- active, canceled, expired, past_due
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- 3. Platform Fee Collection Log
CREATE TABLE IF NOT EXISTS platform_fees (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task_id BIGINT,
  amount DECIMAL(18,8) NOT NULL,
  fee_percentage INT NOT NULL,
  tx_hash TEXT NOT NULL,
  recipient_address TEXT NOT NULL,
  collected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Seed Default Subscription Tiers
INSERT INTO subscription_tiers (id, name, price_monthly, max_projects, features) VALUES
('free', 'Free', 0.00, 3, '{
  "analytics": false,
  "support": "community",
  "branding": false,
  "api_access": false,
  "priority_queue": false
}'::jsonb),
('pro', 'Pro', 35.00, NULL, '{
  "analytics": true,
  "support": "priority",
  "branding": "custom",
  "api_access": false,
  "priority_queue": true
}'::jsonb),
('enterprise', 'Enterprise', 350.00, NULL, '{
  "analytics": true,
  "support": "dedicated",
  "branding": "white-label",
  "api_access": true,
  "priority_queue": true,
  "custom_integrations": true
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 5. Enable RLS on new tables
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_fees ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
DROP POLICY IF EXISTS "Public Tier Access" ON subscription_tiers;
CREATE POLICY "Public Tier Access" ON subscription_tiers 
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Users Read Own Subscription" ON user_subscriptions;
CREATE POLICY "Users Read Own Subscription" ON user_subscriptions 
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Admin Manage Subscriptions" ON user_subscriptions;
CREATE POLICY "Admin Manage Subscriptions" ON user_subscriptions 
  FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Platform Fees Read Only" ON platform_fees;
CREATE POLICY "Platform Fees Read Only" ON platform_fees 
  FOR SELECT TO anon USING (true);

-- 7. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier_id ON user_subscriptions(tier_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_platform_fees_task_id ON platform_fees(task_id);
CREATE INDEX IF NOT EXISTS idx_platform_fees_collected_at ON platform_fees(collected_at DESC);

-- 8. Function to Get User's Active Subscription
CREATE OR REPLACE FUNCTION get_user_subscription(p_user_id TEXT)
RETURNS TABLE (
  tier_id TEXT,
  tier_name TEXT,
  max_projects INT,
  features JSONB,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    st.id,
    st.name,
    st.max_projects,
    st.features,
    us.expires_at
  FROM user_subscriptions us
  JOIN subscription_tiers st ON us.tier_id = st.id
  WHERE us.user_id = p_user_id 
    AND us.status = 'active'
    AND (us.expires_at IS NULL OR us.expires_at > NOW())
  LIMIT 1;
  
  -- If no active subscription, return free tier
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      st.id,
      st.name,
      st.max_projects,
      st.features,
      NULL::TIMESTAMP WITH TIME ZONE
    FROM subscription_tiers st
    WHERE st.id = 'free';
  END IF;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 9. Function to Check Project Creation Limit
CREATE OR REPLACE FUNCTION can_create_project(p_user_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_max_projects INT;
  v_current_count INT;
BEGIN
  -- Get max projects for user's tier
  SELECT max_projects INTO v_max_projects
  FROM get_user_subscription(p_user_id);
  
  -- NULL means unlimited
  IF v_max_projects IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Count user's active projects
  SELECT COUNT(*) INTO v_current_count
  FROM projects
  WHERE owner_id = p_user_id AND status = 'active';
  
  RETURN v_current_count < v_max_projects;
END;
$$ LANGUAGE plpgsql SET search_path = public;
