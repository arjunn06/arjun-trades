-- Discord daily recap bot (Supabase function "discord-recap").
-- 1. Remembers where each entry came from, so the opening record and the bot's entries are told apart.
-- 2. Tracks each day's prompt and public post, so a day is never prompted or posted twice.
-- 3. A function that replaces a whole day's entries in one step (the "Replace" button in Discord).
-- Safe to run more than once. Run supabase/migrations/20261016090000_livestream_results.sql first.

-- Where an entry came from: 'admin' (dashboard), 'discord' (the bot) or 'opening' (the starting record).
ALTER TABLE public.livestream_results
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'admin'
  CHECK (source IN ('admin', 'discord', 'opening'));

-- The opening record is a running total, not one day's result. Mark it so it never counts as "today's entries".
UPDATE public.livestream_results
SET source = 'opening'
WHERE source = 'admin' AND label LIKE 'Opening record:%';

-- One row per day the bot has prompted. Only the Discord function (service role) can read or write it:
-- row-level security is on and there are deliberately no policies.
CREATE TABLE IF NOT EXISTS public.livestream_recap_days (
  day date PRIMARY KEY,
  -- prompted: waiting for an answer. logged: a recap was posted. no_trades: you said none. auto_no_trades: no answer by 11:59 PM.
  status text NOT NULL DEFAULT 'prompted' CHECK (status IN ('prompted', 'logged', 'no_trades', 'auto_no_trades')),
  prompt_message_id text,
  public_message_id text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.livestream_recap_days ENABLE ROW LEVEL SECURITY;

-- Replace everything logged for a day with one entry, atomically. Never touches the opening record.
CREATE OR REPLACE FUNCTION public.livestream_replace_day(
  p_date date,
  p_wins integer,
  p_losses integer,
  p_source text DEFAULT 'discord'
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.livestream_results WHERE entry_date = p_date AND source <> 'opening';
  INSERT INTO public.livestream_results (entry_date, wins, losses, source)
  VALUES (p_date, p_wins, p_losses, p_source);
END;
$$;

-- Only the Discord function may call it. Visitors and logged-in users cannot.
REVOKE ALL ON FUNCTION public.livestream_replace_day(date, integer, integer, text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.livestream_replace_day(date, integer, integer, text) TO service_role;

NOTIFY pgrst, 'reload schema';
