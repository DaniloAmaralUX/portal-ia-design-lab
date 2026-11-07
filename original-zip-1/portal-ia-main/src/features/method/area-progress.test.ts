import { describe, expect, it } from "vitest";
import { readingOrder } from "@/data/guides";
import { ROADMAPS } from "@/data/roadmaps";
import { guideInProgress, roadmapProgress } from "./area-progress";
import { titles } from "./mentions";
import { showStep } from "./roadmap-step";

const chaptersOf = (slug: string) => Object.keys(titles).filter((id) => id.startsWith(`${slug}/`));

describe("roadmapProgress", () => {
  for (const roadmap of ROADMAPS) {
    const readIds = roadmap.steps.flatMap((step) => showStep(step).readId ?? []);

    it(`${roadmap.area}: counts only the steps there is something to read in, and starts at the first`, () => {
      const progress = roadmapProgress(roadmap.area, new Set());
      expect(progress.done).toBe(0);
      expect(progress.total).toBe(readIds.length);
      expect(progress.next?.title).toBe(showStep(roadmap.steps[0]!).title);
    });

    it(`${roadmap.area}: skips what was read, and ends with no next`, () => {
      expect(roadmapProgress(roadmap.area, new Set(readIds.slice(0, 1))).next?.title).toBe(
        showStep(roadmap.steps.find((s) => showStep(s).readId === readIds[1])!).title,
      );
      expect(roadmapProgress(roadmap.area, new Set(readIds))).toEqual({ done: readIds.length, total: readIds.length, next: null });
    });
  }
});

describe("guideInProgress", () => {
  const guide = readingOrder.find((g) => g.chapters && chaptersOf(g.slug).length > 1)!;
  const chapters = chaptersOf(guide.slug);

  it("is empty when no chapter was read, or when every chapter read finished its guide", () => {
    expect(guideInProgress(new Set())).toBeNull();
    expect(guideInProgress(new Set(chapters))).toBeNull();
  });

  it("points to the first chapter not read of a guide started", () => {
    const progress = guideInProgress(new Set([chapters[0]!]));
    expect(progress).toMatchObject({ done: 1, total: chapters.length, next: { title: titles[chapters[1]!], detail: guide.label } });
    expect(progress?.next?.link).toMatchObject({ to: "/metodo/$guide/$chapter", params: { guide: guide.slug, chapter: chapters[1]!.split("/")[1] } });
  });

  it("finds the chapters of every guide with chapters in the search index", () => {
    for (const g of readingOrder.filter((x) => x.chapters)) expect(chaptersOf(g.slug).length, g.slug).toBeGreaterThan(0);
  });
});
