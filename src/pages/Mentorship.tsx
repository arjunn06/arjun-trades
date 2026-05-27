import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Star, Send, ChevronLeft, ChevronRight, Quote, CheckCircle2, Clock, PlayCircle, Sparkles, Share2 } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import workshopThumbnail from "@/assets/Thumbnail.png";

const interestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  promo_consent: z.boolean(),
});

const Workshop = () => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", promo_consent: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = interestSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Check your details",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("workshop_interest").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      promo_consent: parsed.data.promo_consent,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "You're on the list!", description: "We'll email you as soon as the workshop is live." });
  };

  const reset = () => {
    setOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", promo_consent: false });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Trading Workshop — Arjun IFVG</title>
        <meta name="description" content="Join the free Arjun IFVG workshop. Learn ICT, Smart Money Concepts and the iFVG strategy in Tamil with live sessions and Q&A." />
        <link rel="canonical" href="https://ifvg.in/workshop" />
        <meta property="og:title" content="Free Trading Workshop — Arjun IFVG" />
        <meta property="og:description" content="Free Tamil trading workshop covering ICT, SMC and iFVG strategy." />
        <meta property="og:url" content="https://ifvg.in/workshop" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          name: "Arjun IFVG Free Trading Workshop",
          description: "Free Tamil trading workshop covering ICT, Smart Money Concepts and the iFVG strategy.",
          provider: { "@type": "Organization", name: "Arjun Trades", sameAs: "https://ifvg.in" },
        })}</script>
      </Helmet>
      <Header />



      <section className="py-16 md:py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Heading */}
          <div className="mb-12 md:mb-16 text-center">
            <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground mb-4">
              Workshops
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Free, no-fluff sessions to help you understand how markets really work.
            </p>
          </div>

          {/* Workshop thumbnails */}
          <div className="grid gap-6 md:gap-8 md:grid-cols-2">
            {/* Completed — Beginner to Advanced */}
            <WorkshopCard
              title="Beginner to Advanced — Free Workshop"
              description="Candlestick anatomy, smart money concepts, liquidity, and a structured trading model. Watch the full replay anytime."
              badge={{ label: "Completed", icon: CheckCircle2, tone: "completed" }}
              cta={{ label: "Watch Now", icon: PlayCircle }}
              shareUrl="https://youtu.be/YifBHSrJhqc"
              shareTitle="Beginner to Advanced — Free Workshop by Arjun IFVG"
              onActivate={() => window.open("https://youtu.be/YifBHSrJhqc", "_blank", "noopener,noreferrer")}
              thumbnail={
                <>
                  <img
                    src={workshopThumbnail}
                    alt="Beginner to Advanced Free Workshop"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-background/0" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-16 h-16 text-white drop-shadow-2xl" />
                  </div>
                </>
              }
            />

            {/* Coming Soon — IFVG Masterclass */}
            <WorkshopCard
              title="IFVG Masterclass — Free Workshop"
              description="A deep-dive into the IFVG model, market structure, and the exact playbook I use weekly. Be the first to know when seats open."
              badge={{ label: "Coming Soon", icon: Clock, tone: "coming" }}
              cta={{ label: "I'm Interested", icon: Sparkles }}
              shareUrl={typeof window !== "undefined" ? window.location.href : "/workshop"}
              shareTitle="IFVG Masterclass — Free Workshop by Arjun IFVG"
              onActivate={() => setOpen(true)}
              thumbnail={
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-background flex items-center justify-center">
                  <div className="text-center px-6">
                    <Sparkles className="w-10 h-10 text-primary mx-auto mb-3" />
                    <p className="font-display font-bold text-2xl md:text-3xl text-foreground leading-tight">
                      IFVG <span className="text-primary">Masterclass</span>
                    </p>
                  </div>
                </div>
              }
            />
          </div>

          {/* Testimonials */}
          <TestimonialCarousel />

          {/* Feedback Form */}
          <FeedbackForm />
        </motion.div>
      </section>

      {/* Interest Dialog */}
      <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : reset())}>
        <DialogContent className="sm:max-w-md">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <DialogTitle className="font-display text-2xl mb-2">You're on the list</DialogTitle>
              <DialogDescription className="mb-6">
                We'll send the workshop details to your inbox the moment it's announced.
              </DialogDescription>
              <Button onClick={reset} className="w-full">Done</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Save my spot</DialogTitle>
                <DialogDescription>
                  Drop your details and we'll let you know the moment seats open.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    maxLength={100}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    maxLength={255}
                    required
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={form.promo_consent}
                    onCheckedChange={(v) => setForm({ ...form, promo_consent: v === true })}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-muted-foreground leading-snug">
                    I agree to receive promotional mail from Arjun IFVG.
                  </span>
                </label>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Submitting..." : "Notify me"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
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

  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  const prev = () => setCurrent((c) => (c === 0 ? totalPages - 1 : c - 1));
  const next = () => setCurrent((c) => (c === totalPages - 1 ? 0 : c + 1));

  return (
    <div className="mt-20">
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
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
                  onClick={() => setExpanded(isExpanded ? null : id)}
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

                <span className="text-xs font-medium text-foreground">{t.name}</span>
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
        Attended a workshop? We'd love to hear your thoughts.
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

type WorkshopCardProps = {
  title: string;
  description: string;
  badge: { label: string; icon: React.ComponentType<{ className?: string }>; tone: "completed" | "coming" };
  cta: { label: string; icon: React.ComponentType<{ className?: string }> };
  shareUrl: string;
  shareTitle: string;
  thumbnail: React.ReactNode;
  onActivate: () => void;
};

const WorkshopCard = ({ title, description, badge, cta, shareUrl, shareTitle, thumbnail, onActivate }: WorkshopCardProps) => {
  const BadgeIcon = badge.icon;
  const CtaIcon = cta.icon;
  const badgeClasses =
    badge.tone === "completed"
      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
      : "border-primary/40 bg-primary/15 text-primary";

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = { title: shareTitle, url: shareUrl };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // user cancelled or share failed; fall through to copy
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "Link copied", description: "Workshop link is ready to share." });
    } catch {
      toast({ title: "Couldn't share", description: shareUrl });
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      className="group rounded-3xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-all duration-300 flex flex-col text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {thumbnail}
        <div className={`absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border backdrop-blur px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider ${badgeClasses}`}>
          <BadgeIcon className="w-3.5 h-3.5" />
          {badge.label}
        </div>
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share workshop"
          className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-full border border-border bg-background/70 backdrop-blur text-foreground hover:bg-background hover:border-primary/40 transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h2 className="font-display font-semibold text-xl md:text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mb-6 flex-1">{description}</p>
        <span className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold bg-primary text-primary-foreground group-hover:brightness-110 transition-all self-start">
          <CtaIcon className="w-4 h-4" />
          {cta.label}
        </span>
      </div>
    </div>
  );
};

export default Workshop;
