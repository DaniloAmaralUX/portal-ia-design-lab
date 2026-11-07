import { describe, expect, it } from "vitest";
import { LESSONS, lessonsForStep } from "./lessons";
import { TRAINING_PROGRAMS, PHASES, stepsOf } from "./training";
import { COURSES, getCourse, PLATFORMS } from "./courses";
import { areas } from "@/data/areas";
import { ROLES } from "@/data/roles";

const PLATFORM_URL_PREFIX: Record<string, string> = {
  anthropic: "https://academy.claude.com/courses/",
  openai: "https://academy.openai.com/public/courses/",
  microsoft: "https://learn.microsoft.com/pt-br/training/",
};

const tracks = TRAINING_PROGRAMS.flatMap((c) => c.tracks.map((t) => ({ role: c.area, track: t })));
const steps = tracks.flatMap(({ role, track }) => stepsOf(track).map((step) => ({ role, step })));

function total(minutes: { minutes: number }[]): number {
  return minutes.reduce((sum, a) => sum + a.minutes, 0);
}

describe("AI training", () => {
  it("every area has a role, and every role has its training program", () => {
    expect(ROLES.map((p) => p.area).sort()).toEqual(areas.map((a) => a.id).sort());
    expect(TRAINING_PROGRAMS.map((c) => c.area)).toEqual(ROLES.map((p) => p.area));
  });

  it("every role has a track on each platform, with all three phases", () => {
    for (const c of TRAINING_PROGRAMS) expect(c.tracks.map((t) => t.platform)).toEqual(PLATFORMS.map((p) => p.id));
    for (const { role, track } of tracks) {
      for (const phase of PHASES) expect(track.phases[phase.id].length, `${role}/${track.platform}/${phase.id}`).toBeGreaterThan(0);
    }
  });

  it("every step points to an existing course from the track's platform, with no repeats", () => {
    const broken: string[] = [];
    for (const { role, track } of tracks) {
      const ids = stepsOf(track).map((p) => p.courseId);
      if (new Set(ids).size !== ids.length) broken.push(`${role}/${track.platform}: duplicate course`);
      for (const id of ids) {
        const course = getCourse(id);
        if (!course) broken.push(`${role}/${track.platform}: ${id} does not exist`);
        else if (course.platform !== track.platform) broken.push(`${role}/${track.platform}: ${id} belongs to ${course.platform}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it("every course is in some role's track", () => {
    const used = new Set(steps.map(({ step }) => step.courseId));
    expect(COURSES.filter((c) => !used.has(c.id)).map((c) => c.id)).toEqual([]);
  });

  it("every course has a duration, except the exam", () => {
    for (const course of COURSES) expect(Boolean(course.minutes), course.id).toBe(!course.exam);
  });

  it("every lesson list belongs to an Anthropic course, and the course duration is the sum of its lessons", () => {
    for (const [id, lessons] of Object.entries(LESSONS)) {
      expect(getCourse(id)?.platform, id).toBe("anthropic");
      expect(getCourse(id)?.minutes, id).toBe(total(lessons));
      for (const lesson of lessons) expect(lesson.minutes, `${id}/${lesson.slug}`).toBeGreaterThan(0);
    }
  });

  it("a slice starts and ends on lessons of the course, and its duration is their sum", () => {
    for (const { role, step } of steps) {
      if (!step.slice) continue;
      const lessons = lessonsForStep(step);
      expect(lessons.length, `${role}/${step.courseId}`).toBeGreaterThan(0);
      expect(step.slice.minutes, `${role}/${step.courseId}`).toBe(total(lessons));
    }
  });

  it("every course links to its own platform", () => {
    const outside = COURSES.filter((c) => !c.url.startsWith(PLATFORM_URL_PREFIX[c.platform] ?? "-")).map((c) => c.url);
    expect(outside).toEqual([]);
  });

  it("the text has no em dashes, en dashes or curly quotes", () => {
    const text = JSON.stringify([ROLES, TRAINING_PROGRAMS, COURSES, PLATFORMS, LESSONS]);
    expect(text.match(/[—–“”‘’]/g) ?? []).toEqual([]);
  });
});
