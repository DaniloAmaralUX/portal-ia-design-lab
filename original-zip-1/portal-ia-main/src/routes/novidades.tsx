import { createFileRoute } from "@tanstack/react-router";
import { ChangelogPage } from "@/features/changelog";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/novidades")({
  head: () => pageHead("Novidades", "O que entrou, mudou e saiu em cada versão do catálogo de skills da Pitang."),
  component: ChangelogPage,
});
