import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const reviewSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty({ message: "Name is required" })
    .max(80, { message: "Name must be under 80 characters" }),
  rating: z.number().int().min(1).max(5),
  review: z
    .string()
    .trim()
    .nonempty({ message: "Please write a short review" })
    .max(1000, { message: "Review must be under 1000 characters" }),
});

const RedPillReviews = () => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = reviewSchema.safeParse({ name, rating, review });
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      toast({
        title: "Check your review",
        description: first ?? "Please fill all fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("red_pill_reviews").insert({
      name: parsed.data.name,
      rating: parsed.data.rating,
      review: parsed.data.review,
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: "Couldn't submit",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    setName("");
    setRating(0);
    setReview("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Share your Red Pill review | Arjun Trades</title>
        <meta
          name="description"
          content="Red Pill students — share your honest review of the trading mentorship classes."
        />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />

      <section className="relative px-6 py-20 md:py-28">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-primary/10 blur-[140px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-primary uppercase tracking-[0.3em] text-xs font-semibold mb-4">
              Red Pill Students
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
              Tell us how the classes are going
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Your honest words help fellow traders take the leap. Drop a review
              — it'll appear on the Blueprint page.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-primary/30 bg-card/60 backdrop-blur-xl p-10 text-center"
            >
              <h2 className="font-display font-bold text-2xl text-foreground mb-3">
                Thank you 🙏
              </h2>
              <p className="text-muted-foreground mb-6">
                Your review has been received. It'll show up on the Blueprint
                page shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                Submit another review <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 md:p-8 space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. Arun K."
                  className="w-full rounded-lg bg-background border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = (hover || rating) >= n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                        className="p-1 transition-transform hover:scale-110"
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            active
                              ? "fill-primary text-primary"
                              : "text-muted-foreground/40"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your review
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  maxLength={1000}
                  rows={5}
                  placeholder="What changed in your trading? What stood out about the classes?"
                  className="w-full rounded-lg bg-background border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {review.length}/1000
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:brightness-110 transition-all duration-300 shadow-[0_0_40px_hsl(var(--primary)/0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting…" : "Submit Review"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  );
};

export default RedPillReviews;
