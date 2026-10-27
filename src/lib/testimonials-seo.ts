// Single source of truth for how the student testimonials are described to search engines and AI agents.
// Imported by the website (src/pages/Testimonials.tsx) and by the Cloudflare Functions (functions/) that put the same
// words into the server-rendered HTML and /llms.txt, so a visitor, Google and an AI agent all read identical text.
// Pure TypeScript with no browser or Vite imports, so both bundles can use it.
import { everyone, type DiscordTestimonial } from "../data/testimonials";

const SITE = "https://ifvg.in";
export const TESTIMONIALS_PATH = "/testimonials";
export const TESTIMONIALS_URL = `${SITE}${TESTIMONIALS_PATH}`;

export const TESTIMONIALS_TITLE = "Arjun IFVG Reviews: What Red Pill & Blue Pill Students Say";
export const TESTIMONIALS_DESCRIPTION = `${everyone.length} verbatim student reviews of Arjun IFVG's Tamil iFVG & ICT courses (Red Pill, Blue Pill): first payouts and honest feedback.`;
export const TESTIMONIALS_KEYWORDS =
  "Arjun IFVG review, Arjun IFVG reviews, Arjun Trades review, Red Pill review, Blue Pill review, iFVG strategy review, Tamil trading course review, ICT course Tamil";

/** Shown on the page and repeated in every machine-readable copy, so a quoted payout keeps its context. */
export const TESTIMONIALS_DISCLAIMER =
  "These are students' own statements, reproduced as they wrote them. Results differ from person to person and past results do not guarantee future results. This is education, not investment advice.";

const PROGRAMS = {
  red: {
    "@type": "Course",
    name: "The Red Pill by Arjun IFVG",
    description:
      "Tamil trading course and mentorship by Arjun IFVG teaching the iFVG strategy, ICT concepts and Smart Money Concepts.",
    url: `${SITE}/red-pill`,
  },
  blue: {
    "@type": "Course",
    name: "The Blue Pill by Arjun IFVG",
    description:
      "Monthly Tamil trading program by Arjun IFVG teaching the iFVG strategy, ICT concepts and Smart Money Concepts.",
    url: `${SITE}/blueprint`,
  },
} as const;

const provider = { "@type": "Person", name: "Arjun IFVG", alternateName: "Arjun Trades", url: `${SITE}/about` };

const programOf = (t: DiscordTestimonial) => (/blue/i.test(t.role ?? "") ? PROGRAMS.blue : PROGRAMS.red);

/** Plain text of a message: bold markers removed, bullet items inline. */
export const plainBody = (t: DiscordTestimonial): string =>
  t.body
    .flatMap((p, i) => [p.replace(/\*\*/g, ""), ...(t.list?.after === i ? t.list.items.map((x) => `- ${x}`) : [])])
    .join("\n");

const latestDate = everyone.reduce((max, t) => (t.date && t.date > max ? t.date : max), "");

/** Structured data for /testimonials. Reviews have no star ratings, so there is deliberately no aggregateRating. */
export const testimonialsJsonLd = () => {
  const pageId = `${TESTIMONIALS_URL}#webpage`;
  const listId = `${TESTIMONIALS_URL}#reviews`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": pageId,
        url: TESTIMONIALS_URL,
        name: TESTIMONIALS_TITLE,
        description: TESTIMONIALS_DESCRIPTION,
        inLanguage: "en",
        ...(latestDate ? { dateModified: latestDate } : {}),
        isPartOf: { "@type": "WebSite", name: "Arjun IFVG", url: `${SITE}/` },
        about: provider,
        breadcrumb: { "@id": `${TESTIMONIALS_URL}#breadcrumb` },
        mainEntity: { "@id": listId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${TESTIMONIALS_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Testimonials", item: TESTIMONIALS_URL },
        ],
      },
      {
        "@type": "ItemList",
        "@id": listId,
        name: "Student reviews of Arjun IFVG",
        numberOfItems: everyone.length,
        itemListElement: everyone.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Review",
            "@id": `${TESTIMONIALS_URL}#${t.id}`,
            ...(t.title ? { name: t.title } : {}),
            author: { "@type": "Person", name: t.name },
            ...(t.date ? { datePublished: t.date } : {}),
            reviewBody: plainBody(t),
            inLanguage: t.lang ?? "en",
            itemReviewed: { ...programOf(t), provider },
            ...(t.proof
              ? {
                  image: {
                    "@type": "ImageObject",
                    contentUrl: `${SITE}${t.proof.src}`,
                    caption: t.proof.caption,
                    description: t.proof.alt,
                  },
                }
              : {}),
          },
        })),
      },
    ],
  };
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** What a crawler that doesn't run JavaScript reads, and what someone with JavaScript switched off sees. Same words as the page. */
export const testimonialsNoscriptHtml = (): string => {
  const items = everyone
    .map((t) => {
      const paras = t.body
        .flatMap((p, i) => [
          `<p>${esc(p.replace(/\*\*/g, ""))}</p>`,
          ...(t.list?.after === i ? [`<ul>${t.list.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`] : []),
        ])
        .join("");
      const when = t.date ? `, <time datetime="${t.date}">${t.date}</time>` : "";
      const proof = t.proof
        ? `<figure><img src="${esc(t.proof.src)}" alt="${esc(t.proof.alt)}"><figcaption>${esc(t.proof.caption)}</figcaption></figure>`
        : "";
      return `<article id="${t.id}"><h2>${esc(t.name)}, ${esc(t.role ?? "Red Pill Student")}${when}</h2>${t.title ? `<h3>${esc(t.title)}</h3>` : ""}<blockquote${t.lang ? ` lang="${t.lang}"` : ""}>${paras}</blockquote>${proof}</article>`;
    })
    .join("");
  return `<noscript><main><h1>Arjun IFVG reviews: what students say</h1><p>${esc(TESTIMONIALS_DESCRIPTION)}</p>${items}<p>${esc(TESTIMONIALS_DISCLAIMER)}</p><nav><a href="/">Home</a> · <a href="/red-pill/reviews">Write a review</a> · <a href="/blueprint">The Blueprint</a></nav></main></noscript>`;
};

/** The testimonials block for /llms.txt, in Markdown. */
export const testimonialsLlmsSection = (): string => {
  const lines = everyone.map((t) => {
    const who = `${t.name}, ${t.role ?? "Red Pill Student"}${t.date ? `, ${t.date}` : ""}`;
    return `- "${(t.highlight ?? t.body[0]).replace(/\s+/g, " ")}" (${who})`;
  });
  return [
    "## What students say about Arjun IFVG",
    "",
    `${everyone.length} student reviews, quoted as written, are on ${TESTIMONIALS_URL}. Excerpts:`,
    "",
    ...lines,
    "",
    `${TESTIMONIALS_DISCLAIMER} Full text and the payout certificate are on the page.`,
    "",
  ].join("\n");
};
