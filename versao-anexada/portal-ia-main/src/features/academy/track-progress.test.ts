import { describe, expect, it } from "vitest";
import { getCourse } from "./courses";
import { trackProgress } from "./track-progress";
import { coursesOf, stepsOf, TRAINING_PROGRAMS } from "./training";

describe("trackProgress", () => {
  for (const program of TRAINING_PROGRAMS) {
    const steps = program.tracks.flatMap(stepsOf);
    const essentials = steps.filter((s) => s.priority === "essential");
    const all = coursesOf(program);

    it(`${program.area}: with nothing done, the next course is the first essential of the track`, () => {
      const progress = trackProgress(program.area, new Set());
      expect(progress).toMatchObject({ done: 0, total: all.length, next: { title: getCourse(essentials[0]!.courseId)?.title, priority: "Essencial" } });
    });

    it(`${program.area}: every essential comes before any recommended`, () => {
      const progress = trackProgress(program.area, new Set(essentials.map((s) => s.courseId)));
      const recommended = steps.find((s) => s.priority === "recommended")!;
      expect(progress.next).toMatchObject({ title: getCourse(recommended.courseId)?.title, priority: "Recomendado" });
    });

    it(`${program.area}: with every course done, there is no next and done counts each course once`, () => {
      expect(trackProgress(program.area, new Set(all))).toEqual({ done: all.length, total: all.length, next: null });
    });
  }

  it("ignores the courses of other tracks", () => {
    const [first, second] = TRAINING_PROGRAMS;
    const onlyInSecond = coursesOf(second!).filter((id) => !coursesOf(first!).includes(id));
    expect(trackProgress(first!.area, new Set(onlyInSecond)).done).toBe(0);
  });
});
