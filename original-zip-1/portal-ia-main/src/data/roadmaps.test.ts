import { describe, expect, it } from "vitest";
import { getPlugin } from "./catalog";
import { areas } from "./areas";
import { getGuide } from "./guides";
import { chaptersOf } from "@/lib/guide-text";
import { ROADMAPS } from "./roadmaps";
import { getCourse } from "./trainings";

const guideSources = import.meta.glob<string>("../content/guides/*.md", { query: "?raw", import: "default", eager: true });

function chaptersIn(slug: string): string[] {
  const guide = getGuide(slug);
  const source = guideSources[`../content/guides/${slug}.md`];
  if (!guide || !source) return [];
  return chaptersOf(guide, source).chapters.map((c) => c.id);
}

describe("the roadmaps", () => {
  it("every area has a roadmap", () => {
    expect(ROADMAPS.map((t) => t.area).sort()).toEqual(areas.map((a) => a.id).sort());
  });

  it("every step points to an existing guide, chapter, plugin or training of its own area", () => {
    const broken: string[] = [];
    for (const roadmap of ROADMAPS) {
      for (const step of roadmap.steps) {
        if (step.kind === "guide" && !getGuide(step.guide)) broken.push(`${roadmap.area}: guide ${step.guide}`);
        if (step.kind === "chapter" && !chaptersIn(step.guide).includes(step.chapter)) {
          broken.push(`${roadmap.area}: chapter ${step.guide}/${step.chapter}`);
        }
        if (step.kind === "plugin" && !getPlugin(step.plugin)) broken.push(`${roadmap.area}: plugin ${step.plugin}`);
        if (step.kind === "training") {
          const course = getCourse(step.course);
          if (!course || (course.area && course.area !== roadmap.area)) broken.push(`${roadmap.area}: training ${step.course}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });
});
