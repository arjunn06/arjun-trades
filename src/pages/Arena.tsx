import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowRight, DiscordLogo, Heart, InstagramLogo, Medal, Trophy } from "@phosphor-icons/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Bracket from "@/components/arena/Bracket";
import PoolExplainer from "@/components/arena/PoolExplainer";
import RegistrationForm from "@/components/arena/RegistrationForm";
import ShareButton from "@/components/arena/ShareButton";
import Transparency from "@/components/arena/Transparency";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { ARENA, FAQ, STEPS, formatINR } from "@/data/arena";
import portrait from "@/assets/arjun-portrait.webp";

const ease = [0.16, 1, 0.3, 1] as const;

const HeroLine = ({ children, delay }: { children: React.ReactNode; delay: number }) => (
  <span className="clip-line block">
    <motion.span
      className="block"
      initial={{ y: "108%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </motion.span>
  </span>
);

/** Confirmed entries, from a public function that returns a number and nothing else. Hidden if it can't load. */
const useConfirmedEntries = () => {
  const [entries, setEntries] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    supabase
      .rpc("arena_stats")
      .then(({ data, error }) => {
        if (cancelled || error) return;
        const n = (data as { entries?: number } | null)?.entries;
        if (typeof n === "number") setEntries(n);
      })
      .then(undefined, () => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return entries;
};

const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`type-label rule-mark text-muted-foreground ${className}`}>{children}</p>
);

const glance = [
  { value: formatINR(ARENA.entryFee), label: "Entry fee" },
  { value: "7", label: "Days of league" },
  { value: "4", label: "Reach the playoffs" },
  { value: "2", label: "Apex accounts to win" },
];

/** A hundred squares, one per ₹99, that fill in as the section scrolls into view. */
const Chain = () => (
  <div>
    <motion.div
      aria-hidden="true"
      className="grid grid-cols-10 gap-1.5 sm:gap-2"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: 0.014 }}
    >
      {Array.from({ length: 100 }, (_, i) => (
        <span key={i} className="relative block aspect-square bg-border">
          <motion.span
            className="absolute inset-0 bg-primary"
            variants={{
              hidden: { opacity: 0, scale: 0.4 },
              shown: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } },
            }}
          />
        </span>
      ))}
    </motion.div>
    <p className="type-label mt-5 text-muted-foreground">EACH SQUARE IS ONE TRADER'S ₹99</p>
    <p className="mt-1 text-[1.0625rem]">
      A hundred of us is {formatINR(100 * ARENA.entryFee)}. One person's shot, paid for by people who may never meet.
    </p>
  </div>
);

