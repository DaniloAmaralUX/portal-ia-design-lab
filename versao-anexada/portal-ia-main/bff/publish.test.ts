import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createPortalApp, type Claims, type Oidc } from "./app.ts";
import type { LogEntry } from "./log.ts";
import type { Queue } from "./queue.ts";

// The route that puts a request in the queue, with a queue that is a function. The login is a test one, which hands out the claims
// of the account that the code names: ana is on the list of who publishes in most tests, and other never is.
const TENANT_ID = "00000000-0000-4000-8000-000000000001";
const ISSUER = `https://login.microsoftonline.com/${TENANT_ID}/v2.0`;
const ACCOUNTS: Record<string, Claims> = {
  ana: { tid: TENANT_ID, iss: ISSUER, acct: 0, oid: "oid-ana", name: "Ana Souza", preferred_username: "ana.souza@pitang.com" },
  other: { tid: TENANT_ID, iss: ISSUER, acct: 0, oid: "oid-other", name: "Outra Pessoa", preferred_username: "outra.pessoa@pitang.com" },
};
const oidc: Oidc = {
  authorizationUrl: (attempt) => Promise.resolve(`https://login.example/authorize?state=${attempt.state}`),
  exchangeCode: (url, attempt) => {
    const account = ACCOUNTS[url.searchParams.get("code") ?? ""];
    return url.searchParams.get("state") === attempt.state && account ? Promise.resolve(account) : Promise.reject(new Error("invalid code or state"));
  },
  logoutUrl: () => "https://login.example/logout",
};
const PASSWORDS = { 1: "s".repeat(48) };

let folder = "";
const logged: LogEntry[] = [];

type Publishing = { queue?: Queue | null; sharepointOrigin?: string | null };

function createApp(publisherEmails: string[] = [], publishing: Publishing = {}) {
  return createPortalApp({
    root: path.join(folder, "dist"),
    siteVersion: "1.2.3",
    publicUrl: "http://portal.test",
    tenantId: TENANT_ID,
    sessionPasswords: PASSWORDS,
    publisherEmails,
    ...publishing,
    oidc,
    log: (entry) => void logged.push(entry),
  });
}

const pair = (setCookie: string) => setCookie.split(";")[0] ?? "";

async function logInAs(app: ReturnType<typeof createApp>, code: string) {
  const attempt = await app.request("/auth/login");
  const state = new URL(attempt.headers.get("location") ?? "").searchParams.get("state") ?? "";
  const loginCookie = pair(attempt.headers.getSetCookie()[0] ?? "");
  const response = await app.request(`/auth/callback?code=${code}&state=${encodeURIComponent(state)}`, { headers: { cookie: loginCookie } });
  const session = response.headers.getSetCookie().find((c) => c.includes("portal-session=") && !c.includes("Max-Age=0")) ?? "";
  return { cookie: pair(session) };
}

beforeAll(() => {
  folder = mkdtempSync(path.join(tmpdir(), "portal-publish-"));
  // The app asks for the shell of the site at the root, and these tests never read it.
  mkdirSync(path.join(folder, "dist"));
  writeFileSync(path.join(folder, "dist", "index.html"), "<!DOCTYPE html><html><body></body></html>");
});

afterAll(() => {
  rmSync(folder, { recursive: true, force: true });
});

beforeEach(() => {
  logged.length = 0;
});

