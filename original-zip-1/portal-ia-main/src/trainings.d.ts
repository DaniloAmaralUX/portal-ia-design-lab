declare module "virtual:trainings" {
  import type { TrainingCourse } from "@/data/types";

  export const courses: TrainingCourse[];
}

declare module "virtual:trainings-text" {
  export const trainingText: Record<string, () => Promise<{ source: string }>>;
}
