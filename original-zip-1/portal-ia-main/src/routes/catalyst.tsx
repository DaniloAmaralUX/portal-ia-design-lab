import { createFileRoute } from "@tanstack/react-router";
import { redirectToToolkit } from "@/features/method";

export const Route = createFileRoute("/catalyst")({
  beforeLoad: redirectToToolkit,
});
