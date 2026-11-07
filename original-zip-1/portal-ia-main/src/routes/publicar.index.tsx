import { createFileRoute } from "@tanstack/react-router";
import { PublishPage } from "@/features/publish";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/publicar/")({
  head: () => pageHead("Publicar no Academy", "Os formulários que geram o arquivo de um intervalo técnico ou de uma aula de treinamento."),
  component: PublishPage,
});
