import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CalendarBlank, Check, ClipboardText, CheckCircle } from "@phosphor-icons/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ReviewsNote from "@/components/ReviewsNote";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import redPillHand from "@/assets/red-pill-hand.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

const pillars = [
  {
    title: "Mindset first",
    desc: "Master the psychology of trading before you touch the charts. Learn discipline, patience, and emotional control.",
  },
  {
    title: "Strategy-focused",
    desc: "Proven trading strategies including iFVG, liquidity concepts, and institutional order flow analysis.",
  },
  {
    title: "Real results",
    desc: "Live trading sessions, real market analysis, and practical applications, not theory alone.",
  },
  {
    title: "Premium trading journal",
    desc: "Complimentary access on enrolment: advanced analytics, calendar performance, multi-account support, etc.",
  },
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
    topics: ["Money management rules", "Risk - Reward planning", "Handling losing streaks", "Profit management", "Scaling and compounding"],
  },
  {
    num: 5,
    title: "Psychology & Discipline",
    topics: ["Trading psychology mastery", "Emotional control techniques", "Building trading routines", "Journal and analysis", "Long-term sustainability"],
  },
  {
    num: 6,
    title: "Live Trading",
    topics: ["Live market analysis sessions", "Real-time trade execution", "Weekly market reviews", "Q&A and personal training", "Community support access"],
  },
];

const headlineFeatures = {
  oneOnOne: { title: "Private one-on-one calls", desc: "Special personalised trading training based on your skills." },
  lifetime: { title: "Lifetime access", desc: "One-time payment, access forever." },
  journal: {
    title: "Premium trading journal",
    desc: "Deep insights into your trading patterns with advanced metrics, win rates, drawdown analysis, calendar performance, multi-account management, detailed trade logging, etc.",
  },
};

const otherFeatures = [
  { title: "Live sessions", desc: "Weekly live trading and Q&A sessions." },
  { title: "Private community", desc: "Exclusive access to private Discord." },
  { title: "Trade setups", desc: "Daily trade ideas and market analysis." },
  { title: "Flexible learning", desc: "Learn at your own pace, on your schedule." },
  { title: "Customised game plan", desc: "A trading roadmap built from scratch only for you." },
  { title: "Priority access forever", desc: "Get priority access to all of our premium contents." },
];

const pricingFeatures = [
  "Complete 6-module trading curriculum",
  "Personalised trading training",
  "Exclusive trade ideas",
  "Private Discord community access",
  "Daily liquidity levels and market analysis",
  "Exclusive access to trading journal",
  "1-on-1 private call with me",
  "Trader-first approach and curated trading plan based on your skillsets.",
  "Priority access to all updates",
];

