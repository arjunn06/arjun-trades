/** Pure data with no imports, so the website and the Cloudflare Functions that write the SEO markup read the same words. */
/** Student messages from the community Discord, reproduced as posted (spelling and Tanglish included). */
export interface DiscordTestimonial {
  id: string;
  name: string;
  /** Shown under the name. Defaults to "Red Pill Student". */
  role?: string;
  /** ISO date the message was posted, when known. */
  date?: string;
  /** Proof attached to the message, such as a payout certificate. */
  proof?: { src: string; alt: string; caption: string };
  /** Paragraphs, in order. Wrap text in **double asterisks** for bold. */
  body: string[];
  /** Lines shown as a bullet list after body paragraph `listAfter` (0-based). */
  list?: { after: number; items: string[] };
  title?: string;
  edited?: boolean;
  /** BCP 47 tag when the message is not English, e.g. "ta-Latn" for Tamil in Latin script. */
  lang?: string;
  /** Verbatim excerpt shown on the homepage wall. Use … where text is cut. */
  highlight?: string;
}

export const featured: DiscordTestimonial = {
  id: "singara-velan",
  name: "Singara velan",
  highlight:
    "In my personal experience, Arjun IFVG Brother is one of the best ICT mentors I’ve learned from.",
  date: "2026-10-27",
  title: "My First Funded Account & First Payout Journey — Thank You, Arjun Brother! ❤️🙏",
  body: [
    "Initially, I planned to trade the Indian markets. But I struggled to find someone who could properly explain why we take a trade, what confirmations we need, and why a particular entry makes sense. Many people tell us where to enter, but they don’t always explain the logic behind the trade.",
    "Later, while searching on YouTube, I discovered **Arjun IFVG Brother**. After researching him and finding positive feedback on ChatGPT, I decided to join his **Red Pill course** and start learning ICT concepts.",
    "For three full months, I focused only on paper trading. I didn’t rush into buying a funded account. I waited until I developed confidence in my trading.",
    "Finally, on October 1st, I purchased my first-ever funded account — **Apex 50K**. This was a huge milestone in my trading journey.",
    "On Friday, October 23rd, I requested my first payout of **$500**. I still have around **$4,000 in profit** in my 50K account. This is just the beginning of my journey, and I’m grateful for everything I’ve learned so far.",
    "❤️ **My First Mentor Is Arjun IFVG, and My Last Mentor Will Also Be Arjun IFVG!** 🔥",
    "Arjun IFVG Brother was the first mentor who introduced me to ICT concepts and helped me understand the importance of having a reason behind every trade. I want to continue learning, improving, and growing with the knowledge I’ve gained from him. I’ll always be grateful to him for being an important part of my trading journey.",
    "One of the most valuable lessons he taught me is:",
    "**“When you control your losses, you can take the profits tomorrow.”**",
    "This has become my first priority in trading. I focus on protecting my capital, maintaining discipline, being patient, and understanding the logic behind every entry. I also completely avoid news trading because protecting my account is more important than chasing profits.",
    "❤️ **What Impressed Me Even More Was His Personal Care for His Students.**",
    "On Thursday, October 22nd, I mentioned that I hadn’t received my Plane email after my Apex payout request. The next day, Arjun Brother remembered what I had told him and personally asked me whether I had received the email. He told me to let him know if it still hadn’t arrived and said he would look into it.",
    "That small gesture meant a lot to me. It showed me that he doesn’t just teach ICT concepts; he also remembers his students’ concerns and genuinely cares about helping them. This kind of personal attention and support is something I truly appreciate. ❤️🙏",
    "Arjun Brother, thank you for teaching me ICT concepts, guiding me, and being supportive throughout this journey. My trading journey has only just begun, and I still have a lot to learn. I’m genuinely grateful to be part of the Red Pill community.",
    "**To anyone thinking about joining Arjun IFVG’s classes:** Don’t join blindly just because someone recommends a course. Understand his teaching approach, do your own research, and decide whether it fits your goals. In my personal experience, his ICT teaching and guidance have been valuable parts of my journey.",
    "**In my personal experience, Arjun IFVG Brother is one of the best ICT mentors I’ve learned from.** ❤️🔥",
    "**My First Mentor — Arjun IFVG. My Last Mentor — Arjun IFVG.** ❤️",
    "This is just the beginning. More discipline, more learning, and more growth ahead! 🚀",
  ],
};

