import { createFileRoute } from "@tanstack/react-router";
import { GuidePage, loadOpening } from "@/features/method";

export const Route = createFileRoute("/metodo/$guide/")({
  loader: ({ params }) => loadOpening(params.guide),
  component: GuidePage,
});
