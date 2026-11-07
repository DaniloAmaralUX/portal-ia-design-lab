import { createFileRoute } from "@tanstack/react-router";
import { ToolsPage } from "@/features/tools";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/ferramentas/")({
  head: () => pageHead("Ferramentas Pita.IA", "As ferramentas da Pitang para o trabalho com agentes de IA, prontas para instalar"),
  component: ToolsPage,
});
