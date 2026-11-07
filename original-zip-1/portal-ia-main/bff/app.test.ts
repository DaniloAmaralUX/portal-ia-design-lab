import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { brotliCompressSync, gunzipSync, gzipSync } from "node:zlib";
import { ResponseBodyError } from "openid-client";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ACERVO_CONTENT_SECURITY_POLICY, serverContentSecurityPolicy } from "../src/shared/content-security-policy.ts";
import { createPortalApp, isPitangAccount, safeReturnPath, type Claims, type Oidc } from "./app.ts";
import type { LogEntry } from "./log.ts";

const TENANT_ID = "00000000-0000-4000-8000-000000000001";
const ISSUER = `https://login.microsoftonline.com/${TENANT_ID}/v2.0`;
const OTHER_TENANT = "72f988bf-86f1-41af-91ab-2d7cd011db47";
const ACCOUNTS: Record<string, Claims> = {
  ana: { tid: TENANT_ID, iss: ISSUER, acct: 0, oid: "oid-ana", name: "Ana Souza", preferred_username: "ana.souza@pitang.com" },
  guest: {
    tid: TENANT_ID,
    iss: ISSUER,
    acct: 0,
    oid: "oid-guest",
    idp: `https://sts.windows.net/${OTHER_TENANT}/`,
    name: "Guest",
    preferred_username: "guest@other.com",
  },
  guestByAcct: { tid: TENANT_ID, iss: ISSUER, oid: "oid-acct", acct: 1, name: "Ana Souza", preferred_username: "ana.souza@pitang.com" },
  // A Guest account created in Pitang's own tenant: the idp is the issuer, so only the missing acct claim gives it away.
  internalGuest: { tid: TENANT_ID, iss: ISSUER, oid: "oid-internal", name: "Convidado Interno", preferred_username: "convidado@pitang.com" },
  other: { tid: OTHER_TENANT, acct: 0, iss: `https://login.microsoftonline.com/${OTHER_TENANT}/v2.0`, oid: "oid-other", name: "Other", preferred_username: "someone@other.com" },
  script: { tid: TENANT_ID, iss: ISSUER, acct: 0, oid: "oid-script", name: '"><script>alert(1)</script>', preferred_username: "script@pitang.com" },
};

let refusal: Error | null = null;
const oidc: Oidc = {
  authorizationUrl: (attempt) => Promise.resolve(`https://login.example/authorize?state=${attempt.state}`),
  exchangeCode: (url, attempt) => {
    if (refusal) return Promise.reject(refusal);
    if (url.searchParams.get("state") !== attempt.state) return Promise.reject(new Error("state mismatch"));
    const account = ACCOUNTS[url.searchParams.get("code") ?? ""];
    return account ? Promise.resolve(account) : Promise.reject(new Error("invalid code"));
  },
  logoutUrl: () => "https://login.example/logout",
};

const PASSWORDS = { 1: "s".repeat(48) };
const TEMPLATE = '<!DOCTYPE html><html><body><script>alert("template")</script><script src="a.js"></script></body></html>';
const BROTLI_JS = brotliCompressSync(Buffer.from("console.log('br');"));

let folder = "";
const logged: LogEntry[] = [];

function createApp(publicUrl: string, passwords: Record<string, string> = PASSWORDS, publisherEmails: string[] = []) {
  return createPortalApp({
    root: path.join(folder, "dist"),
    siteVersion: "1.2.3",
    publicUrl,
    tenantId: TENANT_ID,
    sessionPasswords: passwords,
    publisherEmails,
    oidc,
    log: (entry) => void logged.push(entry),
  });
}

let http: ReturnType<typeof createApp>;
let https: ReturnType<typeof createApp>;

