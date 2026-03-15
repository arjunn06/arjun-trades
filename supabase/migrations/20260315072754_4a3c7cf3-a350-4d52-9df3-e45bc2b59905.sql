
CREATE TABLE public.workshop_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.workshop_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback" ON public.workshop_feedback
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can read feedback" ON public.workshop_feedback
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete feedback" ON public.workshop_feedback
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
