/**
 * Everything the Arena page states as fact lives here, so one edit updates the whole page.
 * Anything not decided yet (dates, platform, scoring) is deliberately left out rather than guessed.
 */

export const ARENA = {
  name: "Ultimate IFVG Arena",
  entryFee: 99,

  /** What people see, copy and type into their UPI app. */
  upiNumber: "7339563737",
  /**
   * The UPI address behind the number. Not shown on the page: UPI payment links and QR codes only accept an
   * address, not a phone number, so it is used for the QR code and the tap-to-pay button.
   */
  upiId: "arjun.2003@yescred",
  /** The name registered with the bank, as UPI apps show it. */
  payeeName: "ARJUN S",

  /** Illustration only, taken from the example in the promise. Not a quoted Apex price. */
  exampleActivationFee: 5000,

  /** The explainer video. It goes public on 2026-10-11 at 9 am, so until then YouTube shows it as unavailable. */
  videoId: "Mbh_fDfFqe4",
  videoUrl: "https://youtu.be/Mbh_fDfFqe4",

  youtubeUrl: "https://youtube.com/@arjun_ifvg",
  discordUrl: "https://discord.gg/SCHeKKCa6c",
  instagramUrl: "https://www.instagram.com/arjun_ifvg",
} as const;

export type MatchId = "playoff-1" | "eliminator" | "playoff-2" | "final";

export interface Match {
  id: MatchId;
  label: string;
  /** Short matchup used on the bracket card. */
  matchup: string;
  win: string;
  lose: string;
}

export const MATCHES: Match[] = [
  {
    id: "playoff-1",
    label: "Playoff 1",
    matchup: "#1 vs #2",
    win: "Into the Final",
    lose: "Playoff 2, a second life",
  },
  {
    id: "eliminator",
    label: "Eliminator",
    matchup: "#3 vs #4",
    win: "Into Playoff 2",
    lose: "Out",
  },
  {
    id: "playoff-2",
    label: "Playoff 2",
    matchup: "Loser of Playoff 1 vs winner of Eliminator",
    win: "Into the Final",
    lose: "Out",
  },
  {
    id: "final",
    label: "The Final",
    matchup: "Winner of Playoff 1 vs winner of Playoff 2",
    win: "Apex account + activation fee",
    lose: "Apex account",
  },
];

export const STEPS = [
  {
    title: "Register",
    body: "₹99 gets you a seat. If that's a stretch right now, say so on the form and I'll cover it.",
  },
  {
    title: "League week",
    body: "Seven days of paper trading. The leaderboard moves as you trade, so everyone can watch it live.",
  },
  {
    title: "Top 4 qualify",
    body: "When the week ends, the four highest on the leaderboard move on to the playoffs.",
  },
  {
    title: "Head to head, live",
    body: "Playoffs are 1-on-1 matches streamed on YouTube with live commentary.",
  },
] as const;

export const FAQ = [
  {
    q: "Is this real-money trading?",
    a: "No. Everyone paper trades, so nobody puts trading capital at risk. The ₹99 is the entry fee, and it goes where the section above says it goes.",
  },
  {
    q: "How do I pay?",
    a: "On the registration form, pay ₹99 to my UPI number from any UPI app (or scan the code, or tap the button on your phone), then paste the UPI reference number. I match every payment by hand, and your entry shows as confirmed once I have.",
  },
  {
    q: "Where exactly does my ₹99 go?",
    a: "Into the winner's Apex activation fee. If we collect more than that fee costs, the rest goes to charity or meals for people in need. I don't keep any of it.",
  },
  {
    q: "What if I can't afford ₹99?",
    a: "Message me on Instagram or Discord and I'll put the ₹99 in for you. You play in the same league, on the same leaderboard, as everyone else.",
  },
  {
    q: "Will I see where the money went?",
    a: "Yes. I'll show how many registrations came in, the total collected, how much went to the activation fee and how much to charity. I'll also show who donated and to whom in a short video clip, without showing the receiver's face, to protect their privacy.",
  },
  {
    q: "Do I need an Apex account to join?",
    a: "No. The winner and the runner-up get theirs through the Arena.",
  },
  {
    q: "Can I just watch?",
    a: "Yes. The head-to-head playoffs are livestreamed on YouTube with live commentary, and you don't need to register to watch.",
  },
  {
    q: "When does it start, and what are the rules?",
    a: "Dates and the full rules (platform, instruments, scoring) will be announced on YouTube and Discord before the league begins. Registering now holds your seat.",
  },
] as const;

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;
