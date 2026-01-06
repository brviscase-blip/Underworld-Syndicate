
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const SUPABASE_URL = 'https://nkiyhniwgotnlczqaigk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5raXlobml3Z290bmxjenFhaWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NjQyOTcsImV4cCI6MjA4MzI0MDI5N30.KUDXh_z8gq9lFtLEhMrHjlSamYjuYgP7vE0c4Cd2V4w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
