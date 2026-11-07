import { ResourceCard } from "@/design-system/blocks/ResourceCard";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AreaMark } from "@/components/AreaMark";
import { Progress } from "@/design-system/primitives";
import type { Role } from "@/data/roles";
import { plural } from "@/lib/utils";
import { totalsOf } from "./courses";
import { coursesOf, trainingFor } from "./training";
import { durationLabel } from "./training-text";
import { useCompletedCourses } from "./use-completed-courses";

export function RoleCard({ role }: { role: Role }) {
  const training = trainingFor(role.area);
  const anthropic = training?.tracks.find((p) => p.platform === "anthropic");
  const essentials = anthropic ? totalsOf(anthropic).essential : null;
  const { completed } = useCompletedCourses();
  const courses = training ? coursesOf(training) : [];
  const completedHere = courses.filter((c) => completed.has(c)).length;
  return (
    <ResourceCard><Link
      to="/academy/trilhas/$area"
      params={{ area: role.area }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-[border-color,box-shadow] duration-(--duration-fast) hover:border-foreground/20 hover:shadow-sm"
    >
      <AreaMark area={role.area} size="md" />
      <span data-vt="title" className="mt-4 self-start font-display text-subheading font-bold text-balance">
        {role.name}
      </span>
      <span className="mt-1.5 text-small leading-relaxed text-muted-foreground text-pretty">{role.description}</span>
      <span className="mt-auto block pt-5">
        {completedHere > 0 && <Progress completed={completedHere} total={courses.length} noun="cursos feitos" className="mb-3" insideLink />}
        <span className="flex items-center justify-between gap-2 text-caption font-medium text-foreground/85">
          {essentials && `Anthropic: ${plural(essentials.courses, "essential", "essenciais")} · ${durationLabel(essentials)}`}
          <ArrowRight aria-hidden className="size-4 shrink-0 text-muted-foreground transition-transform duration-(--duration-base) group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link></ResourceCard>
  );
}
