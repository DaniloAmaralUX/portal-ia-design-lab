import { createFileRoute } from "@tanstack/react-router";
import { DesignSystemPage } from "@/features/design-system";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/design-system")({
  head: () => pageHead("Design system", "Catálogo interativo dos 21 componentes Beautiful UI."),
  component: DesignSystemPage,
});
