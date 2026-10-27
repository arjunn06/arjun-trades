import { Fragment } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ArrowUpRight, Plus } from "@phosphor-icons/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { featured, wall, type DiscordTestimonial } from "@/data/testimonials";
import {
  TESTIMONIALS_DESCRIPTION,
  TESTIMONIALS_DISCLAIMER,
  TESTIMONIALS_KEYWORDS,
  TESTIMONIALS_TITLE,
  TESTIMONIALS_URL,
} from "@/lib/testimonials-seo";

const DISCORD_URL = "https://discord.gg/SCHeKKCa6c";
const ease = [0.16, 1, 0.3, 1] as const;

/** Stories that end in a payout or funded account. The rest are class feedback. */
const RESULT_IDS = ["singara-velan", "baskar"];
const everyone = [featured, ...wall];
const results = RESULT_IDS.map((id) => everyone.find((t) => t.id === id)!);
const feedback = wall.filter((t) => !RESULT_IDS.includes(t.id));

/** Figures Singara velan states in his post; shown beside his story. */
const featuredFacts = [
  { value: "June 2026", label: "joined The Red Pill" },
  { value: "$500", label: "first payout, 23 Oct 2026" },
  { value: "~$4,000", label: "in profits" },
];

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** Renders **bold** spans inside a plain string. */
const Inline = ({ text }: { text: string }) => (
  <>
    {text.split("**").map((part, i) =>
      i % 2 ? (
        <strong key={i} className="font-semibold text-foreground">
          {part}
        </strong>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      ),
    )}
  </>
);

