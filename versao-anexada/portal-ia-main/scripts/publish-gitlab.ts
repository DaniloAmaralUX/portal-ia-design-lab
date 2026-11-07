import { courseFile, intervalFile, lessonFile, type GeneratedFile, type Problems, type PublishRequest } from "../src/shared/publish-files.ts";
import { problemsOf } from "../src/shared/publish-request.ts";

// The Merge Request of a request of /publicar, opened through the API of the GitLab. It runs in the job of the queue, which is
// inside the network of the GitLab: the portal never calls it.

export type GitlabConfig = { apiUrl: string; projectId: string; token: string };

export type PublishResult =
  | { ok: true; url: string; branch: string }
  // detail goes to the log of the job and never to the person: it can carry what the GitLab answered.
  | { ok: false; status: 404 | 409 | 422 | 502; error: "invalid" | "not_found" | "conflict" | "upstream"; message: string; problems?: Record<string, string>; detail?: string };

type Failure = Extract<PublishResult, { ok: false }>;
type Reply = { status: number; body: unknown };

// The branch every Merge Request goes to. The skills repository triggers the portal on this one too (its atualiza-portal job).
const TARGET_BRANCH = "main";
const TIMEOUT_MS = 15_000;

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

const invalid = (problems: Problems<string>): Failure => ({
  ok: false,
  status: 422,
  error: "invalid",
  message: "O formulário tem campos para corrigir.",
  problems: Object.fromEntries(Object.entries(problems).filter((entry): entry is [string, string] => typeof entry[1] === "string")),
});

