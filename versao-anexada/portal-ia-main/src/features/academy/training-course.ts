import type { TrainingCourse } from "@/data/types";

export function courseMinutes(course: TrainingCourse): number {
  return course.lessons.reduce((sum, lesson) => sum + (lesson.minutes ?? 0), 0);
}
