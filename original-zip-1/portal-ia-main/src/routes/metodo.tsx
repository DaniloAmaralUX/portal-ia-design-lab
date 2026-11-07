import { createFileRoute } from "@tanstack/react-router";
import { MethodLayout } from "@/features/method";

export const Route = createFileRoute("/metodo")({
  component: MethodLayout,
});
