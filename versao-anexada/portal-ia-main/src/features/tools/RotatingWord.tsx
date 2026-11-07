import { useEffect, useState, type RefObject } from "react";
import { CELL, lettersOf, markPaths, wordWidth } from "@/components/catalyst-mark";
import { usePlayGate } from "@/hooks/use-play-gate";
import { cn } from "@/lib/utils";
import { firstStep, nextStep, type WordStep } from "./rotating-word";

const WORDS = ["CLAUDE CODE", "CODEX", "AGENTES DE IA"] as const;
const SPOKEN = "Claude Code, Codex e agentes de IA";

const DRAWN = WORDS.map((word) =>
  lettersOf(word).map(({ column, rows }) => ({ blocks: markPaths(rows, column).blocks, end: column + Math.max(...rows.map((row) => [...row].length)) })),
);
// The width of the longest word and of the caret after it, kept for every word, so the word that changes never moves the page.
const COLUMNS = Math.max(...WORDS.map(wordWidth)) + 3;
const HEIGHT = 6 * CELL.height;

// The word in pixels that writes itself and erases itself after "pronto para", as the top of a product: one word for each agent the
// catalyst prepares the project for, in a cycle. It plays when the gate lets it, and holds under the pointer and the focus of the
// part of the page around it, and stops while `stopped`, which the button of the top of the page turns on: it never stops by itself
// (WCAG 2.2.2), and a phone has no pointer to hold it. With reduced motion, the first word stands still. Whoever cannot see it reads
// the three names.
export function RotatingWord({ gate, stopped, className }: { gate: RefObject<HTMLElement | null>; stopped: boolean; className?: string }) {
  const [still] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [step, setStep] = useState<WordStep>(() => firstStep(WORDS));
  const { running, held } = usePlayGate(gate, still);

  useEffect(() => {
    if (!running || stopped) return;
    const next = nextStep(WORDS, step);
    const timer = window.setTimeout(() => setStep(next.step), next.delay);
    return () => window.clearTimeout(timer);
  }, [running, stopped, step]);

  const letters = DRAWN[step.word]?.slice(0, step.shown) ?? [];
  const caret = (letters.at(-1)?.end ?? 0) + 1;
  return (
    <span className={cn("inline-flex items-center gap-[0.35em] whitespace-nowrap align-middle text-terminal-copper", className)}>
      <span className="sr-only">{SPOKEN}</span>
      <span aria-hidden>›</span>
      <svg aria-hidden data-word={WORDS[step.word]} viewBox={`0 0 ${COLUMNS * CELL.width} ${HEIGHT}`} className="block h-[0.9em] w-auto">
        <path d={letters.map((l) => l.blocks).join("")} className="fill-current" />
        {!still && <rect x={caret * CELL.width} width={CELL.width * 1.5} height={HEIGHT} className={cn("fill-current", !held && !stopped && "animate-caret")} />}
      </svg>
    </span>
  );
}
