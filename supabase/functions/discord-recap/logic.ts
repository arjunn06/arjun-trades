// The Discord daily recap bot. This file has no Deno-specific code, so it can be tested anywhere:
// everything it touches (database, Discord, clock, signature check) is passed in.
//
// You type /daily-recap, a form asks for wins and losses, and the bot saves the entry and posts the recap.
// Nothing is sent to you automatically.
//
// Two kinds of request reach it:
//   1. Discord interactions (the slash command, the form, the Replace / Add buttons). Signed by Discord, owner only.
//   2. Maintenance calls with a shared secret: "register" (creates the slash command, once) and the optional
//      "deadline" (the 11:59 PM fallback, only if you schedule it).

import { RECAP_TEMPLATE, render, type TemplateVars } from "./template.ts";

// ---------- dependencies ----------

export interface Config {
  /** Discord user IDs allowed to log results. */
  ownerIds: string[];
  /** Public channel where recaps are posted. */
  recapChannelId: string;
  /** Shared secret for the maintenance calls. */
  cronSecret: string;
  /** Needed only to register the slash command. */
  appId?: string;
  /** If set, the command is registered for this server only (instant). Otherwise it is global. */
  guildId?: string;
}

/** "prompted" only exists in rows written by an earlier version of the bot. */
export type DayStatus = "prompted" | "logged" | "no_trades" | "auto_no_trades";

export interface DayRow {
  day: string;
  status: DayStatus;
  publicMessageId: string | null;
}

export interface Totals {
  wins: number;
  losses: number;
  /** How many entries make up the totals. 0 means nothing has been logged for that day. */
  entries: number;
}

export interface Db {
  getDay(day: string): Promise<DayRow | null>;
  upsertDay(day: string, patch: Partial<{ status: DayStatus; publicMessageId: string | null }>): Promise<void>;
  /** The day's entries, not counting the opening record. */
  dayTotals(day: string): Promise<Totals>;
  addEntry(day: string, wins: number, losses: number): Promise<void>;
  /** Replace everything logged for the day with this one entry. */
  replaceDay(day: string, wins: number, losses: number): Promise<void>;
  /** The running record shown on the website. */
  record(): Promise<{ wins: number; losses: number }>;
}

export interface MessagePayload {
  content?: string;
  components?: unknown[];
  allowed_mentions?: unknown;
}

export interface DiscordApi {
  postMessage(channelId: string, payload: MessagePayload): Promise<{ id: string }>;
  editMessage(channelId: string, messageId: string, payload: MessagePayload): Promise<void>;
  /** Read a message's text, or null if it can't be read. */
  getMessage(channelId: string, messageId: string): Promise<{ content: string } | null>;
  /** Create or update a slash command. `guildId` null means a global command. */
  registerCommand(appId: string, guildId: string | null, command: unknown): Promise<void>;
}

export interface Deps {
  config: Config;
  verify(body: string, signature: string, timestamp: string): boolean;
  db: Db;
  discord: DiscordApi;
  now(): Date;
  log(message: string, extra?: unknown): void;
}

// ---------- the slash command ----------

export const COMMAND_NAME = "daily-recap";

export const COMMAND = {
  name: COMMAND_NAME,
  description: "Log the day's wins and losses and post the recap",
  type: 1,
  // Hidden from everyone except server admins. The owner check below still applies on top of this.
  default_member_permissions: "0",
  options: [
    { type: 3, name: "date", description: "Day to log as YYYY-MM-DD. Leave empty for today.", required: false },
    {
      type: 3,
      name: "result",
      description: "Pick the emoji yourself. Leave empty to choose by wins and losses.",
      required: false,
      choices: [
        { name: "🟢 Green day", value: "green" },
        { name: "🔴 Red day", value: "red" },
        { name: "⚫️ Breakeven", value: "breakeven" },
      ],
    },
  ],
};

// ---------- small helpers ----------

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const NO_PINGS = { parse: [] as string[] };
const EPHEMERAL = 64; // only the person who used the command sees the reply

/** Interaction response: a new message only the owner can see. */
const ephemeral = (content: string, components?: unknown[]) =>
  json({ type: 4, data: { content, flags: EPHEMERAL, allowed_mentions: NO_PINGS, ...(components ? { components } : {}) } });

