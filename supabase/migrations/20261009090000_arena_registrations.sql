-- Ultimate IFVG Arena registrations (manual UPI).
-- Visitors can only add a row in the 'pending' state. Verifying, rejecting and reading are admin-only.
-- Safe to run more than once.

CREATE TABLE IF NOT EXISTS public.arena_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(btrim(email)) BETWEEN 3 AND 255),
  discord text NOT NULL CHECK (char_length(btrim(discord)) BETWEEN 2 AND 64),
  journey text CHECK (journey IS NULL OR char_length(journey) <= 500),
  -- The UPI reference the player paid with. An admin matches it against the UPI app before verifying.
  utr text NOT NULL CHECK (char_length(btrim(utr)) BETWEEN 8 AND 32),
  -- 'pending' = waiting for an admin to match the payment; 'verified' = payment matched; 'rejected' = set by an admin.
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- One entry per person, and one payment reference can only be used once.
CREATE UNIQUE INDEX IF NOT EXISTS arena_registrations_email_key
  ON public.arena_registrations (lower(btrim(email)));
CREATE UNIQUE INDEX IF NOT EXISTS arena_registrations_utr_key
  ON public.arena_registrations (upper(btrim(utr)));

-- Admin check used by the policies below. It reads user_roles directly (as the table owner, so row-level security
-- on user_roles can't hide the caller's own row) instead of depending on a has_role() helper.
CREATE OR REPLACE FUNCTION public.arena_is_admin()
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

REVOKE ALL ON FUNCTION public.arena_is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.arena_is_admin() TO authenticated;

ALTER TABLE public.arena_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can register for the arena" ON public.arena_registrations;
CREATE POLICY "Anyone can register for the arena" ON public.arena_registrations
  FOR INSERT TO public WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "Admins can read arena registrations" ON public.arena_registrations;
CREATE POLICY "Admins can read arena registrations" ON public.arena_registrations
  FOR SELECT TO authenticated USING (public.arena_is_admin());

DROP POLICY IF EXISTS "Admins can update arena registrations" ON public.arena_registrations;
CREATE POLICY "Admins can update arena registrations" ON public.arena_registrations
  FOR UPDATE TO authenticated USING (public.arena_is_admin());

DROP POLICY IF EXISTS "Admins can delete arena registrations" ON public.arena_registrations;
CREATE POLICY "Admins can delete arena registrations" ON public.arena_registrations
  FOR DELETE TO authenticated USING (public.arena_is_admin());

-- Public counter for the page: how many entries are confirmed. Returns a number only, never personal data.
CREATE OR REPLACE FUNCTION public.arena_stats()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object('entries', count(*)) FROM public.arena_registrations WHERE status = 'verified';
$$;

REVOKE ALL ON FUNCTION public.arena_stats() FROM public;
GRANT EXECUTE ON FUNCTION public.arena_stats() TO anon, authenticated;

-- Ask PostgREST (the API layer) to reload so the new table and functions are usable immediately.
NOTIFY pgrst, 'reload schema';
