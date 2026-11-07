import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { areas } from "../src/data/areas.ts";
import type { AreaId, Training, TrainingCourse } from "../src/data/types.ts";
import { buildConfig } from "./build-config.ts";

const INDEX = "virtual:trainings";
const TEXT = "virtual:trainings-text";
const COURSE_FILE = "course.md";
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const NUMBER = /^[1-9]\d*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const COURSE_FIELDS = ["title", "summary", "area"] as const;
const LESSON_FIELDS = ["title", "date", "minutes", "summary", "video"] as const;
const AREA_IDS: readonly string[] = areas.map((a) => a.id);

type Course = Omit<TrainingCourse, "lessons">;
type Lesson = Omit<Training, "course" | "area">;
type ParsedLesson = { training: Lesson; text: string };
type Read = { courses: TrainingCourse[]; texts: Map<string, string> };

function headOf(file: string, source: string, fields: readonly string[]): { head: Record<string, string>; text: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) throw new Error(`${file}: the file must start with the head between two --- lines.`);
  const head: Record<string, string> = {};
  for (const line of (match[1] ?? "").split(/\r?\n/)) {
    if (!line.trim()) continue;
    const field = /^([a-z]+):\s*(.*)$/.exec(line);
    if (!field) throw new Error(`${file}: "${line}" is not a field of the head, like title: Capacitação React.`);
    const [, name = "", raw = ""] = field;
    if (!fields.includes(name)) throw new Error(`${file}: the head has no field ${name}. The fields are ${fields.join(", ")}.`);
    if (name in head) throw new Error(`${file}: the field ${name} repeats.`);
    head[name] = raw.trim().replace(/^"(.*)"$/, "$1");
  }
  return { head, text: (match[2] ?? "").trim() };
}

function slugOf(file: string, name: string): string {
  if (!SLUG.test(name)) throw new Error(`${file}: the name is the address of the page, in lowercase letters, digits and dashes.`);
  return name;
}

