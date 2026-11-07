import {
  checkCourse,
  checkInterval,
  checkRecording,
  SLUG,
  type CourseDraft,
  type IntervalDraft,
  type Problems,
  type PublishRequest,
  type Recording,
} from "./publish-files.ts";

// What the BFF and the job of the queue agree on: the request as the browser sends it, the checks it passes before and after the
// queue, and the shape of the object in the bucket. The BFF is the gate (login, list, size), and the job checks again because the
// bucket is not the only door a request could come through.

// What the BFF leaves in the bucket for each request, and what the job reads back.
export type QueueEntry = { version: 1; receivedAt: string; author: string; request: PublishRequest };

const MAX_FIELD = { slug: 80, title: 300, minutes: 8, area: 20, date: 10, summary: 1000, video: 4000, text: 200_000 } as const;
const MAX_AUTHOR = 200;

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

function stringsOf<Key extends string>(value: unknown, limits: Record<Key, number>): Record<Key, string> | null {
  if (!isObject(value)) return null;
  const out: Record<string, string> = {};
  for (const [key, max] of Object.entries<number>(limits)) {
    const field = value[key];
    if (typeof field !== "string" || field.length > max) return null;
    out[key] = field;
  }
  return out;
}

const recordingOf = (value: unknown): Recording | null =>
  stringsOf(value, { title: MAX_FIELD.title, date: MAX_FIELD.date, minutes: MAX_FIELD.minutes, summary: MAX_FIELD.summary, video: MAX_FIELD.video, text: MAX_FIELD.text });

function courseOf(value: unknown): CourseDraft | null {
  const fields = stringsOf(value, { slug: MAX_FIELD.slug, title: MAX_FIELD.title, summary: MAX_FIELD.summary, area: MAX_FIELD.area });
  return fields as CourseDraft | null;
}

// The body is what the person's browser sends, so nothing in it is trusted as typed: a wrong shape is refused here, and the
// content is checked by problemsOf with the same functions as the form.
export function parseRequest(body: unknown): PublishRequest | null {
  if (!isObject(body)) return null;
  if (body.kind === "interval") {
    const recording = recordingOf(body.draft);
    const head = stringsOf(body.draft, { slug: MAX_FIELD.slug, area: MAX_FIELD.area });
    return recording && head ? { kind: "interval", draft: { ...recording, ...head } as IntervalDraft } : null;
  }
  if (body.kind === "lesson") {
    const lesson = recordingOf(body.lesson);
    if (!lesson || typeof body.course !== "string" || body.course.length > MAX_FIELD.slug) return null;
    if (body.newCourse === null) return { kind: "lesson", course: body.course, newCourse: null, lesson };
    const newCourse = courseOf(body.newCourse);
    return newCourse ? { kind: "lesson", course: body.course, newCourse, lesson } : null;
  }
  return null;
}

// The checks that need nothing from the repository. The address already taken and the number of the lesson are the job's, which
// can see the repository.
export function problemsOf(request: PublishRequest, sharepointOrigin: string | null): Problems<string> {
  if (request.kind === "interval") return checkInterval(request.draft, new Set(), sharepointOrigin);
  const { newCourse, lesson } = request;
  const problems: Problems<string> = { ...checkRecording(lesson, sharepointOrigin), ...(newCourse ? checkCourse(newCourse, new Set()) : {}) };
  if (!SLUG.test(request.course)) problems.course = "Escolha um treinamento da lista.";
  if (newCourse && newCourse.slug !== request.course) problems.slug = "O endereço do treinamento não confere com o do formulário.";
  return problems;
}

export function parseQueueEntry(raw: string): QueueEntry | null {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isObject(value) || value.version !== 1) return null;
  const { receivedAt, author } = value;
  if (typeof receivedAt !== "string" || typeof author !== "string" || author.length > MAX_AUTHOR) return null;
  const request = parseRequest(value.request);
  return request ? { version: 1, receivedAt, author, request } : null;
}
