import { useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { ARENA, formatINR } from "@/data/arena";

/** Smallest entry count at which the example fee is fully covered is ~51; start just above it. */
const MIN = 60;
const MAX = 300;
const START = 101;

interface PoolExplainerProps {
  /** Confirmed entries so far, or null while loading or unavailable. */
  confirmed: number | null;
}

const Figure = ({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "primary";
}) => (
  <div className="border-t border-foreground pt-4">
    <dt className="type-label text-muted-foreground">{label}</dt>
    <dd
      className={
        tone === "primary"
          ? "type-display mt-2 text-[clamp(2rem,3.4vw,2.75rem)] tabular-nums text-primary"
          : "type-display mt-2 text-[clamp(2rem,3.4vw,2.75rem)] tabular-nums"
      }
    >
      {value}
    </dd>
  </div>
);

const PoolExplainer = ({ confirmed }: PoolExplainerProps) => {
  const [entries, setEntries] = useState(START);

  const total = entries * ARENA.entryFee;
  const activation = Math.min(total, ARENA.exampleActivationFee);
  const charity = total - activation;
  const activationShare = (activation / total) * 100;

  return (
    <div className="border border-foreground bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="type-label text-muted-foreground">TRY IT · IF THIS MANY TRADERS JOIN</p>
        {confirmed !== null && confirmed > 0 && (
          <p className="type-label text-foreground">
            <span className="text-primary">{confirmed}</span> confirmed so far
          </p>
        )}
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <output className="type-display text-[clamp(3.5rem,8vw,5.5rem)] tabular-nums" htmlFor="arena-pool-slider">
          {entries}
        </output>
        <span className="text-lg text-muted-foreground">
          entries × {formatINR(ARENA.entryFee)} = {formatINR(total)}
        </span>
      </div>

      <SliderPrimitive.Root
        id="arena-pool-slider"
        value={[entries]}
        onValueChange={([v]) => setEntries(v)}
        min={MIN}
        max={MAX}
        step={1}
        className="relative mt-6 flex h-8 w-full touch-none select-none items-center"
      >
        <SliderPrimitive.Track className="relative h-[3px] w-full grow bg-border">
          <SliderPrimitive.Range className="absolute h-full bg-foreground" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label="Number of entries"
          aria-valuetext={`${entries} entries, ${formatINR(total)} collected`}
          className="block h-7 w-3 border-2 border-foreground bg-primary transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring active:scale-y-110"
        />
      </SliderPrimitive.Root>

      <div className="mt-8" aria-hidden="true">
        <div className="flex h-5 w-full overflow-hidden">
          <div className="bg-primary transition-[width] duration-300 ease-out-expo" style={{ width: `${activationShare}%` }} />
          <div className="flex-1 bg-foreground" />
        </div>
        <div className="type-label mt-2 flex justify-between text-muted-foreground">
          <span>ACTIVATION FEE</span>
          <span>CHARITY</span>
        </div>
      </div>

      <dl className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-3">
        <Figure label="Activation fee" value={formatINR(activation)} tone="primary" />
        <Figure label="To charity" value={formatINR(charity)} />
        <Figure label="To Arjun" value="₹0" />
      </dl>

      <p className="mt-6 text-sm text-muted-foreground">
        An illustration, using {formatINR(ARENA.exampleActivationFee)} as the activation fee. The real fee is whatever Apex
        charges for the winner's account.
      </p>
    </div>
  );
};

export default PoolExplainer;