/** Interaction response: replace the message the button was on. */
const updateMessage = (content: string, components: unknown[] = []) =>
  json({ type: 7, data: { content, components, allowed_mentions: NO_PINGS } });

/** Interaction response: open a form. */
const modal = (data: unknown) => json({ type: 9, data });

const safeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

const messageOf = (e: unknown) => (e instanceof Error ? e.message : String(e));

/** A date in India, as yyyy-mm-dd. */
export const istDay = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(d);

const isDay = (s: unknown): s is string =>
  typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));

const prettyDay = (day: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${day}T00:00:00Z`),
  );

const weekdayOf = (day: string) =>
  new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));

const pct = (wins: number, losses: number) => (wins + losses === 0 ? 0 : Math.round((wins / (wins + losses)) * 100));

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const resultsText = (wins: number, losses: number) => `${plural(wins, "win", "wins")}, ${plural(losses, "loss", "losses")}`;

const NOTES_MAX = 500;
const ZERO: Totals = { wins: 0, losses: 0, entries: 0 };

const GREEN = "🟢";
const RED = "🔴";
const GREY = "\u26AB\uFE0F";

/** The day's emoji as picked in the command: a automatic, g green, r red, b breakeven. Travels in button and form ids. */
type Pick = "a" | "g" | "r" | "b";
const PICK_BY_VALUE: Record<string, Pick> = { green: "g", red: "r", breakeven: "b" };
const toPick = (raw: unknown): Pick => (raw === "g" || raw === "r" || raw === "b" ? raw : "a");

/** Your pick wins. Without one: 🟢 when wins beat losses, 🔴 when losses beat wins, ⚫️ for an even day or no trades. */
const emojiFor = (wins: number, losses: number, pick: Pick) =>
  pick === "g" ? GREEN : pick === "r" ? RED : pick === "b" ? GREY : wins > losses ? GREEN : losses > wins ? RED : GREY;

// ---------- the public recap ----------

const recapPayload = (
  deps: Deps,
  day: string,
  t: Totals,
  record: { wins: number; losses: number },
  notes: string,
  pick: Pick = "a",
): MessagePayload => {
  const vars: TemplateVars = {
    emoji: emojiFor(t.wins, t.losses, pick),
    forDate: day === istDay(deps.now()) ? "" : ` for ${prettyDay(day)}`,
    notes: notes.trim(),
    date: prettyDay(day),
    weekday: weekdayOf(day),
    winsLabel: plural(t.wins, "win", "wins"),
    lossesLabel: plural(t.losses, "loss", "losses"),
    wins: t.wins,
    losses: t.losses,
    trades: t.wins + t.losses,
    winrate: pct(t.wins, t.losses),
    totalWins: record.wins,
    totalLosses: record.losses,
    totalTrades: record.wins + record.losses,
    totalWinrate: pct(record.wins, record.losses),
  };
  // Only @everyone / @here can notify. Mentions of people or roles typed into the notes never ping anyone.
  return { content: render(RECAP_TEMPLATE, vars).trimEnd(), allowed_mentions: { parse: ["everyone"] } };
};

/** Edit the day's earlier public message if there is one, otherwise post a new one. */
const publish = async (
  deps: Deps,
  existingId: string | null,
  payload: MessagePayload,
): Promise<{ id: string | null; error?: string }> => {
  const channel = deps.config.recapChannelId;
  if (existingId) {
    try {
      await deps.discord.editMessage(channel, existingId, payload);
      return { id: existingId };
    } catch (e) {
      deps.log("could not edit the earlier recap, posting a new one", messageOf(e));
    }
  }
  try {
    const posted = await deps.discord.postMessage(channel, payload);
    return { id: posted.id };
  } catch (e) {
    deps.log("could not post to the recap channel", messageOf(e));
    return { id: null, error: messageOf(e) };
  }
};

/** Notes are never stored. To keep them when a day is logged again, read them back from the post itself. */
const earlierNotes = async (deps: Deps, row: DayRow | null): Promise<string> => {
  if (!row?.publicMessageId) return "";
  try {
    const message = await deps.discord.getMessage(deps.config.recapChannelId, row.publicMessageId);
    const content = message?.content ?? "";
    const gap = content.indexOf("\n\n"); // notes follow the blank line under the results
    return gap === -1 ? "" : content.slice(gap + 2).trim().slice(0, NOTES_MAX);
  } catch (e) {
    deps.log("could not read the earlier recap", messageOf(e));
    return "";
  }
};

const permissionHint = (error: string) =>
  `I couldn't post to the recap channel (${error}). Check the bot's permissions there.`;

// ---------- saving a result ----------

type SaveMode = "new" | "add" | "replace";

const saveResult = async (
  deps: Deps,
  day: string,
  wins: number,
  losses: number,
  mode: SaveMode,
  notes: string,
  pick: Pick,
) => {
  if (mode === "replace") await deps.db.replaceDay(day, wins, losses);
  else await deps.db.addEntry(day, wins, losses);

  const [totals, record, row] = await Promise.all([deps.db.dayTotals(day), deps.db.record(), deps.db.getDay(day)]);
  const posted = await publish(deps, row?.publicMessageId ?? null, recapPayload(deps, day, totals, record, notes, pick));
  await deps.db.upsertDay(day, { status: "logged", publicMessageId: posted.id ?? row?.publicMessageId ?? null });

  const dayLine =
    mode === "add"
      ? `Added ${resultsText(wins, losses)}. ${prettyDay(day)} now totals ${resultsText(totals.wins, totals.losses)}.`
      : `Saved ${resultsText(totals.wins, totals.losses)} for ${prettyDay(day)}.`;
  const recordLine = `Running record: ${record.wins} W / ${record.losses} L (${pct(record.wins, record.losses)}%).`;
  return posted.error
    ? `${dayLine} ${recordLine}\nThe dashboard is updated, but ${permissionHint(posted.error)}`
    : `${dayLine} ${recordLine}\nPosted to the recap channel.`;
};

/** "No trades taken": post it publicly and remember the day. Used by the form (0 and 0) and the optional fallback. */
const postNoTrades = async (
  deps: Deps,
  day: string,
  row: DayRow | null,
  status: "no_trades" | "auto_no_trades",
  notes: string,
  pick: Pick = "a",
) => {
  const record = await deps.db.record();
  const posted = await publish(deps, row?.publicMessageId ?? null, recapPayload(deps, day, ZERO, record, notes, pick));
  await deps.db.upsertDay(day, { status, publicMessageId: posted.id ?? row?.publicMessageId ?? null });
  return posted;
};

// ---------- Discord interactions ----------

// deno-lint-ignore no-explicit-any
type Interaction = any;

const userIdOf = (i: Interaction) => i.member?.user?.id ?? i.user?.id ?? "";

const NOT_OWNER = "Only the account owner can log results.";

const parseCount = (raw: unknown): number | null => {
  if (typeof raw !== "string" || !/^\s*\d{1,4}\s*$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 0 && n <= 1000 ? n : null;
};

const numberField = (id: string, label: string, value: string) => ({
  type: 1,
  components: [
    {
      type: 4,
      custom_id: id,
      label,
      style: 1,
      min_length: 1,
      max_length: 4,
      required: true,
      placeholder: "0",
      ...(value ? { value } : {}),
    },
  ],
});

const notesField = (value: string) => ({
  type: 1,
  components: [
    {
      type: 4,
      custom_id: "notes",
      label: "Notes (optional)",
      style: 2, // multi-line
      required: false,
      max_length: NOTES_MAX,
      placeholder: "Anything to add about the day",
      ...(value ? { value } : {}),
    },
  ],
});

/** The form. `mode` is remembered in the form's id, so nothing has to be stored between steps. */
const recapForm = (day: string, mode: SaveMode, pick: Pick, existing: Totals, notes: string) =>
  modal({
    custom_id: `recap:submit:${day}:${mode}:${pick}`,
    title: `Recap for ${prettyDay(day)}`,
    components: [
      // Editing the day's numbers starts from what is there; adding starts empty.
      numberField("wins", "Wins (0 if none)", mode === "replace" ? String(existing.wins) : ""),
      numberField("losses", "Losses (0 if none)", mode === "replace" ? String(existing.losses) : ""),
      notesField(notes),
    ],
  });

/** /daily-recap */
const onCommand = async (i: Interaction, deps: Deps): Promise<Response> => {
  if (i.data?.name !== COMMAND_NAME) return ephemeral("That command isn't recognised.");
  if (!deps.config.ownerIds.includes(userIdOf(i))) return ephemeral(NOT_OWNER);

  const today = istDay(deps.now());
  const raw = (i.data?.options ?? []).find((o: { name: string }) => o.name === "date")?.value;
  const day = raw === undefined || String(raw).trim() === "" ? today : String(raw).trim();
  if (!isDay(day)) return ephemeral("Use the date format YYYY-MM-DD, for example 2026-10-17.");
  if (day > today) return ephemeral("That date is in the future.");

  const rawPick = (i.data?.options ?? []).find((o: { name: string }) => o.name === "result")?.value;
  if (rawPick !== undefined && rawPick !== "" && !(String(rawPick) in PICK_BY_VALUE)) {
    return ephemeral("Pick Green, Red or Breakeven for the result, or leave it empty.");
  }
  const pick: Pick = rawPick === undefined || rawPick === "" ? "a" : PICK_BY_VALUE[String(rawPick)];

  const existing = await deps.db.dayTotals(day);
  if (existing.entries === 0) return recapForm(day, "new", pick, existing, "");

  // The day already has entries: choose what to do first, then fill in the form.
  return ephemeral(
    `${prettyDay(day)} already has ${resultsText(existing.wins, existing.losses)} logged. What do you want to do?`,
    [
      {
        type: 1,
        components: [
          { type: 2, style: 4, label: "Replace it", custom_id: `recap:mode:${day}:replace:${pick}` },
          { type: 2, style: 1, label: "Add to it", custom_id: `recap:mode:${day}:add:${pick}` },
          { type: 2, style: 2, label: "Cancel", custom_id: "recap:cancel" },
        ],
      },
    ],
  );
};

/** Replace / Add / Cancel buttons. Replace and Add open the form. */
const onComponent = async (i: Interaction, deps: Deps): Promise<Response> => {
  const [ns, action, day, mode, rawPick] = String(i.data?.custom_id ?? "").split(":");
  if (ns !== "recap") return ephemeral("That button isn't recognised.");
  if (!deps.config.ownerIds.includes(userIdOf(i))) return ephemeral(NOT_OWNER);
  if (action === "cancel") return updateMessage("Cancelled. Nothing was changed.");

  if (action === "mode" && isDay(day) && (mode === "replace" || mode === "add")) {
    const [existing, row] = await Promise.all([deps.db.dayTotals(day), deps.db.getDay(day)]);
    return recapForm(day, mode, toPick(rawPick), existing, await earlierNotes(deps, row));
  }
  return ephemeral("That button isn't recognised.");
};

/** The form was submitted. */
const onModal = async (i: Interaction, deps: Deps): Promise<Response> => {
  const [ns, action, day, rawMode, rawPick] = String(i.data?.custom_id ?? "").split(":");
  if (ns !== "recap" || action !== "submit" || !isDay(day)) return ephemeral("That form isn't recognised.");
  if (!deps.config.ownerIds.includes(userIdOf(i))) return ephemeral(NOT_OWNER);

  const fields: Record<string, string> = {};
  for (const row of i.data?.components ?? []) {
    for (const c of row.components ?? []) fields[c.custom_id] = c.value;
  }
  const wins = parseCount(fields.wins);
  const losses = parseCount(fields.losses);
  if (wins === null || losses === null) {
    return ephemeral("Wins and losses must be whole numbers from 0 to 1000. Nothing was saved.");
  }
  const notes = String(fields.notes ?? "").trim().slice(0, NOTES_MAX);
  const pick = toPick(rawPick);

  const existing = await deps.db.dayTotals(day);
  // Entries can appear while the form is open (for example from the dashboard), so never overwrite by accident.
  const mode: SaveMode = rawMode === "replace" ? "replace" : existing.entries > 0 ? "add" : "new";

  // 0 and 0 means no trades that day.
  if (wins + losses === 0) {
    if (existing.entries > 0) {
      return ephemeral(
        `${prettyDay(day)} already has ${resultsText(existing.wins, existing.losses)} logged, so it can't be marked as no trades. Delete those entries on the dashboard first, or enter the real numbers.`,
      );
    }
    const row = await deps.db.getDay(day);
    const posted = await postNoTrades(deps, day, row, "no_trades", notes, pick);
    return ephemeral(posted.error ? permissionHint(posted.error) : `Posted: no trades taken on ${prettyDay(day)}.`);
  }

  return ephemeral(await saveResult(deps, day, wins, losses, mode, notes, pick));
};

