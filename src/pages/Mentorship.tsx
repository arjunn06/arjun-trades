import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Calendar, ArrowLeft, Star, Send, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import workshopThumbnail from "@/assets/Thumbnail.png";

const Workshop = () => {
  const workshop = {
    title: "Arjun Trades: Free Beginner Trading Workshop",
    subtitle: "A deep-dive, practical workshop for serious traders.",
    coverImage: workshopThumbnail, 
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
                    Workshop is completed.
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
                  <a
                    href="https://youtu.be/YifBHSrJhqc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold bg-primary text-primary-foreground hover:brightness-110 transition-all"
                  >
                    Watch on YouTube
                  </a>
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

          {/* Testimonials */}
          <TestimonialCarousel />

          {/* Feedback Form */}
          <FeedbackForm />
        </motion.div>
      </section>
    </div>
  );
};

const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState<
    { name: string; rating: number; feedback: string; created_at: string }[]
  >([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("workshop_feedback")
        .select("name, rating, feedback, created_at")
        .order("created_at", { ascending: false });

      if (data) setTestimonials(data);
      setLoading(false);
    };

    fetch();
  }, []);

  if (loading || testimonials.length === 0) return null;

  const perPage = 3;
  const totalPages = Math.ceil(testimonials.length / perPage);
  const page = current % totalPages;

  const visible = testimonials.slice(
    page * perPage,
    page * perPage + perPage
  );

  const prev = () =>
    setCurrent((c) => (c === 0 ? totalPages - 1 : c - 1));

  const next = () =>
    setCurrent((c) => (c === totalPages - 1 ? 0 : c + 1));

  return (
    <div className="mt-16">
      <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-6">
        What attendees say
      </h2>

      <motion.div
        key={page}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-4 md:grid-cols-3"
      >
        {visible.map((t, idx) => {
          const id = page * perPage + idx;
          const isExpanded = expanded === id;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-5 space-y-3 h-full flex flex-col"
            >
              <Quote className="w-6 h-6 text-primary/20" />

              <p
                className={`text-foreground leading-relaxed text-sm ${
                  isExpanded ? "" : "line-clamp-4"
                }`}
              >
                "{t.feedback}"
              </p>

              {t.feedback.length > 180 && (
                <button
                  onClick={() =>
                    setExpanded(isExpanded ? null : id)
                  }
                  className="text-xs text-primary font-medium hover:underline self-start"
                >
                  {isExpanded ? "Read less" : "Read more"}
                </button>
              )}

              <div className="flex items-center gap-2 pt-1 mt-auto">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= t.rating
                          ? "text-primary fill-primary"
                          : "text-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>

                <span className="text-xs font-medium text-foreground">
                  {t.name}
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-6">
          <button
            onClick={prev}
            className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs text-muted-foreground">
            {page + 1} / {totalPages}
          </span>

          <button
            onClick={next}
            className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || rating === 0 || !feedback.trim()) {
      toast({ title: "Please fill all fields and select a rating", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("workshop_feedback").insert({
      name: name.trim(),
      rating,
      feedback: feedback.trim(),
    } as any);
    setSubmitting(false);
    if (error) {
      toast({ title: "Something went wrong", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Thank you for your feedback!" });
  };

  if (submitted) {
    return (
      <div className="mt-12 rounded-3xl border border-border bg-card p-8 text-center">
        <Star className="w-8 h-8 text-primary fill-primary mx-auto mb-3" />
        <h3 className="font-display text-xl font-semibold text-foreground mb-1">Thanks for your feedback!</h3>
        <p className="text-sm text-muted-foreground">Your response has been recorded.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 rounded-3xl border border-border bg-card p-6 md:p-8">
      <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-1">
        Workshop Feedback
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Attended the workshop? We'd love to hear your thoughts.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            maxLength={100}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "text-primary fill-primary"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Feedback</label>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="What did you think of the workshop?"
            maxLength={1000}
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {submitting ? "Submitting…" : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default Workshop;
