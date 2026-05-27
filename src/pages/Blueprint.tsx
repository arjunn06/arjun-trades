import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import RedPillReviewsWall from "@/components/RedPillReviewsWall";
import redPillHand from "@/assets/red-pill-hand.jpg";
import bluePillHand from "@/assets/blue-pill-hand.jpg";
import whopLogo from "@/assets/whop-logo.svg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: "easeOut" as const },
  }),
};

const ProgressiveBlurText = ({ text }: { text: string }) => (
  <span className="relative inline-block text-foreground">
    {/* Sharp base text */}
    <span className="relative">{text}</span>
    {/* Single blurred copy, masked to fade in from the left */}
    <span
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        filter: "blur(10px)",
        WebkitMaskImage:
          "linear-gradient(to right, hsl(0 0% 0% / 0.9) 0%, transparent 70%)",
        maskImage:
          "linear-gradient(to right, hsl(0 0% 0% / 0.9) 0%, transparent 70%)",
      }}
    >
      {text}
    </span>
  </span>
);

const WhopIcon = ({ className = "" }: { className?: string }) => (
  <img
    src={whopLogo}
    alt="Whop"
    className={`h-4 w-auto ${className}`}
  />
);

const Blueprint = () => {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "The Red Pill — Tamil Trading Mentorship Course",
    description:
      "Affordable Tamil trading mentorship covering ICT, iFVG, Smart Money Concepts, liquidity, risk and psychology. One-time payment, lifetime access.",
    provider: {
      "@type": "Organization",
      name: "Arjun Trades",
      sameAs: "https://ifvg.in",
    },
    inLanguage: ["ta", "en"],
    educationalCredentialAwarded: "Trading Mentorship",
    offers: [
      {
        "@type": "Offer",
        name: "The Red Pill — Lifetime Access",
        price: "4999",
        priceCurrency: "INR",
        category: "OneTimePayment",
        url: "https://ifvg.in/red-pill",
      },
      {
        "@type": "Offer",
        name: "The Blue Pill — Monthly Membership",
        priceCurrency: "INR",
        category: "Subscription",
        url: "https://whop.com/arjun-ifvg/thebluepill/",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Helmet>
        <title>Trading Course in Tamil — ICT & iFVG Mentorship | Arjun Trades</title>
        <meta
          name="description"
          content="Affordable Tamil trading course and mentorship. Learn ICT, iFVG, Smart Money Concepts, liquidity and risk management. The Red Pill (lifetime access) and The Blue Pill (monthly membership) by Arjun Trades."
        />
        <meta
          name="keywords"
          content="trading course in tamil, tamil trading course, cheap trading course, trading mentorship tamil, ict trading course, ifvg trading course, smart money concepts tamil, arjun trades, arjun ifvg, tamil trading mentorship"
        />
        <link rel="canonical" href="https://ifvg.in/blueprint" />
        <meta property="og:title" content="Trading Course in Tamil — ICT & iFVG Mentorship by Arjun Trades" />
        <meta
          property="og:description"
          content="Two paths into Arjun Trades' Tamil trading mentorship — The Red Pill (lifetime) and The Blue Pill (monthly). ICT, iFVG and Smart Money Concepts simplified."
        />
        <meta property="og:url" content="https://ifvg.in/blueprint" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Trading Course in Tamil — Arjun Trades Blueprint" />
        <meta
          name="twitter:description"
          content="Tamil trading mentorship by Arjun Trades. ICT, iFVG, Smart Money Concepts. The Red Pill and The Blue Pill."
        />
        <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>
      </Helmet>
      <Header />
      <main>


      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-primary/10 blur-[140px] rounded-full" />
          <div className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-center mb-16 md:mb-24"
          >
            <h1 className="font-display font-bold text-6xl md:text-8xl tracking-tight leading-none mb-6">
              <ProgressiveBlurText text="Hello Neo," />
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Two paths. One keeps you asleep. One changes how you see the
              market forever.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* RED PILL */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="group relative rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-primary/60"
            >
              <div className="absolute -top-20 right-0 w-72 h-72 bg-primary/10 blur-[100px] rounded-full transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={redPillHand}
                  alt="Hand holding a glowing red pill"
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-primary/20 mix-blend-screen blur-3xl" />
                </div>
                <div className="absolute top-6 left-6">
                  <p className="text-primary uppercase tracking-[0.3em] text-xs font-semibold">
                    Choose Reality
                  </p>
                </div>
              </div>

              <div className="relative z-10 p-8 md:p-10 -mt-6">
                <h2 className="font-display font-bold text-4xl text-foreground mb-3">
                  The Red Pill
                </h2>
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="font-display font-bold text-4xl text-primary">₹4,999</span>
                  <span className="text-muted-foreground text-sm">/ for lifetime</span>
                </div>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                  The complete trading mentorship program. Learn market
                  structure, liquidity, execution, psychology, risk management
                  and build your own edge from scratch.
                </p>

                <div className="space-y-3 mb-10">
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Complete trading curriculum
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Private Discord community
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Personalised mentorship
                  </div>
                </div>

                <Link
                  to="/red-pill"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:brightness-110 transition-all duration-300 shadow-[0_0_40px_hsl(var(--primary)/0.4)]"
                >
                  Enter The Red Pill
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* BLUE PILL */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="group relative rounded-3xl border border-blue-500/20 bg-card/60 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-blue-500/60"
            >
              <div className="absolute -bottom-20 left-0 w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={bluePillHand}
                  alt="Hand holding a glowing blue pill"
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-blue-500/25 mix-blend-screen blur-3xl" />
                </div>
                <div className="absolute top-6 left-6">
                  <p className="text-blue-400 uppercase tracking-[0.3em] text-xs font-semibold">
                    Stay Connected
                  </p>
                </div>
              </div>

              <div className="relative z-10 p-8 md:p-10 -mt-6">
                <h2 className="font-display font-bold text-4xl text-foreground mb-3">
                  The Blue Pill
                </h2>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-display font-bold text-4xl text-blue-400">₹499</span>
                  <span className="text-muted-foreground text-sm">/ per month</span>
                </div>
                <p className="text-blue-400 text-sm font-semibold mb-5">
                  Start with a 3-day free trial
                </p>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                  A recurring membership for traders who want ongoing access.
                  Premium class recordings from The Red Pill, monthly private
                  1-on-1 calls and future premium drops, delivered every month.
                </p>

                <div className="space-y-3 mb-10">
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Red Pill premium class recordings
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Monthly private 1-on-1 call
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Recurring access to premium drops
                  </div>
                </div>

                <a
                  href="https://whop.com/arjun-ifvg/thebluepill/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:brightness-110 transition-all duration-300 shadow-[0_0_40px_rgba(59,130,246,0.4)]"
                >
                  <WhopIcon />
                  Subscribe using Whop
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <RedPillReviewsWall />
      </main>
    </div>
  );
};

export default Blueprint;
