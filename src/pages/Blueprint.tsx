import { motion } from "framer-motion";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RedPillReviewsWall from "@/components/RedPillReviewsWall";
import redPillHand from "@/assets/red-pill-hand.jpg";
import bluePillHand from "@/assets/blue-pill-hand.jpg";
import whopLogo from "@/assets/whop-logo.svg";
import { BLUEPILL_URL, REDPILL_URL } from "@/lib/links";

const ease = [0.16, 1, 0.3, 1] as const;

/** Sharp text with a blurred copy masked in from the left, so the line reads as coming into focus. */
const ProgressiveBlurText = ({ text }: { text: string }) => (
  <span className="relative inline-block">
    <span className="relative">{text}</span>
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        filter: "blur(8px)",
        WebkitMaskImage: "linear-gradient(to right, hsl(0 0% 0% / 0.85) 0%, transparent 55%)",
        maskImage: "linear-gradient(to right, hsl(0 0% 0% / 0.85) 0%, transparent 55%)",
      }}
    >
      {text}
    </span>
  </span>
);

interface PillPanelProps {
  image: string;
  imageAlt: string;
  imagePosition: string;
  kicker: string;
  title: string;
  price: string;
  priceNote: string;
  trial?: string;
  description: string;
  points: string[];
  cta: React.ReactNode;
  delay: number;
  /** Red panel uses the signal colour for ticks; the blue panel stays neutral so red never leaks into it. */
  accent?: boolean;
}

const PillPanel = ({
  image,
  imageAlt,
  imagePosition,
  kicker,
  title,
  price,
  priceNote,
  trial,
  description,
  points,
  cta,
  delay,
  accent = false,
}: PillPanelProps) => (
  <motion.article
    initial={{ opacity: 0, y: 28 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.9, delay, ease }}
    className="group relative flex flex-col overflow-hidden bg-panel text-panel-foreground"
  >
    <div className="relative aspect-[5/4] overflow-hidden">
      <img
        src={image}
        alt={imageAlt}
        width={1024}
        height={1024}
        className={`h-full w-full object-cover transition-transform [transition-duration:1400ms] ease-out-expo group-hover:scale-[1.04] ${imagePosition}`}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-panel to-transparent" />
    </div>

    <div className="-mt-10 flex flex-1 flex-col px-7 pb-8 sm:px-10 sm:pb-10">
      <p className="type-label text-panel-muted">{kicker}</p>
      <h2 className="type-title mt-3 text-[clamp(2.75rem,5vw,4rem)]">{title}</h2>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="type-title text-5xl tabular-nums sm:text-6xl">{price}</span>
        <span className="text-panel-muted">{priceNote}</span>
      </div>
      <p className="mt-2 font-semibold lg:h-7">{trial}</p>

      <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-panel-foreground/85 lg:min-h-[7.25rem]">{description}</p>

      <ul className="mt-7 space-y-3">
        {points.map((pt) => (
          <li key={pt} className="flex items-start gap-3 text-[0.9375rem]">
            <Check className={`mt-0.5 h-5 w-5 shrink-0 ${accent ? "text-signal" : "text-panel-muted"}`} weight="bold" />
            {pt}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-9">{cta}</div>
    </div>
  </motion.article>
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

  const solidBtn =
    "inline-flex h-14 max-w-full items-center justify-center gap-2.5 whitespace-nowrap px-5 text-[0.9375rem] font-semibold transition-[background-color,color,transform] duration-200 ease-out-expo active:translate-y-px sm:px-7 sm:text-base";

  return (
    <div className="min-h-[100dvh]">
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
      <main id="main">
        <section className="shell pb-12 pt-10 sm:pt-16 lg:pb-16">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="type-display text-[clamp(3.75rem,13vw,11rem)]"
          >
            <ProgressiveBlurText text="Hello Neo," />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="type-lead mt-6 max-w-2xl text-muted-foreground"
          >
            Two paths. One puts you into the system. One gives you access to overlook the system. Choose wisely, Neo.
          </motion.p>
        </section>

        <section className="shell grid gap-4 lg:grid-cols-2 lg:gap-6">
          <PillPanel
            delay={0.2}
            image={redPillHand}
            imageAlt="An open hand holding a glowing red pill"
            imagePosition="object-[50%_40%]"
            accent
            kicker="Choose reality"
            title="The Red Pill"
            price="₹4,999"
            priceNote="for lifetime"
            description="The complete trading mentorship program. Learn market structure, liquidity, execution, psychology, risk management and build your own edge from scratch."
            points={["Complete trading curriculum", "Private Discord community", "Personalised mentorship"]}
            cta={
              <a
                href={REDPILL_URL}
                className={`${solidBtn} bg-signal text-panel hover:bg-panel-foreground hover:text-panel`}
              >
                Enter The Red Pill
                <ArrowRight className="h-5 w-5" weight="bold" />
              </a>
            }
          />
          <PillPanel
            delay={0.32}
            image={bluePillHand}
            imageAlt="An open hand holding a glowing blue pill"
            imagePosition="object-[50%_40%]"
            kicker="Stay connected"
            title="The Blue Pill"
            price="₹499"
            priceNote="per month"
            trial="Start with a 3-day free trial"
            description="A recurring membership for traders who want ongoing access. Premium class recordings from The Red Pill, monthly private 1-on-1 calls and future premium drops, delivered every month."
            points={[
              "Red Pill premium class recordings",
              "Monthly private 1-on-1 call",
              "Recurring access to premium drops",
            ]}
            cta={
              <a
                href={BLUEPILL_URL}
                className={`${solidBtn} border border-panel-foreground text-panel-foreground hover:bg-panel-foreground hover:text-panel`}
              >
                <img src={whopLogo} alt="Whop" className="h-4 w-auto" />
                Subscribe using Whop
                <ArrowRight className="h-5 w-5" weight="bold" />
              </a>
            }
          />
        </section>

        <RedPillReviewsWall />
      </main>
      <Footer />
    </div>
  );
};

export default Blueprint;
