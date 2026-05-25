import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import redPillHand from "@/assets/red-pill-hand.jpg";
import bluePillHand from "@/assets/blue-pill-hand.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.8, ease: "easeOut" as const },
  }),
};

const ProgressiveBlurText = ({ text }: { text: string }) => {
  // Stacked blur layers that progressively sharpen from left to right.
  const layers = [
    { blur: 14, from: 35, to: 100 },
    { blur: 6, from: 55, to: 100 },
    { blur: 2, from: 75, to: 100 },
    { blur: 0, from: 90, to: 100 },
  ];
  return (
    <span className="relative inline-block text-foreground">
      <span className="invisible">{text}</span>
      {layers.map((l, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute inset-0 whitespace-nowrap"
          style={{
            filter: l.blur ? `blur(${l.blur}px)` : undefined,
            WebkitMaskImage: `linear-gradient(to right, transparent 0%, black ${l.from}%, black ${l.to}%)`,
            maskImage: `linear-gradient(to right, transparent 0%, black ${l.from}%, black ${l.to}%)`,
          }}
        >
          {text}
        </span>
      ))}
    </span>
  );
};

const WhopIcon = ({ className = "" }: { className?: string }) => (
  <span
    className={`inline-flex items-center justify-center w-5 h-5 rounded-md bg-white text-blue-600 font-black text-[0.7rem] ${className}`}
  >
    W
  </span>
);

const Blueprint = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />

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
                <h2 className="font-display font-bold text-4xl text-foreground mb-4">
                  The Red Pill
                </h2>
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
                <h2 className="font-display font-bold text-4xl text-foreground mb-4">
                  The Blue Pill
                </h2>
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
    </div>
  );
};

export default Blueprint;
