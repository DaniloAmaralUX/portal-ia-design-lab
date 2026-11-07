import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { guides } from "../src/data/guides.ts";
import { chaptersOf, outline } from "../src/lib/guide-text.ts";
import { skillNamesIn } from "../src/lib/skill-name.ts";
import { loadRelease } from "./skills-source.ts";

export type Mention = { guide: string; chapter: string | null; anchor: string | null; title: string; count: number };
export type AcademyDocument = {
  guide: string;
  chapter: string | null;
  anchor: string | null;
  title: string;
  text: string;
};

const skills = new Set(loadRelease().skills.map((s) => s.slug));

function plainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\{#[\w-]+\}/g, " ")
    .replace(/^#+\s*/gm, "")
    .replace(/[*_`>|]/g, " ")
    .replace(/-{3,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function citedSkills(md: string): Map<string, number> {
  const clean = md.replace(/\]\([^)]*\)/g, "]").replace(/\{#[\w-]+\}/g, "");
  const count = new Map<string, number>();
  for (const slug of skillNamesIn(clean)) if (skills.has(slug)) count.set(slug, (count.get(slug) ?? 0) + 1);
  return count;
}

function dedicatedSections(md: string): { slug: string; anchor: string; title: string }[] {
  return [...md.matchAll(/^#{3,4}\s+(.+?)\s*\{#([\w-]+)\}\s*$/gm)].flatMap(([, title = "", anchor = ""]) =>
    [...new Set(skillNamesIn(title))]
      .filter((slug) => skills.has(slug))
      .map((slug) => ({ slug, anchor, title: plainText(title) })),
  );
}

function subtitles(md: string): string {
  return [...md.matchAll(/^#{3,4}\s+(.+?)(?:\s*\{#[\w-]+\})?\s*$/gm)].map(([, t]) => plainText(t ?? "")).join(" · ");
}

function excerpts(slug: string, source: string) {
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return [];
  if (guide.chapters) {
    return chaptersOf(guide, source).chapters.map((c) => ({ chapter: c.id, anchor: null, title: c.title, md: c.source }));
  }
  const sections = outline(source);
  return sections.map((s, i) => {
    const start = source.indexOf(`{#${s.id}}`);
    const end = i + 1 < sections.length ? source.indexOf(`{#${sections[i + 1]?.id}}`) : source.length;
    return { chapter: null, anchor: s.id, title: s.text, md: source.slice(start, end) };
  });
}

function buildAcademyIndex(folder: string) {
  const mentions: Record<string, Mention[]> = {};
  const documents: AcademyDocument[] = [];
  for (const guide of guides) {
    documents.push({ guide: guide.slug, chapter: null, anchor: null, title: guide.label, text: `${guide.title} ${guide.summary}` });
    const file = path.join(folder, `${guide.slug}.md`);
    if (!existsSync(file)) continue;
    const source = readFileSync(file, "utf8");
    for (const t of excerpts(guide.slug, source)) {
      const body = plainText(t.md);
      documents.push({
        guide: guide.slug,
        chapter: t.chapter,
        anchor: t.anchor,
        title: t.title,
        text: `${subtitles(t.md)} ${body.slice(0, 400)}`.trim(),
      });
      const dedicated = new Map(dedicatedSections(t.md).map((d) => [d.slug, d]));
      for (const [slug, count] of citedSkills(t.md)) {
        const section = dedicated.get(slug);
        (mentions[slug] ??= []).push(
          section
            ? { guide: guide.slug, chapter: t.chapter, anchor: section.anchor, title: section.title, count }
            : { guide: guide.slug, chapter: t.chapter, anchor: t.anchor, title: t.title, count },
        );
      }
    }
  }
  for (const [slug, list] of Object.entries(mentions)) {
    const dedicated = (m: Mention) => (m.title.includes(slug) ? 1 : 0);
    list.sort((a, b) => dedicated(b) - dedicated(a) || b.count - a.count);
  }
  return { mentions, documents };
}

const MENTIONS = "virtual:academy-index/mentions";
const DOCUMENTS = "virtual:academy-index/documents";

export function academy(): Plugin {
  let folder = "";
  return {
    name: "pitang-academy-index",
    configResolved(config) {
      folder = path.join(config.root, "src/content/guides");
    },
    resolveId(id) {
      return id === MENTIONS || id === DOCUMENTS ? `\0${id}` : undefined;
    },
    load(id) {
      if (id !== `\0${MENTIONS}` && id !== `\0${DOCUMENTS}`) return undefined;
      const { mentions, documents } = buildAcademyIndex(folder);
      for (const guide of guides) {
        const file = path.join(folder, `${guide.slug}.md`);
        if (existsSync(file)) this.addWatchFile(file);
      }
      if (id === `\0${DOCUMENTS}`) return `export const documents = ${JSON.stringify(documents)};\n`;
      const titles = Object.fromEntries(documents.flatMap((d) => (d.chapter ? [[`${d.guide}/${d.chapter}`, d.title]] : [])));
      return `export const mentions = ${JSON.stringify(mentions)};\nexport const titles = ${JSON.stringify(titles)};\n`;
    },
  };
}
