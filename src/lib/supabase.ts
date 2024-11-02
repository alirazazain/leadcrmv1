import { createClient } from '@supabase/supabase-js';

// Default to empty strings to prevent URL construction error
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Add a check for development environment
if (import.meta.env.DEV && (!supabaseUrl || !supabaseKey)) {
  console.warn(
    'Missing Supabase credentials. Make sure to add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.'
  );
}