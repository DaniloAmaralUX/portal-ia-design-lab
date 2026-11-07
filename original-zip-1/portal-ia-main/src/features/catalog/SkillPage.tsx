import { getRouteApi } from "@tanstack/react-router";
import { SkillView } from "./SkillView";

const route = getRouteApi("/plugins/$plugin/$skill");

export function SkillPage() {
  const { skill, doc } = route.useLoaderData();
  return <SkillView key={skill.slug} skill={skill} doc={doc} />;
}