beforeAll(() => {
  folder = mkdtempSync(path.join(tmpdir(), "portal-bff-"));
  const dist = path.join(folder, "dist");
  const write = (file: string, content: string | Buffer) => {
    mkdirSync(path.dirname(path.join(dist, file)), { recursive: true });
    writeFileSync(path.join(dist, file), content);
  };
  write(
    "index.html",
    '<!DOCTYPE html><html lang="pt-BR"><head><script>window.start = 1</script></head><body><h1>Internal home</h1><script type="module" src="/assets/app-abc.js"></script></body></html>',
  );
  write("academy/index.html", '<!DOCTYPE html><html lang="pt-BR"><head></head><body><h1>Internal tracks</h1></body></html>');
  write("big/index.html", `<!DOCTYPE html><html><body><script>1</script>${"<p>padding for compression</p>".repeat(100)}</body></html>`);
  write("assets/app-abc.js", `console.log("internal code");\n${"// padding\n".repeat(200)}`);
  write("assets/app-br.js", "console.log('br');");
  write("assets/app-br.js.br", BROTLI_JS);
  write("assets/app-br.js.gz", gzipSync("console.log('br');"));
  write("assets/inter-latin-wght-normal-xyz.woff2", "font");
  write("downloads/plugin.zip", "internal zip");
  write("downloads/pr-review-1.2.0.zip", "internal plugin zip");
  write("downloads/pg-revisar-seguranca-1.2.0.zip", "internal skill zip");
  write("plugins/pr-review.md", "# Internal plugin\n");
  write("acervo/plugin/skills/x/template.html", TEMPLATE);
  write("notes.txt", "internal index");
  write("favicon.svg", "<svg></svg>");
  writeFileSync(path.join(folder, "outside-the-build.txt"), "outside secret");
  http = createApp("http://portal.test");
  https = createApp("https://portal.test");
});

afterAll(() => {
  rmSync(folder, { recursive: true, force: true });
});

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  logged.length = 0;
});

afterEach(() => {
  vi.useRealTimers();
  refusal = null;
});

const page = { accept: "text/html" };
const minutes = (n: number) => n * 60 * 1000;
const advance = (ms: number) => vi.setSystemTime(Date.now() + ms);
const setCookies = (response: Response) => response.headers.getSetCookie();
const pair = (setCookie: string) => setCookie.split(";")[0] ?? "";

async function logInAs(app: typeof http, code: string, returnPath = "/academy") {
  const attempt = await app.request(`/auth/login?volta=${encodeURIComponent(returnPath)}`);
  const state = new URL(attempt.headers.get("location") ?? "").searchParams.get("state") ?? "";
  const loginCookie = pair(setCookies(attempt)[0] ?? "");
  const response = await app.request(`/auth/callback?code=${code}&state=${encodeURIComponent(state)}`, { headers: { cookie: loginCookie } });
  const session = setCookies(response).find((c) => c.includes("portal-session=") && !c.includes("Max-Age=0")) ?? "";
  return { attempt, loginCookie, response, session, cookie: pair(session) };
}

describe("an anonymous request", () => {
  it("goes to the login page, which carries none of the page content", async () => {
    const request = await http.request("/academy", { headers: page });
    expect(request.status).toBe(302);
    expect(request.headers.get("location")).toBe("/entrar?volta=%2Facademy");
    const screen = await http.request("/entrar?volta=%2Facademy", { headers: page });
    const html = await screen.text();
    expect(screen.status).toBe(200);
    expect(html).toContain("Entrar com a Microsoft");
    expect(html).toContain('href="/auth/login?volta=%2Facademy"');
    expect(html).not.toContain("Internal tracks");
    expect(screen.headers.get("cache-control")).toBe("no-store");
  });

  it("shows only the known login errors", async () => {
    const known = await (await http.request("/entrar?erro=conta", { headers: page })).text();
    expect(known).toContain('role="alert"');
    const madeUp = await (await http.request("/entrar?erro=%3Cscript%3E", { headers: page })).text();
    expect(madeUp).not.toContain('role="alert"');
    expect(madeUp).not.toContain("<script>");
    expect(await (await http.request("/entrar?erro=account", { headers: page })).text()).not.toContain('role="alert"');
  });

  it.each(["/academy/index.html", "/assets/app-abc.js", "/downloads/plugin.zip", "/plugins/pr-review.md", "/acervo/plugin/skills/x/template.html", "/notes.txt", "/missing"])(
    "cannot download %s",
    async (file) => {
      const response = await http.request(file);
      expect(response.status).toBe(401);
      expect(await response.text()).not.toMatch(/Internal|internal|template/);
    },
  );

  it.each(["/health/", "/Health", "/entrar/", "/auth/login/", "/api/me/", "/api//me", "//health", "/favicon.svg/", "/assets/inter-latin-wght-normal-xyz.woff2/", "/assets/x/..%2finter-latin-wght-normal-xyz.woff2"])(
    "treats %s as closed, because only the exact public paths are open",
    async (file) => {
      const response = await http.request(file);
      expect(response.status).toBe(401);
    },
  );

  it("gets no account from /api/me", async () => {
    const response = await http.request("/api/me");
    expect(response.status).toBe(401);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ error: "unauthenticated" });
  });

  it("downloads only the favicon and the fonts the login page uses", async () => {
    expect((await http.request("/favicon.svg")).status).toBe(200);
    expect((await http.request("/assets/inter-latin-wght-normal-xyz.woff2")).status).toBe(200);
    expect((await http.request("/favicon.svg?x=1")).status).toBe(200);
  });

  it("gets a plain 404, not the page shell, for a public path that does not exist", async () => {
    const response = await http.request("/assets/missing-font.woff2");
    expect(response.status).toBe(404);
    expect(await response.text()).not.toContain("Internal home");
  });

  it("answers the health check with the status and the version of the site, and only the methods each public route accepts", async () => {
    const health = await http.request("/health");
    expect(health.status).toBe(200);
    expect(await health.json()).toEqual({ status: "ok", version: "1.2.3" });
    expect((await http.request("/health", { method: "HEAD" })).status).toBe(200);
    expect((await http.request("/health", { method: "POST" })).status).toBe(405);
    expect((await http.request("/entrar", { method: "POST" })).status).toBe(405);
    expect((await http.request("/auth/login", { method: "POST" })).status).toBe(405);
    expect((await http.request("/auth/logout")).headers.get("allow")).toBe("POST");
    expect((await http.request("/academy", { method: "POST" })).status).toBe(405);
  });
});

