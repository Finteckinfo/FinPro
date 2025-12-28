-- FinPro Database Security Hardening Script
-- Execute this in your Supabase SQL Editor to resolve "mutable search_path" warnings.

-- 1. Hardening allocate_project_funds
CREATE OR REPLACE FUNCTION public.allocate_project_funds(p_project_id BIGINT, p_amount DOUBLE PRECISION)
RETURNS void AS $$
BEGIN
  UPDATE projects
  SET allocated_funds = allocated_funds + p_amount,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = p_project_id;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2. Hardening update_messages_updated_at
CREATE OR REPLACE FUNCTION public.update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 3. Hardening update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Security hardening completed: All functions now have an explicit search_path.';
END $$;
