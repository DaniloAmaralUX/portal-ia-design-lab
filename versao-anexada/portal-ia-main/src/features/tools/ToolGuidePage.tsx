import { getRouteApi, Navigate, useRouterState } from "@tanstack/react-router";
import { guideTarget, PRESENTING } from "@/features/method";
import { ToolPage } from "./ToolPage";

const guideRoute = getRouteApi("/ferramentas/$guide");
const route = getRouteApi("/ferramentas/$guide/");

// The first page of a tool is the page of the product. The presentation starts on the first chapter, and an anchor of a chapter
// lands on that chapter.
export function ToolGuidePage() {
  const { guide, index } = guideRoute.useLoaderData();
  const { modo } = route.useSearch();
  const hash = useRouterState({ select: (s) => s.location.hash });
  if (!index) return null;
  const first = index.chapters[0];
  if (modo === PRESENTING && first) return <Navigate {...guideTarget({ guide: guide.slug, chapter: first.id })} search={{ modo: PRESENTING }} replace />;
  const target = hash && Object.hasOwn(index.anchors, hash) ? index.anchors[hash] : undefined;
  if (target) return <Navigate {...guideTarget({ guide: guide.slug, chapter: target, anchor: target === hash ? null : hash })} replace />;
  return <ToolPage key={guide.slug} guide={guide} chapters={index.chapters} />;
}
