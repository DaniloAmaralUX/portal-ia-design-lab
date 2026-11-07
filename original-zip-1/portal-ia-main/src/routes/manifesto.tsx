import { createFileRoute } from "@tanstack/react-router";
import { loadManifesto, ManifestoPage } from "@/features/manifesto";
import { GuideSkeleton, validateReadingSearch } from "@/features/method";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/manifesto")({
  validateSearch: validateReadingSearch,
  loader: loadManifesto,
  head: ({ loaderData }) => pageHead(loaderData?.guide.label, loaderData?.guide.summary),
  pendingComponent: GuideSkeleton,
  component: ManifestoPage,
});
