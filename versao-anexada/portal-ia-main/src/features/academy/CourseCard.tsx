import { ArrowUpRight } from "lucide-react";
import { platformOf, type Course } from "./courses";
import { DoneButton } from "./DoneButton";
import { courseDuration } from "./training-text";

export function CourseCard({ course }: { course: Course }) {
  const platform = platformOf(course.platform);
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-xs">
      <p className="eyebrow">{platform.name}</p>
      <h3 className="mt-2 text-body font-semibold text-balance">
        <a href={course.url} target="_blank" rel="noreferrer" className="decoration-foreground/30 underline-offset-4 hover:underline">
          <span lang={course.language}>{course.title}</span>
          <ArrowUpRight aria-hidden className="ml-1 inline size-3.5 align-[-0.1em] text-muted-foreground" />
          <span className="sr-only"> (abre em outra aba)</span>
        </a>
      </h3>
      <p className="mt-1.5 text-small leading-relaxed text-muted-foreground text-pretty">{course.summary}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-4">
        <span className="text-caption font-medium tabular-nums text-foreground/85">
          {[courseDuration(course), course.level].filter(Boolean).join(" · ")}
        </span>
        <DoneButton course={course} />
      </div>
    </article>
  );
}
