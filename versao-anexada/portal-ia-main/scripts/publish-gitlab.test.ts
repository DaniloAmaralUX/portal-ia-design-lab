import { describe, expect, it } from "vitest";
import { createPublisher, type GitlabConfig } from "./publish-gitlab.ts";

// The Merge Request of a request of /publicar, against a GitLab that is a function. What the job of the queue asks of the GitLab is
// read here from calls, so a test sees the branch, the commit and the Merge Request that would exist.
const GITLAB: GitlabConfig = { apiUrl: "https://gitlab.example.com", projectId: "42", token: "glpat-secret" };
const ORIGIN = "https://empresa.sharepoint.com";
const VIDEO = `${ORIGIN}/sites/time/_layouts/15/embed.aspx?UniqueId=abc`;
const INTERVAL = {
  kind: "interval",
  draft: { slug: "revisao-de-pr", title: "Revisão de PR", date: "2026-10-20", minutes: "42", summary: "As seis revisões.", video: VIDEO, text: "O que foi mostrado.", area: "engenharia" },
} as const;
const LESSON = { kind: "lesson", course: "claude-cowork", newCourse: null, lesson: { title: "Aula 4", date: "2026-10-22", minutes: "", summary: "A quarta aula.", video: VIDEO, text: "Texto." } } as const;

type Answers = Record<string, { status: number; body?: unknown }>;

// Answers by "METHOD path", and keeps what it was asked.
function gitlab(answers: Answers, config: GitlabConfig = GITLAB) {
  const calls: { method: string; path: string; token: string | null; body: unknown }[] = [];
  const fetchFake = ((input: string, init: RequestInit) => {
    const url = new URL(input);
    const method = init.method ?? "GET";
    const key = `${method} ${url.pathname.replace(`/api/v4/projects/${encodeURIComponent(config.projectId)}`, "")}`;
    calls.push({ method, path: key, token: new Headers(init.headers).get("PRIVATE-TOKEN"), body: init.body ? (JSON.parse(init.body as string) as unknown) : undefined });
    const answer = answers[key] ?? { status: 404, body: { message: "404 Not Found" } };
    return Promise.resolve(new Response(JSON.stringify(answer.body ?? {}), { status: answer.status }));
  }) as unknown as typeof fetch;
  return { publisher: createPublisher({ gitlab: config, sharepointOrigin: ORIGIN, fetch: fetchFake }), calls };
}

const ok: Answers = {
  "POST /repository/commits": { status: 201 },
  "POST /merge_requests": { status: 201, body: { web_url: "https://gitlab.example.com/portal/-/merge_requests/7" } },
};

