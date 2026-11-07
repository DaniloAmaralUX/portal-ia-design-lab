import type { Course, Total } from "./courses";
import { stepMinutes } from "./courses";
import type { Lesson } from "./lessons";
import type { CourseStep } from "./training";
import { formatDuration, plural } from "@/lib/utils";

export function durationLabel(total: Total): string {
  if (total.minutes) return formatDuration(total.minutes);
  return total.exams ? "exame" : "nenhum";
}

export function coursesFor(total: Total): string {
  return plural(total.courses, "curso", "cursos");
}

// The Anthropic times are the sum of the lessons, so they are exact; the other platforms give an estimate.
export function courseDuration(course: Course): string {
  if (course.exam) return "exame pago, sem duração de curso";
  return `${course.platform === "anthropic" ? "" : "~"}${formatDuration(course.minutes ?? 0)}`;
}

export function stepSummary(step: CourseStep, course: Course, lessons: Lesson[]): string {
  if (lessons.length) {
    const videos = lessons.filter((a) => a.format === "video").length;
    return [
      plural(lessons.filter((a) => a.format !== "quiz").length, "aula", "aulas"),
      formatDuration(stepMinutes(step)),
      videos ? `vídeo em ${plural(videos, "aula", "aulas")}` : null,
    ]
      .filter(Boolean)
      .join(" · ");
  }
  return [course.lessonCount ? plural(course.lessonCount, "aula", "aulas") : null, courseDuration(course), course.level ?? null]
    .filter(Boolean)
    .join(" · ");
}
