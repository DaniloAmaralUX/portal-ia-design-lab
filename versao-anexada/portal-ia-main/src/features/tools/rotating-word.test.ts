import { describe, expect, it } from "vitest";
import { firstStep, nextStep, PACE, type WordStep } from "./rotating-word";

const run = (words: string[], count: number) => {
  const steps: { step: WordStep; delay: number }[] = [];
  let step = firstStep(words);
  for (let i = 0; i < count; i++) {
    const next = nextStep(words, step);
    steps.push(next);
    step = next.step;
  }
  return steps;
};

describe("the line that changes", () => {
  it("opens with the first word whole, so it reads from the first paint", () => {
    expect(firstStep(["AB", "C"])).toEqual({ word: 0, shown: 2, erasing: false });
  });

  it("holds the word, erases it a letter at a time, and writes the next a letter at a time", () => {
    const steps = run(["AB", "C"], 6);
    expect(steps.map((s) => [s.step.word, s.step.shown, s.step.erasing])).toEqual([
      [0, 2, true],
      [0, 1, true],
      [0, 0, true],
      [1, 0, false],
      [1, 1, false],
      [1, 1, true],
    ]);
    expect(steps.map((s) => s.delay)).toEqual([PACE.hold, PACE.erase, PACE.erase, PACE.gap, PACE.type, PACE.hold]);
  });

  it("comes back to the first word whole after the last, in a cycle", () => {
    const steps = run(["AB", "C"], 10);
    expect(steps.at(-1)?.step).toEqual(firstStep(["AB", "C"]));
  });

  it("goes at the pace of the time tokens of the site", () => {
    expect(PACE).toEqual({ type: 120, erase: 60, hold: 1800, gap: 300 });
  });
});
