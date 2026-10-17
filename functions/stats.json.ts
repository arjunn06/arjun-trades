import { fetchHistory, fetchRecord, statsJson, type PagesContext } from "./_lib/record";

const HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  // Open to any site or agent that wants to read it.
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=300",
};

/** /stats.json: the record as plain JSON, with the method and caveat attached so a quoted number keeps its context. */
export const onRequest = async (ctx: PagesContext) => {
  if (ctx.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...HEADERS, "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS" } });
  }
  if (ctx.request.method !== "GET" && ctx.request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD, OPTIONS" } });
  }
  const [record, history] = await Promise.all([fetchRecord(ctx.env), fetchHistory(ctx.env)]);
  if (!record) {
    return new Response(JSON.stringify({ error: "The record is temporarily unavailable." }), {
      status: 503,
      headers: { ...HEADERS, "Cache-Control": "no-store", "Retry-After": "300" },
    });
  }
  return new Response(JSON.stringify(statsJson(record, history), null, 2), { headers: HEADERS });
};
