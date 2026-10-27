import { useEffect, useRef, useState, type ReactNode } from "react";
import { Star } from "@phosphor-icons/react";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TestimonialItem {
  name: string;
  /** Omit for quotes that were not star-rated. */
  rating?: number;
  text: string;
  /** Shown under the name, e.g. "Red Pill Student". */
  role?: string;
  /** Proof image shown under the quote, such as a payout certificate. */
  proof?: { src: string; alt: string };
}

interface TestimonialsProps {
  title: string;
  subtitle?: string;
  items: TestimonialItem[];
  /** How many quotes to show before "Show more". */
  initial?: number;
  /** Rendered under the wall, e.g. a link to the full testimonials page. */
  footer?: ReactNode;
}

const Quote = ({ item }: { item: TestimonialItem }) => {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);
  const ref = useRef<HTMLQuoteElement>(null);

  // Only offer "Read more" when the text is actually cut off at this column width.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      if (!expanded) setClamped(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [item.text, expanded]);

  const long = clamped || expanded;

  return (
    <figure className="border-t border-foreground pt-5">
      {item.rating != null && (
        <div className="flex items-center gap-3 pb-4" aria-label={`Rated ${item.rating} out of 5`}>
          <div className="flex gap-0.5" aria-hidden>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn("h-4 w-4", s <= item.rating! ? "text-primary" : "text-border")}
                weight="fill"
              />
            ))}
          </div>
          <span className="type-label text-muted-foreground" aria-hidden>
            {item.rating}/5
          </span>
        </div>
      )}
      <blockquote
        ref={ref}
        className={cn("text-[1.0625rem] leading-[1.55] text-foreground", !expanded && "line-clamp-4")}
      >
        “{item.text}”
      </blockquote>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 text-sm font-semibold text-foreground underline decoration-border decoration-2 underline-offset-4 hover:decoration-primary"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
      {item.proof && (
        <img
          src={item.proof.src}
          alt={item.proof.alt}
          loading="lazy"
          className="mt-4 w-full border border-border"
        />
      )}
      <figcaption className="mt-4">
        <span className="font-semibold">{item.name}</span>
        {item.role && <span className="block text-sm text-muted-foreground">{item.role}</span>}
      </figcaption>
    </figure>
  );
};

const Testimonials = ({ title, subtitle, items, initial = 9, footer }: TestimonialsProps) => {
  const [showAll, setShowAll] = useState(false);
  if (items.length === 0) return null;

  const visible = showAll ? items : items.slice(0, initial);

  return (
    <section className="py-16 sm:py-20">
      <div className="shell">
        <Reveal>
          <h2 className="type-title max-w-[16ch] text-[clamp(2.5rem,6vw,4.75rem)]">{title}</h2>
          {subtitle && <p className="type-lead mt-5 max-w-xl text-muted-foreground">{subtitle}</p>}
        </Reveal>

        <div className="mt-14 columns-1 gap-x-12 md:columns-2 lg:columns-3">
          {visible.map((item, i) => (
            <Reveal key={`${item.name}-${i}`} delay={(i % 3) * 0.06} className="mb-12 break-inside-avoid">
              <Quote item={item} />
            </Reveal>
          ))}
        </div>

        {(items.length > initial && !showAll) || footer ? (
          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
            {items.length > initial && !showAll && (
              <Button variant="outline" onClick={() => setShowAll(true)}>
                Show all {items.length} reviews
              </Button>
            )}
            {footer}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Testimonials;
