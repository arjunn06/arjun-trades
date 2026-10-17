// Server-side helpers for the SEO routes. Runs on Cloudflare Pages Functions.
// Every route that uses these falls back to the plain static page or file if the database can't be reached,
// so a database outage can never take a page down.
import {
  RECORD_CAVEAT,
  RECORD_FOOTNOTE,
  RECORD_SINCE_ISO,
  RECORD_SINCE_LABEL,
  SITE,
  YOUTUBE_STREAMS_URL,
  formatDateIST,
  isoDayIST,
  recordSummary,
  tradesOf,
  winRatePercent,
  type RecordDay,
  type RecordNumbers,
} from "../../src/lib/record-text";

export interface Env {
  ASSETS: { fetch(input: Request | string): Promise<Response> };
  /** Optional overrides, used by tests. */
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

export interface PagesContext {
  request: Request;
  env: Env;
  waitUntil(promise: Promise<unknown>): void;
}

const DEFAULT_URL = "https://nfruhexbfxtxqvcvjbmm.supabase.co";
// The public (anon) key. It is already shipped inside the website's JavaScript and can only do what row-level
// security allows, which for this table is reading.
const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcnVoZXhiZnh0eHF2Y3ZqYm1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTk4MjYsImV4cCI6MjA4ODYzNTgyNn0.tCwkC6T1wAR9rWkGEZ2w4d7l4Abfs9YgTpuigjntqRY";

const get = async (env: Env, path: string): Promise<unknown> => {
  const key = env.SUPABASE_ANON_KEY || DEFAULT_KEY;
  const res = await fetch(`${env.SUPABASE_URL || DEFAULT_URL}${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(2500),
    // Cloudflare keeps the answer for 5 minutes, so the database is asked about once per 5 minutes per location.
    cf: { cacheTtl: 300, cacheEverything: true },
  } as RequestInit);
  if (!res.ok) throw new Error(`database responded ${res.status}`);
  return res.json();
};

/** The running totals, or null if they can't be read (table not set up, database down, bad data). */
export const fetchRecord = async (env: Env): Promise<RecordNumbers | null> => {
  try {
    const raw = (await get(env, "/rest/v1/rpc/livestream_record")) as Record<string, unknown> | null;
    const wins = Number(raw?.wins);
    const losses = Number(raw?.losses);
    if (!Number.isFinite(wins) || !Number.isFinite(losses) || wins < 0 || losses < 0) return null;
    return { wins, losses, lastUpdated: typeof raw?.last_updated === "string" ? raw.last_updated : null };
  } catch {
    return null;
  }
};

export interface RecordHistory {
  /** Newest first, one row per day. */
  days: RecordDay[];
  /** The starting record that covers everything before the daily entries began. */
  opening: RecordDay | null;
}

export const fetchHistory = async (env: Env): Promise<RecordHistory> => {
  try {
    const rows = (await get(
      env,
      "/rest/v1/livestream_results?select=entry_date,wins,losses,source&order=entry_date.desc&limit=1000",
    )) as { entry_date: string; wins: number; losses: number; source: string }[];
    const byDay = new Map<string, RecordDay>();
    const opening: RecordDay = { date: "", wins: 0, losses: 0 };
    let hasOpening = false;
    for (const r of rows) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(r.entry_date)) continue;
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
    return { days: [...byDay.values()].sort((a, b) => (a.date < b.date ? 1 : -1)), opening: hasOpening ? opening : null };
  } catch {
    return { days: [], opening: null };
  }
};

// ---------- text and markup ----------

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** JSON inside a <script> tag: "<" is escaped so the data can never close the tag. */
export const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

/** What someone sees with JavaScript switched off, and what a crawler that doesn't run it reads. Same words as the page. */
export const noscriptHtml = (r: RecordNumbers): string => {
  const updated = formatDateIST(r.lastUpdated);
  const links = [
    ["/about", "About Arjun IFVG"],
    ["/workshop", "Free workshop"],
    ["/join", "Join: Instagram, Discord, YouTube"],
    ["/blogs", "Blog"],
    ["/blueprint", "The Blueprint"],
    ["/contact", "Contact"],
  ]
    .map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`)
    .join("");
  return `<noscript><article><h1>Arjun IFVG, Tamil iFVG and ICT trading</h1><p>Tamil trading community focused on ICT concepts, price action, liquidity, the iFVG strategy and trading psychology. Free YouTube education, a free workshop, a Discord community and mentorship.</p><h2>Public livestream record</h2><p>${escapeHtml(recordSummary(r))}</p><p>${escapeHtml(RECORD_CAVEAT)}${updated ? ` Last updated ${escapeHtml(updated)}.` : ""} Machine-readable: <a href="/stats.json">/stats.json</a>. <a href="${YOUTUBE_STREAMS_URL}">Watch the public livestreams on YouTube</a>.</p><ul>${links}</ul></article></noscript>`;
};

export const statsJson = (r: RecordNumbers, history: RecordHistory) => ({
  name: "Arjun IFVG public livestream trading record",
  trader: "Arjun IFVG",
  website: SITE,
  page: `${SITE}/#record`,
  source: YOUTUBE_STREAMS_URL,
  period: { from: RECORD_SINCE_ISO.slice(0, 7), to: r.lastUpdated ? isoDayIST(r.lastUpdated) : null },
  wins: r.wins,
  losses: r.losses,
  trades: tradesOf(r),
  winRatePercent: winRatePercent(r),
  lastUpdated: r.lastUpdated,
  summary: recordSummary(r),
  method: RECORD_FOOTNOTE,
  caveat: RECORD_CAVEAT,
  openingRecord: history.opening,
  recentDays: history.days.slice(0, 30),
});
