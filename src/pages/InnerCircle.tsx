import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import JoinForm from "@/components/inner-circle/JoinForm";
import { Button } from "@/components/ui/button";
import { DISCLAIMER, INNER_CIRCLE, PERKS, STEPS, formatUSD } from "@/data/innerCircle";

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

const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`type-label rule-mark text-muted-foreground ${className}`}>{children}</p>
);

const glance = [
  { value: formatUSD(INNER_CIRCLE.minDeposit), label: "Minimum deposit" },
  { value: "1", label: "Month, live account" },
  { value: String(PERKS.length), label: "Things you get" },
  { value: "All", label: "Of my trades, shared" },
];

const InnerCircle = () => (
  <div className="min-h-[100dvh]">
    <Helmet>
      <title>The Inner Circle: $100 Live Trading Challenge | Arjun IFVG</title>
      <meta
        name="description"
        content="Join Arjun's 1-month live trading challenge and get insight into every trade, plus the levels, setups and alerts. For educational purposes only."
      />
      <link rel="canonical" href={INNER_CIRCLE.url} />
      <meta property="og:title" content="The Inner Circle: $100 Live Trading Challenge" />
      <meta
        property="og:description"
        content="Arjun is taking a live trading challenge for a month. Join the Inner Circle for insight into every trade. For educational purposes only."
      />
      <meta property="og:url" content={INNER_CIRCLE.url} />
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
          A 1-month live challenge by Arjun IFVG
        </motion.p>

        <h1 className="type-display mt-5 text-[clamp(3.5rem,19vw,5.5rem)] sm:mt-6 sm:text-[clamp(4rem,min(13.5vw,19vh),10.5rem)]">
          <HeroLine delay={0.1}>The Inner</HeroLine>
          <HeroLine delay={0.22}>Circle</HeroLine>
          <HeroLine delay={0.34}>
            <span className="mt-3 block text-[clamp(1.5rem,6.4vw,2.25rem)] leading-[1] tracking-[-0.025em] text-primary sm:mt-5 sm:text-[clamp(2rem,4.6vw,4rem)]">
              {INNER_CIRCLE.challenge}
            </span>
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
              I'm taking this challenge myself, on a live account. Everyone who joins the Inner Circle gets insight into
              all of my trades for the whole month.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <a href="#join">
                    Join the Inner Circle
                    <ArrowRight weight="bold" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#perks">What you get</a>
                </Button>
              </div>
              <p className="type-label mt-5 text-muted-foreground">
                FOR EDUCATIONAL PURPOSES ONLY · LIVE ACCOUNT · {INNER_CIRCLE.period.toUpperCase()}
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
              THE CHALLENGE AT A GLANCE
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

      {/* What members get */}
      <section id="perks" className="shell scroll-mt-20 py-6 sm:py-10">
        <div className="bg-panel p-6 text-panel-foreground sm:p-12 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <p className="type-label rule-mark text-panel-muted">Inside the Inner Circle</p>
                <h2 className="type-title mt-6 text-[clamp(2.5rem,5.5vw,4.5rem)]">
                  I'm taking the challenge. <span className="text-signal">You get insight into every trade.</span>
                </h2>
                <p className="mt-8 max-w-md text-[1.0625rem] text-panel-muted">
                  Anyone who joins can follow along with all of my trades across the challenge period: one month.
                </p>
              </div>
            </Reveal>

            <ol className="lg:col-span-7">
              {PERKS.map((p, i) => (
                <li key={p.title}>
                  <Reveal delay={i * 0.05} className="flex gap-5 border-t border-panel-border py-6 first:border-t-0 first:pt-0 sm:gap-8">
                    <span className="type-mono pt-1 text-sm text-signal">0{i + 1}</span>
                    <div>
                      <h3 className="type-heading text-[clamp(1.375rem,2.4vw,1.875rem)]">{p.title}</h3>
                      <p className="mt-2 max-w-md text-[1.0625rem] text-panel-muted">{p.body}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* How to get in */}
      <section id="how" className="shell scroll-mt-20 py-16 sm:py-24">
        <Reveal>
          <Label>How to get in</Label>
          <h2 className="type-title mt-6 max-w-3xl text-[clamp(2.5rem,6vw,5rem)]">
            Three steps. <span className="text-primary">Then you're in.</span>
          </h2>
          <p className="mt-6 max-w-xl text-[1.0625rem] text-muted-foreground">
            To take part, register with our partner broker, {INNER_CIRCLE.broker}, and deposit at least{" "}
            {formatUSD(INNER_CIRCLE.minDeposit)}.
          </p>
        </Reveal>

        <ol className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex">
              <Reveal delay={i * 0.06} className="flex w-full flex-col border border-foreground p-7 sm:p-8">
                <span className="type-mono text-sm text-primary">0{i + 1}</span>
                <h3 className="type-title mt-6 text-[clamp(1.75rem,2.6vw,2.25rem)]">{s.title}</h3>
                <p className="mt-4 text-muted-foreground">{s.body}</p>
                {i === 0 && (
                  <div className="mt-auto pt-8">
                    <Button asChild size="sm" variant="outline">
                      <a href={INNER_CIRCLE.brokerUrl} target="_blank" rel="noopener noreferrer">
                        Open {INNER_CIRCLE.broker}
                        <ArrowUpRight weight="bold" />
                      </a>
                    </Button>
                  </div>
                )}
                {i === 2 && (
                  <div className="mt-auto pt-8">
                    <Button asChild size="sm" variant="outline">
                      <a href="#join">
                        Go to the form
                        <ArrowRight weight="bold" />
                      </a>
                    </Button>
                  </div>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Join */}
      <section id="join" className="shell scroll-mt-20 py-6 sm:py-10">
        <div className="grid gap-10 border-t border-foreground pt-12 lg:grid-cols-12 lg:gap-16 lg:pt-16">
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Label>Join</Label>
              <h2 className="type-title mt-6 text-[clamp(2.5rem,5.5vw,4.5rem)]">Take your seat</h2>
              <p className="type-lead mt-6 max-w-md text-muted-foreground">
                Your name, email and Discord username. That's all I need to invite you to the platform and the Inner
                Circle.
              </p>
              <p className="mt-8 max-w-md border-t border-border pt-4">
                Before you submit, you need a {INNER_CIRCLE.broker} account with at least{" "}
                {formatUSD(INNER_CIRCLE.minDeposit)} deposited.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-7">
            <JoinForm />
          </Reveal>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="shell pb-16 pt-10 sm:pb-24 sm:pt-16">
        <div className="grid gap-4 border-t border-border pt-8 lg:grid-cols-12 lg:gap-16">
          <p className="type-label text-muted-foreground lg:col-span-5">DISCLAIMER</p>
          <div className="max-w-2xl space-y-3 text-sm text-muted-foreground lg:col-span-7">
            <p>{DISCLAIMER}</p>
            <p>{INNER_CIRCLE.broker} is a separate company. The Inner Circle is run by Arjun IFVG.</p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default InnerCircle;
