import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, YoutubeLogo, Users } from "@phosphor-icons/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import portrait from "@/assets/arjun-portrait.webp";

const SITE_URL = "https://ifvg.in";
const IMAGE_URL = `${SITE_URL}/arjun-ifvg.jpg`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Arjun IFVG",
  alternateName: ["Arjun Trades", "Arjun IFVG Trades"],
  url: `${SITE_URL}/about`,
  image: IMAGE_URL,
  jobTitle: "Trader & Educator",
  description:
    "Arjun IFVG is a Tamil trading educator and founder of Arjun Trades — teaching ICT, Smart Money Concepts, and the iFVG strategy to beginners.",
  knowsAbout: [
    "iFVG Trading Strategy",
    "ICT Concepts",
    "Smart Money Concepts",
    "Forex Trading",
    "Futures Trading",
    "Price Action",
  ],
  sameAs: [
    "https://www.instagram.com/arjun_ifvg",
    "https://youtube.com/@arjun_ifvg",
    "https://x.com/arjun_ifvg",
    "https://twitter.com/arjun_ifvg",
    "https://discord.gg/SCHeKKCa6c",
  ],
};

const socials = [
  { label: "Instagram", handle: "@arjun_ifvg", url: "https://www.instagram.com/arjun_ifvg" },
  { label: "YouTube", handle: "@arjun_ifvg", url: "https://youtube.com/@arjun_ifvg" },
  { label: "X (Twitter)", handle: "@arjun_ifvg", url: "https://x.com/arjun_ifvg" },
  { label: "Discord", handle: "Join community", url: "https://discord.gg/SCHeKKCa6c" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const About = () => {
  return (
    <div className="min-h-[100dvh]">
      <Helmet>
        <title>About Arjun IFVG — Tamil Trader & Founder of Arjun Trades</title>
        <meta
          name="description"
          content="Arjun IFVG is a Tamil trading educator teaching iFVG, ICT and Smart Money Concepts. Learn about Arjun Trades, the YouTube channel, and the community."
        />
        <link rel="canonical" href={`${SITE_URL}/about`} />
        <meta property="og:title" content="About Arjun IFVG — Arjun Trades" />
        <meta
          property="og:description"
          content="Tamil trading educator. Founder of Arjun Trades. iFVG, ICT & Smart Money Concepts simplified for beginners."
        />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`${SITE_URL}/about`} />
        <meta property="og:image" content={IMAGE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={IMAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
      </Helmet>

      <Header />

      <main id="main">
        <section className="shell pb-16 pt-10 sm:pt-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease }}
              className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start"
            >
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={portrait}
                  alt="Arjun IFVG, Tamil trader and founder of Arjun Trades"
                  width={1920}
                  height={1280}
                  className="h-full w-full object-cover object-[63%_30%]"
                  loading="eager"
                />
              </div>
            </motion.div>

            <div className="lg:col-span-7">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease }}
                className="type-display text-[clamp(4rem,12vw,9.5rem)]"
              >
                Arjun <span className="text-primary">IFVG</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
                className="mt-10 max-w-xl space-y-6 text-[1.1875rem] leading-[1.6]"
              >
                <p>
                  I'm Arjun, a Tamil trader and the founder of <strong>Arjun Trades</strong>. I teach the{" "}
                  <strong>iFVG strategy</strong>, ICT concepts and Smart Money Concepts in plain Tamil so beginners
                  can finally cut through the noise.
                </p>
                <p className="text-muted-foreground">
                  On{" "}
                  <a
                    href="https://youtube.com/@arjun_ifvg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline decoration-primary decoration-2 underline-offset-4"
                  >
                    YouTube
                  </a>{" "}
                  and inside our{" "}
                  <a
                    href="https://discord.gg/SCHeKKCa6c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline decoration-primary decoration-2 underline-offset-4"
                  >
                    Discord community
                  </a>{" "}
                  I share daily breakdowns, recaps and structured education, from forex basics to live futures
                  trading.
                </p>
              </motion.div>

              <Reveal className="mt-14 border-t border-foreground pt-8">
                <p className="type-title max-w-[18ch] text-[clamp(2rem,4.5vw,3.5rem)]">
                  We don't chase dopamine, we chase <span className="text-primary">patience.</span>
                </p>
                <p lang="ta" className="mt-4 font-tamil text-2xl font-semibold text-muted-foreground">
                  பொறுமை
                </p>
              </Reveal>

              <Reveal className="mt-12 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href="https://youtube.com/@arjun_ifvg?sub_confirmation=1" target="_blank" rel="noopener noreferrer">
                    <YoutubeLogo weight="fill" />
                    Subscribe on YouTube
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/workshop">
                    <Users weight="bold" />
                    Explore workshops
                  </Link>
                </Button>
              </Reveal>
            </div>
          </div>
        </section>

        <section aria-labelledby="socials-heading" className="py-16 sm:py-20">
          <div className="shell">
            <Reveal>
              <h2 id="socials-heading" className="type-title text-[clamp(2.5rem,6vw,4.75rem)]">
                Find me online
              </h2>
            </Reveal>

            <ul className="mt-12 border-b border-foreground">
              {socials.map(({ label, handle, url }, i) => (
                <li key={label}>
                  <Reveal delay={i * 0.05}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="group flex items-baseline justify-between gap-6 border-t border-foreground py-6 transition-colors duration-300 hover:bg-foreground hover:text-background"
                    >
                      <span className="type-title text-[clamp(1.75rem,4vw,2.75rem)] transition-transform duration-500 ease-out-expo group-hover:translate-x-4">
                        {label}
                      </span>
                      <span className="inline-flex items-center gap-2 font-semibold">
                        {handle}
                        <ArrowUpRight className="h-4 w-4" weight="bold" />
                      </span>
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 font-semibold underline decoration-border decoration-2 underline-offset-[6px] hover:decoration-primary"
              >
                Back to home
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" weight="bold" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
