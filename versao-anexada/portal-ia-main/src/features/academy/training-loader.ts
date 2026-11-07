import { notFound } from "@tanstack/react-router";
import { getCourse, loadTrainingText } from "@/data/trainings";

export function loadCourse(slug: string) {
  const course = getCourse(slug);
  if (!course) throw notFound();
  return { course };
}

export async function loadTraining(slug: string, number: string) {
  const { course } = loadCourse(slug);
  const training = course.lessons.find((l) => String(l.number) === number);
  if (!training) throw notFound();
  return { training, course, text: await loadTrainingText(training) };
}
