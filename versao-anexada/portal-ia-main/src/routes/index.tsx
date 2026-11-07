import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/features/home";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/")({
  head: () => pageHead(),
  component: HomePage,
});
