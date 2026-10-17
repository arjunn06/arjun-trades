// Discord daily recap bot, as a Supabase Edge Function.
// Setup, secrets, deploy and scheduling are in README.md in this folder.
import nacl from "npm:tweetnacl@1.0.3";
import { createClient } from "npm:@supabase/supabase-js@2";
import { makeDb } from "./db.ts";
import { makeDiscord } from "./discord.ts";
import { handleRequest, type Deps } from "./logic.ts";
import { verifyDiscordSignature } from "./verify.ts";

const REQUIRED = [
  "DISCORD_PUBLIC_KEY",
  "DISCORD_BOT_TOKEN",
  "DISCORD_OWNER_IDS",
  "DISCORD_RECAP_CHANNEL_ID",
  "CRON_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const env = (name: string) => Deno.env.get(name) ?? "";
const missing = REQUIRED.filter((name) => !env(name));
if (missing.length > 0) console.error(`discord-recap is missing secrets: ${missing.join(", ")}`);

const deps: Deps | null =
  missing.length > 0
    ? null
    : {
        config: {
          ownerIds: env("DISCORD_OWNER_IDS").split(",").map((s) => s.trim()).filter(Boolean),
          recapChannelId: env("DISCORD_RECAP_CHANNEL_ID"),
          cronSecret: env("CRON_SECRET"),
          // Only needed once, to register the /daily-recap command.
          appId: env("DISCORD_APP_ID") || undefined,
          guildId: env("DISCORD_GUILD_ID") || undefined,
        },
        verify: (body, signature, timestamp) =>
          verifyDiscordSignature(nacl, env("DISCORD_PUBLIC_KEY"), signature, timestamp, body),
        db: makeDb(createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } })),
        discord: makeDiscord(env("DISCORD_BOT_TOKEN")),
        now: () => new Date(),
        log: (message, extra) => console.log(`[discord-recap] ${message}`, extra ?? ""),
      };

Deno.serve((req) => {
  if (!deps) return new Response(JSON.stringify({ error: "not configured" }), { status: 500 });
  return handleRequest(req, deps);
});
