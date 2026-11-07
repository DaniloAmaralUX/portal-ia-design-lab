import { createFileRoute } from "@tanstack/react-router";
import { NovePrototype } from "@/features/prototypes";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/prototipos/nove")({
  head: () => pageHead("Portal IA - Nove", "Experimento de rebranding do Portal IA da Pitang."),
  component: NovePrototype,
});
