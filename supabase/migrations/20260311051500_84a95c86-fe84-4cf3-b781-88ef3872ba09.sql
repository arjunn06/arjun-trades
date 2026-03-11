
-- Contact submissions table
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
  FOR INSERT TO public WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can read contact submissions" ON public.contact_submissions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update (mark as read)
CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete contact submissions" ON public.contact_submissions
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Blog views table
CREATE TABLE public.blog_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id uuid NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  viewer_ip text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a view
CREATE POLICY "Anyone can record a view" ON public.blog_views
  FOR INSERT TO public WITH CHECK (true);

-- Anyone can count views (for public display)
CREATE POLICY "Anyone can read view counts" ON public.blog_views
  FOR SELECT TO public USING (true);

-- Create index for faster view counting
CREATE INDEX idx_blog_views_blog_id ON public.blog_views(blog_id);
