import { useEffect, useRef, useState } from "react";
import { usePlayGate } from "@/hooks/use-play-gate";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { advance, finished, START, type Progress, type ScriptLine } from "./terminal-script";

// The first key waits for the opening of the page to settle.
const START_DELAY_MS = 700;

// The demo runs only when the gate lets it (usePlayGate), and holds its place in between. With reduced motion it shows the whole
// conversation at once, with nothing that moves.
export function useTerminalDemo(script: ScriptLine[]) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState<Progress>(() => (still ? finished(script) : START));
  const { running, held } = usePlayGate(ref, still || paused);
  const first = useRef(true);

  useEffect(() => {
    if (!running) return;
    const step = advance(script, progress, Math.random);
    const timer = window.setTimeout(
      () => {
        first.current = false;
        setProgress(step.progress);
      },
      step.delay + (first.current ? START_DELAY_MS : 0),
    );
    return () => window.clearTimeout(timer);
  }, [running, progress, script]);

  return { ref, progress: still ? finished(script) : progress, still, paused, setPaused, held: held || paused || still };
}
