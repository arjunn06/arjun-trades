import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountUpProps {
  to: number;
  className?: string;
}

/**
 * Counts up to `to` the first time it scrolls into view, then animates from the number on screen to any new
 * value (so a live update ticks 88 to 89 rather than restarting from 0). Writes straight to the DOM node, so it
 * never re-renders React per frame. Screen readers get the final number only, and reduced-motion users see it
 * immediately.
 */
const CountUp = ({ to, className }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      shown.current = to;
      el.textContent = String(to);
      return;
    }
    if (!inView) return;
    const controls = animate(shown.current, to, {
      duration: shown.current === 0 ? 1.6 : 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        shown.current = v;
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  // An invisible copy of the final number holds the width, so the digits count inside a fixed box.
  return (
    <span className="relative inline-block">
      <span className="sr-only">{to}</span>
      <span aria-hidden className="invisible">
        {to}
      </span>
      <span ref={ref} aria-hidden className={cn("absolute right-0 top-0", className)}>
        0
      </span>
    </span>
  );
};

export default CountUp;
