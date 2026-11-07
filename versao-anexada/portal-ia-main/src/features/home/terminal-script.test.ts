import { describe, expect, it } from "vitest";
import { advance, DEMO_SCRIPT, finished, START, viewOf, type Progress, type ScriptLine } from "./terminal-script";

const SCRIPT: ScriptLine[] = [
  { kind: "input", text: "/plugin install x" },
  { kind: "ok", text: "x instalado" },
  { kind: "input", text: "Faça a tarefa" },
  { kind: "skill", text: "x:pg-tarefa" },
  { kind: "note", text: "A tarefa feita, com o resultado gravado." },
];
const half = () => 0.5;

// Every step of one run, from the first prompt to the one that waits after the last answer.
function runOf(script: ScriptLine[]) {
  const steps: { progress: Progress; delay: number }[] = [];
  let progress = START;
  while (progress.line < script.length) {
    const step = advance(script, progress, half);
    steps.push(step);
    progress = step.progress;
  }
  return steps;
}

describe("the terminal of the home page", () => {
  it("types each command a key at a time, with the caret still while the keys come, and the answer comes whole", () => {
    const steps = runOf(SCRIPT);
    const typed = steps.filter((s) => s.progress.line === 0).map((s) => s.progress.chars);
    expect(typed).toEqual(Array.from({ length: SCRIPT[0]?.text.length ?? 0 }, (_, i) => i + 1));
    expect(viewOf(SCRIPT, START, 0)).toMatchObject({ visible: true, shown: "", caret: "pulsing" });
    expect(viewOf(SCRIPT, { ...START, chars: 3 }, 0)).toMatchObject({ shown: "/pl", rest: "ugin install x", caret: "steady" });
    const answer = steps.filter((s) => s.progress.line === 1).map((s) => s.progress.chars);
    expect(answer).toEqual([0, "x instalado".length]);
    expect(viewOf(SCRIPT, { ...START, line: 1 }, 1).visible).toBe(false);
    expect(viewOf(SCRIPT, { ...START, line: 1 }, 0)).toMatchObject({ visible: true, caret: null, rest: "" });
  });

  it("pulses the dot of the skill while it works, and streams its answer in", () => {
    const working = { ...START, line: 3, chars: "x:pg-tarefa".length };
    expect(viewOf(SCRIPT, working, 3).working).toBe(true);
    const streamed = runOf(SCRIPT).filter((s) => s.progress.line === 4 && s.progress.chars > 0);
    expect(streamed.length).toBeGreaterThan(1);
    expect(streamed.at(-1)?.progress.chars).toBe(SCRIPT[4]?.text.length);
  });

  it("ends on a prompt that waits, then fades out and starts over", () => {
    const end = finished(SCRIPT);
    expect(viewOf(SCRIPT, end, SCRIPT.length)).toMatchObject({ visible: true, caret: "pulsing" });
    expect(viewOf(SCRIPT, START, SCRIPT.length).visible).toBe(false);
    const hold = advance(SCRIPT, end, half);
    expect(hold.progress.clearing).toBe(true);
    expect(advance(SCRIPT, hold.progress, half).progress).toEqual({ ...START, run: 1 });
  });

  it("plays the demo of the home page in 9 to 14 seconds", () => {
    const total = runOf(DEMO_SCRIPT).reduce((sum, step) => sum + step.delay, 0);
    expect(total).toBeGreaterThan(9000);
    expect(total).toBeLessThan(14000);
  });
});
