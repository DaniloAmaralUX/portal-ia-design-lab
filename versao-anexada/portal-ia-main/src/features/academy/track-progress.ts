import type { AreaId } from "@/data/types";
import { getCourse, platformOf } from "./courses";
import { coursesOf, PRIORITIES, stepsOf, trainingFor } from "./training";

export type TrackProgress = {
  done: number;
  total: number;
  next: { title: string; platform: string; priority: string } | null;
};

// How far the person is in the track of a role, and the course that comes next: every essential before any recommended, in the
// order the track page shows them.
export function trackProgress(area: AreaId, completed: ReadonlySet<string>): TrackProgress {
  const training = trainingFor(area);
  const courses = training ? coursesOf(training) : [];
  const steps = training?.tracks.flatMap(stepsOf) ?? [];
  const pending = PRIORITIES.flatMap((p) => steps.filter((s) => s.priority === p.id && !completed.has(s.courseId)));
  const step = pending[0];
  const course = step && getCourse(step.courseId);
  return {
    done: courses.filter((id) => completed.has(id)).length,
    total: courses.length,
    next:
      step && course
        ? {
            title: course.title,
            platform: platformOf(course.platform).name,
            priority: PRIORITIES.find((p) => p.id === step.priority)?.name ?? "",
          }
        : null,
  };
}
