import { createFileRoute } from "@tanstack/react-router";
import { AcademyLayout } from "@/features/academy";

export const Route = createFileRoute("/academy")({
  component: AcademyLayout,
});
