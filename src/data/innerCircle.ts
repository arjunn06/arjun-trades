/**
 * Everything the Inner Circle page states as fact lives here, so one edit updates the whole page.
 * Anything not decided yet (start date, account rules) is deliberately left out rather than guessed.
 */

export const INNER_CIRCLE = {
  name: "The Inner Circle",
  challenge: "$100 Live Trading Challenge",
  url: "https://ifvg.in/inner-circle",

  /** The least a member has to deposit with the partner broker, in US dollars. */
  minDeposit: 100,
  /** How long members get insight into Arjun's trades. */
  period: "1 month",

  broker: "Fusion Markets",
  /** Where the "Open Fusion Markets" buttons send people. This is the partner (referral) link, so sign-ups are credited. */
  brokerUrl: "https://fusionmarkets.com/?refcode=118304",

  discordUrl: "https://discord.gg/SCHeKKCa6c",
} as const;

export const formatUSD = (n: number) => `$${n.toLocaleString("en-US")}`;

/** What members get. The order here is the order on the page. */
export const PERKS = [
  {
    title: "The levels I'm watching",
    body: "The areas on the chart I'm marking and keeping an eye on.",
  },
  {
    title: "My plan once the levels get traded into",
    body: "How I plan to approach price after it reaches those levels.",
  },
  {
    title: "The setups I'm interested in",
    body: "The kinds of setups I'm looking for, so you know what I'm waiting on.",
  },
  {
    title: "Transparent challenge progress",
    body: "An open look at how the challenge is going, all month.",
  },
  {
    title: "Exclusive alerts",
    body: "Alerts that go to the Inner Circle only.",
  },
] as const;

export const STEPS = [
  {
    title: `Register with ${INNER_CIRCLE.broker}`,
    body: `${INNER_CIRCLE.broker} is our partner broker. You need an account with them to take part.`,
  },
  {
    title: `Deposit at least ${formatUSD(INNER_CIRCLE.minDeposit)}`,
    body: `Fund the account with a minimum of ${formatUSD(INNER_CIRCLE.minDeposit)}. That's the entry requirement.`,
  },
  {
    title: "Request your invite",
    body: "Give me your name, email and Discord username below, and I'll invite you to the platform and the Inner Circle.",
  },
] as const;

export const DISCLAIMER =
  "The Inner Circle is for educational purposes only. Nothing shared in it is financial advice, or a recommendation to buy or sell anything. Trading carries risk, and you can lose some or all of the money you deposit. Past results don't predict future ones.";
