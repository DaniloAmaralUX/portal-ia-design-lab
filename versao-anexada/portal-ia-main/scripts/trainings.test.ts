import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseCourse, parseTraining, readCourses } from "./trainings.ts";

const ORIGIN = "https://empresa.sharepoint.com";
const VIDEO = `${ORIGIN}/sites/time/_layouts/15/embed.aspx?UniqueId=abc&embed=%7B%7D`;
const COURSE_FILE = "src/content/trainings/claude-cowork/course.md";
const LESSON_FILE = "src/content/trainings/claude-cowork/1.md";

function source(head: Record<string, string>, text = "") {
  return `---\n${Object.entries(head)
    .map(([name, value]) => `${name}: ${value}`)
    .join("\n")}\n---\n${text ? `\n${text}\n` : ""}`;
}

const COURSE = { title: "Claude Cowork", summary: "Três aulas para as áreas de meio.", area: "meio" };
const LESSON = { title: "Aula 1", date: "2026-09-15", minutes: "125", summary: "A primeira aula.", video: VIDEO };

describe("a course of the trainings, read from its course.md", () => {
  it("takes the address from the name of the folder, and the title, the summary and the area from the head", () => {
    expect(parseCourse(COURSE_FILE, source(COURSE))).toEqual({ slug: "claude-cowork", ...COURSE });
  });

  it("takes a course of every area when the head leaves the area out", () => {
    const { area: _area, ...head } = COURSE;
    expect(parseCourse(COURSE_FILE, source(head)).area).toBeNull();
  });

  it.each([
    ["a missing title", source({ ...COURSE, title: "" }), "missing title"],
    ["a field of a lesson", source({ ...COURSE, video: VIDEO }), "no field video"],
    ["an area the site does not have", source({ ...COURSE, area: "design" }), "area must be one of"],
    ["a text under the head", source(COURSE, "O curso."), "has only the head"],
  ])("refuses %s, and names the file", (_name, text, message) => {
    expect(() => parseCourse(COURSE_FILE, text)).toThrow(message);
    expect(() => parseCourse(COURSE_FILE, text)).toThrow(COURSE_FILE);
  });
});

describe("a lesson, read from its file", () => {
  it("reads the head and the text, and takes the number of the lesson from the name of the file", () => {
    expect(parseTraining(LESSON_FILE, source(LESSON, "O que foi mostrado."), ORIGIN)).toEqual({
      training: { number: 1, title: "Aula 1", date: "2026-09-15", minutes: 125, summary: "A primeira aula.", video: VIDEO },
      text: "O que foi mostrado.",
    });
  });

  it.each([
    ["an area, which comes from the course", source({ ...LESSON, area: "meio" }, "Texto."), "no field area"],
    ["a video in another SharePoint", source({ ...LESSON, video: "https://outra.sharepoint.com/x" }, "Texto."), "must be in https://empresa.sharepoint.com"],
    ["an empty text", source(LESSON), "the text that explains the lesson"],
  ])("refuses %s, and names the file", (_name, text, message) => {
    expect(() => parseTraining(LESSON_FILE, text, ORIGIN)).toThrow(message);
    expect(() => parseTraining(LESSON_FILE, text, ORIGIN)).toThrow(LESSON_FILE);
  });

  it.each(["aula-1.md", "0.md", "01.md"])("refuses a lesson named %s, since the name is the number of the lesson", (name) => {
    expect(() => parseTraining(`src/content/trainings/claude-cowork/${name}`, source(LESSON, "Texto."), ORIGIN)).toThrow("the number of the lesson");
  });
});

describe("the folder of the trainings", () => {
  let root = "";
  afterEach(() => rmSync(root, { recursive: true, force: true }));

  function folder(files: Record<string, string>): string {
    root = mkdtempSync(path.join(tmpdir(), "trainings-"));
    for (const [name, text] of Object.entries(files)) {
      mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
      writeFileSync(path.join(root, name), text);
    }
    return root;
  }

  const lesson = (title: string, date: string) => source({ ...LESSON, title, date }, "Texto.");

  it("makes a course of each folder, with the lessons in the order of their numbers and the area of the course, the newest course first", () => {
    const { courses, texts } = readCourses(
      folder({
        "claude-cowork/course.md": source(COURSE),
        ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`claude-cowork/${i + 1}.md`, lesson(`Aula ${i + 1}`, "2026-09-15")])),
        "react/course.md": source({ title: "React", summary: "Hooks." }),
        "react/1.md": lesson("Hooks", "2026-08-01"),
      }),
      ORIGIN,
    );
    expect(courses.map((c) => c.slug)).toEqual(["claude-cowork", "react"]);
    expect(courses[0]?.lessons.map((l) => l.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(courses[0]?.lessons.every((l) => l.course === "claude-cowork" && l.area === "meio")).toBe(true);
    expect(courses[1]?.lessons[0]?.area).toBeNull();
    expect(texts.get("claude-cowork/10")).toBe("Texto.");
    expect(texts.has("react/1")).toBe(true);
  });

  it("has no course when the folder does not exist", () => {
    expect(readCourses(path.join(tmpdir(), "no-trainings-here"), ORIGIN).courses).toEqual([]);
  });

  it.each([
    ["a lesson outside the folder of a course", { "1.md": lesson("Aula 1", "2026-09-15") }, "lives in the folder of its course"],
    ["a folder without course.md", { "claude-cowork/1.md": lesson("Aula 1", "2026-09-15") }, "needs a course.md"],
    ["a course without lessons", { "claude-cowork/course.md": source(COURSE) }, "has no lesson"],
    [
      "a gap in the numbers of the lessons",
      { "claude-cowork/course.md": source(COURSE), "claude-cowork/1.md": lesson("Aula 1", "2026-09-15"), "claude-cowork/3.md": lesson("Aula 3", "2026-09-24") },
      "lesson 2 is missing",
    ],
  ])("refuses %s", (_name, files, message) => {
    expect(() => readCourses(folder(files), ORIGIN)).toThrow(message);
  });
});
