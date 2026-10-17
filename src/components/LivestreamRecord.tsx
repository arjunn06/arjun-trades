import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { formatRecordDate, useLivestreamRecord } from "@/hooks/use-livestream-record";
import { RECORD_FOOTNOTE, YOUTUBE_STREAMS_URL } from "@/lib/record-text";

const LivestreamRecord = () => {
  const ref = useRef<HTMLDivElement>(null);
  // Listen for live updates only while the card is near the screen.
  const onScreen = useInView(ref, { margin: "200px 0px" });
  const { wins, losses, lastUpdated } = useLivestreamRecord(onScreen);

  const total = wins + losses;
  const winShare = total > 0 ? (wins / total) * 100 : 0;
  // The source data is approximate, so show a whole number (88 of 128 is 68.75%, shown as 69%).
  const winRate = Math.round(winShare);
  const updated = formatRecordDate(lastUpdated);

  return (
    <section id="record" className="scroll-mt-20 py-8 sm:py-12">
      <div className="shell" ref={ref}>
        <Reveal>
          <div className="border border-panel-border bg-panel p-7 text-panel-foreground sm:p-9 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
              {/* Win rate: the headline number */}
              <div className="lg:col-span-5">
                <h2 className="type-title text-[clamp(1.75rem,3vw,2.5rem)]">Public livestream record</h2>
                <p className="type-display type-figure mt-5 flex items-start text-[clamp(5.5rem,10vw,8.5rem)] text-signal">
                  <CountUp to={winRate} />
                  <span className="mt-[0.12em] text-[0.5em]" aria-hidden>
                    %
                  </span>
                  <span className="sr-only">%</span>
                </p>
                <p className="type-label mt-2 text-panel-muted">Win rate</p>
              </div>

              {/* Wins and total trades on one short line, with the win share bar below (losses still feed the win rate) */}
              <div className="lg:col-span-7">
                <dl className="flex flex-wrap items-baseline gap-x-10 gap-y-3">
                  <div className="flex items-baseline gap-3">
                    <dt className="order-2 text-lg text-panel-muted">wins</dt>
                    <dd className="type-heading type-figure order-1 text-[clamp(2.5rem,5vw,3.5rem)]">
                      <CountUp to={wins} />
                    </dd>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <dt className="order-2 text-lg text-panel-muted">trades</dt>
                    <dd className="type-heading type-figure order-1 text-[clamp(1.5rem,3vw,2rem)] text-panel-muted">{total}</dd>
                  </div>
                </dl>

                <div className="mt-5" aria-hidden>
                  <div className="h-2 w-full overflow-hidden bg-panel-foreground/20">
                    {/* Full-width fill scaled to the win share: transform only, so live changes animate smoothly. */}
                    <motion.div
                      className="h-full w-full origin-left bg-signal"
                      initial={{ scaleX: 0 }}
                      animate={onScreen ? { scaleX: winShare / 100 } : undefined}
                      transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-panel-border pt-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-xl">
                <p className="text-sm leading-relaxed text-panel-muted">{RECORD_FOOTNOTE}</p>
                {updated && <p className="type-label mt-2 text-panel-muted">Last updated {updated}</p>}
              </div>
              <a
                href={YOUTUBE_STREAMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Here's proof: watch the public livestreams on YouTube"
                className="group/link inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-panel-foreground underline decoration-panel-border decoration-2 underline-offset-[6px] transition-colors hover:decoration-signal"
              >
                Here's proof
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                  weight="bold"
                />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default LivestreamRecord;