describe("the login", () => {
  it("goes to Microsoft with a login cookie that scripts cannot read", async () => {
    const attempt = await http.request("/auth/login?volta=/academy");
    expect(attempt.status).toBe(302);
    expect(attempt.headers.get("location")).toMatch(/^https:\/\/login\.example\/authorize\?state=/);
    const cookie = setCookies(attempt)[0] ?? "";
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Max-Age=600");
  });

  it("returns to the requested page with the session in an HttpOnly cookie", async () => {
    const { response, session } = await logInAs(http, "ana");
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("/academy");
    expect(session).toContain("HttpOnly");
    expect(session).toContain("SameSite=Lax");
    expect(session).toContain("Max-Age=3600");
  });

  it("over HTTPS, uses Secure cookies with the __Host-Http- prefix and sends HSTS", async () => {
    const { session, loginCookie } = await logInAs(https, "ana");
    expect(session).toMatch(/^__Host-Http-portal-session=/);
    for (const attribute of ["Path=/", "HttpOnly", "Secure", "SameSite=Lax"]) expect(session).toContain(attribute);
    expect(session).not.toContain("Domain");
    expect(loginCookie).toMatch(/^__Host-Http-portal-login=/);
    expect((await https.request("/health")).headers.get("strict-transport-security")).toContain("max-age=31536000");
    expect((await http.request("/health")).headers.get("strict-transport-security")).toBeNull();
  });

  it("never returns to another site or to a technical path", () => {
    for (const target of ["https://example.com", "//example.com/x", "/\\example.com", "/auth/logout", "/api/me", "/entrar", null]) {
      expect(safeReturnPath(target)).toBe("/");
    }
    expect(safeReturnPath("/metodo/sdd?x=1#part")).toBe("/metodo/sdd?x=1#part");
  });

  // The URL parser removes the dot segments, so these only start with // after it. They sent the person to evil.example.
  it.each(["/.//evil.example", "/%2e//evil.example", "/%2E//evil.example", "/a/..//evil.example", "/a/%2e%2e//evil.example", "/./\t/evil.example", "/a/..//evil.example/path?x=1#y"])(
    "does not let %s through to another site",
    (target) => {
      expect(safeReturnPath(target)).toBe("/");
    },
  );

  it("sends a return path of 6 KB to the home, and the login cookie stays under what a browser keeps", async () => {
    const long = `/${"a".repeat(6 * 1024)}`;
    expect(safeReturnPath(long)).toBe("/");
    expect(safeReturnPath(`/metodo/${"b".repeat(1100)}`)).toBe("/");
    const attempt = await http.request(`/auth/login?volta=${encodeURIComponent(long)}`);
    const cookie = setCookies(attempt)[0] ?? "";
    expect(cookie.length).toBeLessThan(1500);
    const state = new URL(attempt.headers.get("location") ?? "").searchParams.get("state") ?? "";
    const done = await http.request(`/auth/callback?code=ana&state=${encodeURIComponent(state)}`, { headers: { cookie: pair(cookie) } });
    expect(done.headers.get("location")).toBe("/");
  });

  it.each([
    ["guest", "a guest from another directory"],
    ["other", "an account from another tenant"],
  ])("refuses %s (%s)", async (code) => {
    const { response, session } = await logInAs(http, code);
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("/entrar?volta=%2Facademy&erro=conta");
    expect(await (await http.request("/entrar?volta=%2Facademy&erro=conta", { headers: page })).text()).toContain("não é de quem trabalha na Pitang");
    expect(session).toBe("");
  });

  it("accepts members whatever form Microsoft gives the idp claim", () => {
    const member = ACCOUNTS.ana ?? {};
    expect(isPitangAccount(member, TENANT_ID)).toBe(true);
    expect(isPitangAccount({ ...member, idp: ISSUER }, TENANT_ID)).toBe(true);
    expect(isPitangAccount({ ...member, idp: `https://sts.windows.net/${TENANT_ID}/` }, TENANT_ID)).toBe(true);
    expect(isPitangAccount({ ...member, idp: "live.com" }, TENANT_ID)).toBe(false);
  });

  it("lets in only an account that carries acct 0, the number", () => {
    const { acct: _, ...withoutAcct } = ACCOUNTS.ana ?? {};
    expect(isPitangAccount({ ...withoutAcct, acct: 0 }, TENANT_ID)).toBe(true);
    expect(isPitangAccount(withoutAcct, TENANT_ID)).toBe(false);
    expect(isPitangAccount({ ...withoutAcct, acct: 1 }, TENANT_ID)).toBe(false);
    expect(isPitangAccount({ ...withoutAcct, acct: "0" }, TENANT_ID)).toBe(false);
    expect(isPitangAccount({ ...withoutAcct, acct: null }, TENANT_ID)).toBe(false);
    expect(isPitangAccount({ ...ACCOUNTS.guest, acct: 0 }, TENANT_ID)).toBe(false);
  });

  it("denies the login with the account reason when the acct claim says guest", async () => {
    const { response, session } = await logInAs(http, "guestByAcct");
    expect(response.headers.get("location")).toBe("/entrar?volta=%2Facademy&erro=conta");
    expect(session).toBe("");
    expect(logged).toEqual([{ event: "LOGIN_DENIED", reason: "account", email: "ana.souza@pitang.com", oid: "oid-acct", tid: TENANT_ID }]);
  });

  it("denies a login without the acct claim, logs it, and leaves the download closed", async () => {
    const { response, session } = await logInAs(http, "internalGuest");
    expect(response.headers.get("location")).toBe("/entrar?volta=%2Facademy&erro=conta");
    expect(session).toBe("");
    expect(logged).toEqual([{ event: "LOGIN_DENIED", reason: "account", email: "convidado@pitang.com", oid: "oid-internal", tid: TENANT_ID, detail: "the acct claim is missing from the ID token" }]);
    expect((await http.request("/downloads/pr-review-1.2.0.zip")).status).toBe(401);
  });

  it("refuses a callback without the login cookie, with another state, or after the login expired", async () => {
    const withoutCookie = await http.request("/auth/callback?code=ana&state=x");
    expect(withoutCookie.headers.get("location")).toBe("/entrar?volta=%2F&erro=expirou");
    const attempt = await http.request("/auth/login");
    const loginCookie = pair(setCookies(attempt)[0] ?? "");
    const otherState = await http.request("/auth/callback?code=ana&state=other", { headers: { cookie: loginCookie } });
    expect(otherState.headers.get("location")).toBe("/entrar?volta=%2F&erro=falhou");
    expect(setCookies(otherState).some((c) => c.includes("portal-session="))).toBe(false);
    const state = new URL(attempt.headers.get("location") ?? "").searchParams.get("state") ?? "";
    advance(minutes(11));
    const late = await http.request(`/auth/callback?code=ana&state=${state}`, { headers: { cookie: loginCookie } });
    expect(late.headers.get("location")).toBe("/entrar?volta=%2F&erro=expirou");
  });

  it("treats a cancelled Microsoft login as cancelled", async () => {
    const attempt = await http.request("/auth/login?volta=/metodo");
    const loginCookie = pair(setCookies(attempt)[0] ?? "");
    const cancelled = await http.request("/auth/callback?error=access_denied", { headers: { cookie: loginCookie } });
    expect(cancelled.headers.get("location")).toBe("/entrar?volta=%2Fmetodo&erro=cancelado");
  });
});

