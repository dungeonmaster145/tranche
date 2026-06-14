import { useEffect, useRef, useState } from "react";

/**
 * CountUp — eases a displayed number toward `value` whenever it changes.
 * `format` turns the raw number into the string shown (e.g. money/percent).
 * Respects prefers-reduced-motion by snapping instantly.
 */
export default function CountUp({ value, format = (n) => Math.round(n).toString(), duration = 650, className, style }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduce = typeof window !== "undefined"
      && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = fromRef.current;
    const to = value;
    if (reduce || from === to) { setDisplay(to); fromRef.current = to; return; }

    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <span className={className} style={style}>{format(display)}</span>;
}
