-- Public livestream trading record (the "Public livestream record" card on the home page).
-- Each row is one update: a day's result, or a single trade added live from the admin panel.
-- The totals on the site are the sum of all rows. Anyone can read (the record is public by design);
-- only admins can add, change or delete. Safe to run more than once.

CREATE TABLE IF NOT EXISTS public.livestream_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- The day the trades happened (India time). Defaults to today.
  entry_date date NOT NULL DEFAULT ((now() AT TIME ZONE 'Asia/Kolkata')::date),
  wins integer NOT NULL DEFAULT 0 CHECK (wins BETWEEN 0 AND 1000),
  losses integer NOT NULL DEFAULT 0 CHECK (losses BETWEEN 0 AND 1000),
  -- Optional short label. Readable by anyone who queries the table, so keep it neutral.
  label text CHECK (label IS NULL OR char_length(label) <= 200),
  -- When the entry was added. "Last updated" on the site is the latest of these.
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (wins + losses > 0)
);

-- Admin check used by the policies below. It reads user_roles directly (as the table owner, so row-level security
-- on user_roles can't hide the caller's own row) instead of depending on a has_role() helper, which this database
-- does not have.
CREATE OR REPLACE FUNCTION public.livestream_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.livestream_is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.livestream_is_admin() TO authenticated;

ALTER TABLE public.livestream_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read livestream results" ON public.livestream_results;
CREATE POLICY "Anyone can read livestream results" ON public.livestream_results
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can add livestream results" ON public.livestream_results;
CREATE POLICY "Admins can add livestream results" ON public.livestream_results
  FOR INSERT TO authenticated WITH CHECK (public.livestream_is_admin());

DROP POLICY IF EXISTS "Admins can update livestream results" ON public.livestream_results;
CREATE POLICY "Admins can update livestream results" ON public.livestream_results
  FOR UPDATE TO authenticated
  USING (public.livestream_is_admin())
  WITH CHECK (public.livestream_is_admin());

DROP POLICY IF EXISTS "Admins can delete livestream results" ON public.livestream_results;
CREATE POLICY "Admins can delete livestream results" ON public.livestream_results
  FOR DELETE TO authenticated USING (public.livestream_is_admin());

-- Totals for the site, computed in the database so the page never downloads every row.
CREATE OR REPLACE FUNCTION public.livestream_record()
RETURNS json
LANGUAGE sql
STABLE
AS $$
  SELECT json_build_object(
    'wins', COALESCE(sum(wins), 0),
    'losses', COALESCE(sum(losses), 0),
    'last_updated', max(created_at)
  ) FROM public.livestream_results;
$$;

GRANT EXECUTE ON FUNCTION public.livestream_record() TO anon, authenticated;

-- Let the home page hear about new entries live (Supabase Realtime).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'livestream_results'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.livestream_results;
  END IF;
END $$;

-- Opening record: 88 wins and 40 losses across all public livestreams from May 2026 up to 16 Oct 2026.
-- Inserted only when the table is empty, so re-running this file never double counts.
-- created_at is pinned to 16 Oct 2026 (India time) so "Last updated" shows when these numbers were true,
-- not the day this file happens to be run.
INSERT INTO public.livestream_results (entry_date, wins, losses, label, created_at)
SELECT DATE '2026-10-16', 88, 40, 'Opening record: public livestreams from May 2026 to 16 Oct 2026',
       TIMESTAMPTZ '2026-10-16 00:00:00+05:30'
WHERE NOT EXISTS (SELECT 1 FROM public.livestream_results);

-- Ask PostgREST (the API layer) to reload so the new table and function are usable immediately.
NOTIFY pgrst, 'reload schema';
