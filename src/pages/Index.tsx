import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, DiscordLogo, YoutubeLogo } from "@phosphor-icons/react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import TextLink from "@/components/TextLink";
import TestimonialWall from "@/components/TestimonialWall";
import YouTubeFacade, { ytThumb } from "@/components/YouTubeFacade";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { BLUEPRINT_URL, BLUEPILL_URL, REDPILL_URL } from "@/lib/links";
import portrait from "@/assets/arjun-portrait.webp";
import redPill from "@/assets/red-pill-hand.jpg";
import bluePill from "@/assets/blue-pill-hand.jpg";

interface YTVideo {
  id: string;
  title: string;
  thumbnail?: string;
}

const fallbackVideos: YTVideo[] = [
  { id: "6DWzpfwnKoE", title: "The Reality of Trading Patterns EXPOSED | Why Chart Patterns Fail (Tamil)" },
  { id: "ApRidgKGCr0", title: "How To Identify Daily Bias & Market Narrative | Top Down Analysis Trading Strategy in Tamil" },
  { id: "lswnGDvPxuQ", title: "Forex to Futures Trading: Complete Beginner Guide + Prop Firm Rules In Tamil" },
  { id: "mk0xTQ0EGBw", title: "Why Support & Resistance Trading Always Fails | Brutal Truth for Beginners (Tamil)" },
  { id: "ZQp2rq3KEKk", title: "Introduction to SMC and Liquidity" },
  { id: "uJY02oI3LOI", title: "This Simple iFVG Trading Strategy Will Make You Rich In 2026 - For Beginners (Tamil)" },
];

const directory = [
  {
    title: "YouTube content",
    desc: "Free trading education: breakdowns, recaps, and ICT concepts explained clearly.",
    cta: "Watch now",
    href: "https://youtube.com/@arjun_ifvg",
  },
  {
    title: "Live workshop",
    desc: "Deep-dive, structured iFVG workshop with live examples and Q&A.",
    cta: "View workshop",
    to: "/workshop",
  },
  {
    title: "Blogs",
    desc: "Trading insights, market analysis, and lessons from the journey.",
    cta: "Read blogs",
    to: "/blogs",
  },
  {
    title: "Discord community",
    desc: "Connect with like-minded traders. Daily analysis, alerts, and live discussion.",
    cta: "Join Discord",
    href: "https://discord.gg/SCHeKKCa6c",
  },
];

const playlists = [
  {
    title: "Bootcamp: Basics to Trading",
    description:
      "Start your trading journey from scratch: learn the fundamentals, chart reading, and core concepts step by step.",
    url: "https://www.youtube.com/playlist?list=PL6eNJ1hMC0iaity1hyA8V59IMEk_6nldG",
    embedId: "videoseries?list=PL6eNJ1hMC0iaity1hyA8V59IMEk_6nldG",
    span: "lg:col-span-7",
  },
  {
    title: "iFVG Free Course",
    description:
      "Master the iFVG trading strategy with this comprehensive free course, from theory to live market application.",
    url: "https://www.youtube.com/playlist?list=PL6eNJ1hMC0ibTLpZZPrDqk5abwsqZ5hV8",
    embedId: "videoseries?list=PL6eNJ1hMC0ibTLpZZPrDqk5abwsqZ5hV8",
    span: "lg:col-span-5",
  },
];

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