// ---------- maintenance calls ----------

/** Optional 11:59 PM fallback. Only runs if you schedule it. */
const runDeadline = async (deps: Deps, dryRun: boolean) => {
  // Five minutes back, so a scheduler that fires just after midnight still means the day that is ending.
  const day = istDay(new Date(deps.now().getTime() - 5 * 60 * 1000));
  const row = await deps.db.getDay(day);
  if (row && row.status !== "prompted") return { ok: true, day, results: [] as unknown[], skipped: `already ${row.status}` };

  const [totals, record] = await Promise.all([deps.db.dayTotals(day), deps.db.record()]);
  // Trades already on the dashboard: post those, never "no trades".
  const fromDashboard = totals.entries > 0;
  const what = fromDashboard ? "recap from the dashboard entries" : "no trades taken";
  if (dryRun) return { ok: true, day, results: [{ day, wouldPost: what }] };

  const posted = fromDashboard
    ? await publish(deps, row?.publicMessageId ?? null, recapPayload(deps, day, totals, record, ""))
    : await postNoTrades(deps, day, row, "auto_no_trades", "");
  if (fromDashboard) await deps.db.upsertDay(day, { status: "logged", publicMessageId: posted.id ?? row?.publicMessageId ?? null });
  return { ok: true, day, results: [{ day, posted: what, error: posted.error }] };
};

