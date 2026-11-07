import { createFileRoute } from "@tanstack/react-router";
import { GuideLayout, GuideSkeleton, loadMethodGuide, redirectMovedGuide, validateReadingSearch } from "@/features/method";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/metodo/$guide")({
  validateSearch: validateReadingSearch,
  beforeLoad: redirectMovedGuide,
  loader: ({ params }) => loadMethodGuide(params.guide),
  head: ({ loaderData }) => pageHead(loaderData?.guide.label, loaderData?.guide.summary),
  pendingComponent: GuideSkeleton,
  component: GuideLayout,
});
