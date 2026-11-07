import { createFileRoute } from "@tanstack/react-router";
import { GuideLayout, GuideSkeleton, loadToolGuide, validateReadingSearch } from "@/features/method";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/ferramentas/$guide")({
  validateSearch: validateReadingSearch,
  loader: ({ params }) => loadToolGuide(params.guide),
  head: ({ loaderData }) => pageHead(loaderData?.guide.label, loaderData?.guide.summary),
  pendingComponent: GuideSkeleton,
  component: GuideLayout,
});
