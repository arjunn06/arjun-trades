// Rewrites the single-page app's index.html for /blog/:id so the post's own title, description and image are in the HTML.
// Browsers still get the normal app. Link previews (WhatsApp, Instagram, Discord, X, Slack, LinkedIn…) and crawlers don't
// run JavaScript, so without this they only ever read the site-wide defaults and show the site name for every post.
import { blogDescription, blogShareImage, blogTitle, blogUrl } from "../../src/lib/blog-seo";
import { get, type PagesContext } from "./record";

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

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface PostRow {
  id: string;
  title: string;
  content: string;
  cover_image_url: string | null;
}

/** /blog/:id with that post's title, description and share image in the HTML. Falls back to the plain page if anything goes wrong. */
export const serveBlogPost = async (ctx: PagesContext, id: string): Promise<Response> => {
  const asset = await ctx.env.ASSETS.fetch(ctx.request);
  if (ctx.request.method !== "GET" && ctx.request.method !== "HEAD") return asset;
  if (!asset.ok || !(asset.headers.get("content-type") ?? "").includes("text/html")) return asset;
  if (!UUID.test(id)) return asset;

  try {
    // Same filter the page uses (only published posts), so a draft's title never leaks into a preview.
    const rows = (await get(
      ctx.env,
      `/rest/v1/blogs?select=id,title,content,cover_image_url&id=eq.${id}&published=eq.true&limit=1`,
    )) as PostRow[];
    const post = rows[0];
    if (!post?.title) return asset; // not found or unpublished: serve the page exactly as it is

    const title = blogTitle(post.title);
    const description = blogDescription(post.content);
    const image = blogShareImage(post.cover_image_url);
    const url = blogUrl(post.id);

    // data-rh marks a tag the app's head manager (react-helmet-async) may replace once the page loads, so the browser
    // ends up with one canonical, not two.
    const head =
      `<link rel="canonical" href="${attr(url)}" data-rh="true">` +
      `<meta property="og:url" content="${attr(url)}" data-rh="true">`;

    const response = new HTMLRewriter()
      .on("title", { element: (e) => void e.setInnerContent(title) })
      .on('meta[name="description"]', setContent(description))
      .on('meta[property="og:title"]', setContent(post.title))
      .on('meta[property="og:description"]', setContent(description))
      .on('meta[property="og:type"]', setContent("article"))
      .on('meta[property="og:image"]', setContent(image))
      .on('meta[name="twitter:title"]', setContent(post.title))
      .on('meta[name="twitter:description"]', setContent(description))
      .on('meta[name="twitter:image"]', setContent(image))
      .on("head", { element: (e) => void e.append(head, { html: true }) })
      .transform(asset);

    const out = new Response(response.body, response);
    out.headers.set("x-seo-blog", "injected");
    return out;
  } catch {
    return asset;
  }
};
