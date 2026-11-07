import { createFileRoute } from "@tanstack/react-router";
import { AcademyPage } from "@/features/academy";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/academy/")({
  head: () =>
    pageHead(
      "Academy",
      "As trilhas de capacitação em IA de PO, dev e QA, com cursos gratuitos da Anthropic, da OpenAI e da Microsoft em três fases.",
    ),
  component: AcademyPage,
});
