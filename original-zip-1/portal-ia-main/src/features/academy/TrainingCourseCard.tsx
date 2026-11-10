import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AreaDot } from "@/components/AreaDot";
import { areaById } from "@/data/areas";
import type { TrainingCourse } from "@/data/types";
import { courseMinutes } from "./training-course";
import { formatDuration, plural } from "@/lib/utils";

export function TrainingCourseCard({ course }: { course: TrainingCourse }) {
  const area = course.area ? areaById[course.area] : null;
  const minutes = courseMinutes(course);
  return (
    <Link
      to="/academy/treinamentos/$curso"
      params={{ curso: course.slug }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-xs interactive-surface"
    >
      <span className="text-caption tabular-nums text-muted-foreground">
        {plural(course.lessons.length, "aula", "aulas")}
        {minutes > 0 && ` · ${formatDuration(minutes)}`}
      </span>
      <span data-vt="title" className="mt-3 self-start font-display text-subheading font-bold text-balance">
        {course.title}
      </span>
      <span className="mt-1.5 text-small leading-relaxed text-muted-foreground text-pretty">{course.summary}</span>
      <span className="mt-auto flex items-center justify-between gap-2 pt-5 text-caption font-medium text-foreground/85">
        <span className="inline-flex items-center gap-1.5">
          {area && <AreaDot area={area.id} />}
          {area ? area.name : "Todas as áreas"}
        </span>
        <ArrowRight
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 motion-safe:group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
