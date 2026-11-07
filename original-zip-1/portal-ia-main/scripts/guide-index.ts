import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { guides, type Guide } from "../src/data/guides.ts";
import { anchorChapters, chaptersOf, withHeadingIds } from "../src/lib/guide-text.ts";

const INDEX = "virtual:guide-index";
const TEXT = "virtual:guide-text";
const OPENING = "_opening";

// The browser gets a guide with chapters as an index without text plus one chunk per chapter, never the whole file; chaptersOf runs here, once.
export function guideIndex(): Plugin {
  let folder = "";
  const sourceOf = (slug: string): string | null => {
    const file = path.join(folder, `${slug}.md`);
    return existsSync(file) ? readFileSync(file, "utf8") : null;
  };
  const chapterGuides = () => guides.filter((guide) => guide.chapters && sourceOf(guide.slug) !== null);
  // Each chapter module asks for the same guide, so the parse is kept while the file stays the same.
  const parsed = new Map<string, { source: string; result: ReturnType<typeof chaptersOf> }>();
  const parse = (guide: Guide) => {
    const source = sourceOf(guide.slug) ?? "";
    const kept = parsed.get(guide.slug);
    if (kept?.source === source) return kept.result;
    const result = chaptersOf(guide, source);
    parsed.set(guide.slug, { source, result });
    return result;
  };

  return {
    name: "pitang-guide-index",
    configResolved(config) {
      folder = path.join(config.root, "src/content/guides");
    },
    resolveId(id) {
      return id === INDEX || id === TEXT || id.startsWith(`${TEXT}/`) ? `\0${id}` : undefined;
    },
    load(id) {
      if (!id.startsWith(`\0${INDEX}`) && !id.startsWith(`\0${TEXT}`)) return undefined;
      for (const guide of chapterGuides()) this.addWatchFile(path.join(folder, `${guide.slug}.md`));
      if (id === `\0${INDEX}`) {
        const index = Object.fromEntries(
          chapterGuides().map((guide) => {
            const { chapters } = parse(guide);
            return [guide.slug, { chapters: chapters.map(({ source: _source, ...meta }) => meta), anchors: Object.fromEntries(anchorChapters(chapters)) }];
          }),
        );
        return `export const guideIndex = ${JSON.stringify(index)};\n`;
      }
      if (id === `\0${TEXT}`) {
        const entries = chapterGuides().flatMap((guide) => {
          const { chapters } = parse(guide);
          return [OPENING, ...chapters.map((chapter) => chapter.id)].map((part) => `  ${JSON.stringify(`${guide.slug}/${part}`)}: () => import(${JSON.stringify(`${TEXT}/${guide.slug}/${part}`)}),`);
        });
        return `export const guideText = {\n${entries.join("\n")}\n};\n`;
      }
      const [slug = "", part = ""] = id.slice(`\0${TEXT}/`.length).split("/");
      const guide = guides.find((g) => g.slug === slug);
      const source = guide?.chapters ? sourceOf(slug) : null;
      if (!guide || source === null) throw new Error(`There is no guide with chapters called ${slug}.`);
      const { opening, chapters } = parse(guide);
      const chapter = chapters.find((c) => c.id === part);
      if (part !== OPENING && !chapter) throw new Error(`The guide ${slug} has no chapter ${part}.`);
      // Every sub-heading gets an id here, for the outline and the slides; the ids the guide writes are reserved, so none repeats one a link already uses.
      const text = chapter ? withHeadingIds(chapter.source, anchorChapters(chapters).keys()) : opening;
      return `export const source = ${JSON.stringify(text)};\nexport const title = ${JSON.stringify(chapter ? chapter.title : guide.label)};\n`;
    },
  };
}
