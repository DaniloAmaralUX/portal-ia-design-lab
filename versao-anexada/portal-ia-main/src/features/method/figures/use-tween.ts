import { useEffect, useRef, useState } from "react";
import { between, type Point } from "./radar";

const DURATION_MS = 650;

// The points of a figure on their way to the target, in an ease out of 650 ms, the one the doctor's page uses. The figure that
// stands still, with reduced motion, takes the target at once and never calls this.
export function useTween(target: Point[]): Point[] {
  const [points, setPoints] = useState(target);
  const shown = useRef(target);
  useEffect(() => {
    const from = shown.current;
    if (from === target) return;
    let frame = 0;
    let start: number | null = null;
    const step = (time: number) => {
      start ??= time;
      const k = Math.min(1, (time - start) / DURATION_MS);
      const next = k === 1 ? target : between(from, target, 1 - (1 - k) ** 3);
      shown.current = next;
      setPoints(next);
      if (k < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return points;
}