const onMaintenance = async (req: Request, deps: Deps, secret: string): Promise<Response> => {
  // A short or missing secret on our side means "not configured": refuse everything rather than match an empty value.
  if (deps.config.cronSecret.length < 16 || !safeEqual(secret, deps.config.cronSecret)) return json({ error: "forbidden" }, 403);
  let body: { action?: string; dryRun?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    // no body
  }
  try {
    if (body.action === "register") {
      const { appId, guildId } = deps.config;
      if (!appId) return json({ ok: false, error: "DISCORD_APP_ID is not set" }, 400);
      await deps.discord.registerCommand(appId, guildId ?? null, COMMAND);
      return json({ ok: true, command: COMMAND_NAME, scope: guildId ? "server" : "global" });
    }
    if (body.action === "deadline") return json(await runDeadline(deps, !!body.dryRun));
  } catch (e) {
    deps.log("maintenance call failed", messageOf(e));
    return json({ ok: false, error: messageOf(e) }, 502);
  }
  return json({ error: "unknown action" }, 400);
};

// ---------- entry point ----------

export const handleRequest = async (req: Request, deps: Deps): Promise<Response> => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const secret = req.headers.get("x-cron-secret");
  if (secret !== null) return onMaintenance(req, deps, secret);

  const signature = req.headers.get("x-signature-ed25519");
  const timestamp = req.headers.get("x-signature-timestamp");
  const body = await req.text();
  if (!signature || !timestamp || !deps.verify(body, signature, timestamp)) {
    return new Response("invalid request signature", { status: 401 });
  }

  let interaction: Interaction;
  try {
    interaction = JSON.parse(body);
  } catch {
    return new Response("bad request", { status: 400 });
  }

  const started = Date.now();
  try {
    switch (interaction.type) {
      case 1: // PING, sent by Discord when the endpoint URL is saved
        return json({ type: 1 });
      case 2: // slash command
        return await onCommand(interaction, deps);
      case 3: // button
        return await onComponent(interaction, deps);
      case 5: // submitted form
        return await onModal(interaction, deps);
      default:
        return ephemeral("That isn't supported.");
    }
  } catch (e) {
    deps.log("interaction failed", messageOf(e));
    return ephemeral("Something went wrong on the server. Check the dashboard to see whether the entry was saved.");
  } finally {
    deps.log(`interaction type ${interaction?.type} handled in ${Date.now() - started}ms`);
  }
};
