import { createFileRoute } from "@tanstack/react-router";
import { InPortuguesePage } from "@/features/academy";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/academy/em-portugues")({
  head: () =>
    pageHead(
      "Como estudar em português",
      "Legenda em português nos vídeos da Anthropic Academy e tradução da página inteira no Chrome e no Edge, para os cursos da capacitação em IA.",
    ),
  component: InPortuguesePage,
});
