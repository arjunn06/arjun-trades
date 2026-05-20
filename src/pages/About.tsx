import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Youtube, Users, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import portrait from "@/assets/arjun-portrait.jpg";

const SITE_URL = "https://gleam-blog-pad.lovable.app";
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
    "https://youtube.com/@arjun_ifvg",
    "https://discord.gg/SCHeKKCa6c",
    "https://www.instagram.com/arjun_ifvg",
  ],
};

const About = () => {
  return (
    <div className="min-h-screen bg-background">
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 md:order-1">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-medium tracking-wide uppercase mb-5">
              About
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-6">
              <span className="text-foreground">Arjun</span>{" "}
              <span className="text-primary">IFVG</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-5">
              I'm Arjun — a Tamil trader and the founder of{" "}
              <strong className="text-foreground">Arjun Trades</strong>. I teach the{" "}
              <strong className="text-foreground">iFVG strategy</strong>, ICT concepts and
              Smart Money Concepts in plain Tamil so beginners can finally cut through
              the noise.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
              On <a href="https://youtube.com/@arjun_ifvg" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">YouTube</a>{" "}
              and inside our <a href="https://discord.gg/SCHeKKCa6c" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Discord community</a>{" "}
              I share daily breakdowns, recaps and structured education — from forex basics
              to live futures trading. We don't chase dopamine, we chase patience.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="https://youtube.com/@arjun_ifvg?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:brightness-110 transition-all text-sm">
                <Youtube className="w-5 h-5" />
                Subscribe on YouTube
              </a>
              <Link
                to="/workshop"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-all text-sm">
                <Users className="w-5 h-5" />
                Explore Workshops
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-border">
              <Link to="/" className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:gap-3 transition-all">
                Back to home <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 via-secondary/10 to-transparent blur-2xl rounded-3xl pointer-events-none" />
            <img
              src={portrait}
              alt="Arjun IFVG — Tamil trader and founder of Arjun Trades"
              width={1920}
              height={1280}
              className="relative rounded-2xl border border-border shadow-2xl w-full h-auto object-cover"
              loading="eager"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
