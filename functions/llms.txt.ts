import { RECORD_CAVEAT, SITE, YOUTUBE_STREAMS_URL, formatDateIST, recordSummary } from "../src/lib/record-text";
import { testimonialsLlmsSection } from "../src/lib/testimonials-seo";
import { fetchRecord, type PagesContext } from "./_lib/record";

/** /llms.txt: the static file, with the student testimonials and the current record added underneath. Falls back to the plain file. */
export const onRequest = async (ctx: PagesContext) => {
  const asset = await ctx.env.ASSETS.fetch(ctx.request);
  if (!asset.ok || (ctx.request.method !== "GET" && ctx.request.method !== "HEAD")) return asset;
  try {
    const sections = ["", testimonialsLlmsSection()];
    const record = await fetchRecord(ctx.env).catch(() => null);
    if (record) {
      const updated = formatDateIST(record.lastUpdated);
      sections.push(
        [
          "## Public livestream record",
          "",
          recordSummary(record),
          RECORD_CAVEAT,
          "",
          `- [Home page](${SITE}/#record): the record card, with the method.`,
          `- [stats.json](${SITE}/stats.json): the same figures as JSON${updated ? `, last updated ${updated}` : ""}.`,
          `- [Source livestreams](${YOUTUBE_STREAMS_URL}): the public YouTube streams the record is taken from.`,
          "",
        ].join("\n"),
      );
    }
    const text = await asset.text();
    const headers = new Headers(asset.headers);
    headers.set("Content-Type", "text/plain; charset=utf-8");
    headers.delete("Content-Length");
    headers.delete("ETag");
    return new Response(text.trimEnd() + "\n" + sections.join("\n"), { status: 200, headers });
  } catch {
    return asset;
  }
};
