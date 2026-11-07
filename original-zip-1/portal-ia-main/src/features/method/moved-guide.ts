import { redirect, type ParsedLocation } from "@tanstack/react-router";
import { TOOLKIT } from "@/data/catalyst-toolkit";
import { getGuide, MOVED_GUIDES, sectionOf } from "@/data/guides";
import { guideTarget } from "./guide-target";

const chapterIn = (pathname: string) => pathname.split("/").filter(Boolean)[2] ?? null;

// Where the address of a guide that moved lands: its new guide, and the chapter that took the place of the old one. A tool of the
// house left the Method for Ferramentas with the same chapters. Null for a guide that did not move.
export function movedTarget(guide: string, pathname: string): { guide: string; chapter: string | null } | null {
  const moved = Object.hasOwn(MOVED_GUIDES, guide) ? MOVED_GUIDES[guide] : undefined;
  const chapter = chapterIn(pathname);
  if (moved) return { guide: moved.guide, chapter: chapter ? (moved.chapters[chapter] ?? moved.otherwise) : null };
  const found = getGuide(guide);
  return found && sectionOf(found) === "tools" ? { guide, chapter } : null;
}

// The address of a guide that moved goes to its new place, with the anchor it carried, in place of the old entry of the history.
export function redirectMovedGuide({ params, location }: { params: { guide: string }; location: ParsedLocation }) {
  const target = movedTarget(params.guide, location.pathname);
  if (target) throw redirect({ ...guideTarget({ ...target, anchor: location.hash || null }), replace: true });
}

// The short address of the Catalyst Toolkit, to say out loud or write on a slide.
export function redirectToToolkit(): never {
  throw redirect({ ...guideTarget({ guide: TOOLKIT.slug }), replace: true });
}
