// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://gleam-blog-pad.lovable.app";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://nfruhexbfxtxqvcvjbmm.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcnVoZXhiZnh0eHF2Y3ZqYm1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTk4MjYsImV4cCI6MjA4ODYzNTgyNn0.tCwkC6T1wAR9rWkGEZ2w4d7l4Abfs9YgTpuigjntqRY";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.9" },
  { path: "/workshop", changefreq: "weekly", priority: "0.8" },
  { path: "/red-pill", changefreq: "weekly", priority: "0.8" },
  { path: "/red-pill/info", changefreq: "monthly", priority: "0.6" },
  { path: "/blogs", changefreq: "daily", priority: "0.9" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
];

async function fetchBlogs(): Promise<SitemapEntry[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blogs?select=id,updated_at&published=eq.true`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    );
    if (!res.ok) return [];
    const rows: { id: string; updated_at: string }[] = await res.json();
    return rows.map((r) => ({
      path: `/blog/${r.id}`,
      lastmod: r.updated_at?.slice(0, 10),
      changefreq: "monthly",
      priority: "0.7",
    }));
  } catch {
    return [];
  }
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

const blogEntries = await fetchBlogs();
const entries = [...staticEntries, ...blogEntries];
writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
