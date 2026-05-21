// Public edge function: fetches most popular long-form videos from the channel
// using the YouTube Data API v3. Falls back to RSS feed if API key missing.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const CHANNEL_ID = "UC6GxCECop3P-z6WQisVVqxQ";

const CACHE_MS = 30 * 60 * 1000; // 30 minutes

let cache: { at: number; videos: Video[] } | null = null;

interface Video {
  id: string;
  title: string;
  publishedAt?: string;
  thumbnail?: string;
  viewCount?: number;
}

function isoDurationToSeconds(d: string): number {
  const m = d.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!m) return 0;

  const [, h, mn, s] = m;

  return (
    parseInt(h ?? "0") * 3600 +
    parseInt(mn ?? "0") * 60 +
    parseInt(s ?? "0")
  );
}

async function fetchPopularViaApi(apiKey: string): Promise<Video[]> {
  // Fetch videos ordered by popularity
  const searchUrl = new URL(
    "https://www.googleapis.com/youtube/v3/search"
  );

  searchUrl.searchParams.set("key", apiKey);
  searchUrl.searchParams.set("channelId", CHANNEL_ID);
  searchUrl.searchParams.set("part", "id");
  searchUrl.searchParams.set("order", "viewCount");
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("maxResults", "25");

  const sRes = await fetch(searchUrl);

  if (!sRes.ok) {
    throw new Error(
      `search.list failed: ${sRes.status} ${await sRes.text()}`
    );
  }

  const sJson = await sRes.json();

  const ids: string[] = (sJson.items ?? [])
    .map((i: { id: { videoId: string } }) => i.id.videoId)
    .filter(Boolean);

  if (!ids.length) return [];

  // Fetch detailed video info
  const vUrl = new URL(
    "https://www.googleapis.com/youtube/v3/videos"
  );

  vUrl.searchParams.set("key", apiKey);
  vUrl.searchParams.set("id", ids.join(","));
  vUrl.searchParams.set(
    "part",
    "snippet,contentDetails,statistics,liveStreamingDetails"
  );

  const vRes = await fetch(vUrl);

  if (!vRes.ok) {
    throw new Error(
      `videos.list failed: ${vRes.status} ${await vRes.text()}`
    );
  }

  const vJson = await vRes.json();

  const videos: Video[] = [];

  for (const item of vJson.items ?? []) {
    const seconds = isoDurationToSeconds(
      item.contentDetails?.duration ?? "PT0S"
    );

    const title: string = item.snippet?.title ?? "";
    const description: string = item.snippet?.description ?? "";

    // Filter Shorts: YouTube Shorts can be up to ~3 minutes. Also exclude by hashtag.
    const isShort =
      (seconds > 0 && seconds <= 181) ||
      /#shorts?\b/i.test(title) ||
      /#shorts?\b/i.test(description);

    // Filter livestreams + upcoming + past live broadcasts
    const isLive =
      !!item.liveStreamingDetails ||
      item.snippet?.liveBroadcastContent === "live" ||
      item.snippet?.liveBroadcastContent === "upcoming";

    if (isShort || isLive) continue;

    videos.push({
      id: item.id,
      title,
      publishedAt: item.snippet?.publishedAt,
      thumbnail:
        item.snippet?.thumbnails?.maxres?.url ??
        item.snippet?.thumbnails?.high?.url ??
        `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
      viewCount: parseInt(
        item.statistics?.viewCount ?? "0",
        10
      ),
    });
  }


  // Sort by highest views
  videos.sort(
    (a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)
  );

  // Return only top 6
  return videos.slice(0, 6);
}

async function fetchViaRss(): Promise<Video[]> {
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
  );

  if (!res.ok) {
    throw new Error(`Feed fetch failed: ${res.status}`);
  }

  const xml = await res.text();

  const entries = xml.split("<entry>").slice(1);

  return entries
    .map((e) => {
      const id =
        e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";

      const title =
        e.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";

      return {
        id,
        title,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      };
    })
    .filter((v) => v.id);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    let videos: Video[];

    // Serve cached response
    if (cache && Date.now() - cache.at < CACHE_MS) {
      videos = cache.videos;
    } else {
      const apiKey = Deno.env.get("YOUTUBE_API_KEY");

      try {
        videos = apiKey
          ? await fetchPopularViaApi(apiKey)
          : await fetchViaRss();
      } catch (err) {
        console.error(
          "Primary fetch failed, falling back to RSS:",
          err
        );

        videos = await fetchViaRss();
      }

      cache = {
        at: Date.now(),
        videos,
      };
    }

    return new Response(
      JSON.stringify({ videos }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=600",
        },
      }
    );
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "Unknown error";

    return new Response(
      JSON.stringify({ error: msg }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
