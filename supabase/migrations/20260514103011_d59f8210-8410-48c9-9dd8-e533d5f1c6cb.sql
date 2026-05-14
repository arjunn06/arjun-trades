CREATE TABLE public.workshop_interest (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  promo_consent BOOLEAN NOT NULL DEFAULT false,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.workshop_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit interest"
ON public.workshop_interest
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can read interest"
ON public.workshop_interest
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update interest"
ON public.workshop_interest
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete interest"
ON public.workshop_interest
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));