const RedPill = () => {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="min-h-[100dvh]">
      <Helmet>
        <title>The Red Pill — Elite Trading Mentorship | Arjun IFVG</title>
        <meta
          name="description"
          content="The Red Pill is Arjun IFVG's elite 1-on-1 trading mentorship for serious students of ICT, SMC and the iFVG strategy."
        />
        <link rel="canonical" href="https://ifvg.in/red-pill" />
        <meta property="og:title" content="The Red Pill — Elite Trading Mentorship" />
        <meta property="og:description" content="Arjun IFVG's elite 1-on-1 trading mentorship program." />
        <meta property="og:url" content="https://ifvg.in/red-pill" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <BookingFormDialog open={showBooking} onOpenChange={setShowBooking} />
      <main id="main">
        {/* Hero */}
        <section className="shell pb-16 pt-10 sm:pt-16 lg:pb-24">
          <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="type-label rule-mark text-muted-foreground"
              >
                Applications open: Batch 2
              </motion.p>
              <h1 className="type-display mt-6 text-[clamp(3.5rem,10vw,8.5rem)]">
                {["Take", "The Red Pill"].map((line, i) => (
                  <span key={line} className="clip-line block">
                    <motion.span
                      className={cn("block", i === 1 && "text-primary")}
                      initial={{ y: "108%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1, delay: 0.1 + i * 0.12, ease }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease }}
                className="type-lead mt-8 max-w-xl"
              >
                Wake up to the new reality of making money. A comprehensive training program designed to transform
                beginners into consistently profitable traders at the cost of a single funded account.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.62, ease }}
                className="mt-10 flex flex-col gap-3 sm:flex-row"
              >
                <Button size="lg" onClick={() => setShowBooking(true)}>
                  <ClipboardText weight="bold" />
                  Apply now
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#about">Learn more</a>
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease }}
              className="aspect-square overflow-hidden bg-panel lg:col-span-5"
            >
              <img
                src={redPillHand}
                alt="An open hand holding a glowing red pill"
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* What is The Red Pill */}
        <section id="about" className="scroll-mt-20 py-16 sm:py-20">
          <div className="shell">
            <Reveal>
              <h2 className="type-title text-[clamp(2.5rem,6vw,4.75rem)]">
                What is <span className="text-primary">The Red Pill</span>?
              </h2>
              <p className="type-lead mt-6 max-w-2xl text-muted-foreground">
                A structured, no-nonsense training program that reveals the truth about trading, beyond the Instagram
                lifestyle and get-rich-quick schemes.
              </p>
            </Reveal>

            <dl className="mt-14 border-t border-foreground">
              {pillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.05}>
                  <div className="grid gap-3 border-b border-border py-7 md:grid-cols-12 md:gap-8 md:py-9">
                    <dt className="type-heading text-[1.625rem] md:col-span-5">{p.title}</dt>
                    <dd className="text-[1.0625rem] text-muted-foreground md:col-span-6 md:col-start-7">{p.desc}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* Complete curriculum */}
        <section className="py-16 sm:py-20">
          <div className="shell">
            <Reveal>
              <h2 className="type-title text-[clamp(2.5rem,6vw,4.75rem)]">Complete curriculum</h2>
              <p className="type-lead mt-6 max-w-2xl text-muted-foreground">
                Everything you need to become a professional trader, structured in a step-by-step format.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <Tabs defaultValue="1" orientation="vertical" className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-12">
                <TabsList
                  aria-label="Curriculum modules"
                  className="-mx-5 flex items-stretch justify-start gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:col-span-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
                >
                  {modules.map((m) => (
                    <TabsTrigger
                      key={m.num}
                      value={String(m.num)}
                      className="group shrink-0 justify-start gap-4 border border-border px-4 py-3 text-left text-base font-semibold transition-colors hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-foreground data-[state=active]:text-background lg:w-full lg:border-0 lg:border-t lg:border-border lg:bg-transparent lg:px-0 lg:py-5 lg:data-[state=active]:border-foreground lg:data-[state=active]:bg-transparent lg:data-[state=active]:text-foreground"
                    >
                      <span className="type-mono text-sm text-muted-foreground group-data-[state=active]:text-background/70 lg:group-data-[state=active]:text-primary">
                        {m.num}
                      </span>
                      <span className="lg:type-title lg:text-[1.875rem]">{m.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="lg:col-span-7">
                  {modules.map((m) => (
                    <TabsContent key={m.num} value={String(m.num)} className="mt-0 border-t border-foreground pt-6">
                      <p className="type-label text-muted-foreground">Module {m.num}</p>
                      <h3 className="type-title mt-2 text-4xl sm:text-5xl">{m.title}</h3>
                      <ul className="mt-8 space-y-4">
                        {m.topics.map((t) => (
                          <li key={t} className="flex items-start gap-3 text-[1.125rem]">
                            <Check className="mt-1 h-5 w-5 shrink-0 text-primary" weight="bold" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </Reveal>
          </div>
        </section>

        {/* What's included */}
        <section className="py-16 sm:py-20">
          <div className="shell">
            <Reveal>
              <h2 className="type-title text-[clamp(2.5rem,6vw,4.75rem)]">What's included</h2>
              <p className="type-lead mt-6 max-w-xl text-muted-foreground">
                Premium resources and ongoing support to ensure your success.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-4 lg:grid-cols-12">
              <Reveal className="flex flex-col justify-between bg-panel p-8 text-panel-foreground sm:p-10 lg:col-span-7 lg:row-span-2 lg:min-h-[26rem]">
                <h3 className="type-title max-w-[11ch] text-[clamp(2.5rem,5vw,4.25rem)]">
                  Private <span className="whitespace-nowrap">one-on-one</span> calls
                </h3>
                <p className="mt-10 max-w-sm text-[1.0625rem] text-panel-foreground/80">
                  {headlineFeatures.oneOnOne.desc}
                </p>
              </Reveal>

              <Reveal delay={0.06} className="flex flex-col justify-between bg-primary p-8 text-primary-foreground lg:col-span-5">
                <h3 className="type-title text-4xl sm:text-5xl">{headlineFeatures.lifetime.title}</h3>
                <p className="mt-8 text-[1.0625rem] opacity-90">{headlineFeatures.lifetime.desc}</p>
              </Reveal>

              <Reveal delay={0.12} className="flex flex-col justify-between bg-muted p-8 lg:col-span-5">
                <h3 className="type-title text-4xl sm:text-5xl">{headlineFeatures.journal.title}</h3>
                <p className="mt-8 text-[1.0625rem] text-muted-foreground">{headlineFeatures.journal.desc}</p>
              </Reveal>
            </div>

            <ul className="mt-14 grid gap-x-12 gap-y-0 md:grid-cols-2">
              {otherFeatures.map((f, i) => (
                <li key={f.title}>
                  <Reveal delay={(i % 2) * 0.05} className="border-t border-border py-6">
                    <h3 className="type-heading text-xl">{f.title}</h3>
                    <p className="mt-2 text-muted-foreground">{f.desc}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 py-16 sm:py-20">
          <div className="shell">
            <Reveal>
              <h2 className="type-title text-[clamp(2.5rem,6vw,4.75rem)]">Investment in your future</h2>
              <p className="type-lead mt-6 max-w-xl text-muted-foreground">
                One-time payment for lifetime access. No monthly fees, no hidden costs.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="mt-14 grid bg-panel text-panel-foreground lg:grid-cols-12">
              <div className="flex flex-col justify-between p-8 sm:p-12 lg:col-span-5">
                <div>
                  <p className="type-label text-signal">Applications open: Batch 2</p>
                  <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="type-display text-[clamp(4rem,9vw,6.5rem)] tabular-nums">₹4,999</span>
                    <span className="text-2xl text-panel-muted line-through tabular-nums">₹9,999</span>
                  </div>
                  <p className="mt-4 text-panel-muted">One-time payment. Lifetime access. No recurring fees.</p>
                </div>
                <div className="mt-12">
                  <Button
                    size="lg"
                    onClick={() => setShowBooking(true)}
                    className="w-full bg-signal text-panel hover:bg-panel-foreground hover:text-panel sm:w-auto"
                  >
                    <ClipboardText weight="bold" />
                    Apply now
                  </Button>
                  <p className="mt-4 max-w-xs text-sm text-panel-muted">
                    Submit your application and we'll reach out to confirm your enrolment call.
                  </p>
                </div>
              </div>

              <ul className="space-y-4 border-t border-panel-border p-8 sm:p-12 lg:col-span-7 lg:border-l lg:border-t-0">
                {pricingFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[1.0625rem]">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-signal" weight="bold" />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <ReviewsNote id="tobi" quote="I'm happy that I joined the red pill 3 class. I would say it was worth it." />

        {/* Final CTA */}
        <section className="py-16 sm:py-24">
          <div className="shell grid items-end gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-8">
              <h2 className="type-display text-[clamp(3.25rem,9vw,7.5rem)]">
                Ready to <span className="text-primary">wake up?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-4">
              <p className="max-w-sm text-[1.0625rem] text-muted-foreground">
                Join the inner circle of traders who chose reality over illusion. The journey to consistent
                profitability starts here.
              </p>
              <Button size="lg" className="mt-8" onClick={() => setShowBooking(true)}>
                Apply now
                <ArrowRight weight="bold" />
              </Button>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const timeSlots = [
  "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM",
  "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM",
  "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM",
];

const experienceLevels = [
  "Complete beginner — never traded before",
  "Beginner — traded for less than 6 months",
  "Intermediate — 6 months to 2 years of experience",
  "Advanced — 2+ years but struggling with consistency",
];

const BookingFormDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [experience, setExperience] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !experience || !date || !time) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("red_pill_bookings").insert({
      name: name.trim(),
      contact: contact.trim(),
      trading_experience: experience,
      preferred_date: format(date, "yyyy-MM-dd"),
      preferred_time: time,
    } as any);
    setSubmitting(false);
    if (error) {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
      return;
    }
    // Fire-and-forget: sync to Google Calendar
    supabase.functions
      .invoke("redpill-create-calendar-event", {
        body: {
          name: name.trim(),
          contact: contact.trim(),
          trading_experience: experience,
          preferred_date: format(date, "yyyy-MM-dd"),
          preferred_time: time,
        },
      })
      .catch((err) => console.error("Calendar sync failed", err));
    setSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    if (submitted) {
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setContact("");
        setExperience("");
        setDate(undefined);
        setTime("");
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{submitted ? "Application received" : "Apply for The Red Pill"}</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="space-y-4 py-2">
            <CheckCircle className="h-12 w-12 text-primary" weight="fill" />
            <h3 className="type-heading text-xl">Thank you, {name}.</h3>
            <p className="text-[0.9375rem] text-muted-foreground">
              Your application has been submitted. We'll reach out to you at{" "}
              <span className="font-semibold text-foreground">{contact}</span> to confirm your enrolment call on{" "}
              <span className="font-semibold text-foreground">{date && format(date, "MMM d, yyyy")}</span> at{" "}
              <span className="font-semibold text-foreground">{time}</span>.
            </p>
            <p className="text-[0.9375rem] text-muted-foreground">
              As a bonus for enrolling, you'll receive complimentary access to our{" "}
              <span className="font-semibold text-foreground">Premium Trading Journal</span>, featuring advanced
              analytics, automated trade tagging, P&L breakdowns, and secure cloud backups. Access details will be sent
              to the contact you provided once your enrolment is confirmed.
            </p>
            <Button onClick={handleClose} className="mt-2">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="rp-name" className="field-label">Name</label>
              <input
                id="rp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                maxLength={100}
                className="field"
              />
            </div>
            <div>
              <label htmlFor="rp-contact" className="field-label">Contact number</label>
              <input
                id="rp-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="How should we reach you?"
                maxLength={255}
                className="field"
              />
            </div>
            <div>
              <label htmlFor="rp-exp" className="field-label">Trading experience</label>
              <select
                id="rp-exp"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="field"
              >
                <option value="" disabled>
                  Select your experience level
                </option>
                {experienceLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {/* value stays as stored in the database; only the visible label drops the dash */}
                    {lvl.replace(" — ", ": ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <span className="field-label">Preferred date</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn("field flex items-center gap-2 text-left", !date && "text-muted-foreground")}
                    >
                      <CalendarBlank className="h-5 w-5 shrink-0" />
                      {date ? format(date, "MMM d, yyyy") : "Pick a date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label htmlFor="rp-time" className="field-label">Preferred time</label>
                <select id="rp-time" value={time} onChange={(e) => setTime(e.target.value)} className="field">
                  <option value="" disabled>
                    Select time
                  </option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              <ClipboardText weight="bold" />
              {submitting ? "Submitting…" : "Submit application"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RedPill;