// The name enters the description of the Merge Request, where an @ would notify someone and a bracket would draw a link.
const safeName = (name: string) => name.replace(/[@`[\]<>\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 100) || "alguém do portal";
const short = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

// The subject of a commit has at most 72 columns (AGENTS.md), so the title takes what the fixed words around it leave.
const SUBJECT_COLUMNS = 72;
const subjectOf = (head: string, title: string, tail = "") => `${head}${short(title, SUBJECT_COLUMNS - head.length - tail.length)}${tail}`;
const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();

type Plan = { files: GeneratedFile[]; branch: string; commit: string; title: string };

// A failed fetch says only "fetch failed": the reason (a timeout, a refused connection, a certificate) is in the cause, and it is
// what tells a network problem from a wrong address. The token is in the headers and never in the error.
function detailOf(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const cause = error.cause;
  const reason = cause instanceof Error ? ((cause as Error & { code?: string }).code ?? cause.message) : undefined;
  return reason ? `${error.message} (${reason})` : error.message;
}

export function createPublisher({ gitlab, sharepointOrigin, fetch: fetchImpl = fetch }: { gitlab: GitlabConfig; sharepointOrigin: string | null; fetch?: typeof fetch }) {
  const project = `${gitlab.apiUrl}/api/v4/projects/${encodeURIComponent(gitlab.projectId)}`;

  // The token travels in a header to the address of the configuration only, and a redirect is an error: it would take the token elsewhere.
  async function call(method: string, path: string, body?: unknown): Promise<Reply> {
    const response = await fetchImpl(`${project}${path}`, {
      method,
      headers: { "PRIVATE-TOKEN": gitlab.token, ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
      body: body === undefined ? undefined : JSON.stringify(body),
      redirect: "error",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const text = await response.text();
    try {
      return { status: response.status, body: text ? (JSON.parse(text) as unknown) : null };
    } catch {
      return { status: response.status, body: text };
    }
  }

  const upstream = (detail: string): Failure => ({ ok: false, status: 502, error: "upstream", message: "O GitLab não respondeu como esperado. A solicitação continua na fila.", detail });
  const messageOf = (reply: Reply) => (isObject(reply.body) ? JSON.stringify(reply.body.message ?? reply.body.error ?? "") : String(reply.body)).slice(0, 300);

  // How many lessons the course has now, so the new one takes the next number and the lessons stay numbered from 1 with no gap.
  async function nextLesson(course: string): Promise<number | Failure> {
    const reply = await call("GET", `/repository/tree?path=${encodeURIComponent(`src/content/trainings/${course}`)}&ref=${TARGET_BRANCH}&per_page=100`);
    if (reply.status === 404) return { ok: false, status: 404, error: "not_found", message: "Esse treinamento não existe no repositório." };
    if (reply.status !== 200 || !Array.isArray(reply.body)) return upstream(`tree ${reply.status} ${messageOf(reply)}`);
    return reply.body.filter((item) => isObject(item) && item.type === "blob" && typeof item.name === "string" && /^[1-9]\d*\.md$/.test(item.name)).length + 1;
  }

  async function planOf(request: PublishRequest): Promise<Plan | Failure> {
    const problems = problemsOf(request, sharepointOrigin);
    if (Object.keys(problems).length > 0) return invalid(problems);
    if (request.kind === "interval") {
      const { draft } = request;
      return {
        files: [intervalFile(draft)],
        branch: `publicar/intervalo-${draft.slug}`,
        commit: subjectOf('feat(academy): publica o intervalo técnico "', oneLine(draft.title), '"'),
        title: `Publica o intervalo técnico: ${short(oneLine(draft.title), 100)}`,
      };
    }
    const { newCourse, lesson } = request;
    const number = newCourse ? 1 : await nextLesson(request.course);
    if (typeof number !== "number") return number;
    const files = [...(newCourse ? [courseFile(newCourse)] : []), lessonFile(request.course, number, lesson)];
    return {
      files,
      branch: `publicar/aula-${request.course}-${number}`,
      commit: subjectOf(`feat(academy): publica a aula ${number} de `, request.course),
      title: `Publica a aula ${number} de ${short(oneLine(newCourse?.title ?? request.course), 80)}: ${short(oneLine(lesson.title), 80)}`,
    };
  }

  // The commit goes to a new branch from the target, and "create" fails when the file is there: that is the check that the address is free.
  async function openMergeRequest(request: PublishRequest, author: string): Promise<PublishResult> {
    const plan = await planOf(request);
    if (!("files" in plan)) return plan;
    const commit = await call("POST", "/repository/commits", {
      branch: plan.branch,
      start_branch: TARGET_BRANCH,
      commit_message: plan.commit,
      actions: plan.files.map((file) => ({ action: "create", file_path: file.path, content: file.content })),
    });
    if (commit.status !== 201) {
      const text = messageOf(commit);
      if (commit.status === 400 && /branch called/i.test(text)) {
        return { ok: false, status: 409, error: "conflict", message: "Já existe um envio em andamento para este conteúdo.", detail: `commit ${commit.status} ${text}` };
      }
      if (commit.status === 400 && /already exists/i.test(text)) {
        return { ok: false, status: 409, error: "conflict", message: "Já existe um conteúdo com este endereço.", detail: `commit ${commit.status} ${text}` };
      }
      return upstream(`commit ${commit.status} ${text}`);
    }
    const description = [
      `Enviado pelo /publicar por ${safeName(author)}.`,
      "",
      "Arquivos:",
      ...plan.files.map((file) => `- \`${file.path}\``),
      "",
      "O pipeline do Merge Request monta o portal com o arquivo. Confira o texto e a gravação antes do merge.",
    ].join("\n");
    const merge = await call("POST", "/merge_requests", {
      source_branch: plan.branch,
      target_branch: TARGET_BRANCH,
      title: plan.title,
      description,
      remove_source_branch: true,
      squash: true,
    });
    const url = isObject(merge.body) ? merge.body.web_url : undefined;
    if (merge.status !== 201 || typeof url !== "string") {
      // Without the Merge Request the branch is a leftover that would block the next try with the same address.
      await call("DELETE", `/repository/branches/${encodeURIComponent(plan.branch)}`).catch(() => undefined);
      return upstream(`merge_request ${merge.status} ${messageOf(merge)}`);
    }
    return { ok: true, url, branch: plan.branch };
  }

  return {
    async submit(request: PublishRequest, author: string): Promise<PublishResult> {
      try {
        return await openMergeRequest(request, author);
      } catch (error) {
        return upstream(detailOf(error));
      }
    },
  };
}