const Body = ({ t }: { t: DiscordTestimonial }) => (
  <>
    {t.body.map((p, i) => (
      <Fragment key={i}>
        <p>
          <Inline text={p} />
        </p>
        {t.list?.after === i && (
          <ul className="list-[square] space-y-1.5 pl-5 marker:text-primary">
            {t.list.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </Fragment>
    ))}
  </>
);

/** One student: who they are on the left, the message on the right. */
const Entry = ({ t }: { t: DiscordTestimonial }) => {
  const quote = t.highlight ?? t.body[0];
  // When the whole message is the highlight there is nothing more to expand.
  const hasMore = t.body.join(" ") !== quote;

  return (
    <article className="grid gap-5 border-t border-foreground py-10 lg:grid-cols-12 lg:gap-12 lg:py-12">
      <header className="lg:col-span-3">
        <h3 className="type-heading text-2xl">{t.name}</h3>
        <p className="mt-1 text-muted-foreground">{t.role ?? "Red Pill Student"}</p>
        {t.date && (
          <p className="type-label mt-3 text-muted-foreground">
            <time dateTime={t.date}>{fmtDate(t.date)}</time>
            {t.edited && " · edited"}
          </p>
        )}
      </header>

      <div className="lg:col-span-8 lg:col-start-5">
        <blockquote lang={t.lang} className="type-heading max-w-[34ch] text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.2] [text-wrap:pretty]">
          “{quote}”
        </blockquote>

        {t.id === featured.id && (
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-border py-6 sm:grid-cols-3">
            {featuredFacts.map((f) => (
              <div key={f.value}>
                <dt className="type-figure type-heading text-2xl">{f.value}</dt>
                <dd className="mt-1 text-sm leading-snug text-muted-foreground">{f.label}</dd>
              </div>
            ))}
          </dl>
        )}

        {t.proof && (
          <a
            href={t.proof.src}
            target="_blank"
            rel="noopener noreferrer"
            className="group/p mt-8 block max-w-xl"
            aria-label={`${t.proof.caption}, open full size`}
          >
            <img
              src={t.proof.src}
              alt={t.proof.alt}
              width={1080}
              height={774}
              loading="lazy"
              className="w-full border border-border transition-colors group-hover/p:border-foreground"
            />
            <span className="type-label mt-2 block text-muted-foreground">{t.proof.caption}</span>
          </a>
        )}

        {hasMore && (
          <details className="group mt-8">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm font-semibold underline decoration-border decoration-2 underline-offset-4 hover:decoration-primary [&::-webkit-details-marker]:hidden">
              <Plus className="h-4 w-4 transition-transform group-open:rotate-45" weight="bold" aria-hidden />
              <span className="group-open:hidden">Read the full message</span>
              <span className="hidden group-open:inline">Hide full message</span>
            </summary>
            <div lang={t.lang} className="mt-6 max-w-[40rem] space-y-4 border-l-2 border-border pl-5 text-[1.0625rem] leading-[1.7] text-foreground/85">
              {t.title && <p className="type-heading text-xl text-foreground">{t.title}</p>}
              <Body t={t} />
            </div>
          </details>
        )}
      </div>
    </article>
  );
};

const Section = ({
  id,
  index,
  label,
  title,
  intro,
  items,
}: {
  id: string;
  index: string;
  label: string;
  title: string;
  intro: string;
  items: DiscordTestimonial[];
}) => (
  <section id={id} className="scroll-mt-24 py-12 sm:py-16" aria-labelledby={`${id}-title`}>
    <div className="shell">
      <Reveal>
        <p className="type-label rule-mark uppercase text-muted-foreground">
          {index} · {label}
        </p>
        <h2 id={`${id}-title`} className="type-title mt-5 max-w-[18ch] text-[clamp(2.25rem,5vw,4rem)]">
          {title}
        </h2>
        <p className="type-lead mt-4 max-w-xl text-muted-foreground">{intro}</p>
      </Reveal>

      <div className="mt-10 border-b border-border lg:mt-14">
        {items.map((t) => (
          <Reveal key={t.id}>
            <Entry t={t} />
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <div className="min-h-[100dvh]">
    {/* The structured data (a Review per student) is added on the server by functions/_lib/testimonials.ts. */}
    <Helmet>
      <title>{TESTIMONIALS_TITLE}</title>
      <meta name="description" content={TESTIMONIALS_DESCRIPTION} />
      <meta name="keywords" content={TESTIMONIALS_KEYWORDS} />
      <link rel="canonical" href={TESTIMONIALS_URL} />
      <meta property="og:title" content={TESTIMONIALS_TITLE} />
      <meta property="og:description" content={TESTIMONIALS_DESCRIPTION} />
      <meta property="og:url" content={TESTIMONIALS_URL} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={TESTIMONIALS_TITLE} />
      <meta name="twitter:description" content={TESTIMONIALS_DESCRIPTION} />
    </Helmet>

    <Header />

    <main id="main">
      <section className="shell pb-6 pt-10 sm:pt-16">
        <p className="type-label rule-mark mb-6 uppercase text-muted-foreground">
          Arjun IFVG reviews · Red Pill &amp; Blue Pill students
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="type-display max-w-[14ch] text-[clamp(3.5rem,11vw,8rem)]"
        >
          Real students. <span className="text-primary">Real words.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="type-lead mt-8 max-w-xl text-muted-foreground"
        >
          Messages from students in the community, shared as they wrote them. That includes the doubts and
          suggestions.
        </motion.p>

        <motion.nav
          aria-label="Sections"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <a
            href="#results"
            className="inline-flex h-11 items-center gap-2 border border-foreground px-5 text-sm font-semibold transition-colors hover:bg-foreground hover:text-background"
          >
            Results
            <span className="type-label text-muted-foreground">{results.length}</span>
          </a>
          <a
            href="#feedback"
            className="inline-flex h-11 items-center gap-2 border border-foreground px-5 text-sm font-semibold transition-colors hover:bg-foreground hover:text-background"
          >
            Class feedback
            <span className="type-label text-muted-foreground">{feedback.length}</span>
          </a>
        </motion.nav>
      </section>

      <Section
        id="results"
        index="01"
        label="Results"
        title="From paper trading to payouts"
        intro="Students who took the strategy to a funded account and a first payout."
        items={results}
      />

      <Section
        id="feedback"
        index="02"
        label="Class feedback"
        title="What students say about the class"
        intro="Thoughts on the strategy and the teaching, including what they'd like improved."
        items={feedback}
      />

      <section className="shell pb-8 pt-4">
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">{TESTIMONIALS_DISCLAIMER}</p>
        <Reveal>
          <div className="grid gap-8 border-t border-foreground pt-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <h2 className="type-title text-[clamp(2.25rem,5vw,4rem)]">Taken the class? Add your voice.</h2>
              <p className="type-lead mt-5 max-w-xl text-muted-foreground">
                Honest feedback, good or critical, helps the next student decide and helps me improve the class.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
              <Button asChild size="lg">
                <Link to="/red-pill/reviews">
                  Share your review
                  <ArrowRight weight="bold" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
                  Join the Discord
                  <ArrowUpRight weight="bold" />
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </main>

    <Footer />
  </div>
);

export default Testimonials;
