import { createFileRoute } from "@tanstack/react-router";
import { loadSkill, SkillPage, SkillSkeleton } from "@/features/catalog";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/plugins/$plugin/$skill")({
  loader: ({ params }) => loadSkill(params.plugin, params.skill),
  head: ({ loaderData }) => pageHead(loaderData?.skill.title, loaderData?.skill.summary),
  pendingComponent: SkillSkeleton,
  component: SkillPage,
});
