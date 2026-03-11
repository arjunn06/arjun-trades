
CREATE TABLE public.blog_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id uuid NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  session_start timestamptz NOT NULL DEFAULT now(),
  duration_seconds integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_sessions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a session
CREATE POLICY "Anyone can record a session" ON public.blog_sessions
  FOR INSERT TO public
  WITH CHECK (true);

-- Anyone can update their own session (to set duration)
CREATE POLICY "Anyone can update sessions" ON public.blog_sessions
  FOR UPDATE TO public
  USING (true)
  WITH CHECK (true);

-- Admins can read all sessions
CREATE POLICY "Admins can read sessions" ON public.blog_sessions
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));
