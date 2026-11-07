import type { LinkProps } from "@tanstack/react-router";
import { readingOrder } from "@/data/guides";
import { roadmapFor } from "@/data/roadmaps";
import type { AreaId } from "@/data/types";
import { guideTarget } from "./guide-target";
import { titles } from "./mentions";
import { showStep } from "./roadmap-step";

export type NextRead = { label: string; title: string; detail: string | null; link: LinkProps };
export type ReadProgress = { done: number; total: number; next: NextRead | null };

// The reading steps of the roadmap of an area. The plugin steps have nothing to read, so they count neither as done nor as next.
export function roadmapProgress(area: AreaId, readIds: ReadonlySet<string>): ReadProgress {
  const steps = (roadmapFor(area)?.steps ?? []).map(showStep).flatMap((s) => (s.readId ? [{ ...s, readId: s.readId }] : []));
  const next = steps.find((s) => !readIds.has(s.readId));
  return {
    done: steps.filter((s) => readIds.has(s.readId)).length,
    total: steps.length,
    next: next ? { label: next.label, title: next.title, detail: next.detail, link: next.link } : null,
  };
}

// The first guide, in the reading order of the Method, that the person started and did not finish, with the chapter that comes next.
// The chapters come from the titles of the search index, which keeps them in the order of the guide.
export function guideInProgress(readIds: ReadonlySet<string>): ReadProgress | null {
  for (const guide of readingOrder) {
    if (!guide.chapters) continue;
    const chapters = Object.keys(titles).filter((id) => id.startsWith(`${guide.slug}/`));
    const done = chapters.filter((id) => readIds.has(id)).length;
    const next = chapters.find((id) => !readIds.has(id));
    if (done === 0 || !next) continue;
    return {
      done,
      total: chapters.length,
      next: {
        label: "Capítulo",
        title: titles[next] ?? next,
        detail: guide.label,
        link: guideTarget({ guide: guide.slug, chapter: next.slice(guide.slug.length + 1) }),
      },
    };
  }
  return null;
}
