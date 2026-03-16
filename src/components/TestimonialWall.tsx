import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
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

const SCROLL_SPEED = 60; // seconds per loop cycle

const ScrollColumn = ({
  testimonials,
  direction,
}: {
  testimonials: Testimonial[];
  direction: "up" | "down";
}) => {
  // Duplicate items for seamless loop
  const items = [...testimonials, ...testimonials];
  const totalHeight = testimonials.length * CARD_HEIGHT;

  return (
    <div className="relative h-[540px] overflow-hidden">
      {/* Fade masks */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex flex-col gap-4"
        animate={{
          y: direction === "up" ? [0, -totalHeight] : [-totalHeight, 0],
        }}
        transition={{
          y: {
            duration: SCROLL_SPEED,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {items.map((t, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between"
            style={{ minHeight: CARD_HEIGHT - 16 }}
          >
            <p className="text-foreground text-sm leading-relaxed line-clamp-4">
              "{t.feedback}"
            </p>

            <div className="flex items-center gap-3 pt-3 mt-auto">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase shrink-0">
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
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const TestimonialWall = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase
      .from("workshop_feedback")
      .select("name, rating, feedback")
      .order("created_at", { ascending: false })
      .limit(18)
      .then(({ data }) => {
        if (data) setTestimonials(data);
      });
  }, []);

  // Split into 3 columns
  const columns = useMemo(() => {
    const cols: Testimonial[][] = [[], [], []];
    testimonials.forEach((t, i) => cols[i % 3].push(t));
    return cols;
  }, [testimonials]);

  if (testimonials.length === 0) return null;

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

          <motion.div variants={fadeUp} custom={2} className="grid md:grid-cols-3 gap-4">
            {columns.map((col, i) =>
              col.length > 0 ? (
                <ScrollColumn
                  key={i}
                  testimonials={col}
                  direction={i % 2 === 0 ? "up" : "down"}
                />
              ) : null
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialWall;
