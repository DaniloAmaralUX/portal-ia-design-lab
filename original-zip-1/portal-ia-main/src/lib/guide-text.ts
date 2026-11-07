import { DIAGRAM_GUIDES, type Guide } from "../data/guides.ts";
import { slugify } from "./text.ts";

const SECTION = /^## (.+?) \{#([\w-]+)\}[ \t]*$/gm;

export function headingParts(raw: string): { number: string; text: string } {
  const text = raw
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\\(.)/g, "$1")
    .replace(/[*`]/g, "");
  const n = /^(\d+(?:\.\d+)*)\s+/.exec(text);
  return n ? { number: n[1] ?? "", text: text.slice(n[0].length) } : { number: "", text };
}

export type Heading = { level: number; raw: string; id: string | null; line: number };

const FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/;
const ATX = /^ {0,3}(#{1,6})[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*$/;
const TRAILING_ID = /[ \t]*\{#([\w-]+)\}$/;

// The headings of a Markdown text and the line of each. A "#" line inside a fenced block is code: the prompts of the guides carry whole Markdown files in fences.
export function headingsOf(source: string): Heading[] {
  const out: Heading[] = [];
  let fence: { mark: string; size: number } | null = null;
  const lines = source.split("\n");
  for (const [line, text] of lines.entries()) {
    const open = FENCE.exec(text);
    const marks = open?.[1] ?? "";
    if (fence) {
      if (marks.charAt(0) === fence.mark && marks.length >= fence.size && !open?.[2]?.trim()) fence = null;
      continue;
    }
    if (open && !(marks.startsWith("`") && open[2]?.includes("`"))) {
      fence = { mark: marks.charAt(0), size: marks.length };
      continue;
    }
    const head = ATX.exec(text);
    if (!head) continue;
    const content = head[2] ?? "";
    const id = TRAILING_ID.exec(content);
    out.push({ level: head[1]?.length ?? 0, raw: id ? content.slice(0, id.index) : content, id: id?.[1] ?? null, line });
  }
  return out;
}

const SLUG_MAX = 60;

function slugOf(raw: string): string {
  const slug = slugify(headingParts(raw).text);
  if (slug.length <= SLUG_MAX) return slug;
  const end = slug.lastIndexOf("-", SLUG_MAX);
  return slug.slice(0, end > 0 ? end : SLUG_MAX);
}

// Gives every heading from ## down an id, so the outline and the slides can point to it. The ids the text writes stay; the
// others come from the title and never repeat one the page, or the reserved list, already has.
export function withHeadingIds(source: string, reserved: Iterable<string> = []): string {
  const heads = headingsOf(source);
  const used = new Set([...reserved, ...heads.flatMap((h) => (h.id ? [h.id] : []))]);
  const lines = source.split("\n");
  for (const head of heads) {
    if (head.id || head.level < 2) continue;
    const base = slugOf(head.raw) || "secao";
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    lines[head.line] = `${"#".repeat(head.level)} ${head.raw.trim()} {#${id}}`;
  }
  return lines.join("\n");
}

// The text of a chapter without its own heading, which the page shows as the title.
export function chapterBody(source: string): string {
  return source.replace(/^## .*\n+/, "");
}

// The sections of a chapter: its headings of the highest level, the ones the outline lists under the chapter.
export function sectionsOf(body: string): OutlineItem[] {
  const heads = headingsOf(body).filter((h) => h.level >= 2 && h.id);
  const top = Math.min(...heads.map((h) => h.level));
  return heads.filter((h) => h.level === top).map((h) => ({ id: h.id ?? "", ...headingParts(h.raw) }));
}

export function tableOfContents(guide: Guide, source: string): ReturnType<typeof outline> {
  if (guide.chapters || DIAGRAM_GUIDES.has(guide.slug)) return [];
  const items = outline(source);
  return items.length >= 3 ? items : [];
}

export type OutlineItem = { id: string; number: string; text: string };

export function outline(source: string): OutlineItem[] {
  return [...source.matchAll(SECTION)].map(([, raw = "", id = ""]) => ({ id, ...headingParts(raw) }));
}

function plain(source: string): string {
  return source.replace(/[ \t]*\{#[\w-]+\}[ \t]*$/gm, "").replace(/\[([^\]]+)\]\(#sigla\)/g, "$1").trim();
}

export function pageMarkdown(guide: Guide, source: string): string {
  return `# ${guide.title}\n\n${guide.summary}\n\n${plain(source)}\n`;
}

type Chapter = {
  id: string;
  number: string;
  title: string;
  part: string | null;
  source: string;
  minutes: number;
};

export type ChapterMeta = Omit<Chapter, "source">;

const LABEL = /\n\*\*([^*\n]+)\*\*[ \t]*\n+$/;

function sentenceCase(label: string): string {
  const lower = label.toLowerCase();
  return lower.replace(/(^|·\s+)(\p{L})/gu, (_, before: string, letter: string) => before + letter.toUpperCase());
}

function words(text: string): number {
  return text.split(/\s+/).filter((w) => /\w/.test(w)).length;
}

export function partsOf<T extends ChapterMeta>(chapters: T[]): { part: string | null; chapters: T[] }[] {
  const out: { part: string | null; chapters: T[] }[] = [];
  for (const c of chapters) {
    const last = out.at(-1);
    if (last && last.part === c.part) last.chapters.push(c);
    else out.push({ part: c.part, chapters: [c] });
  }
  return out;
}

export function chaptersOf(guide: Guide, source: string): { opening: string; chapters: Chapter[] } {
  const heads = [...source.matchAll(SECTION)].map((m) => ({ at: m.index, raw: m[1] ?? "", id: m[2] ?? "" }));
  const first = heads[0];
  if (!first) return { opening: source, chapters: [] };
  const texts = heads.map((head, i) => source.slice(head.at, heads[i + 1]?.at ?? source.length));
  const take = (text: string): [string, string | null] => {
    const hit = LABEL.exec("\n" + text);
    const label = hit?.[1];
    return hit && label && label === label.toUpperCase()
      ? [("\n" + text).slice(0, hit.index + 1).slice(1), sentenceCase(label.trim())]
      : [text, null];
  };
  const [opening, firstPart] = take(source.slice(0, first.at));
  let part = firstPart;
  const bodies: string[] = [];
  const parts: (string | null)[] = [];
  for (const text of texts) {
    parts.push(part);
    const [body, next] = take(text);
    bodies.push(body);
    part = next;
  }
  const total = words(source) || 1;
  const chapters = heads.map((head, i) => {
    const { number, text } = headingParts(head.raw);
    const body = bodies[i] ?? "";
    return {
      id: head.id,
      number,
      title: text.replace(/^\?\s+/, ""),
      part: parts[i] ?? null,
      source: body.trim(),
      minutes: Math.max(1, Math.round(((guide.minutes ?? 0) * words(body)) / total)),
    };
  });
  return { opening: opening.trim(), chapters };
}

export function anchorChapters(chapters: Chapter[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const c of chapters) {
    map.set(c.id, c.id);
    for (const [, id] of c.source.matchAll(/\{#([\w-]+)\}/g)) if (id) map.set(id, c.id);
  }
  return map;
}

export function chapterMarkdown(guide: Guide, chapter: Pick<Chapter, "source">): string {
  return `# ${guide.title}\n\n${plain(chapter.source)}\n`;
}