function videoOf(file: string, value: string, sharepointOrigin: string | null): string {
  if (!sharepointOrigin) {
    throw new Error(
      `${file}: the recording plays from SharePoint, and SHAREPOINT_ORIGIN is missing. Put the origin of the recording in the .env, like SHAREPOINT_ORIGIN=https://empresa.sharepoint.com (see .env.example).`,
    );
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${file}: video must be the address of the recording, the src of the embed code of Stream. Got "${value}".`);
  }
  if (url.protocol !== "https:" || !url.hostname.endsWith(".sharepoint.com")) throw new Error(`${file}: video must be an https address of SharePoint.`);
  if (url.origin !== sharepointOrigin) throw new Error(`${file}: video must be in ${sharepointOrigin}, the SHAREPOINT_ORIGIN. Got ${url.origin}.`);
  return url.href;
}

export function parseCourse(file: string, source: string): Course {
  const slug = slugOf(file, path.basename(path.dirname(file)));
  const { head, text } = headOf(file, source, COURSE_FIELDS);
  for (const name of ["title", "summary"]) if (!head[name]) throw new Error(`${file}: the head is missing ${name}.`);
  const area = head.area || null;
  if (area !== null && !AREA_IDS.includes(area)) throw new Error(`${file}: area must be one of ${AREA_IDS.join(", ")}, or left out for every area. Got "${area}".`);
  if (text) throw new Error(`${file}: the file of the course has only the head. The text goes in the file of each lesson.`);
  return { slug, title: head.title ?? "", summary: head.summary ?? "", area: area as AreaId | null };
}

export function parseTraining(file: string, source: string, sharepointOrigin: string | null): ParsedLesson {
  const name = path.basename(file, ".md");
  if (!NUMBER.test(name)) throw new Error(`${file}: the name of the file is the number of the lesson, like 1.md, and the number is the address of its page.`);
  const { head, text } = headOf(file, source, LESSON_FIELDS);
  for (const field of ["title", "date", "summary", "video"]) if (!head[field]) throw new Error(`${file}: the head is missing ${field}.`);
  const date = head.date ?? "";
  if (!DATE.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) throw new Error(`${file}: date must be a day like 2026-10-15. Got "${date}".`);
  const minutes = head.minutes ? Number(head.minutes) : null;
  if (minutes !== null && (!Number.isInteger(minutes) || minutes < 1)) throw new Error(`${file}: minutes must be the whole minutes of the recording, like 42. Got "${head.minutes}".`);
  if (!text) throw new Error(`${file}: the text that explains the lesson goes under the head, and it is empty.`);
  return {
    training: { number: Number(name), title: head.title ?? "", date, minutes, summary: head.summary ?? "", video: videoOf(file, head.video ?? "", sharepointOrigin) },
    text,
  };
}

// Each folder of src/content/trainings is a course: its course.md has the head of the course, and the other files are its lessons,
// named by their numbers, from 1 with no gap. The newest course, by its last lesson, comes first.
export function readCourses(folder: string, sharepointOrigin: string | null): Read {
  const texts = new Map<string, string>();
  const courses: TrainingCourse[] = [];
  if (!existsSync(folder)) return { courses, texts };
  for (const entry of readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const where = `src/content/trainings/${entry.name}`;
    if (!entry.isDirectory()) throw new Error(`${where}: each lesson lives in the folder of its course, like src/content/trainings/claude-cowork/aula-1.md.`);
    const dir = path.join(folder, entry.name);
    if (!existsSync(path.join(dir, COURSE_FILE))) throw new Error(`${where}: the folder of the course needs a ${COURSE_FILE}, with the title, the summary and the area.`);
    const course = parseCourse(`${where}/${COURSE_FILE}`, readFileSync(path.join(dir, COURSE_FILE), "utf8"));
    const names = readdirSync(dir).filter((name) => name.endsWith(".md") && name !== COURSE_FILE);
    if (names.length === 0) throw new Error(`${where}: the course has no lesson. Each lesson is a .md file next to the ${COURSE_FILE}, named by its number, like 1.md.`);
    const lessons = names
      .map((name) => {
        const { training, text } = parseTraining(`${where}/${name}`, readFileSync(path.join(dir, name), "utf8"), sharepointOrigin);
        texts.set(`${course.slug}/${training.number}`, text);
        return { ...training, course: course.slug, area: course.area };
      })
      .sort((a, b) => a.number - b.number);
    lessons.forEach((lesson, i) => {
      if (lesson.number !== i + 1) throw new Error(`${where}: the lessons are numbered from 1 with no gap, and lesson ${i + 1} is missing.`);
    });
    courses.push({ ...course, lessons });
  }
  const last = (c: TrainingCourse) => c.lessons.reduce((max, l) => (l.date > max ? l.date : max), "");
  return { courses: courses.sort((a, b) => last(b).localeCompare(last(a)) || a.title.localeCompare(b.title)), texts };
}

export function trainings(options: { sharepointOrigin?: string | null } = {}): Plugin {
  let folder = "";
  const read = (): Read =>
    readCourses(folder, options.sharepointOrigin === undefined ? buildConfig().sharepointOrigin : options.sharepointOrigin);

  return {
    name: "pitang-trainings",
    configResolved(config) {
      folder = path.join(config.root, "src/content/trainings");
    },
    configureServer(server) {
      server.watcher.add(folder);
      const refresh = (file: string) => {
        if (path.relative(folder, file).startsWith("..") || !file.endsWith(".md")) return;
        for (const id of [`\0${INDEX}`, `\0${TEXT}`]) {
          const module = server.moduleGraph.getModuleById(id);
          if (module) server.moduleGraph.invalidateModule(module);
        }
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", refresh);
      server.watcher.on("unlink", refresh);
    },
    resolveId(id) {
      return id === INDEX || id === TEXT || id.startsWith(`${TEXT}/`) ? `\0${id}` : undefined;
    },
    load(id) {
      if (!id.startsWith(`\0${INDEX}`) && !id.startsWith(`\0${TEXT}`)) return undefined;
      const { courses, texts } = read();
      for (const course of courses) {
        this.addWatchFile(path.join(folder, course.slug, COURSE_FILE));
        for (const lesson of course.lessons) this.addWatchFile(path.join(folder, course.slug, `${lesson.number}.md`));
      }
      if (id === `\0${INDEX}`) return `export const courses = ${JSON.stringify(courses)};\n`;
      if (id === `\0${TEXT}`) {
        const entries = [...texts.keys()].map((key) => `  ${JSON.stringify(key)}: () => import(${JSON.stringify(`${TEXT}/${key}`)}),`);
        return `export const trainingText = {\n${entries.join("\n")}\n};\n`;
      }
      const key = id.slice(`\0${TEXT}/`.length);
      const text = texts.get(key);
      if (text === undefined) throw new Error(`There is no lesson ${key}.`);
      return `export const source = ${JSON.stringify(text)};\n`;
    },
  };
}
