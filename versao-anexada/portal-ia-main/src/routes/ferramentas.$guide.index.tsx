import { createFileRoute } from "@tanstack/react-router";
import { ToolGuidePage } from "@/features/tools";

export const Route = createFileRoute("/ferramentas/$guide/")({
  component: ToolGuidePage,
});
