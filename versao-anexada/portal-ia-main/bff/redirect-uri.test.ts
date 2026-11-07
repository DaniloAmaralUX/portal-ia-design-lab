import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import http from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { serve } from "@hono/node-server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createPortalApp } from "./app.ts";
import { createOidc } from "./oidc.ts";

// The Cloud Run case: the browser talks https to the portal, but the container gets plain HTTP, so the URL the server builds from
// the socket says http. The real openid-client is used, with only fetch replaced, to see what Microsoft would receive.
const PUBLIC_URL = "https://portal.example.test";
const TENANT = "00000000-0000-4000-8000-000000000001";
const CLIENT = "00000000-0000-4000-8000-000000000002";
const ISSUER = `https://login.microsoftonline.com/${TENANT}/v2.0`;
const realFetch = globalThis.fetch;

const b64 = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
const idToken = (nonce: string) =>
  `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: ISSUER,
    aud: CLIENT,
    sub: "subject",
    oid: "oid-ana",
    tid: TENANT,
    acct: 0,
    name: "Ana Souza",
    preferred_username: "ana.souza@pitang.com",
    nonce,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 600,
  })}.signature`;

const metadata = {
  issuer: ISSUER,
  authorization_endpoint: `${ISSUER.replace("/v2.0", "")}/oauth2/v2.0/authorize`,
  token_endpoint: `${ISSUER.replace("/v2.0", "")}/oauth2/v2.0/token`,
  jwks_uri: `${ISSUER.replace("/v2.0", "")}/discovery/v2.0/keys`,
  end_session_endpoint: `${ISSUER.replace("/v2.0", "")}/oauth2/v2.0/logout`,
  response_types_supported: ["code"],
  subject_types_supported: ["pairwise"],
  id_token_signing_alg_values_supported: ["RS256"],
  token_endpoint_auth_methods_supported: ["client_secret_post", "client_secret_basic"],
};

const tokenRequests: URLSearchParams[] = [];
let nonceOfLogin = "";
let folder = "";
let server: ReturnType<typeof serve>;
let port = 0;

// Host is a forbidden header for fetch, so the requests to the BFF go through node:http.
function call(pathname: string, headers: Record<string, string>): Promise<{ status: number; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const request = http.request({ host: "127.0.0.1", port, path: pathname, headers: { Host: "portal.example.test", "X-Forwarded-Proto": "https", ...headers } }, (response) => {
      response.resume();
      response.on("end", () => resolve({ status: response.statusCode ?? 0, headers: response.headers }));
    });
    request.on("error", reject);
    request.end();
  });
}

beforeAll(async () => {
  vi.stubGlobal("fetch", async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
    if (url.hostname !== "login.microsoftonline.com") return realFetch(input, init);
    if (url.pathname.endsWith("/.well-known/openid-configuration")) return Response.json(metadata);
    if (url.pathname.endsWith("/token")) {
      tokenRequests.push(init?.body instanceof URLSearchParams ? init.body : new URLSearchParams(typeof init?.body === "string" ? init.body : ""));
      return Response.json({ access_token: "access", token_type: "Bearer", expires_in: 600, id_token: idToken(nonceOfLogin) });
    }
    return new Response("unexpected", { status: 500 });
  });
  folder = mkdtempSync(path.join(tmpdir(), "portal-redirect-"));
  writeFileSync(path.join(folder, "index.html"), "<html><head><script>1</script></head><body></body></html>");
  const oidc = await createOidc({ tenantId: TENANT, clientId: CLIENT, clientSecret: "client-secret", publicUrl: PUBLIC_URL });
  const app = createPortalApp({ root: folder, siteVersion: "1.2.3", publicUrl: PUBLIC_URL, tenantId: TENANT, sessionPasswords: { 1: "s".repeat(48) }, oidc, log: () => undefined });
  server = serve({ fetch: app.fetch, port: 0, hostname: "127.0.0.1" });
  await new Promise((resolve) => server.once("listening", resolve));
  port = (server.address() as AddressInfo).port;
});

afterAll(() => {
  vi.unstubAllGlobals();
  server.close();
  rmSync(folder, { recursive: true, force: true });
});

describe("the login behind a proxy that speaks https to the browser and http to the container", () => {
  it("sends Microsoft the same redirect_uri in the request and in the code exchange", async () => {
    const login = await call("/auth/login?volta=%2Facademy", {});
    expect(login.status).toBe(302);
    const authorization = new URL(String(login.headers.location));
    const requested = authorization.searchParams.get("redirect_uri");
    expect(requested).toBe(`${PUBLIC_URL}/auth/callback`);
    nonceOfLogin = authorization.searchParams.get("nonce") ?? "";
    const cookie = (login.headers["set-cookie"] ?? []).map((line) => line.split(";")[0]).join("; ");

    const callback = await call(`/auth/callback?code=code-from-microsoft&state=${authorization.searchParams.get("state")}&session_state=extra`, { Cookie: cookie });
    expect(callback.status).toBe(302);
    expect(callback.headers.location).toBe("/academy");
    expect(tokenRequests).toHaveLength(1);
    expect(tokenRequests[0]?.get("redirect_uri")).toBe(requested);
    expect(tokenRequests[0]?.get("code")).toBe("code-from-microsoft");
  });
});