describe("the Merge Request of a request of /publicar", () => {
  it("opens it for a break: a commit on a new branch with the file, then the MR, with the token only in the header", async () => {
    const { publisher, calls } = gitlab(ok);
    expect(await publisher.submit(INTERVAL, "Ana Souza")).toEqual({ ok: true, url: "https://gitlab.example.com/portal/-/merge_requests/7", branch: "publicar/intervalo-revisao-de-pr" });
    expect(calls.map((c) => c.path)).toEqual(["POST /repository/commits", "POST /merge_requests"]);
    expect(calls.every((c) => c.token === "glpat-secret")).toBe(true);
    const commit = calls[0]?.body as { branch: string; start_branch: string; commit_message: string; actions: { action: string; file_path: string; content: string }[] };
    expect(commit).toMatchObject({ branch: "publicar/intervalo-revisao-de-pr", start_branch: "main", commit_message: 'feat(academy): publica o intervalo técnico "Revisão de PR"' });
    expect(commit.actions).toHaveLength(1);
    expect(commit.actions[0]).toMatchObject({ action: "create", file_path: "src/content/intervals/revisao-de-pr.md" });
    expect(commit.actions[0]?.content).toContain(`video: ${VIDEO}`);
    expect(calls[1]?.body).toMatchObject({ source_branch: "publicar/intervalo-revisao-de-pr", target_branch: "main", remove_source_branch: true, squash: true });
  });

  it("keeps the subject of the commit within 72 columns, whatever the title", async () => {
    const { publisher, calls } = gitlab(ok);
    const long = { ...INTERVAL, draft: { ...INTERVAL.draft, title: "Um título bem longo para um intervalo técnico que passa muito das setenta e duas colunas do assunto" } };
    expect((await publisher.submit(long, "Ana")).ok).toBe(true);
    const { commit_message: subject } = calls[0]?.body as { commit_message: string };
    expect(subject.length).toBeLessThanOrEqual(72);
    expect(subject.startsWith('feat(academy): publica o intervalo técnico "Um título')).toBe(true);
    expect(subject.endsWith('…"')).toBe(true);
  });

  it("gives a lesson the next number of the course, found in the repository, and puts only the name of the author in the description", async () => {
    const tree = { status: 200, body: [{ type: "blob", name: "course.md" }, { type: "blob", name: "1.md" }, { type: "blob", name: "2.md" }, { type: "blob", name: "3.md" }] };
    const { publisher, calls } = gitlab({ "GET /repository/tree": tree, ...ok });
    expect(await publisher.submit(LESSON, "Ana @souza [x]")).toMatchObject({ ok: true, branch: "publicar/aula-claude-cowork-4" });
    const commit = calls.find((c) => c.path === "POST /repository/commits")?.body as { actions: { file_path: string }[] };
    expect(commit.actions.map((a) => a.file_path)).toEqual(["src/content/trainings/claude-cowork/4.md"]);
    const merge = calls.find((c) => c.path === "POST /merge_requests")?.body as { description: string };
    expect(merge.description).toContain("por Ana souza x.");
    expect(merge.description).not.toMatch(/[@[\]]/);
  });

  it("writes the course.md with the first lesson when the course is new, without asking the repository for a number", async () => {
    const { publisher, calls } = gitlab(ok);
    const newCourse = { slug: "claude-code", title: "Claude Code", summary: "Duas aulas.", area: "engenharia" } as const;
    expect((await publisher.submit({ ...LESSON, course: "claude-code", newCourse }, "Ana")).ok).toBe(true);
    expect(calls.map((c) => c.path)).toEqual(["POST /repository/commits", "POST /merge_requests"]);
    const commit = calls[0]?.body as { actions: { file_path: string }[] };
    expect(commit.actions.map((a) => a.file_path)).toEqual(["src/content/trainings/claude-code/course.md", "src/content/trainings/claude-code/1.md"]);
  });

  it("checks the content again, with the SharePoint of the build, and asks the GitLab nothing for a request that fails", async () => {
    const { publisher, calls } = gitlab(ok);
    const wrongVideo = { ...INTERVAL, draft: { ...INTERVAL.draft, video: "https://empresa-my.sharepoint.com/x" } };
    const result = await publisher.submit(wrongVideo, "Ana");
    expect(result).toMatchObject({ ok: false, status: 422, error: "invalid" });
    expect((result as { problems: Record<string, string> }).problems.video).toContain(ORIGIN);
    expect(await publisher.submit({ ...LESSON, course: "../outro" }, "Ana")).toMatchObject({ ok: false, error: "invalid" });
    expect(calls).toEqual([]);
  });

  it("answers a conflict when the address or the branch is taken, and not found when the course of the lesson does not exist", async () => {
    const taken = gitlab({ "POST /repository/commits": { status: 400, body: { message: "A file with this name already exists" } } });
    expect(await taken.publisher.submit(INTERVAL, "Ana")).toMatchObject({ ok: false, status: 409, error: "conflict", message: "Já existe um conteúdo com este endereço." });
    const branch = gitlab({ "POST /repository/commits": { status: 400, body: { message: "A branch called 'publicar/intervalo-revisao-de-pr' already exists." } } });
    expect(await branch.publisher.submit(INTERVAL, "Ana")).toMatchObject({ ok: false, status: 409, error: "conflict", message: expect.stringContaining("em andamento") as string });
    const missing = gitlab({ "GET /repository/tree": { status: 404, body: { message: "404 Tree Not Found" } } });
    expect(await missing.publisher.submit(LESSON, "Ana")).toMatchObject({ ok: false, status: 404, error: "not_found" });
  });

  it("deletes the branch when the Merge Request fails, and answers a failure of the moment with the reason apart, and no token", async () => {
    const branch = "DELETE /repository/branches/publicar%2Fintervalo-revisao-de-pr";
    const { publisher, calls } = gitlab({ "POST /repository/commits": { status: 201 }, "POST /merge_requests": { status: 500, body: { message: "boom" } }, [branch]: { status: 204 } });
    const result = await publisher.submit(INTERVAL, "Ana");
    expect(result).toMatchObject({ ok: false, status: 502, error: "upstream", detail: expect.stringContaining("merge_request 500") as string });
    expect(calls.at(-1)?.path).toBe(branch);
    expect(JSON.stringify(result)).not.toContain("glpat-secret");
    expect((result as { message: string }).message).not.toContain("boom");
  });

  it("says why the GitLab was not reached, from the cause of the failed fetch", async () => {
    const down = (() => Promise.reject(new TypeError("fetch failed", { cause: Object.assign(new Error("connect timed out"), { code: "UND_ERR_CONNECT_TIMEOUT" }) }))) as unknown as typeof fetch;
    const publisher = createPublisher({ gitlab: GITLAB, sharepointOrigin: ORIGIN, fetch: down });
    expect(await publisher.submit(INTERVAL, "Ana")).toMatchObject({ ok: false, status: 502, detail: "fetch failed (UND_ERR_CONNECT_TIMEOUT)" });
  });

  it("takes the path of the project as the address of the API, with the slash encoded", async () => {
    const urls: string[] = [];
    const fetchFake = ((input: string) => {
      urls.push(input);
      return Promise.resolve(new Response(JSON.stringify({ web_url: "https://gitlab.example.com/portal/-/merge_requests/7" }), { status: 201 }));
    }) as unknown as typeof fetch;
    const publisher = createPublisher({ gitlab: { ...GITLAB, projectId: "pitang-agentic/portal-ia" }, sharepointOrigin: ORIGIN, fetch: fetchFake });
    expect((await publisher.submit(INTERVAL, "Ana")).ok).toBe(true);
    expect(urls[0]).toBe("https://gitlab.example.com/api/v4/projects/pitang-agentic%2Fportal-ia/repository/commits");
  });
});
