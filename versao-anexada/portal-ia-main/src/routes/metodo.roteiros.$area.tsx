import { createFileRoute } from "@tanstack/react-router";
import { loadRoadmap, RoadmapPage } from "@/features/method";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/metodo/roteiros/$area")({
  loader: ({ params }) => loadRoadmap(params.area),
  head: ({ loaderData }) => pageHead(loaderData?.roadmap.title, loaderData?.roadmap.summary),
  component: RoadmapPage,
});
