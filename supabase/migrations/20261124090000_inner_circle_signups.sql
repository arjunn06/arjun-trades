-- The Inner Circle - $100 Live Trading Challenge sign-ups.
-- Visitors can only add a row in the 'pending' state, and only with the educational-purposes box ticked.
-- Reading, inviting, rejecting and deleting are admin-only. Safe to run more than once.

CREATE TABLE IF NOT EXISTS public.inner_circle_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(btrim(email)) BETWEEN 3 AND 255),
  discord text NOT NULL CHECK (char_length(btrim(discord)) BETWEEN 2 AND 64),
  -- They ticked "I understand this challenge is for educational purposes only". A row can't exist without it,
  -- and created_at records when they ticked it.
  disclaimer_accepted boolean NOT NULL CHECK (disclaimer_accepted),
  -- 'pending' = waiting to be invited; 'invited' = invited to the platform and the Inner Circle; 'rejected' = set by an admin.
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- One sign-up per person.
CREATE UNIQUE INDEX IF NOT EXISTS inner_circle_signups_email_key
  ON public.inner_circle_signups (lower(btrim(email)));

-- Admin check used by the policies below. It reads user_roles directly (as the table owner, so row-level security
-- on user_roles can't hide the caller's own row) instead of depending on a has_role() helper, same as the Arena
-- and livestream tables.
CREATE OR REPLACE FUNCTION public.inner_circle_is_admin()
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

REVOKE ALL ON FUNCTION public.inner_circle_is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.inner_circle_is_admin() TO authenticated;

ALTER TABLE public.inner_circle_signups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can join the inner circle" ON public.inner_circle_signups;
CREATE POLICY "Anyone can join the inner circle" ON public.inner_circle_signups
  FOR INSERT TO public WITH CHECK (status = 'pending' AND disclaimer_accepted);

DROP POLICY IF EXISTS "Admins can read inner circle signups" ON public.inner_circle_signups;
CREATE POLICY "Admins can read inner circle signups" ON public.inner_circle_signups
  FOR SELECT TO authenticated USING (public.inner_circle_is_admin());

DROP POLICY IF EXISTS "Admins can update inner circle signups" ON public.inner_circle_signups;
CREATE POLICY "Admins can update inner circle signups" ON public.inner_circle_signups
  FOR UPDATE TO authenticated
  USING (public.inner_circle_is_admin())
  WITH CHECK (public.inner_circle_is_admin());

DROP POLICY IF EXISTS "Admins can delete inner circle signups" ON public.inner_circle_signups;
CREATE POLICY "Admins can delete inner circle signups" ON public.inner_circle_signups
  FOR DELETE TO authenticated USING (public.inner_circle_is_admin());

-- Ask PostgREST (the API layer) to reload so the new table is usable immediately.
NOTIFY pgrst, 'reload schema';
