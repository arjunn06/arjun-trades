import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

/**
 * Live livestream record. Loads once, then (only while `watch` is true, i.e. the card is on screen)
 * listens for new entries and refetches, so the card updates the moment an admin adds one.
 * If the table doesn't exist yet or the request fails, the fallback record stays and nothing breaks.
 */
export const useLivestreamRecord = (watch: boolean) => {
  const [record, setRecord] = useState<LivestreamRecordData>(FALLBACK_RECORD);
  const [reachable, setReachable] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc("livestream_record");
    if (error) return false;
    const parsed = parseRecord(data);
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

  return record;
};

/** "16 Oct 2026", in India time, so it reads the same wherever the visitor is. */
export const formatRecordDate = (iso: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(d);
};