export const wall: DiscordTestimonial[] = [
  {
    id: "tobi",
    name: "Tobi",
    highlight:
      "I've learnt things psychologically, like how trading is simple and we traders are the one's who make it complicated.",
    date: "2026-09-19",
    body: [
      "Soo... I'm happy that I joined the red pill 3 class. I would say it was worth it. My journey in trading is around 8-9 months. Where I've always been jumping between strategies. Like when see in yt I feel like oh this works, that works, but when I try to execute I was so confused, blew around 4 CFD accounts till date. Then I started following arjun bro and joined the red pill. I've learnt things psychologically, like how trading is simple and we traders are the one's who make it complicated. I'm following arjun bro's strategy since I came to know about it. I'm paper trading it, I know that the strategy works, I lose sometimes. So it is up to me to be disciplined. Execute, repeat the winners and learn from the losers.",
      "~FTW",
    ],
  },
  {
    id: "cython",
    name: "Ç¥thøñ",
    highlight: "ifvg strategy is excellent and your teaching is also really good. I understood the concepts clearly.",
    date: "2026-09-19",
    body: [
      "Bro, in my opinion, ifvg strategy is excellent and your teaching is also really good. I understood the concepts clearly. But I have one doubt — is what we learned in this class enough for long-term trading or to become a full-time trader? Or are there still more advanced things we need to learn and practice?",
    ],
  },
  {
    id: "sanu",
    lang: "ta-Latn",
    name: "Sanu",
    highlight:
      "neenga tharra class recordings enaku neraya help pannuchu … doubts uh atha paakum pothu maximum clear agitum! Thanks bro ❤️",
    date: "2026-09-19",
    edited: true,
    body: [
      "Bro honest ah sollanum na enaku vanthu neenga sonna strategy concepts la nallave purinchu intha strategy ku thevaiyaana ellame sollitinga athu mattum illama simple ah puriyuramaari eruchu trade ah porutha varaikum simple ah eruthatha decision edukka easy ah erukkum! Enaku vanthu ithula neega sonnathula trade edukurathaku thevaiyaana tha mattum sollama yatha panna kudaatho atha sonnathu usefulla eruchu. apro neenga tharra class recordings enaku neraya help pannuchu ena enaku class nadakum pothu oru sila time net kedaikkaathu athalam na recordings la tha paapen athu mattum illa doubts uh atha paakum pothu maximum clear agitum! Thanks bro ❤️",
    ],
  },
  {
    id: "veera-pradeep",
    lang: "ta-Latn",
    name: "Veera pradeep 081",
    highlight: "Bro unga strategy pakka simple ah nalla puriyara mari iruku … but unga class pakka bro nalla research bro",
    date: "2026-09-20",
    body: [
      "Bro unga strategy pakka simple ah nalla puriyara mari iruku but students ah unga kudavea travel panra mari pakka plan oda move panna nalla Irukum bro excicute panrathula tha confusion ah Iruku bro and risk management lot size ithula konja confusion ah Iruku bro but unga class pakka bro nalla research bro",
    ],
  },
  {
    id: "jeevan",
    name: "Jeevan",
    highlight:
      "The strategy is really good, and your guidance has helped me understand market dynamics and execution much better. 🙏",
    date: "2026-09-21",
    body: [
      "Bro, first of all, I really appreciate the way you teach and explain the IFVG strategy. The strategy is really good, and your guidance has helped me understand market dynamics and execution much better. 🙏",
      "One small suggestion that I feel would make the mentorship even more useful for students: it would be great to have a printed/PDF step-by-step implementation guide covering:",
      "Even though you’ve already provided the indicator for free, having all the rules compiled in one printed format would make it much easier for students to follow the strategy consistently and avoid missing any important rules.",
      "Also, if possible, having two doubt-clearing sessions on weekends would be very helpful for students to review their weekly setups and clarify their doubts.",
      "I understand that market dynamics can change over time, but having a structured reference guide based on the current strategy would make the learning and execution process much easier.",
      "Overall, really happy with the mentorship, bro. These additions would make an already good learning process even more structured. ❤️🙏",
    ],
    list: {
      after: 1,
      items: [
        "What key levels need to be marked",
        "Minimum FVG size required",
        "Exact start and end timings for each session",
        "Entry, SL and TP rules",
        "A complete step-by-step execution checklist",
      ],
    },
  },
  {
    id: "baskar",
    name: "Baskar",
    highlight: "Bro first payout 🔥🔥🔥 Thanks bro I did it with your blue pill course and youtube live",
    role: "Blue Pill Student",
    body: ["Bro first payout 🔥🔥🔥 Thanks bro I did it with your blue pill course and youtube live"],
    proof: {
      src: "/images/testimonials/baskar-payout-certificate.jpg",
      alt: "Lucid Trading payout certificate awarded to Baskar for a $1,000 payout, dated September 30, 2026",
      caption: "Lucid Trading payout certificate · 30 Sept 2026",
    },
  },
];

/** Every testimonial, featured story first. */
export const everyone: DiscordTestimonial[] = [featured, ...wall];

/** Order the highlights appear on the homepage wall. */
const HIGHLIGHT_ORDER = ["singara-velan", "baskar", "tobi", "jeevan", "cython", "sanu", "veera-pradeep"];

export const highlights = HIGHLIGHT_ORDER.map((id) => everyone.find((t) => t.id === id))
  .filter((t): t is DiscordTestimonial & { highlight: string } => !!t?.highlight);
