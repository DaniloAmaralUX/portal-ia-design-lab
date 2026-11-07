import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import http from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { serve } from "@hono/node-server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createPortalApp, type Claims, type Oidc } from "./app.ts";

const TENANT_ID = "00000000-0000-4000-8000-000000000001";
const ana: Claims = { tid: TENANT_ID, acct: 0, iss: `https://login.microsoftonline.com/${TENANT_ID}/v2.0`, oid: "oid-ana", name: "Ana", preferred_username: "ana@pitang.com" };
const oidc: Oidc = {
  authorizationUrl: (attempt) => Promise.resolve(`https://login.example/authorize?state=${attempt.state}`),
  exchangeCode: () => Promise.resolve(ana),
  logoutUrl: () => "https://login.example/logout",
};

let folder = "";
let server: ReturnType<typeof serve>;
let base = "";
let cookie = "";

// The path goes on the wire as written. fetch and app.request would normalize the dot segments before the server saw them.
function raw(rawPath: string, extra: Record<string, string> = {}): Promise<{ status: number; body: string; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const url = new URL(base);
    http
      .get({ host: url.hostname, port: url.port, path: rawPath, headers: { cookie, accept: "text/html", ...extra } }, (res) => {
        let body = "";
        res.on("data", (chunk: Buffer) => (body += chunk.toString()));
        res.on("end", () => resolve({ status: res.statusCode ?? 0, body, headers: res.headers }));
      })
      .on("error", reject);
  });
}

beforeAll(async () => {
  folder = mkdtempSync(path.join(tmpdir(), "portal-paths-"));
  const dist = path.join(folder, "dist");
  mkdirSync(path.join(dist, "assets"), { recursive: true });
  writeFileSync(path.join(dist, "index.html"), '<html><head><script>1</script></head><body>home<script src="/assets/app.js"></script></body></html>');
  writeFileSync(path.join(dist, "assets", "app.js"), "console.log(1)");
  writeFileSync(path.join(folder, "outside-the-build.txt"), "outside secret");
  const app = createPortalApp({ root: dist, siteVersion: "1.2.3", publicUrl: "http://portal.test", tenantId: TENANT_ID, sessionPasswords: { 1: "s".repeat(48) }, oidc, log: () => undefined });
  server = serve({ fetch: app.fetch, port: 0, hostname: "127.0.0.1" });
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const attempt = await fetch(`${base}/auth/login`, { redirect: "manual" });
  const state = new URL(attempt.headers.get("location") ?? "").searchParams.get("state") ?? "";
  const login = (attempt.headers.getSetCookie()[0] ?? "").split(";")[0] ?? "";
  const done = await fetch(`${base}/auth/callback?code=x&state=${encodeURIComponent(state)}`, { redirect: "manual", headers: { cookie: login } });
  cookie = (done.headers.getSetCookie().find((c) => c.includes("portal-session=") && !c.includes("Max-Age=0")) ?? "").split(";")[0] ?? "";
});

afterAll(() => {
  server.close();
  rmSync(folder, { recursive: true, force: true });
});

describe("what goes on the wire", () => {
  it("sends the page whole when the client does not ask for compression, with the Content-Length of what it sends", async () => {
    const response = await raw("/", { "accept-encoding": "identity" });
    expect(response.status).toBe(200);
    expect(response.body).toMatch(/<script nonce="[^"]+">1<\/script>/);
    expect(response.body.endsWith("</html>")).toBe(true);
    expect(Number(response.headers["content-length"])).toBe(Buffer.byteLength(response.body));
  });

  it("answers 304 without a body or the length of the file", async () => {
    const first = await raw("/assets/app.js");
    const again = await raw("/assets/app.js", { "if-modified-since": String(first.headers["last-modified"]) });
    expect(again.status).toBe(304);
    expect(again.body).toBe("");
    expect(again.headers["content-length"]).toBeUndefined();
  });
});

describe("a logged-in person asking for a path outside the build", () => {
  it("opens a real file, so the other cases are not blocked for lack of a session", async () => {
    expect((await raw("/assets/app.js")).body).toContain("console.log(1)");
  });

  it.each([
    "/../outside-the-build.txt",
    "/%2e%2e/outside-the-build.txt",
    "/%2E%2E%2Foutside-the-build.txt",
    "/assets/../../outside-the-build.txt",
    "/assets/..%2f..%2foutside-the-build.txt",
    "/assets/%2e%2e/%2e%2e/outside-the-build.txt",
    "/%2Foutside-the-build.txt",
    "//outside-the-build.txt",
    "/%5C..%5Coutside-the-build.txt",
    "/assets/..%5C..%5Coutside-the-build.txt",
    "/%252e%252e/outside-the-build.txt",
    "/%252Foutside-the-build.txt",
    `/${"..%2f".repeat(6)}etc/passwd`,
  ])("does not deliver %s", async (rawPath) => {
    const response = await raw(rawPath);
    expect(response.body).not.toContain("outside secret");
    expect(response.body).not.toContain("root:");
    expect(response.status).not.toBe(500);
  });
});
