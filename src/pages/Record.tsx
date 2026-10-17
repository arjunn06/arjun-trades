import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowUpRight } from "@phosphor-icons/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import TextLink from "@/components/TextLink";
import { formatRecordDate, useLivestreamRecord, useRecordHistory } from "@/hooks/use-livestream-record";
import {
  HOME_DESCRIPTION_STATIC,
  RECORD_CAVEAT,
  RECORD_FOOTNOTE,
  RECORD_SINCE_LABEL,
  RECORD_TITLE,
  SITE,
  YOUTUBE_STREAMS_URL,
  recordDescription,
  tradesOf,
  winRatePercent,
} from "@/lib/record-text";

const ease = [0.16, 1, 0.3, 1] as const;

const dayLabel = (d: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`));

const Record = () => {
  const record = useLivestreamRecord(true);
  const history = useRecordHistory();

  const trades = tradesOf(record);
  const rate = winRatePercent(record);
  const updated = formatRecordDate(record.lastUpdated);
  // Numbers only go into the page's title tags once real ones have loaded, never the fallback.
  const description = record.loaded ? recordDescription(record) : HOME_DESCRIPTION_STATIC;

  return (
    <div className="min-h-[100dvh]">
      <Helmet>
        <title>{RECORD_TITLE}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE}/record`} />
        <meta property="og:title" content={RECORD_TITLE} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE}/record`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={RECORD_TITLE} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <Header />
      <main id="main">
        <section className="shell pb-10 pt-10 sm:pt-16">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="type-display text-[clamp(3.25rem,10vw,8.5rem)]"
          >
            Public livestream record
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="type-lead mt-6 max-w-2xl text-muted-foreground"
          >
            <strong className="font-semibold text-foreground">{rate}% win rate</strong> across {trades} logged trades,
            taken from Arjun IFVG's public YouTube livestreams since {RECORD_SINCE_LABEL}.
          </motion.p>
        </section>

        <section className="shell">
          <Reveal>
            <div className="grid gap-px border border-panel-border bg-panel-border text-panel-foreground sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Win rate", value: rate, suffix: "%", accent: true },
                { label: "Wins", value: record.wins },
                { label: "Losses", value: record.losses },
                { label: "Trades", value: trades },
              ].map((s) => (
                <div key={s.label} className="bg-panel p-7 sm:p-8">
                  <p className="type-label text-panel-muted">{s.label}</p>
                  <p
                    className={`type-display type-figure mt-3 flex items-start text-[clamp(3.5rem,7vw,5.5rem)] ${s.accent ? "text-signal" : ""}`}
                  >
                    <CountUp to={s.value} />
                    {s.suffix && (
                      <span className="mt-[0.12em] text-[0.5em]" aria-hidden>
                        {s.suffix}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
            <p className="type-label mt-4 text-muted-foreground">
              {updated ? `Last updated ${updated}. ` : ""}
              Machine-readable: <a className="underline underline-offset-4" href="/stats.json">/stats.json</a>
            </p>
          </Reveal>
        </section>

        <section className="shell grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <h2 className="type-title text-[clamp(1.75rem,3.5vw,2.75rem)]">How the record is counted</h2>
            <p className="mt-5 max-w-[60ch] text-[1.0625rem] text-muted-foreground">{RECORD_FOOTNOTE}</p>
            <p className="mt-4 max-w-[60ch] text-[1.0625rem] text-muted-foreground">
              A trade counts as a win or a loss. The win rate is wins divided by all trades, rounded to a whole number.
            </p>
            <div className="mt-6">
              <TextLink href={YOUTUBE_STREAMS_URL}>Watch the public livestreams</TextLink>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-6">
            <h2 className="type-title text-[clamp(1.75rem,3.5vw,2.75rem)]">What a win rate does not show</h2>
            <p className="mt-5 max-w-[60ch] text-[1.0625rem] text-muted-foreground">{RECORD_CAVEAT}</p>
          </Reveal>
        </section>

        <section className="shell pb-16 sm:pb-20">
          <Reveal>
            <h2 className="type-title text-[clamp(1.75rem,3.5vw,2.75rem)]">Recent days</h2>
            {history.days.length === 0 && !history.opening ? (
              <p className="mt-6 text-muted-foreground">
                {history.loaded ? "No daily results have been logged yet." : "Loading the daily results."}
              </p>
            ) : (
              <div className="mt-6 overflow-x-auto border-t border-foreground">
                <table className="w-full min-w-[22rem] text-left">
                  <caption className="sr-only">Wins and losses for each day, newest first</caption>
                  <thead>
                    <tr className="type-label text-muted-foreground">
                      <th scope="col" className="py-3 pr-4 font-medium">Day</th>
                      <th scope="col" className="px-4 py-3 text-right font-medium">Wins</th>
                      <th scope="col" className="py-3 pl-4 text-right font-medium">Losses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.days.slice(0, 30).map((d) => (
                      <tr key={d.date} className="border-t border-border">
                        <th scope="row" className="py-3 pr-4 font-medium">{dayLabel(d.date)}</th>
                        <td className="type-mono px-4 py-3 text-right">{d.wins}</td>
                        <td className="type-mono py-3 pl-4 text-right">{d.losses}</td>
                      </tr>
                    ))}
                    {history.opening && (
                      <tr className="border-t border-border text-muted-foreground">
                        <th scope="row" className="py-3 pr-4 font-medium">
                          Opening record, {RECORD_SINCE_LABEL} to {dayLabel(history.opening.date)}
                        </th>
                        <td className="type-mono px-4 py-3 text-right">{history.opening.wins}</td>
                        <td className="type-mono py-3 pl-4 text-right">{history.opening.losses}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {history.days.length > 30 && (
              <p className="type-label mt-3 text-muted-foreground">Showing the latest 30 days. Totals include every entry.</p>
            )}
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
              <TextLink href={YOUTUBE_STREAMS_URL}>Here's proof</TextLink>
              <TextLink to="/join">Follow Arjun IFVG</TextLink>
              <a
                href={`${SITE}/stats.json`}
                className="group/link inline-flex items-center gap-2 font-semibold text-foreground underline decoration-border decoration-2 underline-offset-[6px] transition-colors hover:decoration-primary"
              >
                Get the data as JSON
                <ArrowUpRight className="h-4 w-4" weight="bold" />
              </a>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Record;
