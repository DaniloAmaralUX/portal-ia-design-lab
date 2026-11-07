import { getGuide, sectionOf } from "@/data/guides";

// Where a guide, a chapter of it or a spot inside it lives. The manifesto has a page of its own, the tools of the house are in
// Ferramentas, and the other guides are in the Method.
export type GuideRef = { guide: string; chapter?: string | null; anchor?: string | null };

const ROUTES = {
  method: { guide: "/metodo/$guide", chapter: "/metodo/$guide/$chapter" },
  tools: { guide: "/ferramentas/$guide", chapter: "/ferramentas/$guide/$chapter" },
} as const;

export function guideTarget({ guide, chapter, anchor }: GuideRef) {
  const hash = anchor ?? undefined;
  if (guide === "manifesto" && !chapter) return { to: "/manifesto", hash } as const;
  const found = getGuide(guide);
  const routes = ROUTES[found && sectionOf(found) === "tools" ? "tools" : "method"];
  if (chapter) return { to: routes.chapter, params: { guide, chapter }, hash } as const;
  return { to: routes.guide, params: { guide }, hash } as const;
}
