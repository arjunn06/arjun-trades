CREATE TABLE public.red_pill_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.red_pill_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a review"
ON public.red_pill_reviews
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read approved reviews"
ON public.red_pill_reviews
FOR SELECT
USING (approved = true);

CREATE POLICY "Admins can read all reviews"
ON public.red_pill_reviews
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update reviews"
ON public.red_pill_reviews
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete reviews"
ON public.red_pill_reviews
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));