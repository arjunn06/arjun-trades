// Public edge function: fetches latest videos from a YouTube channel via RSS.
// No API key required. Returns up to 15 latest uploads, optionally shuffled.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HANDLE = "arjun_ifvg";

let cachedChannelId: string | null = null;
let cache: { at: number; videos: Video[] } | null = null;
const CACHE_MS = 10 * 60 * 1000; // 10 minutes

interface Video {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
}

async function resolveChannelId(): Promise<string> {
  if (cachedChannelId) return cachedChannelId;
  const res = await fetch(`https://www.youtube.com/@${HANDLE}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  const html = await res.text();
  const match =
    html.match(/"channelId":"(UC[\w-]{20,})"/) ||
    html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]+)"/);
  if (!match) throw new Error("Could not resolve channel ID");
  cachedChannelId = match[1];
  return cachedChannelId;
}

function parseFeed(xml: string): Video[] {
  const entries = xml.split("<entry>").slice(1);
  return entries.map((entry) => {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
    const title = entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
    const thumbnail =
      entry.match(/<media:thumbnail url="([^"]+)"/)?.[1] ??
      `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    return { id, title, publishedAt, thumbnail };
  }).filter((v) => v.id);
}

// Returns { isShort, isLive }. Two probes:
//  - /shorts/{id} stays on /shorts/ for shorts; redirects to /watch for normal videos.
//  - /watch?v={id} HTML inspected for live flags. CONSENT cookie bypasses EU consent wall.
async function classify(id: string): Promise<{ isShort: boolean; isLive: boolean }> {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    Cookie: "CONSENT=YES+1; SOCS=CAI",
  };

  let isShort = false;
  try {
    const r = await fetch(`https://www.youtube.com/shorts/${id}`, {
      method: "HEAD",
      redirect: "manual",
      headers,
    });
    // 200 = stayed on /shorts (it's a short). 3xx = redirected to /watch (not a short).
    isShort = r.status === 200;
  } catch { /* ignore */ }

  let isLive = false;
  try {
    const r = await fetch(`https://www.youtube.com/watch?v=${id}`, { headers });
    const html = await r.text();
    isLive =
      /"isLiveContent"\s*:\s*true/.test(html) ||
      /"isLive"\s*:\s*true/.test(html) ||
      /"liveBroadcastDetails"/.test(html);
    if (!isShort) {
      const len = parseInt(html.match(/"lengthSeconds"\s*:\s*"(\d+)"/)?.[1] ?? "0", 10);
      if (len > 0 && len <= 60) isShort = true;
    }
  } catch { /* ignore */ }

  return { isShort, isLive };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const random = url.searchParams.get("random") !== "false";

    let videos: Video[];
    if (cache && Date.now() - cache.at < CACHE_MS) {
      videos = cache.videos;
    } else {
      const channelId = await resolveChannelId();
      const feedRes = await fetch(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
      );
      if (!feedRes.ok) throw new Error(`Feed fetch failed: ${feedRes.status}`);
      const xml = await feedRes.text();
      const all = parseFeed(xml);
      // Filter out shorts and livestreams in parallel
      const flags = await Promise.all(all.map((v) => classify(v.id)));
      videos = all.filter((_, i) => !flags[i].isShort && !flags[i].isLive);
      cache = { at: Date.now(), videos };
    }

    const out = random ? shuffle(videos) : videos;

    return new Response(JSON.stringify({ videos: out }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
