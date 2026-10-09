import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Star, PaperPlaneTilt, CheckCircle, Clock, Play, Sparkle, ShareNetwork } from "@phosphor-icons/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Testimonials, { type TestimonialItem } from "@/components/Testimonials";
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
import { cn } from "@/lib/utils";
import workshopThumbnail from "@/assets/Thumbnail.webp";

const ease = [0.16, 1, 0.3, 1] as const;

const interestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  promo_consent: z.boolean(),
});

const REPLAY_URL = "https://youtu.be/YifBHSrJhqc";

const share = async (shareUrl: string, shareTitle: string) => {
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
    toast({ title: "You're on the list", description: "We'll email you as soon as the workshop is live." });
  };

  const reset = () => {
    setOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", promo_consent: false });
    }, 200);
  };

  return (
    <div className="min-h-[100dvh]">
      <Helmet>
        <title>Free Trading Workshop — Arjun IFVG</title>
        <meta
          name="description"
          content="Join the free Arjun IFVG workshop. Learn ICT, Smart Money Concepts and the iFVG strategy in Tamil with live sessions and Q&A."
        />
        <link rel="canonical" href="https://ifvg.in/workshop" />
        <meta property="og:title" content="Free Trading Workshop — Arjun IFVG" />
        <meta property="og:description" content="Free Tamil trading workshop covering ICT, SMC and iFVG strategy." />
        <meta property="og:url" content="https://ifvg.in/workshop" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: "Arjun IFVG Free Trading Workshop",
            description: "Free Tamil trading workshop covering ICT, Smart Money Concepts and the iFVG strategy.",
            provider: { "@type": "Organization", name: "Arjun Trades", sameAs: "https://ifvg.in" },
          })}
        </script>
      </Helmet>
      <Header />
      <main id="main">
        <section className="shell pb-6 pt-10 sm:pt-16">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="type-display text-[clamp(3.75rem,13vw,11rem)]"
          >
            Workshops
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="type-lead mt-6 max-w-xl text-muted-foreground"
          >
            Free, no-fluff sessions to help you understand how markets really work.
          </motion.p>
        </section>

        {/* Completed workshop */}
        <section className="shell py-12 sm:py-16">
          <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-7">
              <a
                href={REPLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Watch the Beginner to Advanced free workshop replay on YouTube"
                className="group relative block aspect-video overflow-hidden bg-muted"
              >
                <img
                  src={workshopThumbnail}
                  alt="Beginner to Advanced Free Workshop"
                  className="h-full w-full scale-[1.02] object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.05]"
                />
                <span className="absolute bottom-0 left-0 flex h-16 w-16 items-center justify-center bg-primary text-primary-foreground transition-[width,background-color] duration-300 ease-out-expo group-hover:w-24 group-hover:bg-foreground group-hover:text-background">
                  <Play className="h-6 w-6" weight="fill" />
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-5">
              <p className="type-label inline-flex items-center gap-2 border border-border px-3 py-1.5 text-muted-foreground">
                <CheckCircle className="h-4 w-4" weight="bold" />
                Completed
              </p>
              <h2 className="type-title mt-6 text-[clamp(2rem,4vw,3.25rem)]">
                Beginner to Advanced: Free Workshop
              </h2>
              <p className="mt-5 max-w-md text-[1.0625rem] text-muted-foreground">
                Candlestick anatomy, smart money concepts, liquidity, and a structured trading model. Watch the full
                replay anytime.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <a href={REPLAY_URL} target="_blank" rel="noopener noreferrer">
                    <Play weight="fill" />
                    Watch now
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => share(REPLAY_URL, "Beginner to Advanced: Free Workshop by Arjun IFVG")}
                  aria-label="Share workshop"
                >
                  <ShareNetwork />
                  Share
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Coming soon */}
        <section className="shell py-6 sm:py-10">
          <Reveal className="grid gap-10 bg-panel p-8 text-panel-foreground sm:p-12 lg:grid-cols-12 lg:items-end lg:gap-12 lg:p-16">
            <div className="lg:col-span-7">
              <p className="type-label inline-flex items-center gap-2 border border-panel-border px-3 py-1.5 text-panel-muted">
                <Clock className="h-4 w-4" weight="bold" />
                Coming soon
              </p>
              <h2 className="type-display mt-8 text-[clamp(3rem,8vw,6.5rem)]">
                IFVG <span className="text-signal">Masterclass</span>
              </h2>
              <p className="mt-2 text-lg text-panel-muted">Free workshop</p>
            </div>
            <div className="lg:col-span-5">
              <p className="max-w-md text-[1.0625rem] text-panel-foreground/85">
                A deep-dive into the IFVG model, market structure, and the exact playbook I use weekly. Be the first to
                know when seats open.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  onClick={() => setOpen(true)}
                  className="bg-signal text-panel hover:bg-panel-foreground hover:text-panel"
                >
                  <Sparkle weight="fill" />
                  I'm interested
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    share(
                      typeof window !== "undefined" ? window.location.href : "/workshop",
                      "IFVG Masterclass: Free Workshop by Arjun IFVG",
                    )
                  }
                  aria-label="Share workshop"
                  className="border-panel-foreground text-panel-foreground hover:bg-panel-foreground hover:text-panel"
                >
                  <ShareNetwork />
                  Share
                </Button>
              </div>
            </div>
          </Reveal>
        </section>

        <AttendeeTestimonials />
        <FeedbackForm />

        {/* Interest dialog */}
        <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : reset())}>
          <DialogContent className="sm:max-w-md">
            {submitted ? (
              <div className="space-y-4 py-2">
                <CheckCircle className="h-12 w-12 text-primary" weight="fill" />
                <DialogTitle>You're on the list</DialogTitle>
                <DialogDescription>
                  We'll send the workshop details to your inbox the moment it's announced.
                </DialogDescription>
                <Button onClick={reset} className="mt-2">
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Save my spot</DialogTitle>
                  <DialogDescription>
                    Drop your details and we'll let you know the moment seats open.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-6">
                  <div>
                    <Label htmlFor="name" className="field-label">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      maxLength={100}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="field-label">
                      Email
                    </Label>
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
                  <label className="flex cursor-pointer items-start gap-3">
                    <Checkbox
                      checked={form.promo_consent}
                      onCheckedChange={(v) => setForm({ ...form, promo_consent: v === true })}
                      className="mt-0.5"
                    />
                    <span className="text-[0.9375rem] leading-snug text-muted-foreground">
                      I agree to receive promotional mail from Arjun IFVG.
                    </span>
                  </label>
                </div>

                <DialogFooter>
                  <Button type="submit" size="lg" disabled={submitting} className="w-full">
                    {submitting ? "Submitting..." : "Notify me"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

const AttendeeTestimonials = () => {
  const [items, setItems] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("workshop_feedback")
        .select("name, rating, feedback, created_at")
        .order("created_at", { ascending: false });
      if (data) setItems(data.map((d) => ({ name: d.name, rating: d.rating, text: d.feedback })));
    };
    load();
  }, []);

  return <Testimonials title="What attendees say" items={items} initial={6} />;
};

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
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
    toast({ title: "Thank you for your feedback" });
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="shell grid gap-10 border-t border-foreground pt-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 className="type-title text-[clamp(2.25rem,5vw,3.75rem)]">Workshop feedback</h2>
          <p className="mt-5 max-w-sm text-[1.0625rem] text-muted-foreground">
            Attended a workshop? We'd love to hear your thoughts.
          </p>
        </div>

        <div className="lg:col-span-7">
          {submitted ? (
            <div className="border border-foreground p-8">
              <Star className="h-8 w-8 text-primary" weight="fill" />
              <h3 className="type-heading mt-4 text-2xl">Thanks for your feedback</h3>
              <p className="mt-1 text-muted-foreground">Your response has been recorded.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
              <div>
                <label htmlFor="fb-name" className="field-label">
                  Name
                </label>
                <input
                  id="fb-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  maxLength={100}
                  className="field"
                />
              </div>

              <fieldset>
                <legend className="field-label">Rating</legend>
                <div role="radiogroup" aria-label="Rating" className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      role="radio"
                      aria-checked={rating === star}
                      aria-label={`${star} out of 5`}
                      onClick={() => setRating(star)}
                      className="group/star p-1.5 transition-transform active:scale-95"
                    >
                      <Star
                        className={cn(
                          "h-8 w-8 transition-colors",
                          star <= rating ? "text-primary" : "text-border group-hover/star:text-muted-foreground",
                        )}
                        weight={star <= rating ? "fill" : "regular"}
                      />
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="fb-text" className="field-label">
                  Feedback
                </label>
                <textarea
                  id="fb-text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What did you think of the workshop?"
                  maxLength={1000}
                  rows={4}
                  className="field resize-none"
                />
              </div>

              <Button type="submit" size="lg" disabled={submitting}>
                <PaperPlaneTilt weight="bold" />
                {submitting ? "Submitting…" : "Submit feedback"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Workshop;
