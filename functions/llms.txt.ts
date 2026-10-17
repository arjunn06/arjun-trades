import { RECORD_CAVEAT, SITE, YOUTUBE_STREAMS_URL, formatDateIST, recordSummary } from "../src/lib/record-text";
import { fetchRecord, type PagesContext } from "./_lib/record";

/** /llms.txt: the static file, with the current record added underneath. Falls back to the plain file. */
export const onRequest = async (ctx: PagesContext) => {
  const asset = await ctx.env.ASSETS.fetch(ctx.request);
  if (!asset.ok || (ctx.request.method !== "GET" && ctx.request.method !== "HEAD")) return asset;
  try {
    const record = await fetchRecord(ctx.env);
    if (!record) return asset;
    const updated = formatDateIST(record.lastUpdated);
    const text = await asset.text();
    const section = [
      "",
      "## Public livestream record",
      "",
      recordSummary(record),
      RECORD_CAVEAT,
      "",
      `- [Record page](${SITE}/record): the figures, how they are counted, and recent days.`,
      `- [stats.json](${SITE}/stats.json): the same figures as JSON${updated ? `, last updated ${updated}` : ""}.`,
      `- [Source livestreams](${YOUTUBE_STREAMS_URL}): the public YouTube streams the record is taken from.`,
      "",
    ].join("\n");
    const headers = new Headers(asset.headers);
    headers.set("Content-Type", "text/plain; charset=utf-8");
    headers.delete("Content-Length");
    headers.delete("ETag");
    return new Response(text.trimEnd() + "\n" + section, { status: 200, headers });
  } catch {
    return asset;
  }
};
