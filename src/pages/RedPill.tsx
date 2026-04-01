import { motion } from "framer-motion";
import { ArrowRight, Brain, Target, TrendingUp, Zap, Users, Clock, BarChart3, Award, Crosshair, BookOpen, MessageCircle, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const pillars = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Mindset First",
    desc: "Master the psychology of trading before you touch the charts. Learn discipline, patience, and emotional control.",
  },
  {
    icon: <Crosshair className="w-6 h-6" />,
    title: "Strategy-Focused",
    desc: "Proven trading strategies including iFVG, liquidity concepts, and institutional order flow analysis.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Real Results",
    desc: "Live trading sessions, real market analysis, and practical applications — not theory alone.",
  },
];

const features = [
  { icon: <MessageCircle className="w-6 h-6" />, title: "Private one-on-one calls", desc: "Special personalised trading training based on your skills." },
  { icon: <Zap className="w-6 h-6" />, title: "Live Sessions", desc: "Weekly live trading and Q&A sessions." },
  { icon: <Users className="w-6 h-6" />, title: "Private Community", desc: "Exclusive Discord with 500+ traders." },
  { icon: <Clock className="w-6 h-6" />, title: "Lifetime Access", desc: "One-time payment, access forever." },
  { icon: <Target className="w-6 h-6" />, title: "Trade Setups", desc: "Daily trade ideas and market analysis." },
  { icon: <BookOpen className="w-6 h-6" />, title: "Flexible Learning", desc: "Learn at your own pace, on your schedule." },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Customised game plan", desc: "A trading roadmap built from scratch only for you." },
  { icon: <Award className="w-6 h-6" />, title: "Priority access forever", desc: "Get priority access to all of our premium contents." },
];

const modules = [
  {
    num: 1,
    title: "Trading Foundations",
    topics: ["Market structure basics", "Timeframe analysis", "Support and resistance", "Trend identification", "Risk management fundamentals"],
  },
  {
    num: 2,
    title: "ICT Concepts",
    topics: ["Liquidity and order flow", "Market maker models", "Fair value gaps (FVG)", "Order blocks and breakers", "Institutional trading patterns"],
  },
  {
    num: 3,
    title: "iFVG Strategy",
    topics: ["Inverse fair value gaps explained", "Entry and exit techniques", "Stop loss placement", "Target setting strategies", "Trade management rules"],
  },
  {
    num: 4,
    title: "Money Management",
    topics: ["Multi-timeframe analysis", "Session-based trading", "News trading strategies", "Portfolio management", "Scaling and compounding"],
  },
  {
    num: 5,
    title: "Psychology & Discipline",
    topics: ["Trading psychology mastery", "Emotional control techniques", "Building trading routines", "Journal and analysis", "Long-term sustainability"],
  },
  {
    num: 6,
    title: "Live Trading",
    topics: ["Live market analysis sessions", "Real-time trade execution", "Weekly market reviews", "Q&A and mentorship", "Community support access"],
  },
];

const pricingFeatures = [
  "Complete 6-module trading curriculum",
  "Personalised trading training",
  "Weekly live trading sessions",
  "Private Discord community access",
  "Daily trade setups and analysis",
  "Custom trading tools & indicators",
  "1-on-1 private call with me",
  "Trader-first approach and curated trading plan based on your skillsets.",
  "Priority access to all updates",
];

const RedPill = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[150px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="mb-8">
            <span className="inline-block px-5 py-1.5 rounded-full border border-primary/30 text-primary text-sm font-medium tracking-wide uppercase">
              Elite Trading Program
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-8"
          >
            <span className="text-foreground">Take </span>
            <span className="text-primary">The Red Pill</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Wake up to the new reality of making money. A comprehensive training program designed to transform beginners into consistently profitable traders.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:brightness-110 transition-all duration-300 text-base"
            >
              Enroll Now
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-all duration-300 text-base"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </section>

      {/* What is The Red Pill */}
      <section id="about" className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4 text-center"
            >
              What is <span className="text-primary">The Red Pill</span>?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto"
            >
              A structured, no-nonsense training program that reveals the truth about trading — beyond the Instagram lifestyle and get-rich-quick schemes.
            </motion.p>

            <motion.div variants={fadeUp} custom={2} className="grid md:grid-cols-3 gap-6">
              {pillars.map((p, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card p-8 space-y-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    {p.icon}
                  </div>
                  <h3 className="font-display font-semibold text-xl text-foreground">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Complete Curriculum */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4 text-center"
            >
              Complete Curriculum
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto"
            >
              Everything you need to become a professional trader, structured in a step-by-step format
            </motion.p>

            <motion.div variants={fadeUp} custom={2} className="grid md:grid-cols-2 gap-6">
              {modules.map((m) => (
                <div
                  key={m.num}
                  className="rounded-2xl border border-border bg-card p-7 space-y-4"
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Module {m.num}
                  </span>
                  <h3 className="font-display font-bold text-xl text-foreground">
                    {m.title}
                  </h3>
                  <ul className="space-y-2">
                    {m.topics.map((t, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4 text-center"
            >
              What's Included
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-muted-foreground text-center mb-16 max-w-xl mx-auto"
            >
              Premium resources and ongoing support to ensure your success
            </motion.p>

            <motion.div variants={fadeUp} custom={2} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card p-6 text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    {f.icon}
                  </div>
                  <h3 className="font-display font-semibold text-sm text-foreground">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4 text-center"
            >
              Investment in Your Future
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
            >
              One-time payment for lifetime access. No monthly fees, no hidden costs.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={2}
              className="rounded-2xl border border-primary/30 bg-card p-8 md:p-10 relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-block px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wide">
                  Limited Time Offer
                </span>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-3 mb-2">
                  <span className="font-display font-bold text-5xl text-foreground">$49</span>
                  <span className="text-xl text-muted-foreground line-through">$99</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  One-time payment • Lifetime access • No recurring fees
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {pricingFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="https://discord.gg/SCHeKKCa6c"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:brightness-110 transition-all duration-300 text-base"
              >
                Enroll in The Red Pill
                <ArrowRight className="w-5 h-5" />
              </a>

              <p className="text-center text-xs text-muted-foreground mt-4">
                30-day money-back guarantee • Secure payment
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4"
            >
              Ready to Wake Up?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-muted-foreground mb-8 max-w-xl mx-auto"
            >
              Join 500+ traders who chose reality over illusion. The journey to consistent profitability starts here.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:brightness-110 transition-all duration-300 text-base"
              >
                Take The Red Pill
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-display font-bold text-lg text-foreground">Arjun Trades</p>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Home</Link>
            <Link to="/workshop" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Workshop</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Contact</Link>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 Arjun Trades</p>
        </div>
      </footer>
    </div>
  );
};

export default RedPill;
