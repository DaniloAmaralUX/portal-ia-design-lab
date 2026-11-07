import { describe, expect, it } from "vitest";
import { createQueue } from "./queue.ts";

const REQUEST = {
  kind: "interval",
  draft: { slug: "revisao-de-pr", title: "Revisão de PR", date: "2026-10-20", minutes: "", summary: "As revisões.", video: "https://empresa.sharepoint.com/x", text: "Texto.", area: "" },
} as const;

type Call = { url: string; method: string; headers: Record<string, string>; body: string | undefined };

// A fetch that plays the metadata server of Cloud Run and the API of Cloud Storage, and keeps what it was asked.
function cloud(answers: { token?: () => Response; upload?: () => Response } = {}) {
  const calls: Call[] = [];
  const fetchFake = ((url: string, init: RequestInit = {}) => {
    calls.push({ url, method: init.method ?? "GET", headers: Object.fromEntries(new Headers(init.headers).entries()), body: init.body as string | undefined });
    if (url.startsWith("http://metadata.google.internal/")) return Promise.resolve(answers.token?.() ?? Response.json({ access_token: "ya29.token", expires_in: 3600 }));
    return Promise.resolve(answers.upload?.() ?? Response.json({ name: "pending/x" }, { status: 200 }));
  }) as unknown as typeof fetch;
  return { fetchFake, calls };
}

describe("the queue of /publicar", () => {
  it("creates an object in pending/ of the bucket with the identity of the service account, and never overwrites", async () => {
    const { fetchFake, calls } = cloud();
    await createQueue({ bucket: "portal-ia-publish", fetch: fetchFake }).add(REQUEST, "Ana Souza");

    expect(calls[0]).toMatchObject({ url: "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token", headers: { "metadata-flavor": "Google" } });
    const upload = calls[1];
    const url = new URL(upload?.url ?? "");
    expect(url.origin + url.pathname).toBe("https://storage.googleapis.com/upload/storage/v1/b/portal-ia-publish/o");
    expect(url.searchParams.get("uploadType")).toBe("media");
    expect(url.searchParams.get("ifGenerationMatch")).toBe("0");
    expect(url.searchParams.get("name")).toMatch(/^pending\/\d{8}T\d{9}Z-[0-9a-f-]{36}\.json$/);
    expect(upload).toMatchObject({ method: "POST", headers: { authorization: "Bearer ya29.token", "content-type": "application/json" } });
    expect(JSON.parse(upload?.body ?? "")).toMatchObject({ version: 1, author: "Ana Souza", request: REQUEST });
  });

  it("gives each request its own name", async () => {
    const { fetchFake, calls } = cloud();
    const queue = createQueue({ bucket: "portal-ia-publish", fetch: fetchFake });
    await queue.add(REQUEST, "Ana");
    await queue.add(REQUEST, "Ana");
    const names = calls.filter((c) => c.url.includes("storage.googleapis.com")).map((c) => new URL(c.url).searchParams.get("name"));
    expect(new Set(names).size).toBe(2);
  });

  it("keeps the token until a minute before it expires, and asks for another after", async () => {
    let clock = 1_000_000;
    const { fetchFake, calls } = cloud({ token: () => Response.json({ access_token: "ya29.token", expires_in: 3600 }) });
    const queue = createQueue({ bucket: "portal-ia-publish", fetch: fetchFake, now: () => clock });
    const tokens = () => calls.filter((c) => c.url.includes("metadata.google.internal")).length;
    await queue.add(REQUEST, "Ana");
    clock += 3_000_000;
    await queue.add(REQUEST, "Ana");
    expect(tokens()).toBe(1);
    clock += 600_000;
    await queue.add(REQUEST, "Ana");
    expect(tokens()).toBe(2);
  });

  it("fails with the status of the metadata server, or of the storage, and never with the token", async () => {
    const noToken = cloud({ token: () => new Response("no", { status: 404 }) });
    await expect(createQueue({ bucket: "b-ucket", fetch: noToken.fetchFake }).add(REQUEST, "Ana")).rejects.toThrow("metadata server answered 404");
    const noUpload = cloud({ upload: () => new Response("denied", { status: 403 }) });
    const failure = createQueue({ bucket: "b-ucket", fetch: noUpload.fetchFake }).add(REQUEST, "Ana");
    await expect(failure).rejects.toThrow("storage answered 403");
    await failure.catch((error: Error) => expect(error.message).not.toContain("ya29"));
  });

  it("says why the network failed, from the cause of the failed fetch", async () => {
    const down = (() => Promise.reject(new TypeError("fetch failed", { cause: Object.assign(new Error("timed out"), { code: "UND_ERR_CONNECT_TIMEOUT" }) }))) as unknown as typeof fetch;
    await expect(createQueue({ bucket: "b-ucket", fetch: down }).add(REQUEST, "Ana")).rejects.toThrow("fetch failed (UND_ERR_CONNECT_TIMEOUT)");
  });
});