const Arena = () => {
  const confirmed = useConfirmedEntries();

  return (
    <div className="min-h-[100dvh]">
      <Helmet>
        <title>Ultimate IFVG Arena: a ₹99 paper trading tournament | Arjun IFVG</title>
        <meta
          name="description"
          content="A one-week paper trading league and live head-to-head playoffs. Every ₹99 entry goes toward the winner's Apex activation fee, and Arjun keeps none of it."
        />
        <link rel="canonical" href="https://ifvg.in/arena" />
        <meta property="og:title" content="Ultimate IFVG Arena" />
        <meta
          property="og:description"
          content="One week of paper trading, live playoffs on YouTube, and a community that funds the winner's Apex account, ₹99 at a time."
        />
        <meta property="og:url" content="https://ifvg.in/arena" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ifvg.in/Ombed.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <Header />
      <main id="main">
        {/* Hero */}
        <section className="shell pb-8 pt-8 sm:pt-12 lg:pb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="type-label rule-mark text-muted-foreground"
          >
            A trading tournament by Arjun IFVG
          </motion.p>

          <h1 className="type-display mt-5 text-[clamp(3rem,17.5vw,5.25rem)] sm:mt-6 sm:text-[clamp(4rem,min(13.5vw,19vh),10.5rem)]">
            <HeroLine delay={0.1}>Ultimate IFVG</HeroLine>
            <HeroLine delay={0.22}>
              <span className="text-primary">Arena</span>
            </HeroLine>
          </h1>

          <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
            <div className="flex min-w-0 flex-col justify-between gap-10 lg:col-span-6">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease }}
                className="type-lead max-w-lg"
              >
                One week of paper trading. A leaderboard that moves. Live head-to-head playoffs on YouTube. And an Apex
                account for the winner, paid for by all of us, {formatINR(ARENA.entryFee)} at a time.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.65, ease }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild size="lg">
                    <a href="#register">
                      Register, {formatINR(ARENA.entryFee)}
                      <ArrowRight weight="bold" />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href="#why">Why we're doing this</a>
                  </Button>
                </div>
                <p className="type-label mt-5 text-muted-foreground">
                  PAPER TRADING ONLY · LIVESTREAMED ON YOUTUBE
                  {confirmed !== null && confirmed > 0 && ` · ${confirmed} CONFIRMED SO FAR`}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease }}
              className="bg-panel text-panel-foreground lg:col-span-6"
            >
              <p className="type-label border-b border-panel-border px-6 py-4 text-panel-muted sm:px-8">
                THE ARENA AT A GLANCE
              </p>
              <dl className="grid grid-cols-2">
                {glance.map((g, i) => (
                  <div
                    key={g.label}
                    className={`p-6 sm:p-8 ${i % 2 === 1 ? "border-l border-panel-border" : ""} ${i > 1 ? "border-t border-panel-border" : ""}`}
                  >
                    <dd className="type-display text-[clamp(3rem,6vw,5rem)] tabular-nums">{g.value}</dd>
                    <dt className="type-label mt-3 text-panel-muted">{g.label.toUpperCase()}</dt>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>
        </section>

        {/* Why */}
        <section id="why" className="shell scroll-mt-20 py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <Label>Why this exists</Label>
              <h2 className="type-title mt-6 text-[clamp(2.5rem,6vw,5rem)]">
                I could fund this alone. <span className="text-primary">I'm choosing not to.</span>
              </h2>
              <div className="mt-8 max-w-xl space-y-5 text-[1.0625rem]">
                <p>
                  A trader with real skill and no spare cash shouldn't have to wait for luck. I could write that cheque
                  myself and be done in a minute.
                </p>
                <p>
                  But then one person helps one person, and it ends there. So I'm asking everyone to put in{" "}
                  {formatINR(ARENA.entryFee)} instead. When the winner activates their Apex account, it's because the whole
                  community lifted them. That's a chain, and the person we lift becomes the next one who can pull
                  someone up.
                </p>
                <p>
                  The leaderboard is how we find them: a week of paper trading out in the open, then head-to-head
                  matches live on stream. You don't get in on a name or a following. You earn your place on the board.
                </p>
              </div>
            </Reveal>
            <div className="lg:col-span-5 lg:pt-14">
              <Chain />
            </div>
          </div>
        </section>

        {/* Format */}
        <section id="format" className="shell scroll-mt-20 py-6 sm:py-10">
          <div className="bg-panel p-6 text-panel-foreground sm:p-12 lg:p-16">
            <Reveal>
              <p className="type-label rule-mark text-panel-muted">How it works</p>
              <h2 className="type-title mt-6 max-w-3xl text-[clamp(2.5rem,6vw,5rem)]">
                Seven days to get in. <span className="text-signal">Up to three matches to win it.</span>
              </h2>
            </Reveal>

            <ol className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={i * 0.06} className="border-t border-panel-foreground pt-5">
                    <span className="type-mono text-sm text-signal">0{i + 1}</span>
                    <h3 className="type-heading mt-2 text-xl">{s.title}</h3>
                    <p className="mt-3 text-[0.9375rem] text-panel-muted">{s.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>

            <div className="mt-16 border-t border-panel-border pt-12 lg:mt-20">
              <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
                <h3 className="type-title text-[clamp(1.75rem,3.4vw,2.75rem)] lg:col-span-5">The playoffs</h3>
                <p className="max-w-xl text-[1.0625rem] text-panel-muted lg:col-span-7">
                  Finish in the top 2 and you get two lives. Finish 3rd or 4th and every match is win or go home. It's
                  the same shape as the IPL playoffs, if you've watched those.
                </p>
              </div>
              <div className="mt-10">
                <Bracket />
              </div>
            </div>
          </div>
        </section>

        {/* Prizes */}
        <section id="prizes" className="shell scroll-mt-20 py-16 sm:py-24">
          <Reveal>
            <Label>The prizes</Label>
            <h2 className="type-title mt-6 text-[clamp(2.5rem,6vw,5rem)]">What's on the line</h2>
          </Reveal>

          <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:gap-6">
            <Reveal className="flex flex-col justify-between border border-primary bg-primary p-8 text-primary-foreground sm:p-10">
              <div>
                <Trophy className="h-9 w-9" weight="fill" aria-hidden="true" />
                <p className="type-label mt-8">WINNER</p>
                <h3 className="type-display mt-3 text-[clamp(2.75rem,5.5vw,4.5rem)]">
                  Apex account
                  <span className="block">+ activation fee</span>
                </h3>
              </div>
              <p className="mt-10 max-w-sm">
                The activation fee is paid by the community's {formatINR(ARENA.entryFee)} entries. That's the whole point.
              </p>
            </Reveal>

            <Reveal
              delay={0.08}
              className="flex flex-col justify-between border border-foreground p-8 sm:p-10"
            >
              <div>
                <Medal className="h-9 w-9" weight="fill" aria-hidden="true" />
                <p className="type-label mt-8 text-muted-foreground">RUNNER-UP</p>
                <h3 className="type-display mt-3 text-[clamp(2.75rem,5.5vw,4.5rem)]">
                  Apex account
                  <span className="block text-muted-foreground">no activation fee</span>
                </h3>
              </div>
              <p className="mt-10 max-w-sm text-muted-foreground">
                Reach the Final and you walk away with an account either way.
              </p>
            </Reveal>
          </div>

          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            Apex is a separate company. The Arena is organised by Arjun IFVG.
          </p>
        </section>

        {/* Money and promises */}
        <section id="money" className="shell scroll-mt-20 pb-16 sm:pb-24">
          <div className="grid gap-12 border-t border-foreground pt-12 lg:grid-cols-12 lg:gap-16 lg:pt-16">
            <Reveal className="lg:col-span-5">
              <Label>Where your {formatINR(ARENA.entryFee)} goes</Label>
              <h2 className="type-title mt-6 text-[clamp(2.5rem,5vw,4.25rem)]">Every rupee, accounted for</h2>
              <ol className="mt-10 space-y-6">
                {[
                  "Every rupee goes toward the winner's Apex activation fee.",
                  "Whatever is left after that goes to charity or meals for people in need.",
                  "I keep none of it. Not a single penny.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-5 border-t border-border pt-5">
                    <span className="type-mono text-sm text-primary">0{i + 1}</span>
                    <p className="text-[1.0625rem]">{t}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-7">
              <PoolExplainer confirmed={confirmed} />
            </Reveal>
          </div>

          <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={portrait}
                  alt="Arjun"
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "54% 30%" }}
                />
              </div>
            </Reveal>

            <div className="lg:col-span-8">
              <Reveal>
                <Label>Arjun's promises</Label>
              </Reveal>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Reveal delay={0.05} className="flex flex-col border border-foreground p-7 sm:p-8">
                  <Heart className="h-7 w-7 text-primary" weight="fill" aria-hidden="true" />
                  <h3 className="type-title mt-6 text-[clamp(1.75rem,2.6vw,2.25rem)]">
                    Not a single penny as profit
                  </h3>
                  <p className="mt-4 text-muted-foreground">
                    Say we collect ₹10,000 and the activation fee is ₹5,000. The other ₹5,000 goes to charity or meals
                    for people in need.
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    And I won't be the one handing it over. The youngest teenagers in our community who want to step in
                    for a good cause will take it there.
                  </p>
                </Reveal>

                <Reveal delay={0.12} className="flex flex-col border border-foreground p-7 sm:p-8">
                  <Heart className="h-7 w-7 text-primary" weight="fill" aria-hidden="true" />
                  <h3 className="type-title mt-6 text-[clamp(1.75rem,2.6vw,2.25rem)]">
                    If {formatINR(ARENA.entryFee)} is too much, tell me
                  </h3>
                  <p className="mt-4 text-muted-foreground">
                    If you genuinely can't afford the entry fee, message me and I'll put the {formatINR(ARENA.entryFee)}{" "}
                    in for you. You play in the same league, on the same leaderboard, as an equal.
                  </p>
                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    <Button asChild size="sm" variant="outline">
                      <a href={ARENA.instagramUrl} target="_blank" rel="noopener noreferrer">
                        <InstagramLogo weight="fill" />
                        Instagram
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={ARENA.discordUrl} target="_blank" rel="noopener noreferrer">
                        <DiscordLogo weight="fill" />
                        Discord
                      </a>
                    </Button>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <Transparency confirmed={confirmed} />

        {/* Register */}
        <section id="register" className="shell scroll-mt-20 py-6 sm:py-10">
          <div className="grid gap-10 border-t border-foreground pt-12 lg:grid-cols-12 lg:gap-16 lg:pt-16">
            <Reveal className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <Label>Register</Label>
                <h2 className="type-title mt-6 text-[clamp(2.5rem,5.5vw,4.5rem)]">Be a link in the chain</h2>
                <p className="type-lead mt-6 max-w-md text-muted-foreground">
                  {formatINR(ARENA.entryFee)} and a few details. Your entry is confirmed once I've matched your payment.
                </p>
                <ul className="mt-8 max-w-md space-y-4">
                  {[
                    "A seat in the one-week league, on the live leaderboard",
                    "A shot at the playoffs, streamed live on YouTube",
                    `${formatINR(ARENA.entryFee)} toward lifting the winner`,
                  ].map((t) => (
                    <li key={t} className="flex gap-4 border-t border-border pt-4">
                      <span aria-hidden="true" className="mt-2.5 h-0.5 w-5 shrink-0 bg-primary" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-7">
              <RegistrationForm />
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="shell scroll-mt-20 py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <Label>Questions</Label>
              <h2 className="type-title mt-6 text-[clamp(2.25rem,4.4vw,3.5rem)]">Good to know</h2>
            </Reveal>
            <Reveal delay={0.06} className="lg:col-span-8">
              <Accordion type="single" collapsible className="border-t border-foreground">
                {FAQ.map((f, i) => (
                  <AccordionItem key={f.q} value={`q${i}`} className="border-border">
                    <AccordionTrigger className="py-5 text-left text-[1.125rem] font-semibold hover:text-primary hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="max-w-2xl pb-6 text-[1.0625rem] text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* Close */}
        <section className="pb-16 sm:pb-24">
          <div className="shell grid items-end gap-10 border-t border-foreground pt-12 lg:grid-cols-12 lg:pt-16">
            <Reveal className="lg:col-span-8">
              <h2 className="type-display text-[clamp(3rem,9vw,7.5rem)]">
                Help lift the <span className="text-primary">next trader.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-4">
              <p className="max-w-sm text-[1.0625rem] text-muted-foreground">
                {formatINR(ARENA.entryFee)}. A week of paper trading. A funded shot for someone who's earned it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="#register">
                    Register
                    <ArrowRight weight="bold" />
                  </a>
                </Button>
                <ShareButton />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Arena;
