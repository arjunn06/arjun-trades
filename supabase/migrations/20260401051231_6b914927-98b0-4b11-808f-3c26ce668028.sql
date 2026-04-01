
CREATE TABLE public.red_pill_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact text NOT NULL,
  trading_experience text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.red_pill_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a booking" ON public.red_pill_bookings
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can read bookings" ON public.red_pill_bookings
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update bookings" ON public.red_pill_bookings
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete bookings" ON public.red_pill_bookings
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
