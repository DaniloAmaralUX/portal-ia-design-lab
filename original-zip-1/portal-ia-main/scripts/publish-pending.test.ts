import { describe, expect, it } from "vitest";
import { CREATED, processEntry, REFUSED, TRANSIENT } from "./publish-pending.ts";
import type { PublishResult } from "./publish-gitlab.ts";

const REQUEST = {
  kind: "interval",
  draft: { slug: "revisao-de-pr", title: "Revisão de PR", date: "2026-10-20", minutes: "", summary: "As revisões.", video: "https://empresa.sharepoint.com/x", text: "Texto.", area: "" },
};
const entry = (overrides: Record<string, unknown> = {}) => JSON.stringify({ version: 1, receivedAt: "2026-10-28T12:00:00.000Z", author: "Ana Souza", request: REQUEST, ...overrides });

// A publisher that answers what it is told, and keeps what it was asked.
const publisher = (result: PublishResult) => {
  const asked: unknown[][] = [];
  return { asked, submit: (...args: unknown[]) => (asked.push(args), Promise.resolve(result)) } as { asked: unknown[][]; submit: never };
};

describe("one request of the queue of /publicar", () => {
  it("is a Merge Request opened, with the author of the entry, and the object goes to feitos/ (exit 0)", async () => {
    const p = publisher({ ok: true, url: "https://gitlab.example.com/x/-/merge_requests/7", branch: "publicar/intervalo-revisao-de-pr" });
    const outcome = await processEntry(entry(), p);
    expect(outcome.code).toBe(CREATED);
    expect(outcome.message).toContain("publicar/intervalo-revisao-de-pr");
    expect(p.asked).toEqual([[REQUEST, "Ana Souza"]]);
  });

  it("is a refusal that another try would repeat when the content, the address or the course is wrong, and the object goes to falhas/ (exit 3)", async () => {
    for (const [error, status] of [["invalid", 422], ["conflict", 409], ["not_found", 404]] as const) {
      const outcome = await processEntry(entry(), publisher({ ok: false, status, error, message: "recusado" }));
      expect(outcome.code).toBe(REFUSED);
      expect(outcome.message).toContain(error);
    }
  });

  it("is a failure of the moment when the GitLab did not answer, and the object stays in pending/ for the next run (exit 1)", async () => {
    const outcome = await processEntry(entry(), publisher({ ok: false, status: 502, error: "upstream", message: "sem resposta", detail: "commit 500 boom" }));
    expect(outcome.code).toBe(TRANSIENT);
    expect(outcome.message).toContain("commit 500 boom");
  });

  it("refuses a file that is not a request of /publicar, without asking the GitLab anything (exit 3)", async () => {
    const p = publisher({ ok: true, url: "https://x/y", branch: "b" });
    for (const raw of ["not json", "[]", entry({ version: 2 }), entry({ request: { kind: "other" } }), entry({ author: 1 }), entry({ request: { kind: "interval", draft: { title: 1 } } })]) {
      expect((await processEntry(raw, p)).code).toBe(REFUSED);
    }
    expect(p.asked).toEqual([]);
  });
});
