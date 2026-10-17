// The public message the bot posts in your recap channel. Edit the text freely, then redeploy.
//
// Placeholders (each is replaced when the message is posted):
//   {emoji}      the result you picked in the command (🟢 / 🔴 / ⚫️). If you didn't pick one: 🟢 when wins beat
//                losses, 🔴 when losses beat wins, ⚫️ for an even day or no trades
//   {wins} {losses}   the day's numbers
//   {notes}      whatever you typed in the Notes box (blank if you left it empty)
//   {forDate}    empty for today; " for 15 Oct 2026" when you log an earlier day
//   {date} {weekday} {winsLabel} {lossesLabel} {trades} {winrate}
//   {totalWins} {totalLosses} {totalTrades} {totalWinrate}   (unused by default; the running record)
//
// The first line pings the whole server when the post is first sent (editing a post later does not ping again).
// Delete the "@everyone" line to stop that. The bot also needs the "Mention @everyone" permission in the channel.
//
// Trailing blank lines are removed, so a post without notes ends after the results line.
// Discord formatting works: **bold**, *italic*, line breaks.

export const RECAP_TEMPLATE = ["@everyone", "Trading Recap{forDate}:", "{emoji} {wins} WIN {losses} LOSS", "", "{notes}"].join("\n");

export type TemplateVars = Record<string, string | number>;

/** Replaces {name} placeholders in one pass (text inserted by a placeholder is never re-scanned). */
export const render = (template: string, vars: TemplateVars): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => (key in vars ? String(vars[key]) : ""));
