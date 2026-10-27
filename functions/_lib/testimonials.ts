// Rewrites the single-page app's index.html for /testimonials so the reviews are in the HTML itself.
// Browsers still get the normal app. Crawlers and AI agents that don't run JavaScript get the title, description,
// structured data (a Review for every student) and the full text of every review.
import {
  TESTIMONIALS_DESCRIPTION,
  TESTIMONIALS_KEYWORDS,
  TESTIMONIALS_TITLE,
  TESTIMONIALS_URL,
  testimonialsJsonLd,
  testimonialsNoscriptHtml,
} from "../../src/lib/testimonials-seo";
import { safeJson, type PagesContext } from "./record";

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

const attr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** /testimonials with every review in the HTML. Falls back to the plain page if anything goes wrong. */
export const serveTestimonials = async (ctx: PagesContext): Promise<Response> => {
  const asset = await ctx.env.ASSETS.fetch(ctx.request);
  if (ctx.request.method !== "GET" && ctx.request.method !== "HEAD") return asset;
  if (!asset.ok || !(asset.headers.get("content-type") ?? "").includes("text/html")) return asset;

  try {
    // data-rh marks a tag the app's head manager (react-helmet-async) may replace once the page loads, so the browser
    // ends up with one canonical, not two. The structured data deliberately has no data-rh: the app doesn't write its
    // own copy, and without the marker the head manager leaves it alone, so Google still sees it after rendering.
    const head =
      `<link rel="canonical" href="${TESTIMONIALS_URL}" data-rh="true">` +
      `<meta property="og:url" content="${TESTIMONIALS_URL}" data-rh="true">` +
      `<meta name="keywords" content="${attr(TESTIMONIALS_KEYWORDS)}" data-rh="true">` +
      `<script type="application/ld+json">${safeJson(testimonialsJsonLd())}</script>`;

    const response = new HTMLRewriter()
      .on("title", { element: (e) => void e.setInnerContent(TESTIMONIALS_TITLE) })
      .on('meta[name="description"]', setContent(TESTIMONIALS_DESCRIPTION))
      .on('meta[property="og:title"]', setContent(TESTIMONIALS_TITLE))
      .on('meta[property="og:description"]', setContent(TESTIMONIALS_DESCRIPTION))
      .on('meta[name="twitter:title"]', setContent(TESTIMONIALS_TITLE))
      .on('meta[name="twitter:description"]', setContent(TESTIMONIALS_DESCRIPTION))
      .on("head", { element: (e) => void e.append(head, { html: true }) })
      .on("body", { element: (e) => void e.append(testimonialsNoscriptHtml(), { html: true }) })
      .transform(asset);

    const out = new Response(response.body, response);
    out.headers.set("x-seo-testimonials", "injected");
    return out;
  } catch {
    return asset;
  }
};
