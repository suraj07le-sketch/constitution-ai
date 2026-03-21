-- 1. Unique Identification:
-- Users are uniquely identified by 'user_id' which references 'auth.users'

CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_status TEXT DEFAULT 'active',
    last_crop_operation TIMESTAMPTZ DEFAULT now(), -- Terminolgy: Crop Operation
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Indices for Identification
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);

-- 3. Automatic "Crop Operation" Update every 6 days
-- Note: 'pg_cron' must be enabled in your Supabase project (Settings -> Database -> Extensions)

-- To enable the automated 6-day cycle, uncomment the lines below and run them:
-- SELECT cron.schedule(
--   'six-day-automatic-crop-op',
--   '0 0 */6 * *', 
--   'INSERT INTO public.sessions (user_id, last_crop_operation) SELECT id, now() FROM auth.users'
-- );

-- 4. RLS for Security
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Individual access" ON public.sessions;
CREATE POLICY "Individual access" ON public.sessions
    FOR ALL USING (auth.uid() = user_id);

-- Summary of Automation:
-- This script creates a 'sessions' table linked to your users.
-- The commented 'cron.schedule' code (when executed in Supabase SQL editor) 
-- will automatically perform a "crop operation" (new row insertion) for all users every 6 days.
