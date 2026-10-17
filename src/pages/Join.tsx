import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ArrowUpRight, DiscordLogo, InstagramLogo, Play } from "@phosphor-icons/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { ytThumb } from "@/components/YouTubeFacade";
import { supabase } from "@/integrations/supabase/client";
import { BLUEPRINT_URL } from "@/lib/links";
import { cn } from "@/lib/utils";
// Saved from the public @arjun_ifvg profile (150x150, the largest size Instagram serves logged-out).
// Instagram CDN links are signed and expire, so the file lives in the repo instead of being hotlinked.
import instagramAvatar from "@/assets/instagram-avatar.jpg";
import redPill from "@/assets/red-pill-hand.jpg";
import bluePill from "@/assets/blue-pill-hand.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

const INSTAGRAM_URL = "https://www.instagram.com/arjun_ifvg";
const DISCORD_URL = "https://discord.gg/SCHeKKCa6c";
const YOUTUBE_URL = "https://youtube.com/@arjun_ifvg";

interface LatestVideo {
  id: string;
  title: string;
}

// Shown until (or if) the latest upload can be fetched.
const fallbackVideo: LatestVideo = {
  id: "6DWzpfwnKoE",
  title: "The Reality of Trading Patterns EXPOSED | Why Chart Patterns Fail (Tamil)",
};

/** The whole card is one link. The button-looking label inside is not a second control. */
const Cta = ({ children, className, internal }: { children: React.ReactNode; className?: string; internal?: boolean }) => {
  const Arrow = internal ? ArrowRight : ArrowUpRight;
  return (
    <span
      className={cn(
        "inline-flex h-12 items-center gap-2.5 px-6 text-[0.9375rem] font-semibold transition-[background-color,color] duration-200",
        className,
      )}
    >
      {children}
      <Arrow
        className={cn(
          "h-4 w-4 transition-transform duration-300 ease-out-expo",
          internal ? "group-hover:translate-x-1" : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
        )}
        weight="bold"
      />
    </span>
  );
};

interface JoinCardProps {
  href: string;
  /** External destinations open in a new tab; our own Blueprint subdomain stays in the same tab. */
  newTab?: boolean;
  className?: string;
  innerClassName?: string;
  delay?: number;
  children: React.ReactNode;
}

const JoinCard = ({ href, newTab = true, className, innerClassName, delay = 0, children }: JoinCardProps) => (
  <Reveal delay={delay} className={className}>
    <a
      href={href}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn("group flex h-full flex-col overflow-hidden transition-colors duration-300", innerClassName)}
    >
      {children}
    </a>
  </Reveal>
);

