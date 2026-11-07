import { createFileRoute } from "@tanstack/react-router";
import { ContributePage } from "@/features/pages";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/contribuir")({
  head: () => pageHead("Contribuir", "Como criar uma skill para o catálogo da Pitang, o que a curadoria olha e como pedir uma skill nova."),
  component: ContributePage,
});
