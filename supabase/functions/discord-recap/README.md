# Discord daily recap bot

You type `/daily-recap` in your server. A form pops up asking for **wins**, **losses** and optional **notes**. When you
submit, the bot:

1. saves the entry to the livestream record (the website and the admin dashboard update straight away),
2. posts your recap in the public recap channel, in your usual format:

```
@everyone
Trading Recap:
🟢 2 WIN 0 LOSS

Absolutely cooked on OPEX
```

The emoji is yours to pick: `/daily-recap result:` offers **🟢 Green day**, **🔴 Red day** and **⚫️ Breakeven**. If you
leave it empty, the bot picks by the counts (🟢 wins beat losses, 🔴 losses beat wins, ⚫️ even or no trades). Use the pick
when the counts don't tell the story, such as 3 wins and 2 losses that still ended red. If you log the same day again,
pick the result again, or the bot goes back to choosing by the counts. Notes only go into the Discord post. They are
never saved in a database. The post starts with `@everyone`, which pings the server when it is first sent (editing the
post later does not ping again), so the bot needs the **Mention @everyone** permission in the recap channel. To stop the
ping, delete that line in `template.ts`. Nothing is ever sent to you automatically.

- **No trades today:** enter `0` and `0` (notes are fine too). The bot posts `⚫️ 0 WIN 0 LOSS`.
- **Day already has entries** (for example you tapped "1 Win" on the dashboard during the stream): the bot asks first
  whether to **Replace** them or **Add** to them, then opens the form. Replace starts from the day's current numbers.
- **Another day:** `/daily-recap date:2026-10-15` logs that day instead of today. The post says which day it is.
- **Logging again for the same day** edits that day's earlier public message instead of posting a second one.
  The notes box is filled in from the existing post, so your notes aren't lost. This needs the **Read Message History**
  permission for the bot in the recap channel. Without it the notes box just starts empty.
- Only the Discord user IDs in `DISCORD_OWNER_IDS` can use it. The command is also hidden from everyone except server admins.

There is no bot process to keep running. Discord sends each command and form to this Supabase function.

## 1. Database

Run these in the Supabase SQL editor, in order (the first one is already done):

1. `supabase/migrations/20261016090000_livestream_results.sql`
2. `supabase/migrations/20261017090000_livestream_recap_bot.sql`

## 2. Discord, one time

1. Go to <https://discord.com/developers/applications> and choose **New Application**. Name it anything.
2. **General Information**: copy the **Application ID** (`DISCORD_APP_ID`) and the **Public Key** (`DISCORD_PUBLIC_KEY`).
3. **Bot** (left menu): choose **Reset Token** and copy it. This is `DISCORD_BOT_TOKEN`. Keep it secret. No privileged
   intents are needed.
4. **OAuth2 > URL Generator**: tick the scopes `bot` **and** `applications.commands`, then the permissions
   **View Channels** and **Send Messages** (and **Read Message History**, which keeps your notes when you log a day again).
   Open the generated URL and add the bot to your server.
