import type { DiscordApi, MessagePayload } from "./logic.ts";

const API = "https://discord.com/api/v10";

/** Minimal Discord REST client: post, edit and read a message, register a slash command. */
export const makeDiscord = (botToken: string, fetchFn: typeof fetch = fetch): DiscordApi => {
  const call = async (method: string, path: string, body?: unknown) => {
    const res = await fetchFn(`${API}${path}`, {
      method,
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
        "User-Agent": "DiscordBot (https://ifvg.in, 1.0)",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Discord ${method} ${path} failed with ${res.status}: ${detail.slice(0, 200)}`);
    }
    return res.json();
  };

  return {
    async postMessage(channelId: string, payload: MessagePayload) {
      const message = await call("POST", `/channels/${channelId}/messages`, payload);
      return { id: String(message.id) };
    },
    async editMessage(channelId: string, messageId: string, payload: MessagePayload) {
      await call("PATCH", `/channels/${channelId}/messages/${messageId}`, payload);
    },
    async getMessage(channelId: string, messageId: string) {
      const message = await call("GET", `/channels/${channelId}/messages/${messageId}`);
      return { content: String(message.content ?? "") };
    },
    // POST creates the command, or updates it if one with the same name already exists.
    async registerCommand(appId: string, guildId: string | null, command: unknown) {
      const path = guildId ? `/applications/${appId}/guilds/${guildId}/commands` : `/applications/${appId}/commands`;
      await call("POST", path, command);
    },
  };
};
