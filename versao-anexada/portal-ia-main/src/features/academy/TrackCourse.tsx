import { ArrowUpRight, Check } from "lucide-react";
import { iconHidden, iconShown, iconSwap } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { getCourse } from "./courses";
import { DoneButton } from "./DoneButton";
import { LessonList } from "./LessonList";
import { lessonsForStep } from "./lessons";
import { PriorityBadge } from "./PriorityBadge";
import { TechLeadBadge } from "./TechLeadBadge";
import type { CourseStep } from "./training";
import { stepSummary } from "./training-text";
import { useCompletedCourses } from "./use-completed-courses";

export function TrackCourse({ step, position }: { step: CourseStep; position: number }) {
  const { completed } = useCompletedCourses();
  const course = getCourse(step.courseId);
  if (!course) return null;
  const lessons = lessonsForStep(step);
  const note = step.note ?? course.note;
  const done = completed.has(course.id);
  return (
    <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 border-b border-border py-5 last:border-b-0">
      <span
        className={cn(
          "tabular relative inline-grid size-8 place-items-center rounded-full font-display text-small font-bold transition-colors duration-(--duration-base)",
          done ? "bg-success text-background" : "bg-foreground text-background",
        )}
      >
        <span className={cn("col-start-1 row-start-1", iconSwap, done ? iconHidden : iconShown)}>{position}</span>
        <Check aria-hidden strokeWidth={2.5} className={cn("col-start-1 row-start-1 size-4", iconSwap, done ? iconShown : iconHidden)} />
        {done && <span className="sr-only">, feito</span>}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <h4 className="min-w-0 pt-1 text-body font-semibold text-balance">
            <a href={course.url} target="_blank" rel="noreferrer" className="decoration-foreground/30 underline-offset-4 hover:underline">
              <span lang={course.language}>{course.title}</span>
              <ArrowUpRight aria-hidden className="ml-1 inline size-3.5 align-[-0.1em] text-muted-foreground" />
              <span className="sr-only"> (abre em outra aba)</span>
            </a>
          </h4>
          <span className="flex shrink-0 gap-1.5 pt-1">
            <PriorityBadge priority={step.priority} />
            {step.techLead && <TechLeadBadge />}
          </span>
        </div>
        <p className="mt-1 max-w-measure text-small leading-relaxed text-foreground/85 text-pretty">{course.summary}</p>
        <p className="mt-3 text-small leading-relaxed text-pretty">
          <span className="eyebrow block">Por que para este papel</span>
          {step.reason}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="text-caption font-medium tabular-nums text-foreground/85">{stepSummary(step, course, lessons)}</p>
          <DoneButton course={course} />
        </div>
        {note && <p className="mt-1 text-caption text-muted-foreground text-pretty">{note}</p>}
        {lessons.length > 0 && <LessonList course={course} lessons={lessons} />}
      </div>
    </li>
  );
}
