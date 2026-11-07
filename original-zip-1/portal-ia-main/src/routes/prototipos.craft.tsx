import { createFileRoute } from "@tanstack/react-router";
import { CraftPrototype } from "@/features/prototypes";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/prototipos/craft")({
  head: () => pageHead("Portal IA - Shadcncraft", "Experimento de rebranding do Portal IA da Pitang."),
  component: CraftPrototype,
});
