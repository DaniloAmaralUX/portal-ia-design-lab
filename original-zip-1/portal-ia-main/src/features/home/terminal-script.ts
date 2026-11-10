import { catalogPlugins, findPlugin, MARKETPLACE_URL } from "@/data/catalog-index";

export type Kind = "input" | "ok" | "skill" | "note";
export type ScriptLine = { kind: Kind; text: string };

const DEMO = "communication";

export const DEMO_SCRIPT: ScriptLine[] = [
  { kind: "input", text: `/plugin marketplace add ${MARKETPLACE_URL}` },
  { kind: "ok", text: `Marketplace pitang adicionado · ${catalogPlugins.length} plugins` },
  { kind: "input", text: `/plugin install ${DEMO}@pitang` },
  { kind: "ok", text: findPlugin(DEMO) ? `${DEMO} instalado · ${findPlugin(DEMO)?.skills.length} skills` : `${DEMO} instalado` },
  { kind: "input", text: "Monte uma apresentação sobre o projeto para a diretoria" },
  { kind: "skill", text: `${DEMO}:pg-criar-apresentacao` },
  { kind: "note", text: "8 slides no molde da Pitang, gravados em apresentacao-diretoria.pptx" },
];

// Where the demo is: the run, the line and how many of its characters show. The line past the last is the prompt that waits for
// the next request, and a run that is clearing fades out before the next one starts.
export type Progress = { run: number; line: number; chars: number; clearing: boolean };

export const START: Progress = { run: 0, line: 0, chars: 0, clearing: false };

export function finished(script: ScriptLine[]): Progress {
  return { run: 0, line: script.length, chars: 0, clearing: false };
}

// The pace of a person at the keyboard and of the commands that answer, in milliseconds: a key every 18 to 44 ms, a space a little
// slower, a beat before typing and before the Enter, and the answers that take as long as a command would. A run lasts about 12 s.
const PACE = {
  firstKey: 500,
  key: { least: 18, spread: 26, space: 35 },
  enter: { least: 240, spread: 120 },
  answer: { ok: 620, skill: 520 },
  afterAnswer: 300,
  work: 1600,
  stream: { every: 16, chars: 3 },
  hold: 6000,
  clear: 420,
};

const lineOn = (p: Progress, line: number): Progress => ({ run: p.run, line, chars: 0, clearing: false });

export function advance(script: ScriptLine[], p: Progress, random: () => number): { progress: Progress; delay: number } {
  if (p.clearing) return { progress: { ...START, run: p.run + 1 }, delay: PACE.clear };
  const line = script[p.line];
  if (!line) return { progress: { ...p, clearing: true }, delay: PACE.hold };
  const length = line.text.length;
  if (line.kind === "input") {
    if (p.chars === 0) return { progress: { ...p, chars: 1 }, delay: PACE.firstKey };
    if (p.chars < length) {
      const space = line.text[p.chars - 1] === " " ? PACE.key.space : 0;
      return { progress: { ...p, chars: p.chars + 1 }, delay: PACE.key.least + random() * PACE.key.spread + space };
    }
    return { progress: lineOn(p, p.line + 1), delay: PACE.enter.least + random() * PACE.enter.spread };
  }
  if (line.kind === "note") {
    if (p.chars < length) return { progress: { ...p, chars: Math.min(length, p.chars + PACE.stream.chars) }, delay: PACE.stream.every };
    return { progress: lineOn(p, p.line + 1), delay: PACE.afterAnswer };
  }
  if (p.chars < length) return { progress: { ...p, chars: length }, delay: PACE.answer[line.kind] };
  return { progress: lineOn(p, p.line + 1), delay: line.kind === "skill" ? PACE.work : PACE.afterAnswer };
}

// What a line shows: the typed part, the rest kept invisible so the box has its final size from the start, and the caret, which
// stands still while the keys come and pulses while it waits.
export type LineView = { visible: boolean; shown: string; rest: string; caret: "steady" | "pulsing" | null; working: boolean };

export function viewOf(script: ScriptLine[], p: Progress, index: number): LineView {
  const line = script[index];
  if (!line) {
    const waiting = p.line >= script.length;
    return { visible: waiting, shown: "", rest: "", caret: waiting ? "pulsing" : null, working: false };
  }
  if (index < p.line) return { visible: true, shown: line.text, rest: "", caret: null, working: false };
  if (index > p.line) return { visible: false, shown: "", rest: line.text, caret: null, working: false };
  const typing = line.kind === "input";
  return {
    visible: typing || p.chars > 0,
    shown: line.text.slice(0, p.chars),
    rest: line.text.slice(p.chars),
    caret: typing ? (p.chars === 0 ? "pulsing" : "steady") : null,
    working: line.kind === "skill" && p.chars > 0,
  };
}
