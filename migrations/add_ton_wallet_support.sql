-- Add ton_wallet_address to telegram_users
ALTER TABLE telegram_users 
ADD COLUMN IF NOT EXISTS ton_wallet_address TEXT;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_telegram_users_ton_address ON telegram_users(ton_wallet_address);

-- Notify
DO $$
BEGIN
  RAISE NOTICE 'Added ton_wallet_address column to telegram_users table';
END $$;
