import type { ComponentType } from "react";
import { CurrencyInr, HandHeart, Trophy, Users, VideoCamera } from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";
import Reveal from "@/components/Reveal";
import { ARENA, formatINR } from "@/data/arena";

interface TransparencyProps {
  /** Confirmed entries so far, or null while loading or unavailable. */
  confirmed: number | null;
}

interface Line {
  icon: ComponentType<IconProps>;
  title: string;
  detail: string;
  /** Present for the two figures we can show live. Otherwise `later` says when it will be shown. */
  value?: string;
  later?: string;
  note?: string;
}

const Transparency = ({ confirmed }: TransparencyProps) => {
  const live = confirmed !== null;

  const lines: Line[] = [
    {
      icon: Users,
      title: "Registrations",
      detail: "How many people joined the Arena.",
      value: live ? String(confirmed) : undefined,
      later: "Updates live as entries come in",
    },
    {
      icon: CurrencyInr,
      title: "Total collected",
      detail: "Everything the players paid in.",
      value: live ? formatINR(confirmed * ARENA.entryFee) : undefined,
      later: "Updates live as entries come in",
    },
    {
      icon: Trophy,
      title: "Activation fee",
      detail: "How much of it goes to the winner's Apex activation fee.",
      later: "Shown once it's paid",
    },
    {
      icon: HandHeart,
      title: "Charity and donations",
      detail: "How much goes to people in need.",
      later: "Shown once it's donated",
    },
    {
      icon: VideoCamera,
      title: "Who donates, and to whom",
      detail: "A short video clip of the donation being made.",
      later: "Shown with the donation",
      note: "The receiver's face is never shown, to protect their privacy.",
    },
  ];

  return (
    <section id="transparency" className="shell scroll-mt-20 py-6 sm:py-10">
      <div className="bg-panel p-6 text-panel-foreground sm:p-12 lg:p-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="type-label rule-mark text-panel-muted">Transparency</p>
              <h2 className="type-title mt-6 text-[clamp(2.5rem,5.5vw,4.5rem)]">
                You'll see <span className="text-signal">where it went.</span>
              </h2>
              <p className="mt-8 max-w-md text-[1.0625rem] text-panel-muted">
                This only works if you can trust it. So I'll show you the numbers and the donation itself, not just tell
                you about them.
              </p>
              <p className="mt-5 max-w-md text-[1.0625rem] text-panel-muted">
                Anyone who put in {formatINR(ARENA.entryFee)} should be able to see exactly what it did.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7">
            <ol className="border-b border-panel-border">
              {lines.map((l, i) => {
                const Icon = l.icon;
                return (
                  <li key={l.title} className="flex gap-5 border-t border-panel-border py-6 sm:gap-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-panel-border text-signal">
                      <Icon className="h-5 w-5" weight="bold" aria-hidden="true" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-6 gap-y-3">
                      <div className="min-w-0">
                        <h3 className="type-heading text-xl">
                          <span className="type-mono mr-2 text-sm text-panel-muted">0{i + 1}</span>
                          {l.title}
                        </h3>
                        <p className="mt-1 max-w-sm text-[0.9375rem] text-panel-muted">{l.detail}</p>
                        {l.value === undefined && l.later && (
                          <p className="type-label mt-3 text-panel-muted">{l.later.toUpperCase()}</p>
                        )}
                        {l.note && (
                          <p className="type-label mt-3 inline-block border border-signal px-2.5 py-1.5 text-signal">
                            {l.note}
                          </p>
                        )}
                      </div>
                      {l.value !== undefined && (
                        <p className="type-display text-[clamp(2rem,4vw,3rem)] tabular-nums">{l.value}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
            {live && (
              <p className="type-label mt-4 text-panel-muted">
                THE FIRST TWO FIGURES UPDATE LIVE AS ENTRIES ARE CONFIRMED
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Transparency;
