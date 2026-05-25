import { motion } from "framer-motion";
import { ArrowRight, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  }),
};

const Blueprint = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />

      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-center mb-20"
          >
            <h1 className="font-display font-bold text-6xl md:text-8xl tracking-tight leading-none mb-6">
              <span className="inline-block text-foreground animate-[blurPulse_6s_ease-in-out_infinite]">
                Hello Neo,
              </span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Two paths. One keeps you asleep. One changes how you see the market forever.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="group relative rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-xl p-8 md:p-10 overflow-hidden"
            >
              <div className="absolute -top-20 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-primary uppercase tracking-[0.3em] text-xs font-semibold mb-3">
                      Choose Reality
                    </p>

                    <h2 className="font-display font-bold text-4xl text-foreground mb-4">
                      The Red Pill
                    </h2>
                  </div>

                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-primary blur-3xl opacity-40 rounded-full" />

                    <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-[0_0_60px_rgba(239,68,68,0.7)]">
                      <div className="w-10 h-10 rounded-full bg-white/90" />
                    </div>
                  </motion.div>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl">
                  The complete trading mentorship program. Learn market structure, liquidity, execution, psychology, risk management and build your own edge from scratch.
                </p>

                <div className="space-y-4 mb-12">
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Complete trading curriculum
                  </div>

                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Private Discord community
                  </div>

                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Personalised mentorship
                  </div>
                </div>

                <Link
                  to="/red-pill"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:brightness-110 transition-all duration-300"
                >
                  Enter The Red Pill
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="group relative rounded-3xl border border-blue-500/20 bg-card/60 backdrop-blur-xl p-8 md:p-10 overflow-hidden"
            >
              <div className="absolute -bottom-20 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-blue-400 uppercase tracking-[0.3em] text-xs font-semibold mb-3">
                      Stay Connected
                    </p>

                    <h2 className="font-display font-bold text-4xl text-foreground mb-4">
                      The Blue Pill
                    </h2>
                  </div>

                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      delay: 0.5,
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-40 rounded-full" />

                    <div className="relative w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.7)]">
                      <div className="w-10 h-10 rounded-full bg-white/90" />
                    </div>
                  </motion.div>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl">
                  A recurring membership for traders who want ongoing access. Get premium class recordings, monthly 1-on-1 calls, deeper market insights and future premium drops.
                </p>

                <div className="space-y-4 mb-12">
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Premium class recordings
                  </div>

                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Monthly private 1-1 calls
                  </div>

                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Recurring premium access
                  </div>
                </div>

                <a
                  href="https://whop.com/arjun-ifvg/thebluepill/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:brightness-110 transition-all duration-300"
                >
                  <div className="w-5 h-5 rounded-md bg-white text-blue-500 flex items-center justify-center text-xs font-black">
                    W
                  </div>

                  Subscribe Using Whop

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