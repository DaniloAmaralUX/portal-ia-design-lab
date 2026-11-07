import { headingParts, headingsOf } from "@/lib/guide-text";

// One slide of a presentation. The body is the Markdown of the guide itself: the presentation is the same text, cut in another way.
export type Slide = {
  cover?: boolean;
  id: string | null;
  kicker: string | null;
  number: string;
  title: string | null;
  body: string;
};

export type Cover = { kicker: string; number?: string; title: string; lead?: string };

// A section this short, with no code block and no table, fits one slide with its sub-headings; a longer one gives a slide to each.
const WHOLE_WORDS = 140;
// An opening this short goes on the cover, under the title; a longer one takes the slide after it.
const LEAD_WORDS = 60;

function words(text: string): number {
  return text.split(/\s+/).filter((w) => /\w/.test(w)).length;
}

function fits(text: string, max: number): boolean {
  return words(text) <= max && !/^ {0,3}(```|~~~)/m.test(text) && !/^ {0,3}\|/m.test(text);
}

// The slides of a text: the cover, the opening, then one slide per section of the highest level, cut again at the level below
// when the section is long. The deeper headings stay inside the slide.
export function slidesOf(cover: Cover, text: string): Slide[] {
  const lines = text.split("\n");
  const heads = headingsOf(text).filter((h) => h.level >= 2);
  const between = (from: number, to: number) => lines.slice(from, to).join("\n").trim();
  const intro = between(0, heads[0]?.line ?? lines.length);
  const lead = Boolean(intro) && fits(intro, LEAD_WORDS);
  const slides: Slide[] = [
    { cover: true, id: null, kicker: cover.kicker, number: cover.number ?? "", title: cover.title, body: lead ? intro : (cover.lead ?? "") },
  ];
  if (intro && !lead) slides.push({ id: null, kicker: cover.title, number: "", title: null, body: intro });
  const top = Math.min(...heads.map((h) => h.level));
  const sub = Math.min(...heads.filter((h) => h.level > top).map((h) => h.level));
  const endOf = (i: number, level: number) => heads.slice(i + 1).find((h) => h.level <= level)?.line ?? lines.length;
  let section: { id: string | null; title: string; whole: boolean } | null = null;
  for (const [i, head] of heads.entries()) {
    const { number, text: title } = headingParts(head.raw);
    if (head.level === top) {
      const end = endOf(i, top);
      const firstSub = heads.slice(i + 1).find((h) => h.line < end && h.level === sub)?.line;
      const whole = firstSub === undefined || fits(between(head.line + 1, end), WHOLE_WORDS);
      section = { id: head.id, title, whole };
      slides.push({ id: head.id, kicker: null, number, title, body: between(head.line + 1, whole ? end : (firstSub ?? end)) });
    } else if (head.level === sub && !section?.whole) {
      // A sub-heading with no id of its own (the guide read whole gives none) leaves the presentation on the section it is part of.
      slides.push({ id: head.id ?? section?.id ?? null, kicker: section?.title ?? null, number, title, body: between(head.line + 1, endOf(i, sub)) });
    }
  }
  return slides;
}
