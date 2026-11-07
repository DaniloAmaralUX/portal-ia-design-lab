import { AREA_IDS, type AreaId } from "./area-ids.ts";

// The files that /publicar writes, in the shape that scripts/intervals.ts and scripts/trainings.ts read. The form checks with these
// functions to help the person, and the BFF checks again with the same ones before it opens the Merge Request.

export type Recording = { title: string; date: string; minutes: string; summary: string; video: string; text: string };
export type IntervalDraft = Recording & { slug: string; area: AreaId | "" };
export type CourseDraft = { slug: string; title: string; summary: string; area: AreaId | "" };
export type GeneratedFile = { path: string; content: string };
export type Problems<Field extends string> = Partial<Record<Field, string>>;

// What the form sends to /api/publish. A lesson of a course that exists names the course and leaves newCourse null, and the BFF
// finds the number of the lesson in the repository. A new course brings its own head, and its slug is the course.
export type PublishRequest =
  | { kind: "interval"; draft: IntervalDraft }
  | { kind: "lesson"; course: string; newCourse: CourseDraft | null; lesson: Recording };

export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const AREA_LIST: readonly string[] = AREA_IDS;

// Stream hands out the embed code, an <iframe>, and the file needs only its src. Pasting the whole code works too.
export function videoAddress(input: string): string {
  const src = /<iframe[^>]*\ssrc="([^"]+)"/i.exec(input)?.[1];
  return (src ?? input).replaceAll("&amp;", "&").trim();
}

function videoProblem(input: string, sharepointOrigin: string | null): string | undefined {
  const value = videoAddress(input);
  if (!value) return "Cole o endereço da gravação ou o código de incorporação do Stream.";
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return "O endereço não é um link. Cole o src do código de incorporação do Stream.";
  }
  if (url.protocol !== "https:" || !url.hostname.endsWith(".sharepoint.com")) return "A gravação precisa estar no SharePoint da Pitang, num endereço https.";
  // The build refuses a video outside SHAREPOINT_ORIGIN, so the BFF, which knows it, refuses before the Merge Request exists.
  return sharepointOrigin && url.origin !== sharepointOrigin ? `A gravação precisa estar em ${sharepointOrigin}.` : undefined;
}

export function checkRecording(draft: Recording, sharepointOrigin: string | null = null): Problems<keyof Recording> {
  const problems: Problems<keyof Recording> = {};
  if (!draft.title.trim()) problems.title = "Escreva o título.";
  if (!DATE.test(draft.date) || Number.isNaN(Date.parse(`${draft.date}T00:00:00Z`))) problems.date = "Escolha a data da gravação.";
  const minutes = draft.minutes.trim();
  if (minutes && !/^[1-9]\d*$/.test(minutes)) problems.minutes = "Escreva os minutos inteiros da gravação, como 42, ou deixe em branco.";
  if (!draft.summary.trim()) problems.summary = "Escreva o resumo, a frase que aparece no cartão.";
  const video = videoProblem(draft.video, sharepointOrigin);
  if (video) problems.video = video;
  if (!draft.text.trim()) problems.text = "Escreva o texto que explica o que foi mostrado.";
  return problems;
}

function slugProblem(slug: string, taken: ReadonlySet<string>, what: string): string | undefined {
  if (!SLUG.test(slug)) return "Use só letras minúsculas sem acento, números e hífens, como revisao-de-pr.";
  return taken.has(slug) ? `Já existe ${what} com este endereço. Escolha outro.` : undefined;
}

export function checkInterval(draft: IntervalDraft, taken: ReadonlySet<string>, sharepointOrigin: string | null = null): Problems<keyof IntervalDraft> {
  const problems: Problems<keyof IntervalDraft> = checkRecording(draft, sharepointOrigin);
  const slug = slugProblem(draft.slug, taken, "um intervalo");
  if (slug) problems.slug = slug;
  if (draft.area && !AREA_LIST.includes(draft.area)) problems.area = "Escolha uma das áreas da lista.";
  return problems;
}

export function checkCourse(draft: CourseDraft, taken: ReadonlySet<string>): Problems<keyof CourseDraft> {
  const problems: Problems<keyof CourseDraft> = {};
  const slug = slugProblem(draft.slug, taken, "um treinamento");
  if (slug) problems.slug = slug;
  if (!draft.title.trim()) problems.title = "Escreva o nome do treinamento.";
  if (!draft.summary.trim()) problems.summary = "Escreva o resumo do treinamento.";
  if (draft.area && !AREA_LIST.includes(draft.area)) problems.area = "Escolha uma das áreas da lista.";
  return problems;
}

// The head is one field per line, and the parsers read a line as name: value, so a value never breaks the line.
const oneLine = (value: string) => value.replace(/\s+/g, " ").trim();

function fileOf(head: [string, string][], text?: string): string {
  const lines = head.filter(([, value]) => oneLine(value)).map(([name, value]) => `${name}: ${oneLine(value)}`);
  const body = text?.replace(/\r\n?/g, "\n").trim();
  return `---\n${lines.join("\n")}\n---\n${body ? `\n${body}\n` : ""}`;
}

const areaOf = (area: string) => (AREA_LIST.includes(area) ? area : "");

const recordingHead = (draft: Recording): [string, string][] => [
  ["title", draft.title],
  ["date", draft.date],
  ["summary", draft.summary],
  ["video", videoAddress(draft.video)],
];

export function intervalFile(draft: IntervalDraft): GeneratedFile {
  return {
    path: `src/content/intervals/${draft.slug}.md`,
    content: fileOf([...recordingHead(draft), ["area", areaOf(draft.area)], ["minutes", draft.minutes]], draft.text),
  };
}

export function courseFile(draft: CourseDraft): GeneratedFile {
  return {
    path: `src/content/trainings/${draft.slug}/course.md`,
    content: fileOf([
      ["title", draft.title],
      ["summary", draft.summary],
      ["area", areaOf(draft.area)],
    ]),
  };
}

export function lessonFile(course: string, number: number, draft: Recording): GeneratedFile {
  return { path: `src/content/trainings/${course}/${number}.md`, content: fileOf([...recordingHead(draft), ["minutes", draft.minutes]], draft.text) };
}