describe("POST /api/publish", () => {
  const ORIGIN = "https://empresa.sharepoint.com";
  const VIDEO = `${ORIGIN}/sites/time/_layouts/15/embed.aspx?UniqueId=abc`;
  const INTERVAL = {
    kind: "interval",
    draft: { slug: "revisao-de-pr", title: "Revisão de PR", date: "2026-10-20", minutes: "42", summary: "As seis revisões.", video: VIDEO, text: "O que foi mostrado.", area: "engenharia" },
  };
  const LESSON = { kind: "lesson", course: "claude-cowork", newCourse: null, lesson: { title: "Aula 4", date: "2026-10-22", minutes: "", summary: "A quarta aula.", video: VIDEO, text: "Texto." } };
  const headers = (cookie: string, extra: Record<string, string> = {}) => ({ cookie, "content-type": "application/json", "x-portal": "publish", ...extra });
  const post = (app: ReturnType<typeof createApp>, cookie: string, body: unknown, extra: Record<string, string> = {}) =>
    app.request("/api/publish", { method: "POST", headers: headers(cookie, extra), body: typeof body === "string" ? body : JSON.stringify(body) });

  // A queue that keeps what it is given, or fails when it is told to.
  function queue(failure?: Error) {
    const added: { request: unknown; author: string }[] = [];
    const fake: Queue = {
      add: (request, author) => {
        if (failure) return Promise.reject(failure);
        added.push({ request, author });
        return Promise.resolve();
      },
    };
    return { fake, added };
  }
  const appWith = (q: Queue | null, emails = ["ana.souza@pitang.com"]) => createApp(emails, { queue: q, sharepointOrigin: ORIGIN });

  it("puts the request in the queue with the name of the author, and answers 202", async () => {
    const { fake, added } = queue();
    const app = appWith(fake);
    const response = await post(app, (await logInAs(app, "ana")).cookie, INTERVAL);
    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ status: "queued" });
    expect(added).toEqual([{ request: INTERVAL, author: "Ana Souza" }]);
  });

  it("queues a lesson without asking the repository for anything: the number of the lesson is the job's", async () => {
    const { fake, added } = queue();
    const app = appWith(fake);
    expect((await post(app, (await logInAs(app, "ana")).cookie, LESSON)).status).toBe(202);
    expect(added).toHaveLength(1);
    const newCourse = { slug: "claude-code", title: "Claude Code", summary: "Duas aulas.", area: "engenharia" };
    expect((await post(app, (await logInAs(app, "ana")).cookie, { ...LESSON, course: "claude-code", newCourse })).status).toBe(202);
    expect(added).toHaveLength(2);
  });

  it("refuses without a session, without the header, and to whoever is not on the list, before it queues anything", async () => {
    const { fake, added } = queue();
    const app = appWith(fake);
    expect((await post(app, "", INTERVAL)).status).toBe(401);
    const ana = await logInAs(app, "ana");
    expect((await post(app, ana.cookie, INTERVAL, { "x-portal": "other" })).status).toBe(403);
    const other = await logInAs(app, "other");
    expect((await post(app, other.cookie, INTERVAL)).status).toBe(403);
    expect(added).toEqual([]);
  });

  it("answers 503 when there is no queue configured, and 405 to any other method", async () => {
    const app = appWith(null);
    const { cookie } = await logInAs(app, "ana");
    expect((await post(app, cookie, INTERVAL)).status).toBe(503);
    expect((await app.request("/api/publish", { headers: { cookie } })).status).toBe(405);
  });

  it("checks the content with the checks of the form and the SharePoint of the build, and queues nothing that fails", async () => {
    const { fake, added } = queue();
    const app = appWith(fake);
    const { cookie } = await logInAs(app, "ana");
    const wrongVideo = { ...INTERVAL, draft: { ...INTERVAL.draft, video: "https://empresa-my.sharepoint.com/x" } };
    const bad = await post(app, cookie, wrongVideo);
    expect(bad.status).toBe(422);
    expect(((await bad.json()) as { problems: Record<string, string> }).problems.video).toContain(ORIGIN);
    expect((await post(app, cookie, { ...INTERVAL, draft: { ...INTERVAL.draft, slug: "../x", area: "rh" } })).status).toBe(422);
    expect((await post(app, cookie, { ...LESSON, course: "../outro" })).status).toBe(422);
    expect((await post(app, cookie, { kind: "interval", draft: { title: 1 } })).status).toBe(400);
    expect((await post(app, cookie, "not json")).status).toBe(400);
    expect(added).toEqual([]);
  });

  it("refuses a body over the limit", async () => {
    const { fake, added } = queue();
    const app = appWith(fake);
    const { cookie } = await logInAs(app, "ana");
    const big = { ...INTERVAL, draft: { ...INTERVAL.draft, text: "x".repeat(400 * 1024) } };
    expect((await post(app, cookie, big)).status).toBe(413);
    expect(added).toEqual([]);
  });

  it("answers 502 when the queue fails, logs why, and keeps what the queue said away from the person", async () => {
    const { fake } = queue(new Error("fetch failed (UND_ERR_CONNECT_TIMEOUT)"));
    const app = appWith(fake);
    const response = await post(app, (await logInAs(app, "ana")).cookie, INTERVAL);
    expect(response.status).toBe(502);
    expect(logged.some((entry) => entry.event === "SERVER_ERROR" && entry.detail === "publish: fetch failed (UND_ERR_CONNECT_TIMEOUT)")).toBe(true);
    expect(JSON.stringify(await response.json())).not.toContain("UND_ERR");
  });
});
