import { createFileRoute } from "@tanstack/react-router";
import { MainlineHome } from "@/features/mainline";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/prototipos/mainline/")({
  head: () => pageHead("Portal IA - Mainline", "Capacitação, método e conhecimento para trabalhar com IA na Pitang."),
  component: MainlineHome,
});
