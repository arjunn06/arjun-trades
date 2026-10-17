import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { formatRecordDate, useLivestreamRecord } from "@/hooks/use-livestream-record";

/** The date the record starts from. The totals themselves come from the database (see the admin panel). */
const TRACKING_SINCE = "May 2026";

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
    <section className="py-8 sm:py-12">
      <div className="shell" ref={ref}>
        <Reveal>
          <div className="border border-panel-border bg-panel p-7 text-panel-foreground sm:p-10 lg:p-14">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Win rate: the headline number */}
              <div className="flex flex-col justify-between gap-10 lg:col-span-6">
                <h2 className="type-title max-w-[12ch] text-[clamp(2rem,4vw,3.25rem)]">Public livestream record</h2>
                <div>
                  <p className="type-display type-figure flex items-start text-[clamp(7rem,17vw,13rem)] text-signal">
                    <CountUp to={winRate} />
                    <span className="mt-[0.12em] text-[0.5em]" aria-hidden>
                      %
                    </span>
                    <span className="sr-only">%</span>
                  </p>
                  <p className="type-label mt-3 text-panel-muted">Win rate</p>
                </div>
              </div>

              {/* Wins and losses */}
              <div className="flex flex-col justify-end lg:col-span-6">
                <dl>
                  <div className="flex items-baseline justify-between border-t border-panel-border py-5">
                    <dt className="text-lg text-panel-muted">Wins</dt>
                    <dd className="type-display type-figure text-[clamp(4.5rem,9vw,7rem)]">
                      <CountUp to={wins} />
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-panel-border py-5">
                    <dt className="text-lg text-panel-muted">Losses</dt>
                    <dd className="type-display type-figure text-[clamp(4.5rem,9vw,7rem)] text-panel-muted">
                      <CountUp to={losses} />
                    </dd>
                  </div>
                </dl>

                <div className="mt-4" aria-hidden>
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
                <p className="type-label mt-3 text-panel-muted">
                  {wins} wins out of {total} trades
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4 border-t border-panel-border pt-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-xl">
                <p className="text-sm leading-relaxed text-panel-muted">
                  Taken from all public livestreams on YouTube since {TRACKING_SINCE}. Approximately the first 100
                  trades were summarised by AI from the public livestreams. After that, results are logged manually
                  every day. Real results can vary slightly.
                </p>
                {updated && <p className="type-label mt-3 text-panel-muted">Last updated {updated}</p>}
              </div>
              <a
                href="https://www.youtube.com/@arjun_ifvg/streams"
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
