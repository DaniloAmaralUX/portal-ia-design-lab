import { getRouteApi, Navigate, useRouterState } from "@tanstack/react-router";
import { GuideCover } from "./GuideCover";
import { MethodGuidePage } from "./MethodGuidePage";
import { PRESENTING } from "./reading-search";

const guideRoute = getRouteApi("/metodo/$guide");
const route = getRouteApi("/metodo/$guide/");

export function GuidePage() {
  const { guide, doc, index } = guideRoute.useLoaderData();
  const { opening } = route.useLoaderData();
  const { modo } = route.useSearch();
  const hash = useRouterState({ select: (s) => s.location.hash });
  if (index) {
    // A guide with chapters is presented from its first chapter; the cover has nothing of its own to show on a slide.
    const first = index.chapters[0];
    if (modo === PRESENTING && first) {
      return <Navigate to="/metodo/$guide/$chapter" params={{ guide: guide.slug, chapter: first.id }} search={{ modo: PRESENTING }} replace />;
    }
    const target = hash && Object.hasOwn(index.anchors, hash) ? index.anchors[hash] : undefined;
    if (target) {
      return <Navigate to="/metodo/$guide/$chapter" params={{ guide: guide.slug, chapter: target }} hash={target === hash ? undefined : hash} replace />;
    }
    return <GuideCover key={guide.slug} guide={guide} opening={opening} chapters={index.chapters} />;
  }
  return <MethodGuidePage key={guide.slug} guide={guide} doc={doc ?? ""} />;
}
