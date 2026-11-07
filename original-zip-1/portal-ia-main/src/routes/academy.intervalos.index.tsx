import { createFileRoute } from "@tanstack/react-router";
import { IntervalsPage, validateIntervalsSearch } from "@/features/academy";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/academy/intervalos/")({
  validateSearch: validateIntervalsSearch,
  head: () => pageHead("Intervalos técnicos", "As gravações dos intervalos técnicos da Pitang, com o vídeo e o texto de cada um, por área."),
  component: IntervalsPage,
});
