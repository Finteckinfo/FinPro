import { createClient } from '@supabase/supabase-js';
import { APP_CONFIG } from './config';

const { url, anonKey } = APP_CONFIG.supabase;

if (!url || !anonKey) {
    console.warn('Supabase environment variables are missing. Some features may not work correctly.');
}

export const supabase = createClient(
    url || 'https://placeholder.supabase.co',
    anonKey || 'placeholder-key'
);
