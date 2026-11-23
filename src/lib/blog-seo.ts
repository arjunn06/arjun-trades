// Single source of truth for how a blog post is described to browsers, search engines and link previews.
// Imported by the blog page (src/pages/BlogPost.tsx) and by the Cloudflare Function (functions/_lib/blog.ts) that puts
// the same words into the server-rendered HTML, so the title and description a crawler reads from the raw HTML are the
// ones the page sets once it loads. Pure TypeScript with no browser or Vite imports, so both bundles can use it.

export const SITE = "https://ifvg.in";

/** Used for the link preview of a post that has no cover image. */
export const DEFAULT_SHARE_IMAGE = `${SITE}/Ombed.png`;

export const blogUrl = (id: string) => `${SITE}/blog/${id}`;

export const blogTitle = (title: string) => `${title} | Arjun IFVG`;

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  hellip: "…",
  ndash: "–",
  mdash: "—",
};

const decodeEntity = (whole: string, body: string): string => {
  if (body[0] === "#") {
    const code = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
    return Number.isInteger(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole;
  }
  return NAMED_ENTITIES[body.toLowerCase()] ?? whole;
};

/**
 * The words of a post's HTML as one line of plain text. Paragraphs, headings, list items and line breaks become
 * spaces, so "…advice.</p><p>I repeat" reads "…advice. I repeat" and not "…advice.I repeat".
 */
export const blogPlainText = (html: string): string =>
  html
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/?(?:p|div|br|li|ul|ol|h[1-6]|blockquote|figure|figcaption|tr)\b[^>]*>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, decodeEntity)
    .replace(/\s+/g, " ")
    .trim();

/** The meta description: the start of the post, cut at a word boundary, at most `max` characters. */
export const blogDescription = (html: string, max = 160): string => {
  const text = blogPlainText(html);
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:!?-]+$/, "")}…`;
};

/** The image link previews show: the post's cover if it has one, otherwise the site's default. Always an absolute URL. */
export const blogShareImage = (cover: string | null | undefined): string => {
  const url = (cover ?? "").trim();
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${SITE}${url}`;
  return DEFAULT_SHARE_IMAGE;
};
