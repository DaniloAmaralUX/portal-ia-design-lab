import { DURATION } from "@/lib/motion";

// Where the line that changes is: which word, how many of its letters are on screen, and whether they are coming or going.
export type WordStep = { word: number; shown: number; erasing: boolean };

// The line opens with the first word whole, so it reads from the first paint, and the motion starts as that word goes.
export const firstStep = (words: readonly string[]): WordStep => ({ word: 0, shown: words[0]?.length ?? 0, erasing: false });

// The pace, in the time tokens of the site: a letter comes in at the fast step and goes at half of it, the whole word stays six slow
// steps, and the next word starts a slow step after the last one went.
export const PACE = { type: DURATION.fast, erase: DURATION.fast / 2, hold: DURATION.slow * 6, gap: DURATION.slow } as const;

// The next step of the line, and how long the current one stays before it.
export function nextStep(words: readonly string[], step: WordStep): { step: WordStep; delay: number } {
  const length = words[step.word]?.length ?? 0;
  if (!step.erasing && step.shown < length) return { step: { ...step, shown: step.shown + 1 }, delay: PACE.type };
  if (!step.erasing) return { step: { ...step, erasing: true }, delay: PACE.hold };
  if (step.shown > 0) return { step: { ...step, shown: step.shown - 1 }, delay: PACE.erase };
  return { step: { word: (step.word + 1) % words.length, shown: 0, erasing: false }, delay: PACE.gap };
}
