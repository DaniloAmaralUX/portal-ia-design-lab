import { notFound } from "@tanstack/react-router";
import { loadGuide } from "@/data/guide-loader";
import { getGuide, sectionOf, type Section } from "@/data/guides";

// The guide of the route, in its section: the text itself, or the index of its chapters with no text.
async function loadGuideIn(section: Section, slug: string) {
  const guide = getGuide(slug);
  if (!guide || sectionOf(guide) !== section) throw notFound();
  if (!guide.chapters) return { guide, doc: await loadGuide(guide.slug), index: null };
  const { guideIndex } = await import("virtual:guide-index");
  const index = guideIndex[guide.slug];
  if (!index) throw notFound();
  return { guide, doc: null, index };
}

export const loadMethodGuide = (slug: string) => loadGuideIn("method", slug);
export const loadToolGuide = (slug: string) => loadGuideIn("tools", slug);

// The opening of a guide with chapters, which the cover shows above the list.
export async function loadOpening(slug: string) {
  if (!getGuide(slug)?.chapters) return { opening: "" };
  const { guideText } = await import("virtual:guide-text");
  const load = guideText[`${slug}/_opening`];
  return { opening: load ? (await load()).source : "" };
}

// The text of one chapter, one chapter at a time.
export async function loadChapter(guide: string, chapter: string) {
  const { guideText } = await import("virtual:guide-text");
  const load = guideText[`${guide}/${chapter}`];
  if (!load || chapter === "_opening") throw notFound();
  return load();
}
