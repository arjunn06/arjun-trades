import Reveal from "@/components/Reveal";
import TextLink from "@/components/TextLink";
import { everyone } from "@/data/testimonials";

interface ReviewsNoteProps {
  /** Which student to quote. */
  id: string;
  /** A different excerpt of the same message. It must be a verbatim part of what the student wrote. */
  quote?: string;
}

/** One student quote with a link to the full wall. Placed on pages where a visitor is deciding whether to trust the teaching. */
const ReviewsNote = ({ id, quote }: ReviewsNoteProps) => {
  const t = everyone.find((x) => x.id === id);
  if (!t) return null;
  const text = quote ?? t.highlight ?? t.body[0];

  return (
    <section aria-labelledby={`reviews-note-${id}`} className="py-12 sm:py-16">
      <div className="shell">
        <Reveal className="grid gap-6 border-t border-foreground pt-8 lg:grid-cols-12 lg:gap-12">
          <p id={`reviews-note-${id}`} className="type-label rule-mark uppercase text-muted-foreground lg:col-span-3">
            What students say
          </p>
          <figure className="lg:col-span-8 lg:col-start-5">
            <blockquote className="type-heading max-w-[34ch] text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.2] [text-wrap:pretty]">
              “{text}”
            </blockquote>
            <figcaption className="mt-5 text-muted-foreground">
              <span className="font-semibold text-foreground">{t.name}</span>, {t.role ?? "Red Pill Student"}
            </figcaption>
            <TextLink to="/testimonials" className="mt-6">
              Read all {everyone.length} student reviews
            </TextLink>
          </figure>
        </Reveal>
      </div>
    </section>
  );
};

export default ReviewsNote;
