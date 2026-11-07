import { createFileRoute } from "@tanstack/react-router";
import { MethodPage } from "@/features/method";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/metodo/")({
  head: () =>
    pageHead(
      "Método",
      "Como a Pitang trabalha com IA: o ciclo SDD com Compozy, os requisitos que ele consome e um caso real, com um roteiro por área.",
    ),
  component: MethodPage,
});