const Join = () => {
  const [video, setVideo] = useState<LatestVideo>(fallbackVideo);
  const [thumb, setThumb] = useState(ytThumb(fallbackVideo.id, "maxresdefault"));

  useEffect(() => {
    let cancelled = false;
    supabase.functions
      .invoke("youtube-videos", { method: "GET" })
      .then(({ data, error }) => {
        if (cancelled || error || !data?.videos?.length) return;
        const latest = data.videos[0] as LatestVideo;
        setVideo({ id: latest.id, title: latest.title });
        setThumb(ytThumb(latest.id, "maxresdefault"));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-[100dvh]">
      <Helmet>
        <title>Join Arjun IFVG | Tamil Trading Community</title>
        <meta
          name="description"
          content="Follow Arjun IFVG on Instagram, join the Discord, subscribe on YouTube, or go straight to The Blueprint."
        />
        <link rel="canonical" href="https://ifvg.in/join" />
        <meta property="og:title" content="Join Arjun IFVG" />
        <meta
          property="og:description"
          content="Instagram, Discord, YouTube and The Blueprint, all in one place."
        />
        <meta property="og:url" content="https://ifvg.in/join" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <main id="main">
        <section className="shell pb-10 pt-10 sm:pb-14 sm:pt-16">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="type-display text-[clamp(4.5rem,16vw,13rem)]"
          >
            Join
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="type-lead mt-6 max-w-md text-muted-foreground"
          >
            Follow, subscribe, or go straight to The Blueprint.
          </motion.p>
        </section>

        <section className="shell">
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
            {/* Instagram profile */}
            <JoinCard
              href={INSTAGRAM_URL}
              className="lg:col-span-5"
              innerClassName="min-h-[22rem] justify-between border border-border bg-card p-7 hover:border-foreground sm:p-9"
            >
              <div className="flex items-start justify-between">
                <div className="h-20 w-20 overflow-hidden bg-muted sm:h-24 sm:w-24">
                  <img
                    src={instagramAvatar}
                    alt="Arjun IFVG's Instagram profile picture"
                    width={150}
                    height={150}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <InstagramLogo className="h-9 w-9" />
              </div>
              <div className="mt-10">
                <p className="type-title text-[clamp(2.25rem,4vw,3rem)]">Arjun IFVG</p>
                <p className="type-label mt-2 text-muted-foreground">@arjun_ifvg</p>
                <Cta className="mt-8 border border-foreground group-hover:bg-foreground group-hover:text-background">
                  Follow on Instagram
                </Cta>
              </div>
            </JoinCard>

            {/* Discord */}
            <JoinCard
              href={DISCORD_URL}
              delay={0.06}
              className="lg:col-span-7"
              innerClassName="min-h-[22rem] justify-between bg-panel p-7 text-panel-foreground sm:p-9"
            >
              <DiscordLogo className="h-14 w-14 text-signal" weight="fill" />
              <div className="mt-10">
                <p className="type-title text-[clamp(2.25rem,5vw,4rem)]">Discord community</p>
                <p className="mt-4 max-w-md text-[1.0625rem] text-panel-foreground/80">
                  Connect with like-minded traders. Daily analysis, alerts, and live discussion.
                </p>
                <Cta className="mt-8 bg-panel-foreground text-panel group-hover:bg-signal">Join Discord</Cta>
              </div>
            </JoinCard>

            {/* YouTube */}
            <JoinCard
              href={`${YOUTUBE_URL}?sub_confirmation=1`}
              delay={0.04}
              className="lg:col-span-7"
              innerClassName="border border-border bg-card hover:border-foreground"
            >
              <div className="relative aspect-video overflow-hidden bg-panel">
                <img
                  src={thumb}
                  alt=""
                  loading="lazy"
                  onLoad={(e) => {
                    // YouTube serves a 120px grey placeholder when maxres doesn't exist for a video.
                    if (e.currentTarget.naturalWidth <= 120 && thumb.includes("maxres")) {
                      setThumb(ytThumb(video.id, "hqdefault"));
                    }
                  }}
                  onError={() => setThumb(ytThumb(video.id, "hqdefault"))}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                />
                <span className="absolute bottom-0 left-0 flex h-14 w-14 items-center justify-center bg-primary text-primary-foreground sm:h-16 sm:w-16">
                  <Play className="h-6 w-6" weight="fill" />
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between p-7 sm:p-9">
                <div>
                  <p className="type-label text-muted-foreground">Latest upload</p>
                  <p className="type-heading mt-2 line-clamp-2 max-w-[34ch] text-xl sm:text-2xl">{video.title}</p>
                </div>
                <Cta className="mt-8 self-start bg-primary text-primary-foreground group-hover:bg-foreground group-hover:text-background">
                  Subscribe on YouTube
                </Cta>
              </div>
            </JoinCard>

            {/* The Blueprint */}
            <JoinCard
              href={BLUEPRINT_URL}
              newTab={false}
              delay={0.1}
              className="lg:col-span-5"
              innerClassName="min-h-[22rem] justify-between bg-primary p-7 text-primary-foreground sm:p-9"
            >
              <div className="flex gap-3">
                {[
                  { src: redPill, alt: "An open hand holding a glowing red pill" },
                  { src: bluePill, alt: "An open hand holding a glowing blue pill" },
                ].map((p, i) => (
                  <div key={p.alt} className={cn("h-24 w-24 overflow-hidden bg-panel sm:h-28 sm:w-28", i === 1 && "mt-6")}>
                    <img
                      src={p.src}
                      alt={p.alt}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.06]"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <p className="type-title text-[clamp(2.25rem,4vw,3rem)]">The Blueprint</p>
                <p className="mt-4 max-w-sm text-[1.0625rem] opacity-90">
                  The choice is yours. Two paths to mastering the markets: pick the one that fits your journey.
                </p>
                <Cta
                  internal
                  className="mt-8 bg-panel text-panel-foreground group-hover:bg-panel-foreground group-hover:text-panel"
                >
                  Enter now
                </Cta>
              </div>
            </JoinCard>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Join;
