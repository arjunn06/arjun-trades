import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  name: string;
  rating: number;
  review: string;
  created_at: string;
}

const RedPillReviewsWall = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("red_pill_reviews")
      .select("id, name, rating, review, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(24)
      .then(({ data }) => {
        if (cancelled) return;
        setReviews((data as Review[]) ?? []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <section className="relative px-6 py-20 md:py-28 border-t border-border">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-semibold mb-4">
            Real Words. Real Students.
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground">
            What the Red Pill students are saying
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.4) }}
              className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 hover:border-primary/40 transition-colors"
            >
              <Quote className="absolute top-4 right-4 w-6 h-6 text-primary/20" />
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`w-4 h-4 ${
                      n <= r.rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-foreground text-sm md:text-base leading-relaxed mb-5 whitespace-pre-line">
                {r.review}
              </p>
              <p className="text-muted-foreground text-sm font-medium">
                — {r.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RedPillReviewsWall;
