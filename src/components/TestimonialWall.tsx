import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  name: string;
  rating: number;
  feedback: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const TestimonialWall = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase
      .from("workshop_feedback")
      .select("name, rating, feedback")
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (data) setTestimonials(data);
      });
  }, []);

  if (testimonials.length === 0) return null;

  // Split into 3 columns for masonry effect
  const columns: Testimonial[][] = [[], [], []];
  testimonials.forEach((t, i) => columns[i % 3].push(t));

  return (
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
            Don't Just Take My Word For It
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
          >
            Real feedback from workshop attendees
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={2}
            className="columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:balance]"
          >
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                custom={idx}
                className="break-inside-avoid mb-4 rounded-2xl border border-border bg-card p-5 space-y-3"
              >
                    <p className="text-foreground text-sm leading-relaxed">
                      "{t.feedback}"
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase">
                        {t.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-foreground block">
                          {t.name}
                        </span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= t.rating
                                  ? "text-primary fill-primary"
                                  : "text-muted-foreground/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialWall;
