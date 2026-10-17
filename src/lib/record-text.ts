// Single source of truth for how the public livestream record is described.
// Imported by the website (src/) and by the Cloudflare Functions (functions/) that put the same words into the
// server-rendered HTML, /stats.json and /llms.txt, so a visitor, Google and an AI agent all read identical text.
// Pure TypeScript with no imports, so both bundles can use it.

export const SITE = "https://ifvg.in";

/** The record is counted from the first public livestream in this month. */
export const RECORD_SINCE_LABEL = "May 2026";
export const RECORD_SINCE_ISO = "2026-05-01";

export const YOUTUBE_STREAMS_URL = "https://www.youtube.com/@arjun_ifvg/streams";

export const HOME_TITLE = "Arjun IFVG | Tamil iFVG & ICT Trading Community";
export const HOME_DESCRIPTION_STATIC =
  "Tamil trading community focused on ICT concepts, price action, liquidity, the iFVG strategy and trading psychology.";
export const RECORD_TITLE = "Arjun IFVG Win Rate: Public Livestream Trading Record";

/** The footer line on the home page card, in the owner's wording. */
export const RECORD_FOOTNOTE = `Based on public YouTube livestreams since ${RECORD_SINCE_LABEL}. AI summarized about the first 100 trades; later results were logged in realtime. Actual results may vary slightly.`;

/** Shown wherever the number is shown in full (the /record page, /stats.json, /llms.txt). A win rate is not a profit figure. */
export const RECORD_CAVEAT =
  "Win rate counts trades won, not money made. It says nothing about position size, risk or profit. Past results do not guarantee future results. This is education, not investment advice.";

export interface RecordNumbers {
  wins: number;
  losses: number;
  /** ISO timestamp of the latest entry, or null. */
  lastUpdated: string | null;
}

export interface RecordDay {
  /** yyyy-mm-dd */
  date: string;
  wins: number;
  losses: number;
}

export const tradesOf = (r: Pick<RecordNumbers, "wins" | "losses">) => r.wins + r.losses;

/** Whole number: the source data is approximate, so no false precision (88 of 128 is 68.75%, shown as 69%). */
export const winRatePercent = (r: Pick<RecordNumbers, "wins" | "losses">) =>
  tradesOf(r) === 0 ? 0 : Math.round((r.wins / tradesOf(r)) * 100);

export const homeDescription = (r: RecordNumbers) =>
  `Arjun IFVG public livestream record since ${RECORD_SINCE_LABEL}: ${r.wins} wins from ${tradesOf(r)} logged trades (${winRatePercent(r)}% win rate, approximate). Tamil iFVG and ICT trading education.`;

export const recordDescription = (r: RecordNumbers) =>
  `Arjun IFVG win rate from public YouTube livestreams since ${RECORD_SINCE_LABEL}: ${winRatePercent(r)}% (${r.wins} wins, ${r.losses} losses, ${tradesOf(r)} trades). Approximate and updated daily.`;

/** One paragraph with the figures, used in the no-JavaScript fallback, /llms.txt and the JSON. */
export const recordSummary = (r: RecordNumbers) =>
  `Arjun IFVG's public livestream trading record since ${RECORD_SINCE_LABEL}: ${winRatePercent(r)}% win rate, ${r.wins} wins and ${r.losses} losses across ${tradesOf(r)} trades. ${RECORD_FOOTNOTE}`;

/** "17 Oct 2026", in India time so it reads the same everywhere. */
export const formatDateIST = (iso: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(d);
};

/** yyyy-mm-dd of an ISO timestamp, in India time. */
export const isoDayIST = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(iso));

/** Structured data for the /record page: the page itself plus the record as a Dataset with a JSON download. */
export const recordJsonLd = (r: RecordNumbers) => {
  const url = `${SITE}/record`;
  const datasetId = `${url}#dataset`;
  const modified = r.lastUpdated ?? undefined;
  const end = r.lastUpdated ? isoDayIST(r.lastUpdated) : undefined;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: RECORD_TITLE,
        description: recordDescription(r),
        ...(modified ? { dateModified: modified } : {}),
        inLanguage: "en",
        isPartOf: { "@type": "WebSite", name: "Arjun IFVG", url: `${SITE}/` },
        about: { "@id": datasetId },
        mainEntity: { "@id": datasetId },
      },
      {
        "@type": "Dataset",
        "@id": datasetId,
        name: "Arjun IFVG public livestream trading record",
        description: `${recordSummary(r)} ${RECORD_CAVEAT}`,
        url,
        creator: { "@type": "Person", name: "Arjun IFVG", url: `${SITE}/about` },
        isAccessibleForFree: true,
        keywords: ["Arjun IFVG", "iFVG strategy", "ICT trading", "public livestream trading record", "win rate"],
        temporalCoverage: `${RECORD_SINCE_ISO}/${end ?? ".."}`,
        ...(modified ? { dateModified: modified } : {}),
        isBasedOn: YOUTUBE_STREAMS_URL,
        variableMeasured: [
          { "@type": "PropertyValue", name: "Win rate", value: winRatePercent(r), unitText: "percent" },
          { "@type": "PropertyValue", name: "Wins", value: r.wins, unitText: "trades" },
          { "@type": "PropertyValue", name: "Losses", value: r.losses, unitText: "trades" },
          { "@type": "PropertyValue", name: "Total trades", value: tradesOf(r), unitText: "trades" },
        ],
        distribution: { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${SITE}/stats.json` },
      },
    ],
  };
};