describe("a logged-in person", () => {
  it("opens pages and files", async () => {
    const { cookie } = await logInAs(http, "ana");
    const academy = await http.request("/academy", { headers: { ...page, cookie } });
    expect(academy.status).toBe(200);
    expect(await academy.text()).toContain("Internal tracks");
    expect(await (await http.request("/downloads/plugin.zip", { headers: { cookie } })).text()).toBe("internal zip");
  });

  it("gets the page shell with 200 for an address the router draws, and 404 for a file or a technical path that does not exist", async () => {
    const { cookie } = await logInAs(http, "ana");
    const address = await http.request("/does/not/exist", { headers: { ...page, cookie } });
    expect(address.status).toBe(200);
    expect(address.headers.get("content-type")).toContain("text/html");
    expect(address.headers.get("cache-control")).toBe("no-store");
    expect(await address.text()).toContain("Internal home");
    for (const [file, accept] of [
      ["/missing.js", "text/html"],
      ["/assets/missing-abc.css", "text/html"],
      ["/api/nothing", "text/html"],
      ["/auth/nothing", "text/html"],
      ["/does/not/exist", "application/json"],
    ] as const) {
      const response = await http.request(file, { headers: { accept, cookie } });
      expect(response.status, file).toBe(404);
      expect(await response.text(), file).not.toContain("Internal home");
    }
  });

  it("gets the Markdown pages as text/markdown, and the cache headers of each kind of file", async () => {
    const { cookie } = await logInAs(http, "ana");
    const markdown = await http.request("/plugins/pr-review.md", { headers: { cookie } });
    expect(markdown.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(markdown.headers.get("cache-control")).toBe("private, no-cache");
    expect((await http.request("/assets/app-abc.js", { headers: { cookie } })).headers.get("cache-control")).toBe("private, max-age=31536000, immutable");
    expect((await http.request("/academy", { headers: { ...page, cookie } })).headers.get("cache-control")).toBe("no-store");
  });

  it("gets 304 for a file that did not change since the last visit", async () => {
    const { cookie } = await logInAs(http, "ana");
    const first = await http.request("/downloads/plugin.zip", { headers: { cookie } });
    const modified = first.headers.get("last-modified") ?? "";
    expect(modified).not.toBe("");
    const again = await http.request("/downloads/plugin.zip", { headers: { cookie, "if-modified-since": modified } });
    expect(again.status).toBe(304);
    expect(await again.text()).toBe("");
  });

  it("gets the precompressed file the browser accepts, and the original otherwise", async () => {
    const { cookie } = await logInAs(http, "ana");
    const br = await http.request("/assets/app-br.js", { headers: { cookie, "accept-encoding": "gzip, br" } });
    expect(br.headers.get("content-encoding")).toBe("br");
    expect(Buffer.from(await br.arrayBuffer()).equals(BROTLI_JS)).toBe(true);
    const gzip = await http.request("/assets/app-br.js", { headers: { cookie, "accept-encoding": "gzip" } });
    expect(gunzipSync(Buffer.from(await gzip.arrayBuffer())).toString()).toBe("console.log('br');");
    const plain = await http.request("/assets/app-br.js", { headers: { cookie, "accept-encoding": "identity" } });
    expect(plain.headers.get("content-encoding")).toBeNull();
    expect(await plain.text()).toBe("console.log('br');");
  });

  it("sees only their name, e-mail and whether they publish in /api/me, and the page carries no account data", async () => {
    const { cookie } = await logInAs(http, "script");
    const me = await http.request("/api/me", { headers: { cookie } });
    expect(me.status).toBe(200);
    expect(me.headers.get("content-type")).toContain("application/json");
    expect(me.headers.get("cache-control")).toBe("no-store");
    expect(await me.json()).toEqual({ name: '"><script>alert(1)</script>', email: "script@pitang.com", canPublish: false });
    expect((await http.request("/api/me", { method: "POST", headers: { cookie } })).status).toBe(405);
    const html = await (await http.request("/", { headers: { ...page, cookie } })).text();
    expect(html).not.toContain("script@pitang.com");
    expect(html).not.toContain("alert(1)");
  });

  it("publishes only with an e-mail of the list of who publishes, in any case", async () => {
    const app = createApp("http://portal.test", PASSWORDS, ["ANA.SOUZA@pitang.com"]);
    const canPublish = async (code: string) => {
      const { cookie } = await logInAs(app, code);
      return ((await (await app.request("/api/me", { headers: { cookie } })).json()) as { canPublish: boolean }).canPublish;
    };
    expect(await canPublish("ana")).toBe(true);
    expect(await canPublish("script")).toBe(false);
  });

  it("loses the session when the cookie is tampered with", async () => {
    const { cookie } = await logInAs(http, "ana");
    const tampered = cookie.slice(0, -2) + (cookie.endsWith("A") ? "B" : "A") + cookie.slice(-1);
    expect((await http.request("/academy", { headers: { ...page, cookie: tampered } })).status).toBe(302);
  });

  it("cannot use the login cookie as a session", async () => {
    const { loginCookie } = await logInAs(http, "ana");
    const replayed = loginCookie.replace("portal-login=", "portal-session=");
    expect((await http.request("/academy", { headers: { ...page, cookie: replayed } })).status).toBe(302);
  });

  it("cannot use a session as a login attempt", async () => {
    const { cookie } = await logInAs(http, "ana");
    const replayed = cookie.replace("portal-session=", "portal-login=");
    const response = await http.request("/auth/callback?code=ana&state=x", { headers: { cookie: replayed } });
    expect(response.headers.get("location")).toBe("/entrar?volta=%2F&erro=expirou");
  });

  it("loses a session that sat idle for more than 60 minutes, and keeps one that is used", async () => {
    const { cookie } = await logInAs(http, "ana");
    let current = cookie;
    for (let i = 0; i < 3; i++) {
      advance(minutes(59));
      const response = await http.request("/academy", { headers: { ...page, cookie: current } });
      expect(response.status).toBe(200);
      current = pair(setCookies(response).find((c) => c.includes("portal-session=")) ?? "");
      expect(current).not.toBe("");
    }
    advance(minutes(62));
    expect((await http.request("/academy", { headers: { ...page, cookie: current } })).status).toBe(302);
  });

  it("loses the session after 8 hours, even if it is used all the time", async () => {
    const { cookie } = await logInAs(http, "ana");
    let current = cookie;
    for (let elapsed = 30; elapsed <= 7 * 60 + 30; elapsed += 30) {
      advance(minutes(30));
      const response = await http.request("/academy", { headers: { ...page, cookie: current } });
      expect(response.status, `after ${elapsed} minutes`).toBe(200);
      current = pair(setCookies(response).find((c) => c.includes("portal-session=")) ?? "");
    }
    advance(minutes(31));
    expect((await http.request("/academy", { headers: { ...page, cookie: current } })).status).toBe(302);
  });

  it("keeps the session across a secret rotation, and loses it when the old secret is gone", async () => {
    const { cookie } = await logInAs(http, "ana");
    const rotated = createApp("http://portal.test", { 2: "n".repeat(48), 1: PASSWORDS[1] });
    const response = await rotated.request("/academy", { headers: { ...page, cookie } });
    expect(response.status).toBe(200);
    const renewed = pair(setCookies(response).find((c) => c.includes("portal-session=")) ?? "");
    expect(renewed).not.toBe(cookie);
    const onlyNew = createApp("http://portal.test", { 2: "n".repeat(48) });
    expect((await onlyNew.request("/academy", { headers: { ...page, cookie: renewed } })).status).toBe(200);
    expect((await onlyNew.request("/academy", { headers: { ...page, cookie } })).status).toBe(302);
  });

  it("goes straight to the requested page when opening the login page", async () => {
    const { cookie } = await logInAs(http, "ana");
    const response = await http.request("/entrar?volta=%2Fmetodo", { headers: { ...page, cookie } });
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("/metodo");
  });

  it("logs out with a POST that only this site can send, clearing the cache", async () => {
    const { cookie } = await logInAs(http, "ana");
    expect((await http.request("/auth/logout", { headers: { cookie } })).status).toBe(405);
    expect((await http.request("/auth/logout", { method: "POST", headers: { cookie } })).status).toBe(403);
    const logout = await http.request("/auth/logout", { method: "POST", headers: { cookie, "x-portal": "logout" } });
    expect(logout.status).toBe(200);
    expect(await logout.json()).toEqual({ destination: "https://login.example/logout" });
    expect(setCookies(logout)[0]).toMatch(/portal-session=; .*Max-Age=0/);
    expect(logout.headers.get("clear-site-data")).toBe('"cache"');
  });
});

describe("the audit log", () => {
  it("records logins, refusals and logouts with the account identifiers, the tid included", async () => {
    const { cookie } = await logInAs(http, "ana");
    await logInAs(http, "other");
    await http.request("/auth/callback?code=ana&state=x");
    await http.request("/auth/logout", { method: "POST", headers: { cookie, "x-portal": "logout" } });
    expect(logged).toEqual([
      { event: "LOGIN_SUCCESS", email: "ana.souza@pitang.com", oid: "oid-ana", tid: TENANT_ID },
      { event: "LOGIN_DENIED", reason: "account", email: "someone@other.com", oid: "oid-other", tid: OTHER_TENANT },
      { event: "LOGIN_DENIED", reason: "expired" },
      { event: "LOGOUT", email: "ana.souza@pitang.com", oid: "oid-ana", tid: TENANT_ID },
    ]);
  });

  it("records the Microsoft error code when the login fails there", async () => {
    const attempt = await http.request("/auth/login");
    const loginCookie = pair(setCookies(attempt)[0] ?? "");
    await http.request("/auth/callback?error=server_error", { headers: { cookie: loginCookie } });
    expect(logged).toEqual([{ event: "LOGIN_DENIED", reason: "failed", idpError: "server_error" }]);
  });

  it("logs an error code that is not one of RFC 6749 as unrecognized, never as the text received", async () => {
    const attempt = await http.request("/auth/login");
    const loginCookie = pair(setCookies(attempt)[0] ?? "");
    await http.request(`/auth/callback?error=${encodeURIComponent('x"}\n{"event":"LOGIN_SUCCESS"')}`, { headers: { cookie: loginCookie } });
    expect(logged).toEqual([{ event: "LOGIN_DENIED", reason: "failed", idpError: "unrecognized" }]);
    for (const code of ["invalid_request", "unauthorized_client", "access_denied", "unsupported_response_type", "invalid_scope", "server_error", "temporarily_unavailable"]) {
      logged.length = 0;
      const again = pair(setCookies(await http.request("/auth/login"))[0] ?? "");
      await http.request(`/auth/callback?error=${code}`, { headers: { cookie: again } });
      expect(logged[0]).toMatchObject({ idpError: code });
    }
  });

  it("records the error and the AADSTS code when the token endpoint refuses the code", async () => {
    refusal = new ResponseBodyError("server responded with an error in the response body", {
      cause: { error: "invalid_grant", error_description: "AADSTS70008: The provided authorization code or refresh token has expired. Trace ID: abc Correlation ID: def" },
      response: new Response(null, { status: 400 }),
    });
    await logInAs(http, "ana");
    expect(logged).toHaveLength(1);
    expect(logged[0]).toMatchObject({ event: "LOGIN_DENIED", reason: "failed", idpError: "invalid_grant", aadsts: "AADSTS70008" });
    expect(JSON.stringify(logged[0])).not.toContain("Trace ID");
  });
});

describe("the downloads", () => {
  const download = (cookie: string, file = "/downloads/pr-review-1.2.0.zip", init: RequestInit = {}) => http.request(file, { ...init, headers: { cookie, ...init.headers } });

  it("hand out the .zip files to a person with a session, and the application records no use", async () => {
    const { cookie } = await logInAs(http, "ana");
    logged.length = 0;
    for (const file of ["/downloads/pr-review-1.2.0.zip", "/downloads/pg-revisar-seguranca-1.2.0.zip", "/downloads/plugin.zip"]) expect((await download(cookie, file)).status).toBe(200);
    const first = await download(cookie);
    const modified = first.headers.get("last-modified") ?? "";
    expect((await download(cookie, "/downloads/pr-review-1.2.0.zip", { headers: { "if-modified-since": modified } })).status).toBe(304);
    expect((await download(cookie, "/downloads/missing-1.0.0.zip")).status).toBe(404);
    expect(logged).toEqual([]);
  });

  it("stay closed without a session", async () => {
    expect((await http.request("/downloads/pr-review-1.2.0.zip")).status).toBe(401);
    expect(logged).toEqual([]);
  });

  it("have no route that takes a record of use: /api/events is not there any more", async () => {
    const { cookie } = await logInAs(http, "ana");
    logged.length = 0;
    const post = await http.request("/api/events", { method: "POST", headers: { cookie, "x-portal": "interest", "content-type": "application/json" }, body: "{}" });
    expect(post.status).toBe(405);
    expect((await http.request("/api/events", { method: "POST", body: "{}" })).status).toBe(405);
    expect((await http.request("/api/events", { headers: { cookie } })).status).toBe(404);
    expect(logged).toEqual([]);
  });
});

describe("the page nonce", () => {
  it("goes into every script of the build's pages, and a plugin file from the acervo comes out equal to the file", async () => {
    const { cookie } = await logInAs(http, "ana");
    const template = await http.request("/acervo/plugin/skills/x/template.html", { headers: { cookie } });
    expect(template.status).toBe(200);
    expect(await template.text()).toBe(TEMPLATE);
    const home = await (await http.request("/", { headers: { ...page, cookie } })).text();
    expect([...home.matchAll(/<script(?! nonce=)/g)]).toHaveLength(0);
    expect([...home.matchAll(/<script nonce="[^"]+"/g)]).toHaveLength(2);
  });

  it("hands a plugin file out under a sandbox policy, and every other response under the policy of the site", async () => {
    const { cookie } = await logInAs(http, "ana");
    const template = await http.request("/acervo/plugin/skills/x/template.html", { headers: { cookie } });
    expect(template.headers.get("content-security-policy")).toBe(ACERVO_CONTENT_SECURITY_POLICY);
    expect(ACERVO_CONTENT_SECURITY_POLICY).toBe("sandbox; default-src 'none'");
    const home = await http.request("/", { headers: { ...page, cookie } });
    expect(home.headers.get("content-security-policy")).toContain("base-uri 'none'");
    expect(home.headers.get("content-security-policy")).not.toContain("sandbox");
    const asset = await http.request("/assets/app-abc.js", { headers: { cookie } });
    expect(asset.headers.get("content-security-policy")).not.toContain("sandbox");
  });

  it("gives every page a new nonce, and the policy of that response names it", async () => {
    const { cookie } = await logInAs(http, "ana");
    const nonces: string[] = [];
    for (let i = 0; i < 2; i++) {
      const response = await http.request("/", { headers: { ...page, cookie } });
      const used = [...(await response.text()).matchAll(/<script nonce="([^"]+)"/g)].map((m) => m[1] ?? "");
      expect(new Set(used).size).toBe(1);
      const nonce = used[0] ?? "";
      expect(response.headers.get("content-security-policy")).toBe(serverContentSecurityPolicy(nonce, null));
      nonces.push(nonce);
    }
    expect(nonces[0]).not.toBe(nonces[1]);
  });

  it("is also in the shell that answers an address the router draws", async () => {
    const { cookie } = await logInAs(http, "ana");
    const response = await http.request("/missing", { headers: { ...page, cookie } });
    expect(await response.text()).toMatch(/<script nonce="[^"]+">window\.start = 1<\/script>/);
  });

  it("compresses the page without losing the nonce", async () => {
    const { cookie } = await logInAs(http, "ana");
    const response = await http.request("/big", { headers: { ...page, cookie, "accept-encoding": "gzip" } });
    expect(response.headers.get("content-encoding")).toBe("gzip");
    const html = gunzipSync(Buffer.from(await response.arrayBuffer())).toString();
    expect(html).toMatch(/<script nonce="[^"]+"/);
  });
});

describe("the security headers", () => {
  it("go on every response, with no framing by other sites", async () => {
    const response = await http.request("/entrar", { headers: page });
    const { cookie } = await logInAs(http, "ana");
    const inside = await http.request("/academy", { headers: { ...page, cookie } });
    const asset = await http.request("/assets/app-abc.js", { headers: { cookie } });
    for (const r of [response, inside, asset, await http.request("/health")]) {
      expect(r.headers.get("x-frame-options")).toBe("DENY");
      expect(r.headers.get("x-content-type-options")).toBe("nosniff");
      expect(r.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
      expect(r.headers.get("cross-origin-opener-policy")).toBe("same-origin");
      expect(r.headers.get("permissions-policy")).toContain("camera=()");
      expect(r.headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
    }
  });

  it("gives the login page its own policy, with the nonce of that page on its only script", async () => {
    const response = await http.request("/entrar", { headers: page });
    const policy = response.headers.get("content-security-policy") ?? "";
    expect(policy).toContain("default-src 'none'");
    const nonce = /script-src 'nonce-([^']+)'/.exec(policy)?.[1];
    const scripts = [...(await response.text()).matchAll(/<script nonce="([^"]+)"/g)].map((m) => m[1]);
    expect(scripts).toEqual([nonce]);
  });
});
