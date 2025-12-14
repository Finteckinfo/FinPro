/**
 * Supabase client (frontend)
 * - Uses VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * - Safe to import anywhere; will be null if not configured
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const isSupabaseConfigured = !!supabase;

export const isSupabaseOnly =
  isSupabaseConfigured && !(import.meta as any).env?.VITE_BACKEND_URL;


