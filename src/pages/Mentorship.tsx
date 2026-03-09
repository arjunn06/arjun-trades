import { motion } from "framer-motion";
import { BookOpen, Clock, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Workshop = () => {
  const workshop = {
    title: "Arjun Trades iFVG Workshop",
    subtitle: "A deep-dive, practical workshop for serious traders.",
    coverImage:
      "https://images.pexels.com/photos/5439427/pexels-photo-5439427.jpeg?auto=compress&cs=tinysrgb&w=1600",
    date: "Sunday, 15 March 2026",
    time: "11:00 AM – 2:00 PM IST (Approximately)",
    duration: "3-4 hours · Live on Google Meet & YouTube",
    price: "₹0",
    seats: "100 total seats",
    agenda: [
      "Introduction",
      "Candlestick Anatomy",
      "Long Trades vs Short Trades",
      "Stop Loss & Take Profits",
      "Liquidity Basics",
      "Smart Money Concepts",
    ],
    schedule: [
      { time: "11:00 – 11:30 AM", label: "Welcome, workshop overview, expectations" },
      { time: "11:30 – 12:00 PM", label: "Navigating through TradingView and Candlestick Anatomy" },
      { time: "12:00 – 12:15 PM", label: "Long Trades vs Short Trades" },
      { time: "12:15 – 12:30 PM", label: "Stop Loss & Take Profits" },
      { time: "12:30 – 01:00 PM", label: "Liquidity Basics" },
      { time: "01:00 – 01:30 PM", label: "Smart Money Concepts" },
      { time: "01:30 – 02:00 PM", label: "Interactive QnA Sessions" },
    ],
    description: [
      "Who is this workshop for?",
      "• Complete beginners who have no idea what trading is but want to understand how markets actually work.",
      "• Traders using basic support & resistance who want to refine their understanding of price movement.",
      "• Trading enthusiasts who are struggling to find a structured trading model that makes sense.",
    ],
    note: "Seats are intentionally limited so I can give proper attention to everyone. Recordings will be publicly available on YouTube.",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-16 md:py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back home
          </Link>

          {/* Header */}
          <div className="flex items-start gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-2">
                Workshop
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {workshop.subtitle}
              </p>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid gap-10 md:gap-12 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
            {/* Left: cover + description + agenda */}
            <div className="space-y-10">
              {/* Cover image */}
              <div className="overflow-hidden rounded-3xl border border-border bg-card aspect-[16/9]">
                <img
                  src={workshop.coverImage}
                  alt={workshop.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                  About this workshop
                </h2>
                {workshop.description.map((para, idx) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed">
                    {para}
                  </p>
                ))}
                <p className="text-sm text-muted-foreground/80">{workshop.note}</p>
              </div>

              {/* Agenda */}
              <div className="space-y-4">
                <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                  What you&apos;ll learn
                </h2>
                <ul className="space-y-2 text-muted-foreground text-sm md:text-base">
                  {workshop.agenda.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: details + CTA */}
            <aside className="space-y-6 md:space-y-8">
              <div className="rounded-3xl border border-border bg-card p-6 md:p-7 space-y-5">
                {/* Date & time */}
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-amber-400">
                    Seats are full
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{workshop.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{workshop.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{workshop.duration}</p>
                </div>

                {/* Price & seats */}
                <div className="border-t border-border/60 pt-4 mt-2 space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                    Investment
                  </p>
                  <p className="font-display text-2xl font-semibold text-foreground">
                    {workshop.price}
                  </p>
                  <p className="text-xs text-muted-foreground">{workshop.seats}</p>
                </div>

                {/* CTA buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    disabled
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold border border-border bg-muted text-muted-foreground cursor-not-allowed opacity-70"
                  >
                    Seats are full
                  </button>
                  <a
                    href="https://discord.gg/SCHeKKCa6c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Join Discord to get notified about the next workshop
                  </a>
                </div>
              </div>

              {/* Schedule */}
              <div className="rounded-3xl border border-border bg-card/60 p-6 md:p-7 space-y-4">
                <h2 className="font-display text-lg md:text-xl font-semibold text-foreground">
                  Session schedule
                </h2>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {workshop.schedule.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex flex-col gap-0.5 rounded-xl border border-border/60 bg-background/40 px-3 py-2.5"
                    >
                      <span className="text-[0.75rem] font-medium text-primary/90 uppercase tracking-wide">
                        {item.time}
                      </span>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Workshop;
