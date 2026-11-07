import { createFileRoute } from "@tanstack/react-router";
import { PublishIntervalPage } from "@/features/publish";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/publicar/intervalo-tecnico")({
  head: () => pageHead("Publicar um intervalo técnico", "O formulário que confere um intervalo técnico e gera o arquivo dele."),
  component: PublishIntervalPage,
});