const Index = () => {
  const [videos, setVideos] = useState<YTVideo[]>(fallbackVideos);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    supabase.functions
      .invoke("youtube-videos", { method: "GET" })
      .then(({ data, error }) => {
        if (cancelled || error || !data?.videos?.length) return;
        const fetched = data.videos as YTVideo[];
        // Ensure at least 6 videos by padding from fallback if needed.
        const seen = new Set(fetched.map((v) => v.id));
        const padded = [...fetched];
        for (const fb of fallbackVideos) {
          if (padded.length >= 6) break;
          if (!seen.has(fb.id)) {
            padded.push(fb);
            seen.add(fb.id);
          }
        }
        setVideos(padded);
        setActive(0);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const current = videos[active] ?? videos[0];

  return (
    <>
      <Helmet>
        <title>Arjun IFVG | Tamil Trading Community</title>
        <meta
          name="description"
          content="Tamil trading community focused on ICT concepts, price action, liquidity, iFVG strategy, and trading psychology."
        />
        <meta
          name="keywords"
          content="ICT trading, SMC trading, Tamil trading, iFVG, forex trading, futures trading"
        />
        <link rel="canonical" href="https://ifvg.in/" />

        {/* Open Graph */}
        <meta property="og:title" content="Arjun IFVG" />
        <meta
          property="og:description"
          content="Tamil trading community focused on ICT concepts and trading education."
        />
        <meta property="og:url" content="https://ifvg.in/" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "IFVG",
            url: "https://ifvg.in",
            founder: {
              "@type": "Person",
              name: "Arjun S",
            },
            sameAs: ["https://youtube.com/@arjun_ifvg", "https://discord.gg/SCHeKKCa6c"],
          })}
        </script>
      </Helmet>

      <div className="min-h-[100dvh]">
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
              Arjun IFVG, Tamil trading community
            </motion.p>

            <h1 className="type-display mt-5 text-[clamp(2.75rem,min(10.6vw,15.5vh),8.25rem)] sm:mt-6">
              <span className="sr-only">Arjun IFVG. </span>
              <HeroLine delay={0.1}>We don't chase dopamine,</HeroLine>
              <HeroLine delay={0.22}>
                we chase <span className="text-primary">patience.</span>
              </HeroLine>
            </h1>

            <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-12">
              <div className="flex min-w-0 flex-col justify-between gap-8 lg:col-span-5">
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease }}
                  className="type-lead max-w-md"
                >
                  See what the community is learning right now: fresh breakdowns, recaps and ICT concepts every week.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.62, ease }}
                  className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
                >
                  <Button asChild size="lg">
                    <a
                      href="https://youtube.com/@arjun_ifvg?sub_confirmation=1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <YoutubeLogo weight="fill" />
                      Subscribe on YouTube
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href="https://discord.gg/SCHeKKCa6c" target="_blank" rel="noopener noreferrer">
                      <DiscordLogo weight="fill" />
                      Join Discord
                    </a>
                  </Button>
                </motion.div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden bg-muted sm:aspect-[16/9] lg:col-span-7 lg:aspect-auto lg:h-[clamp(240px,38vh,400px)]">
                <motion.img
                  src={portrait}
                  alt="Arjun, Tamil trader and founder of Arjun Trades, in a camouflage jacket at dusk"
                  width={1920}
                  height={1280}
                  {...{ fetchpriority: "high" }}
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.6, ease }}
                  className="h-full w-full object-cover object-[50%_28%]"
                />
              </div>
            </div>
          </section>

          {/* Popular on YouTube */}
          <section className="py-16 sm:py-20">
            <div className="shell">
              <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="type-title text-[clamp(2.5rem,6vw,4.75rem)]">Popular on YouTube</h2>
                  <p className="type-lead mt-5 max-w-xl text-muted-foreground">
                    Long-form trading breakdowns from the channel.
                  </p>
                </div>
                <TextLink href="https://youtube.com/@arjun_ifvg">View all videos on YouTube</TextLink>
              </Reveal>

              <Reveal delay={0.1} className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-8">
                  <YouTubeFacade key={current.id} id={current.id} title={current.title} />
                  <h3 className="type-heading mt-6 max-w-[40ch] text-2xl sm:text-[1.75rem]">{current.title}</h3>
                </div>

                <ol className="flex flex-col lg:col-span-4" aria-label="More videos">
                  {videos.map((v, i) => (
                    <li key={v.id}>
                      <button
                        type="button"
                        onClick={() => setActive(i)}
                        aria-current={active === i}
                        className={cn(
                          "group grid w-full grid-cols-[6.5rem_1fr] items-start gap-4 border-t py-4 text-left transition-colors",
                          active === i ? "border-primary" : "border-border hover:border-foreground",
                        )}
                      >
                        <span className="relative block aspect-video overflow-hidden bg-muted">
                          <img
                            src={ytThumb(v.id, "mqdefault")}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </span>
                        <span
                          className={cn(
                            "line-clamp-3 text-[0.9375rem] font-medium leading-snug transition-colors",
                            active === i ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                          )}
                        >
                          {v.title}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </section>

          {/* The Blueprint */}
          <section className="py-16 sm:py-20">
            <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
              <Reveal className="lg:col-span-6">
                <h2 className="type-display text-[clamp(3.5rem,9.5vw,8.5rem)]">
                  The <span className="text-primary">Blueprint</span>
                </h2>
                <p className="type-lead mt-8 max-w-md">
                  The choice is yours. Two paths to mastering the markets: pick the one that fits your journey.
                </p>
                <Button asChild size="lg" className="mt-10">
                  <a href={BLUEPRINT_URL}>
                    Enter now
                    <ArrowRight weight="bold" />
                  </a>
                </Button>
              </Reveal>

              <Reveal delay={0.12} className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-6">
                {[
                  { img: redPill, label: "The Red Pill", href: REDPILL_URL, alt: "An open hand holding a glowing red pill" },
                  { img: bluePill, label: "The Blue Pill", href: BLUEPILL_URL, alt: "An open hand holding a glowing blue pill" },
                ].map((p, i) => (
                  <a
                    key={p.label}
                    href={p.href}
                    className={cn("group block", i === 1 && "mt-10 sm:mt-14")}
                  >
                    <div className="aspect-square overflow-hidden bg-panel">
                      <img
                        src={p.img}
                        alt={p.alt}
                        loading="lazy"
                        width={1024}
                        height={1024}
                        className="h-full w-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.05]"
                      />
                    </div>
                    <p className="mt-3 flex items-center justify-between font-semibold">
                      {p.label}
                      <ArrowUpRight
                        className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        weight="bold"
                      />
                    </p>
                  </a>
                ))}
              </Reveal>
            </div>
          </section>

          {/* Where to go */}
          <section className="py-16 sm:py-20">
            <div className="shell">
              <ul className="border-b border-foreground">
                {directory.map((item, i) => {
                  const inner = (
                    <>
                      <div className="grid items-baseline gap-3 px-0 py-8 transition-transform duration-500 ease-out-expo group-hover:translate-x-4 md:grid-cols-12 md:gap-8 md:py-10">
                        <h3 className="type-title text-[clamp(2.25rem,5vw,3.75rem)] md:col-span-5">{item.title}</h3>
                        <p className="text-muted-foreground transition-colors group-hover:text-background/75 md:col-span-5 md:max-w-sm">
                          {item.desc}
                        </p>
                        <span className="inline-flex items-center gap-2 font-semibold md:col-span-2 md:justify-end">
                          {item.cta}
                          {item.to ? (
                            <ArrowRight className="h-4 w-4" weight="bold" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" weight="bold" />
                          )}
                        </span>
                      </div>
                    </>
                  );
                  const cls =
                    "group block border-t border-foreground transition-colors duration-300 hover:bg-foreground hover:text-background";
                  return (
                    <li key={item.title}>
                      <Reveal delay={i * 0.05}>
                        {item.to ? (
                          <Link to={item.to} className={cls}>
                            {inner}
                          </Link>
                        ) : (
                          <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                            {inner}
                          </a>
                        )}
                      </Reveal>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* Featured playlists */}
          <section className="py-16 sm:py-20">
            <div className="shell">
              <Reveal>
                <h2 className="type-title text-[clamp(2.5rem,6vw,4.75rem)]">Featured playlists</h2>
                <p className="type-lead mt-5 max-w-xl text-muted-foreground">
                  Structured courses to take you from beginner to confident trader.
                </p>
              </Reveal>

              <div className="mt-12 grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
                {playlists.map((pl, i) => (
                  <Reveal key={pl.title} delay={i * 0.1} className={pl.span}>
                    <a
                      href={pl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <div className="aspect-video overflow-hidden bg-panel">
                        <iframe
                          src={`https://www.youtube.com/embed/${pl.embedId}`}
                          title={pl.title}
                          className="pointer-events-none h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                      <h3 className="type-heading mt-6 text-2xl sm:text-3xl">{pl.title}</h3>
                      <p className="mt-3 max-w-md text-muted-foreground">{pl.description}</p>
                      <span className="mt-5 inline-flex items-center gap-2 font-semibold underline decoration-border decoration-2 underline-offset-[6px] transition-colors group-hover:decoration-primary">
                        Watch playlist
                        <ArrowUpRight className="h-4 w-4" weight="bold" />
                      </span>
                    </a>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <TestimonialWall />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
