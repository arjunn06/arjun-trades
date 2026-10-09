import { Trophy } from "@phosphor-icons/react";
import { MATCHES, type Match, type MatchId } from "@/data/arena";
import { cn } from "@/lib/utils";

/*
  The playoff bracket. Sits on a dark panel, so it uses the panel tokens.
  Desktop: a fixed-height stage where every position is a percentage, with one SVG of connectors on top.
  The SVG uses a 100x100 box stretched to the stage and non-scaling strokes, so lines stay crisp at any width.
  Below lg: a stacked list built from the same data.
*/

const byId = Object.fromEntries(MATCHES.map((m) => [m.id, m])) as Record<MatchId, Match>;

// Stage coordinates, in percent of the stage. Column x positions: 0, 20, 48, 76.
const CARDS: { id: MatchId; left: number; width: number; centerY: number }[] = [
  { id: "playoff-1", left: 20, width: 22, centerY: 23 },
  { id: "eliminator", left: 20, width: 22, centerY: 77 },
  { id: "playoff-2", left: 48, width: 22, centerY: 50 },
  { id: "final", left: 76, width: 24, centerY: 50 },
];

const SEEDS = [
  { rank: 1, centerY: 11 },
  { rank: 2, centerY: 35 },
  { rank: 3, centerY: 65 },
  { rank: 4, centerY: 89 },
];

type LineKind = "seed" | "win" | "second";

const LINES: { d: string; kind: LineKind }[] = [
  { d: "M14 11H17V23H20", kind: "seed" },
  { d: "M14 35H17V23", kind: "seed" },
  { d: "M14 65H17V77H20", kind: "seed" },
  { d: "M14 89H17V77", kind: "seed" },
  { d: "M42 28H45V45H48", kind: "second" },
  { d: "M42 72H45V55H48", kind: "win" },
  { d: "M42 18H73V44H76", kind: "win" },
  { d: "M70 50H73V56H76", kind: "win" },
];

const lineStyle: Record<LineKind, { stroke: string; dash?: string; opacity: number }> = {
  seed: { stroke: "hsl(var(--panel-muted))", opacity: 0.45 },
  win: { stroke: "hsl(var(--signal))", opacity: 1 },
  second: { stroke: "hsl(var(--panel-muted))", dash: "5 5", opacity: 0.9 },
};

const COLUMNS = [
  { label: "League top 4", left: 0 },
  { label: "Round 1", left: 20 },
  { label: "Round 2", left: 48 },
  { label: "Final", left: 76 },
];

const Outcomes = ({ match }: { match: Match }) => (
  <dl className="mt-3 space-y-1.5 border-t border-panel-border pt-3 text-[0.8125rem] leading-snug">
    <div className="flex gap-2">
      <dt className="type-label w-9 shrink-0 text-signal">WIN</dt>
      <dd className="text-panel-foreground">{match.win}</dd>
    </div>
    <div className="flex gap-2">
      <dt className="type-label w-9 shrink-0 text-panel-muted">LOSE</dt>
      <dd className="text-panel-muted">{match.lose}</dd>
    </div>
  </dl>
);

const Bracket = () => (
  <div>
    {/* Desktop stage */}
    <div className="hidden lg:block" role="group" aria-label="Playoff bracket">
      <div className="relative h-7">
        {COLUMNS.map((c) => (
          <span
            key={c.label}
            className="type-label absolute top-0 text-panel-muted"
            style={{ left: `${c.left}%` }}
          >
            {c.label}
          </span>
        ))}
      </div>

      <div className="relative h-[540px]">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          {LINES.map((l) => (
            <path
              key={l.d}
              d={l.d}
              fill="none"
              stroke={lineStyle[l.kind].stroke}
              strokeOpacity={lineStyle[l.kind].opacity}
              strokeWidth={1.5}
              strokeDasharray={lineStyle[l.kind].dash}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {SEEDS.map((s) => (
          <div
            key={s.rank}
            className="absolute left-0 flex h-10 w-[14%] -translate-y-1/2 items-center justify-between border border-panel-border bg-panel px-3"
            style={{ top: `${s.centerY}%` }}
          >
            <span className="type-mono text-base font-semibold text-panel-foreground">#{s.rank}</span>
            <span className="type-label text-[0.6875rem] text-panel-muted">LEAGUE</span>
          </div>
        ))}

        {CARDS.map((c) => {
          const m = byId[c.id];
          const isFinal = c.id === "final";
          return (
            <article
              key={c.id}
              className={cn(
                "absolute -translate-y-1/2 border bg-panel p-4",
                isFinal ? "border-signal p-5" : "border-panel-border",
              )}
              style={{ left: `${c.left}%`, width: `${c.width}%`, top: `${c.centerY}%` }}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className={cn("type-heading", isFinal ? "text-[1.75rem]" : "text-xl")}>{m.label}</h3>
                {isFinal && <Trophy className="h-6 w-6 shrink-0 text-signal" weight="fill" aria-hidden="true" />}
              </div>
              <p className="mt-1 text-[0.875rem] leading-snug text-panel-muted">{m.matchup}</p>
              <Outcomes match={m} />
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.8125rem] text-panel-muted">
        <span className="inline-flex items-center gap-3">
          <svg width="28" height="2" aria-hidden="true">
            <line x1="0" y1="1" x2="28" y2="1" stroke="hsl(var(--signal))" strokeWidth="2" />
          </svg>
          Winner advances
        </span>
        <span className="inline-flex items-center gap-3">
          <svg width="28" height="2" aria-hidden="true">
            <line
              x1="0"
              y1="1"
              x2="28"
              y2="1"
              stroke="hsl(var(--panel-muted))"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
          </svg>
          Second life
        </span>
      </div>
    </div>

    {/* Stacked list below lg */}
    <ol className="lg:hidden">
      {MATCHES.map((m, i) => {
        const isFinal = m.id === "final";
        const last = i === MATCHES.length - 1;
        return (
          <li key={m.id} className="relative flex gap-5 pb-8 last:pb-0">
            {!last && <span aria-hidden="true" className="absolute bottom-0 left-[15px] top-9 w-px bg-panel-border" />}
            <span
              aria-hidden="true"
              className={cn(
                "type-mono relative z-10 flex h-8 w-8 shrink-0 items-center justify-center border text-sm font-semibold",
                isFinal
                  ? "border-signal bg-signal text-panel"
                  : "border-panel-border bg-panel text-panel-foreground",
              )}
            >
              {i + 1}
            </span>
            <div className={cn("min-w-0 flex-1 border p-4", isFinal ? "border-signal" : "border-panel-border")}>
              <h3 className="type-heading text-xl">{m.label}</h3>
              <p className="mt-1 text-[0.9375rem] leading-snug text-panel-muted">{m.matchup}</p>
              <Outcomes match={m} />
            </div>
          </li>
        );
      })}
    </ol>
  </div>
);

export default Bracket;
