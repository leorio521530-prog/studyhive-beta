// Shared Supabase client — imported by every page that needs the database or auth.
// Replace the two placeholder values below with your project's real values from
// Project Settings → API in the Supabase dashboard.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://stlvhydxkyyawiwajvhn.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0bHZoeWR4a3l5YXdpd2FqdmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3OTYyMTcsImV4cCI6MjEwMzM3MjIxN30.kWXcY57j6M1kRFTpY6JBsJ5wPineXoQGWjqCHLpp8ds';

export const supabase = createClient(supabaseUrl, supabaseKey);
