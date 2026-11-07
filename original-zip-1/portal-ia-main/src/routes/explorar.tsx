import { createFileRoute } from "@tanstack/react-router";
import { ExplorePage, validateExploreSearch } from "@/features/explore";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/explorar")({
  validateSearch: validateExploreSearch,
  head: () => pageHead("Catálogo de skills", "Todas as skills da Pitang para o Claude Code, com busca em português e filtros por área, plugin e modo."),
  component: ExplorePage,
});
