import { useEffect, useRef, useState } from "react";

export function useTypingProgress(started: boolean, duration: number) {
  const [reducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [progress, setProgress] = useState(reducedMotion ? 1 : 0);
  const finished = useRef(reducedMotion);

  useEffect(() => {
    if (!started || finished.current) return;

    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const next = Math.min(1, (now - startedAt) / duration);
      setProgress(next);
      if (next < 1) frame = requestAnimationFrame(tick);
      else finished.current = true;
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, duration]);

  return progress;
}
