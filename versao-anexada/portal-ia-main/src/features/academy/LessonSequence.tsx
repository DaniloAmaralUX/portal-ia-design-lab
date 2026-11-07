import { Link } from "@tanstack/react-router";
import type { TrainingCourse } from "@/data/types";
import { cn, formatDuration } from "@/lib/utils";

export function LessonSequence({ course, current }: { course: TrainingCourse; current?: number }) {
  return (
    <ol className="divide-y divide-border">
      {course.lessons.map((lesson) => {
        const here = lesson.number === current;
        return (
          <li key={lesson.number}>
            <Link
              to="/academy/treinamentos/$curso/$aula"
              params={{ curso: course.slug, aula: String(lesson.number) }}
              aria-current={here ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 py-2.5 text-small transition-colors duration-(--duration-fast)",
                here ? "font-semibold text-foreground" : "text-foreground/85 hover:text-foreground",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border text-caption tabular-nums",
                  here ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground",
                )}
              >
                {lesson.number}
              </span>
              <span className="min-w-0 flex-1 text-pretty">{lesson.title}</span>
              {lesson.minutes && <span className="shrink-0 text-caption font-normal tabular-nums text-muted-foreground">{formatDuration(lesson.minutes)}</span>}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
