import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string | undefined;

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawAnonKey &&
  rawUrl.trim() !== '' &&
  !rawUrl.includes('your-project-ref') &&
  !rawUrl.includes('placeholder')
);

// Fallback to valid URL structure so createClient never throws fatal module-load exception
const supabaseUrl = isSupabaseConfigured ? rawUrl! : 'https://placeholder.supabase.co';
const supabaseAnonKey = isSupabaseConfigured ? rawAnonKey! : 'placeholder-anon-key';

if (!isSupabaseConfigured) {
  console.warn('[Tejomay] Supabase environment variables not configured or using placeholders. Offline fallback store will be utilized.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
