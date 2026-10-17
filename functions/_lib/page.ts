// Rewrites the single-page app's index.html on the server so the live numbers are in the HTML itself.
// Browsers still get the normal app. Crawlers and AI agents that don't run JavaScript get the title, description,
// structured data and a plain-text version of the record.
import { HOME_TITLE, SITE, homeDescription, recordJsonLd } from "../../src/lib/record-text";
import { fetchRecord, noscriptHtml, safeJson, type PagesContext } from "./record";

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

/** The home page ("/") with the current record in it. */
export const serveHome = async (ctx: PagesContext): Promise<Response> => {
  const asset = await ctx.env.ASSETS.fetch(ctx.request);
  if (ctx.request.method !== "GET" && ctx.request.method !== "HEAD") return asset;
  if (!asset.ok || !(asset.headers.get("content-type") ?? "").includes("text/html")) return asset;

  try {
    const record = await fetchRecord(ctx.env);
    if (!record) return asset; // can't read the numbers: serve the page exactly as it is

    const description = homeDescription(record);

    // data-rh marks a tag the app's head manager (react-helmet-async) may replace once the page loads, so the browser
    // ends up with one canonical, not two. The structured data deliberately has no data-rh: the app doesn't write its
    // own copy, and without the marker the head manager leaves it alone, so Google still sees it after rendering.
    const head =
      `<link rel="canonical" href="${SITE}/" data-rh="true">` +
      `<script type="application/ld+json">${safeJson(recordJsonLd(record))}</script>`;

    const response = new HTMLRewriter()
      .on("title", { element: (e) => void e.setInnerContent(HOME_TITLE) })
      .on('meta[name="description"]', setContent(description))
      .on('meta[property="og:title"]', setContent(HOME_TITLE))
      .on('meta[property="og:description"]', setContent(description))
      .on('meta[name="twitter:title"]', setContent(HOME_TITLE))
      .on('meta[name="twitter:description"]', setContent(description))
      .on("head", { element: (e) => void e.append(head, { html: true }) })
      .on("body", { element: (e) => void e.append(noscriptHtml(record), { html: true }) })
      .transform(asset);

    const out = new Response(response.body, response);
    out.headers.set("x-seo-record", "injected");
    return out;
  } catch {
    return asset;
  }
};
