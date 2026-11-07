// A screen of the terminal, line by line. A part of a line takes a tone.
export type Tone = "dim" | "strong" | "prompt" | "ok";
export type Part = string | { tone: Tone; text: string };
export type Screen = { title: string; lines: Part[][] };

const tone =
  (name: Tone) =>
  (text: string): Part => ({ tone: name, text });
export const dim = tone("dim");
export const strong = tone("strong");
export const prompt = tone("prompt");
export const ok = tone("ok");
