import type { Training, TrainingCourse } from "./types";
import { courses } from "virtual:trainings";
import { trainingText } from "virtual:trainings-text";

export { courses };

export const trainings: Training[] = courses.flatMap((c) => c.lessons);

export function getCourse(slug: string): TrainingCourse | undefined {
  return courses.find((c) => c.slug === slug);
}

// The text of one lesson, which comes with its page and not with the code of the site.
export async function loadTrainingText(lesson: Training): Promise<string> {
  const load = trainingText[`${lesson.course}/${lesson.number}`];
  return load ? (await load()).source : "";
}
