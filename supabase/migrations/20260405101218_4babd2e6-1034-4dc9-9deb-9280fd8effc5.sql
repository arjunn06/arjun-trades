
CREATE TABLE public.red_pill_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  trading_experience TEXT NOT NULL,
  learning_preferences TEXT[] NOT NULL DEFAULT '{}',
  class_time TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.red_pill_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit info" ON public.red_pill_info FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can read info" ON public.red_pill_info FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update info" ON public.red_pill_info FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete info" ON public.red_pill_info FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
