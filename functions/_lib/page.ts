// Rewrites the single-page app's index.html on the server so the live numbers are in the HTML itself.
// Browsers still get the normal app. Crawlers and AI agents that don't run JavaScript get the title, description,
// structured data and a plain-text version of the record.
import { HOME_TITLE, RECORD_TITLE, SITE, homeDescription, recordDescription, recordJsonLd } from "../../src/lib/record-text";
import { fetchHistory, fetchRecord, noscriptHtml, safeJson, type PagesContext } from "./record";

// Minimal types for Cloudflare's HTMLRewriter, which the runtime provides.
interface RewriterElement {
  setAttribute(name: string, value: string): unknown;
  setInnerContent(content: string, options?: { html?: boolean }): unknown;
  append(content: string, options?: { html?: boolean }): unknown;
}
interface RewriterHandlers {
  element(element: RewriterElement): void;
}
declare class HTMLRewriter {
  on(selector: string, handlers: RewriterHandlers): HTMLRewriter;
  transform(response: Response): Response;
}

const setContent = (value: string): RewriterHandlers => ({ element: (e) => void e.setAttribute("content", value) });

export const servePage = async (ctx: PagesContext, kind: "home" | "record"): Promise<Response> => {
  const asset = await ctx.env.ASSETS.fetch(ctx.request);
  if (ctx.request.method !== "GET" && ctx.request.method !== "HEAD") return asset;
  if (!asset.ok || !(asset.headers.get("content-type") ?? "").includes("text/html")) return asset;

  try {
    const [record, history] = await Promise.all([
      fetchRecord(ctx.env),
      kind === "record" ? fetchHistory(ctx.env) : Promise.resolve({ days: [], opening: null }),
    ]);
    if (!record) return asset; // can't read the numbers: serve the page exactly as it is

    const title = kind === "home" ? HOME_TITLE : RECORD_TITLE;
    const description = kind === "home" ? homeDescription(record) : recordDescription(record);
    const url = kind === "home" ? `${SITE}/` : `${SITE}/record`;

    // data-rh marks a tag the app's head manager (react-helmet-async) may replace once the page loads, so the browser
    // ends up with one canonical, not two. The structured data deliberately has no data-rh: the app doesn't write its
    // own copy, and without the marker the head manager leaves it alone, so Google still sees it after rendering.
    const head =
      `<link rel="canonical" href="${url}" data-rh="true">` +
      (kind === "record" ? `<script type="application/ld+json">${safeJson(recordJsonLd(record))}</script>` : "");

    const response = new HTMLRewriter()
      .on("title", { element: (e) => void e.setInnerContent(title) })
      .on('meta[name="description"]', setContent(description))
      .on('meta[property="og:title"]', setContent(title))
      .on('meta[property="og:description"]', setContent(description))
      .on('meta[name="twitter:title"]', setContent(title))
      .on('meta[name="twitter:description"]', setContent(description))
      .on("head", { element: (e) => void e.append(head, { html: true }) })
      .on("body", { element: (e) => void e.append(noscriptHtml(kind, record, history), { html: true }) })
      .transform(asset);

    const out = new Response(response.body, response);
    out.headers.set("x-seo-record", "injected");
    return out;
  } catch {
    return asset;
  }
};
