// Shared Supabase client — imported by every page that needs the database or auth.
// Replace the two placeholder values below with your project's real values from
// Project Settings → API in the Supabase dashboard.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'YOUR_PROJECT_URL'; // e.g. https://xxxxx.supabase.co
const supabaseKey = 'YOUR_ANON_PUBLIC_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
