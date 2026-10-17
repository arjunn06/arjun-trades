import type { Db, DayRow, DayStatus } from "./logic.ts";

// Loosely typed on purpose: the function runs with the service role and only touches the tables below.
// deno-lint-ignore no-explicit-any
type Client = any;

const fail = (op: string, error: { message: string }): never => {
  throw new Error(`database ${op} failed: ${error.message}`);
};

const toRow = (r: { day: string; status: string; public_message_id: string | null }): DayRow => ({
  day: r.day,
  status: r.status as DayStatus,
  publicMessageId: r.public_message_id,
});

export const makeDb = (client: Client): Db => ({
  async getDay(day) {
    const { data, error } = await client.from("livestream_recap_days").select("*").eq("day", day).maybeSingle();
    if (error) fail("getDay", error);
    return data ? toRow(data) : null;
  },

  async upsertDay(day, patch) {
    const row: Record<string, unknown> = { day, updated_at: new Date().toISOString() };
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.publicMessageId !== undefined) row.public_message_id = patch.publicMessageId;
    const { error } = await client.from("livestream_recap_days").upsert(row, { onConflict: "day" });
    if (error) fail("upsertDay", error);
  },

  // The opening record is a running total, so it never counts as a day's entries.
  async dayTotals(day) {
    const { data, error } = await client
      .from("livestream_results")
      .select("wins, losses")
      .eq("entry_date", day)
      .neq("source", "opening");
    if (error) fail("dayTotals", error);
    const rows: { wins: number; losses: number }[] = data ?? [];
    return {
      wins: rows.reduce((a, r) => a + r.wins, 0),
      losses: rows.reduce((a, r) => a + r.losses, 0),
      entries: rows.length,
    };
  },

  async addEntry(day, wins, losses) {
    const { error } = await client
      .from("livestream_results")
      .insert({ entry_date: day, wins, losses, source: "discord" });
    if (error) fail("addEntry", error);
  },

  async replaceDay(day, wins, losses) {
    const { error } = await client.rpc("livestream_replace_day", {
      p_date: day,
      p_wins: wins,
      p_losses: losses,
      p_source: "discord",
    });
    if (error) fail("replaceDay", error);
  },

  async record() {
    const { data, error } = await client.rpc("livestream_record");
    if (error) fail("record", error);
    return { wins: Number(data?.wins ?? 0), losses: Number(data?.losses ?? 0) };
  },
});
