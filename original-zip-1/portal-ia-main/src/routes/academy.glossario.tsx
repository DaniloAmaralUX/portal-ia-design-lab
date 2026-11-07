import { createFileRoute } from "@tanstack/react-router";
import { GlossaryPage } from "@/features/academy";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/academy/glossario")({
  head: () => pageHead("Glossário", "Os termos e as siglas do site e dos guias do Método, cada um com a explicação."),
  component: GlossaryPage,
});
