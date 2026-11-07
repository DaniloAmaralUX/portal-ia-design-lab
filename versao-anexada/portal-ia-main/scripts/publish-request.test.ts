import { describe, expect, it } from "vitest";
import { parseQueueEntry, parseRequest, problemsOf } from "../src/shared/publish-request.ts";

const ORIGIN = "https://empresa.sharepoint.com";
const VIDEO = `${ORIGIN}/sites/time/_layouts/15/embed.aspx?UniqueId=abc`;
const RECORDING = { title: "Aula 4", date: "2026-10-22", minutes: "", summary: "A quarta aula.", video: VIDEO, text: "Texto." };
const INTERVAL = { kind: "interval", draft: { ...RECORDING, slug: "revisao-de-pr", area: "engenharia" } };
const LESSON = { kind: "lesson", course: "claude-cowork", newCourse: null, lesson: RECORDING };

describe("the request of /publicar, as the browser sends it", () => {
  it("is read when it has the shape of a break or of a lesson, and keeps only the fields of that shape", () => {
    expect(parseRequest(INTERVAL)).toEqual(INTERVAL);
    expect(parseRequest(LESSON)).toEqual(LESSON);
    const withExtra = { ...INTERVAL, draft: { ...INTERVAL.draft, admin: true }, other: 1 };
    expect(parseRequest(withExtra)).toEqual(INTERVAL);
  });

  it("is refused when a field is missing, is not text, is too long, or the kind is unknown", () => {
    expect(parseRequest(null)).toBeNull();
    expect(parseRequest([])).toBeNull();
    expect(parseRequest({ kind: "other" })).toBeNull();
    expect(parseRequest({ ...INTERVAL, draft: { ...INTERVAL.draft, title: 1 } })).toBeNull();
    expect(parseRequest({ ...INTERVAL, draft: { ...INTERVAL.draft, title: "x".repeat(301) } })).toBeNull();
    expect(parseRequest({ ...LESSON, course: 7 })).toBeNull();
    expect(parseRequest({ ...LESSON, newCourse: { slug: "x" } })).toBeNull();
    const { slug: _slug, ...noSlug } = INTERVAL.draft;
    expect(parseRequest({ ...INTERVAL, draft: noSlug })).toBeNull();
  });
});

describe("the checks that need nothing from the repository", () => {
  it("pass a complete request, for a break and for a lesson", () => {
    expect(problemsOf(parseRequest(INTERVAL)!, ORIGIN)).toEqual({});
    expect(problemsOf(parseRequest(LESSON)!, ORIGIN)).toEqual({});
  });

  it("name each problem: the video outside the SharePoint of the build, a course that is not an address, a new course that does not match", () => {
    expect(problemsOf(parseRequest({ ...INTERVAL, draft: { ...INTERVAL.draft, video: "https://empresa-my.sharepoint.com/x" } })!, ORIGIN).video).toContain(ORIGIN);
    expect(problemsOf(parseRequest({ ...LESSON, course: "../x" })!, ORIGIN).course).toBeDefined();
    const newCourse = { slug: "claude-code", title: "Claude Code", summary: "Duas aulas.", area: "" };
    expect(problemsOf(parseRequest({ ...LESSON, course: "outro", newCourse })!, ORIGIN).slug).toBeDefined();
    expect(problemsOf(parseRequest({ ...LESSON, course: "claude-code", newCourse })!, ORIGIN)).toEqual({});
  });
});

describe("the object that the portal leaves in the bucket", () => {
  const entry = { version: 1, receivedAt: "2026-10-28T12:00:00.000Z", author: "Ana Souza", request: INTERVAL };

  it("is read back as it was written", () => {
    expect(parseQueueEntry(JSON.stringify(entry))).toEqual(entry);
  });

  it("is refused when it is not JSON, has another version, or carries a request that is not one", () => {
    expect(parseQueueEntry("not json")).toBeNull();
    expect(parseQueueEntry(JSON.stringify({ ...entry, version: 2 }))).toBeNull();
    expect(parseQueueEntry(JSON.stringify({ ...entry, author: "x".repeat(201) }))).toBeNull();
    expect(parseQueueEntry(JSON.stringify({ ...entry, request: { kind: "interval" } }))).toBeNull();
  });
});
