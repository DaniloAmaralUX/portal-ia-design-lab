import { createFileRoute } from "@tanstack/react-router";
import { ToolsLayout } from "@/features/tools";

export const Route = createFileRoute("/ferramentas")({
  component: ToolsLayout,
});
