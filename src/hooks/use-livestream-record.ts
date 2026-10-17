import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatDateIST, type RecordDay } from "@/lib/record-text";

export interface LivestreamRecordData {
  wins: number;
  losses: number;
  /** ISO timestamp of the latest entry. */
  lastUpdated: string | null;
}

/** The record as supplied on 16 Oct 2026. Shown until live numbers load, and kept if the database isn't set up yet. */
export const FALLBACK_RECORD: LivestreamRecordData = {
  wins: 88,
  losses: 40,
  lastUpdated: "2026-10-16T00:00:00+05:30",
};

/** Accepts only what `livestream_record()` returns; anything else is ignored. */
export const parseRecord = (raw: unknown): LivestreamRecordData | null => {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const wins = Number(r.wins);
  const losses = Number(r.losses);
  if (!Number.isFinite(wins) || !Number.isFinite(losses) || wins < 0 || losses < 0) return null;
  return { wins, losses, lastUpdated: typeof r.last_updated === "string" ? r.last_updated : null };
};

// One request is shared between every component on the page that asks for the record.
let lastKnown: LivestreamRecordData | null = null;
let inflight: Promise<LivestreamRecordData | null> | null = null;

const fetchRecord = (): Promise<LivestreamRecordData | null> => {
  if (!inflight) {
    inflight = (async () => {
      const { data, error } = await supabase.rpc("livestream_record");
      if (error) return null;
      const parsed = parseRecord(data);
      if (parsed) lastKnown = parsed;
      return parsed;
    })().finally(() => {
      inflight = null;
    });
  }
  return inflight;
};

/**
 * Live livestream record. Loads once, then (only while `watch` is true, i.e. the card is on screen)
 * listens for new entries and refetches, so the card updates the moment an admin adds one.
 * If the table doesn't exist yet or the request fails, the fallback record stays and nothing breaks.
 * `loaded` is true only once real numbers have arrived, so page titles and descriptions never use the fallback.
 */
export const useLivestreamRecord = (watch: boolean) => {
  const [record, setRecord] = useState<LivestreamRecordData>(lastKnown ?? FALLBACK_RECORD);
  const [reachable, setReachable] = useState(lastKnown !== null);

  const load = useCallback(async () => {
    const parsed = await fetchRecord();
    if (!parsed) return false;
    setRecord(parsed);
    return true;
  }, []);

  useEffect(() => {
    let cancelled = false;
    load().then((ok) => {
      if (!cancelled) setReachable(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  useEffect(() => {
    if (!watch || !reachable) return;
    const channel = supabase
      .channel("livestream-record")
      .on("postgres_changes", { event: "*", schema: "public", table: "livestream_results" }, () => {
        void load();
      })
      .subscribe();
    // A tab left in the background can miss events, so catch up when it comes back.
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      void supabase.removeChannel(channel);
    };
  }, [watch, reachable, load]);

  return { ...record, loaded: reachable };
};

export interface RecordHistoryData {
  /** Newest first, one row per day. */
  days: RecordDay[];
  /** The starting record that covers everything before the daily entries began. */
  opening: RecordDay | null;
  loaded: boolean;
}

/** Day-by-day results for the record page. Public read, same as the totals. */
export const useRecordHistory = (): RecordHistoryData => {
  const [state, setState] = useState<RecordHistoryData>({ days: [], opening: null, loaded: false });

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("livestream_results")
      .select("entry_date, wins, losses, source")
      .order("entry_date", { ascending: false })
      .limit(1000)
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const byDay = new Map<string, RecordDay>();
        const opening: RecordDay = { date: "", wins: 0, losses: 0 };
        let hasOpening = false;
        for (const r of data) {
          if (r.source === "opening") {
            hasOpening = true;
            opening.date = r.entry_date;
            opening.wins += r.wins;
            opening.losses += r.losses;
            continue;
          }
          const day = byDay.get(r.entry_date) ?? { date: r.entry_date, wins: 0, losses: 0 };
          day.wins += r.wins;
          day.losses += r.losses;
          byDay.set(r.entry_date, day);
        }
        setState({
          days: [...byDay.values()].sort((a, b) => (a.date < b.date ? 1 : -1)),
          opening: hasOpening ? opening : null,
          loaded: true,
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};

/** "17 Oct 2026" for the header of the card. Kept here so existing imports keep working. */
export const formatRecordDate = formatDateIST;
