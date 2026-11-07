import { createFileRoute } from "@tanstack/react-router";
import { PluginsPage, validatePluginsSearch } from "@/features/catalog";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/plugins/")({
  validateSearch: validatePluginsSearch,
  head: () => pageHead("Plugins", "Os plugins da Pitang para o Claude Code, as skills de cada um e o kit para o time de um projeto."),
  component: PluginsPage,
});