5. Make sure the bot can see and post in the recap channel (for a private channel, add the bot's role under the
   channel's permissions).
6. In Discord, turn on **User Settings > Advanced > Developer Mode**. Then right-click to copy three IDs: the recap
   channel, your own user, and the server (right-click the server icon). The server ID is optional but makes the command
   appear instantly.

## 3. Secrets and deploy

Create `supabase/.env.discord` (it is git-ignored, never commit it):

```
DISCORD_APP_ID=the application id
DISCORD_PUBLIC_KEY=paste the public key
DISCORD_BOT_TOKEN=paste the bot token
DISCORD_OWNER_IDS=your Discord user id
DISCORD_RECAP_CHANNEL_ID=the public recap channel id
DISCORD_GUILD_ID=your server id
CRON_SECRET=any random string of 32+ characters
```

Make the `CRON_SECRET` with `openssl rand -hex 24`. It protects the two maintenance calls below. Then:

```bash
supabase login
supabase link --project-ref nfruhexbfxtxqvcvjbmm
supabase secrets set --env-file supabase/.env.discord
supabase functions deploy discord-recap --no-verify-jwt
```

`--no-verify-jwt` is required: Discord can't send a Supabase login token, so the function checks Discord's signature
itself. You can delete `supabase/.env.discord` once the secrets are set.

## 4. Point Discord at the function

Developer Portal > **General Information** > **Interactions Endpoint URL**:

```
https://nfruhexbfxtxqvcvjbmm.supabase.co/functions/v1/discord-recap
```

Save. Discord sends a test request, and the save only succeeds if the function is deployed, the secrets are set and
the public key is right.

## 5. Create the `/daily-recap` command (once)

The function registers the command itself, so you never handle the bot token in a terminal:

```bash
curl -X POST https://nfruhexbfxtxqvcvjbmm.supabase.co/functions/v1/discord-recap \
  -H "x-cron-secret: YOUR_CRON_SECRET" -H "Content-Type: application/json" \
  -d '{"action":"register"}'
```

You should get `{"ok":true,"command":"daily-recap","scope":"server"}`. Type `/` in your server and `daily-recap` appears.
If you change the command later (for example when a new option is added), run it again. It updates in place.

## 6. Try it

Before the real recap, point `DISCORD_RECAP_CHANNEL_ID` at a private test channel (set the secrets again), run
`/daily-recap`, and check the post and the dashboard. Then switch it to the real channel. Delete the test entry on the
admin dashboard.

## Changing the public message

Edit `template.ts` (the placeholders, such as `{emoji}`, `{wins}`, `{losses}` and `{notes}`, are listed at the top) and run
`supabase functions deploy discord-recap --no-verify-jwt` again.

## Optional: 11:59 PM fallback

Off by default. If you want the bot to post on its own when you forget, schedule this. At 11:59 PM IST, if you haven't
logged that day, it posts the **no trades** version of your recap. If you added trades on the dashboard but never ran `/daily-recap`, it
posts **those trades** instead, never "no trades". Think about this before turning it on: on a day you traded but forgot
to log anything anywhere, it would post "0 WIN 0 LOSS" publicly.

pg_cron works in UTC, and **11:59 PM IST is 18:29 UTC**. Replace `YOUR_CRON_SECRET` with the same value as `CRON_SECRET`,
then run in the SQL editor:

```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Keep the shared secret in Vault rather than in the job text.
select vault.create_secret('YOUR_CRON_SECRET', 'recap_cron_secret');

select cron.schedule('discord-recap-deadline', '29 18 * * *', $$
  select net.http_post(
    url := 'https://nfruhexbfxtxqvcvjbmm.supabase.co/functions/v1/discord-recap',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'recap_cron_secret')
    ),
    body := '{"action":"deadline"}'::jsonb
  );
$$);
```

To see what it would do without posting anything, send `{"action":"deadline","dryRun":true}` with the same curl as
step 5. To turn it off: `select cron.unschedule('discord-recap-deadline');`. To check it ran:
`select * from cron.job_run_details order by start_time desc limit 5;`.

## If something is off

| Symptom | Likely cause |
|---|---|
| Discord won't save the Interactions Endpoint URL | Function not deployed, a secret missing, or the wrong public key |
| `/daily-recap` doesn't appear | The bot was added without the `applications.commands` scope, the register call wasn't run, or you aren't a server admin (the command is hidden from everyone else). Reload Discord with Ctrl/Cmd+R |
| "This interaction failed" | Check the function logs in the Supabase dashboard (Edge Functions > discord-recap > Logs) |
| "Missing Access" or "Missing Permissions" in the reply | The bot lacks View Channel or Send Messages in the recap channel |
| Notes box is empty when logging a day again | The bot lacks Read Message History in the recap channel |
| "Only the account owner can log results" | Your user ID isn't in `DISCORD_OWNER_IDS` |
| Register call returns `DISCORD_APP_ID is not set` | Add it to the env file and run `supabase secrets set` again |
