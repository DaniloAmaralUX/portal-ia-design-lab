import { createFileRoute } from "@tanstack/react-router";
import { loadTrack, TrainingPage } from "@/features/academy";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/academy/trilhas/$area")({
  loader: ({ params }) => loadTrack(params.area),
  head: ({ loaderData }) =>
    pageHead(
      loaderData && `Trilha de capacitação: ${loaderData.role.name}`,
      loaderData && `${loaderData.role.description} Cursos gratuitos da Anthropic, da OpenAI e da Microsoft, em três fases.`,
    ),
  component: TrainingPage,
});
