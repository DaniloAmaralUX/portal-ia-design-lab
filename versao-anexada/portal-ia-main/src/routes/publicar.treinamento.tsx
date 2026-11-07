import { createFileRoute } from "@tanstack/react-router";
import { PublishTrainingPage } from "@/features/publish";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/publicar/treinamento")({
  head: () => pageHead("Publicar uma aula de treinamento", "O formulário que confere uma aula de treinamento e gera o arquivo dela."),
  component: PublishTrainingPage,
});
