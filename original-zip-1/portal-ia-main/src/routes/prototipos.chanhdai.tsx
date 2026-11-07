import { createFileRoute } from "@tanstack/react-router";
import { ChanhPrototype } from "@/features/prototypes";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/prototipos/chanhdai")({
  head: () => pageHead("Portal IA - Chanh Dai", "Experimento de rebranding do Portal IA da Pitang."),
  component: ChanhPrototype,
});
