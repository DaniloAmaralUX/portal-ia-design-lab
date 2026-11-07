import { createFileRoute } from "@tanstack/react-router";
import { GettingStartedPage } from "@/features/pages";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/primeiros-passos")({
  head: () => pageHead("Primeiros passos", "Como adicionar o marketplace da Pitang, instalar um plugin, atualizar e desinstalar no Claude Code."),
  component: GettingStartedPage,
});
