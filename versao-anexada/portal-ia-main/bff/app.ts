import { randomBytes } from "node:crypto";
import { Hono, type Context, type MiddlewareHandler } from "hono";
import { bodyLimit } from "hono/body-limit";
import { compress } from "hono/compress";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { NONCE, secureHeaders, type SecureHeadersVariables } from "hono/secure-headers";
import { ResponseBodyError } from "openid-client";
import { ACERVO_DIRECTIVES, serverDirectives } from "../src/shared/content-security-policy.ts";
import { parseRequest, problemsOf } from "../src/shared/publish-request.ts";
import { createStaticFiles, findLoginFonts, PLUGIN_FILES } from "./files.ts";
import { logToStdout, type Logger } from "./log.ts";
import { LOGIN_ERRORS, loginPageDirectives, parseLoginError, renderLoginPage, type LoginError } from "./login-page.ts";
import type { Queue } from "./queue.ts";
import { createSealer, IDLE_TIMEOUT_SECONDS, LOGIN_ATTEMPT_SECONDS } from "./session.ts";

export type Claims = Record<string, unknown>;
export type LoginAttempt = { state: string; nonce: string; codeVerifier: string };
export type Oidc = {
  authorizationUrl(attempt: LoginAttempt): Promise<string>;
  exchangeCode(currentUrl: URL, attempt: LoginAttempt): Promise<Claims>;
  logoutUrl(): string;
};

type Session = { name: string; email: string; oid: string; tid: string; exp: number };
type PendingLogin = LoginAttempt & { returnPath: string };
type Variables = SecureHeadersVariables & { session: Session | null };
type AppContext = Context<{ Variables: Variables }, string>;

type PortalAppOptions = {
  root: string;
  siteVersion: string;
  publicUrl: string;
  tenantId: string;
  sessionPasswords: Record<string, string>;
  oidc: Oidc;
  sessionDurationHours?: number;
  sharepointOrigin?: string | null;
  publisherEmails?: readonly string[];
  queue?: Queue | null;
  log?: Logger;
};

// The routes that answer without a session, by exact path. Everything else is closed unless it is one of the login page's own files.
const PUBLIC_ROUTES = { "/health": "GET, HEAD", "/entrar": "GET, HEAD", "/auth/login": "GET", "/auth/callback": "GET", "/auth/logout": "POST", "/api/me": "GET", "/api/publish": "POST" } as const;
const PUBLIC_FILES = /^\/(favicon\.svg|assets\/[\w.-]+\.woff2)$/;
const LOGIN_PAGE = "/entrar";
// The body of /api/publish carries the text of a page, so the limit is well above a form and well below what a request can hold.
const MAX_PUBLISH_BYTES = 300 * 1024;

// Guests sign in through Pitang's tenant too, and a Guest account created in the tenant itself has an idp equal to the issuer, so the idp alone cannot tell it from a member.
// The acct claim does: it is 0 for a member and 1 for a guest, and the app registration must send it. Without it nobody gets in, so a missing claim never passes as a member.
export function isPitangAccount(claims: Claims, tenantId: string): boolean {
  if (claims.tid !== tenantId) return false;
  if (claims.acct !== 0) return false;
  const idp = claims.idp;
  return idp === undefined || idp === claims.iss || idp === `https://sts.windows.net/${tenantId}/`;
}

// The login cookie carries the return path, and a browser keeps a cookie only up to about 4 KB, so the path has a limit well under it.
const MAX_RETURN_PATH = 1024;

export function safeReturnPath(raw: string | null | undefined): string {
  if (!raw || raw.length > MAX_RETURN_PATH || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return "/";
  try {
    const url = new URL(raw, "http://portal.invalid");
    const path = url.pathname + url.search + url.hash;
    const notAPage = url.pathname.startsWith("/auth/") || url.pathname.startsWith("/api/") || url.pathname === LOGIN_PAGE;
    // The parser removes the dot segments, so "/.//evil.example" and "/a/..//evil.example" only become "//evil.example" after it: the
    // check that matters is on the result, which a browser reads as another site.
    if (url.host !== "portal.invalid" || notAPage || path.startsWith("//") || path.includes("\\") || path.length > MAX_RETURN_PATH) return "/";
    return path;
  } catch {
    return "/";
  }
}

const randomToken = () => randomBytes(32).toString("base64url");
const text = (value: unknown) => (typeof value === "string" ? value : "");
const emailOf = (claims: Claims) => text(claims.preferred_username) || text(claims.email);
const identityOfSession = (session: Session) => ({ email: session.email, oid: session.oid || undefined, tid: session.tid || undefined });
const identityOf = (claims: Claims) => ({ email: emailOf(claims) || undefined, oid: text(claims.oid) || undefined, tid: text(claims.tid) || undefined });

// The error codes of RFC 6749: section 4.1.2.1 for the redirect back from the authorization endpoint, and 5.2 for the token endpoint.
// Anyone can put anything in ?error=, so what is not on the list goes to the log as "unrecognized" and never as the text received.
const AUTHORIZATION_ERRORS = new Set(["invalid_request", "unauthorized_client", "access_denied", "unsupported_response_type", "invalid_scope", "server_error", "temporarily_unavailable"]);
const TOKEN_ERRORS = new Set(["invalid_request", "invalid_client", "invalid_grant", "unauthorized_client", "unsupported_grant_type", "invalid_scope"]);
const knownError = (known: Set<string>, value: string) => (known.has(value) ? value : "unrecognized");

// What Microsoft's token endpoint said when it refused the code: the error and the AADSTS code, never the whole description.
function idpFailureOf(error: unknown): { idpError?: string; aadsts?: string } {
  if (!(error instanceof ResponseBodyError)) return {};
  return { idpError: knownError(TOKEN_ERRORS, error.error), aadsts: /AADSTS\d+/.exec(error.error_description ?? "")?.[0] };
}

const methodNotAllowed = (c: AppContext, allow: string) => c.text("Método não permitido.\n", 405, { Allow: allow, "Cache-Control": "no-store" });

type ContentSecurityPolicy = NonNullable<NonNullable<Parameters<typeof secureHeaders>[0]>["contentSecurityPolicy"]>;

// The shared directives are kebab-case, as in the policy string; Hono wants camelCase keys.
const camelCase = (name: string) => name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
const honoDirectives = (directives: Record<string, readonly (string | typeof NONCE)[]>) =>
  Object.fromEntries(Object.entries(directives).map(([name, values]) => [camelCase(name), [...values]])) as ContentSecurityPolicy;

export function createPortalApp(options: PortalAppOptions): Hono<{ Variables: Variables }> {
  const publicUrl = options.publicUrl.replace(/\/+$/, "");
  const secure = publicUrl.startsWith("https://");
  const log = options.log ?? logToStdout;
  const sessionDurationMs = (options.sessionDurationHours ?? 8) * 60 * 60 * 1000;
  const sealer = createSealer(options.sessionPasswords);
  const publishers = new Set((options.publisherEmails ?? []).map((email) => email.toLowerCase()));
  const canPublish = (session: Session) => publishers.has(session.email.toLowerCase());
  const queue = options.queue ?? null;
  const staticFiles = createStaticFiles(options.root);
  const fonts = findLoginFonts(options.root);
  // __Host-Http- makes the browser require Secure, Path=/, no Domain and HttpOnly. Safari up to 27.2 reads it as __Host- and does not guarantee HttpOnly. Hono's prefix option only knows __Host- and __Secure-, so the name is written here.
  const sessionCookie = secure ? "__Host-Http-portal-session" : "portal-session";
  const loginCookie = secure ? "__Host-Http-portal-login" : "portal-login";
  // Lax, not Strict: a link opened from Teams or an e-mail arrives as a cross-site navigation, and with Strict the person would meet the login again. CSRF is covered by the X-Portal header on the logout and by having no GET that changes state. The login cookie also has to come back from Microsoft's redirect.
  const cookieOptions = { path: "/", httpOnly: true, sameSite: "Lax", secure } as const;

  const app = new Hono<{ Variables: Variables }>();

  // The login page has its own, stricter policy. secureHeaders sets its headers after the handler runs, so the outermost one wins: this one goes first.
  app.use(LOGIN_PAGE, secureHeaders({ ...headerOptions(secure), contentSecurityPolicy: honoDirectives(loginPageDirectives(NONCE)) }));
  // The plugins' own files, which the site hands out as they are, get a policy that keeps their HTML and scripts from running on this origin.
  const acervoHeaders: MiddlewareHandler<{ Variables: Variables }> = secureHeaders({ ...headerOptions(secure), contentSecurityPolicy: honoDirectives(ACERVO_DIRECTIVES) });
  app.use("*", (c: AppContext, next) => (PLUGIN_FILES.test(c.req.path) ? acervoHeaders(c, next) : next()));
  app.use("*", secureHeaders({ ...headerOptions(secure), contentSecurityPolicy: honoDirectives(serverDirectives(NONCE, options.sharepointOrigin ?? null)) }));
  app.use("*", compress());

  async function currentSession(c: AppContext): Promise<Session | null> {
    const session = await sealer.open<Session>("session", getCookie(c, sessionCookie));
    return session && typeof session.exp === "number" && session.exp > Date.now() && typeof session.email === "string" ? session : null;
  }

  async function sealSession(session: Session, c: AppContext) {
    setCookie(c, sessionCookie, await sealer.seal("session", session, IDLE_TIMEOUT_SECONDS), { ...cookieOptions, maxAge: IDLE_TIMEOUT_SECONDS });
  }

  function redirectToLogin(c: AppContext, returnPath: string, error?: LoginError) {
    const query = new URLSearchParams({ volta: returnPath });
    if (error) query.set("erro", LOGIN_ERRORS[error].param);
    return c.redirect(`${LOGIN_PAGE}?${query.toString()}`, 302);
  }

  // The authorization of the whole site. Only the routes and files above answer without a session; any new path starts closed.
  app.use(async (c, next) => {
    const session = await currentSession(c);
    c.set("session", session);
    c.header("Cache-Control", "no-store");
    const path = c.req.path;
    if (Object.hasOwn(PUBLIC_ROUTES, path)) return next();
    if (c.req.method !== "GET" && c.req.method !== "HEAD") return methodNotAllowed(c, "GET, HEAD");
    if (PUBLIC_FILES.test(path)) return next();
    if (!session) {
      if ((c.req.header("Accept") ?? "").includes("text/html")) return redirectToLogin(c, safeReturnPath(path + new URL(c.req.url).search));
      return c.text(`Entre com a conta Microsoft da Pitang em ${publicUrl}/ para abrir este arquivo.\n`, 401);
    }
    // Every request renews the idle timeout; the absolute limit stays the one sealed at login.
    await sealSession(session, c);
    return next();
  });

  app.get("/health", (c) => c.json({ status: "ok", version: options.siteVersion }));

  app.get(LOGIN_PAGE, (c) => {
    const session = c.get("session");
    const returnPath = safeReturnPath(c.req.query("volta"));
    if (session) return c.redirect(returnPath, 302);
    const html = renderLoginPage({ returnPath, error: parseLoginError(c.req.query("erro")), fonts, nonce: c.get("secureHeadersNonce") ?? "" });
    return c.html(html);
  });

  app.get("/auth/login", async (c) => {
    const pending: PendingLogin = { state: randomToken(), nonce: randomToken(), codeVerifier: randomToken(), returnPath: safeReturnPath(c.req.query("volta")) };
    const destination = await options.oidc.authorizationUrl(pending);
    setCookie(c, loginCookie, await sealer.seal("login", pending, LOGIN_ATTEMPT_SECONDS), { ...cookieOptions, maxAge: LOGIN_ATTEMPT_SECONDS });
    return c.redirect(destination, 302);
  });

  app.get("/auth/callback", async (c) => {
    const pending = await sealer.open<PendingLogin>("login", getCookie(c, loginCookie));
    const deny = (reason: LoginError, returnPath: string, details: { claims?: Claims; idpError?: string; aadsts?: string; detail?: string } = {}) => {
      log({ event: "LOGIN_DENIED", reason, ...(details.claims ? identityOf(details.claims) : {}), idpError: details.idpError, aadsts: details.aadsts, detail: details.detail });
      deleteCookie(c, loginCookie, cookieOptions);
      return redirectToLogin(c, returnPath, reason);
    };
    if (!pending) return deny("expired", "/");
    const callbackError = c.req.query("error");
    if (callbackError) return deny(callbackError === "access_denied" ? "cancelled" : "failed", pending.returnPath, { idpError: knownError(AUTHORIZATION_ERRORS, callbackError) });
    let claims: Claims;
    try {
      // The URL the server builds from the socket says http behind Cloud Run, and the library takes the redirect_uri of the exchange from it:
      // Microsoft only accepts the one that went in the authorization request, so it is built from the public address with the query received.
      claims = await options.oidc.exchangeCode(new URL(`/auth/callback${new URL(c.req.url).search}`, publicUrl), pending);
    } catch (error) {
      return deny("failed", pending.returnPath, { ...idpFailureOf(error), detail: error instanceof Error ? error.message : String(error) });
    }
    // When the app registration does not send acct, every login lands here, so the log says it: the person debugging sees the missing claim, and not a wall of refused accounts.
    if (!isPitangAccount(claims, options.tenantId)) return deny("account", pending.returnPath, { claims, detail: claims.acct === undefined ? "the acct claim is missing from the ID token" : undefined });
    const email = emailOf(claims);
    deleteCookie(c, loginCookie, cookieOptions);
    await sealSession({ name: text(claims.name) || email, email, oid: text(claims.oid), tid: text(claims.tid), exp: Date.now() + sessionDurationMs }, c);
    log({ event: "LOGIN_SUCCESS", ...identityOf(claims) });
    return c.redirect(pending.returnPath, 302);
  });

  // A custom header can't come from a form or a link on another site, so nobody can sign someone else out.
  app.post("/auth/logout", (c) => {
    if (c.req.header("X-Portal") !== "logout") return c.text("Pedido recusado.\n", 403);
    const session = c.get("session");
    if (session) log({ event: "LOGOUT", ...identityOfSession(session) });
    deleteCookie(c, sessionCookie, cookieOptions);
    c.header("Clear-Site-Data", '"cache"');
    return c.json({ destination: options.oidc.logoutUrl() });
  });

  app.get("/api/me", (c) => {
    const session = c.get("session");
    if (!session) return c.json({ error: "unauthenticated" }, 401);
    return c.json({ name: session.name, email: session.email, canPublish: canPublish(session) });
  });

  // Puts what the form sends in the queue of the bucket, where a job of the GitLab opens the Merge Request. It answers without the gate, as /api/me does, and checks by itself: the session, the list of who publishes,
  // the X-Portal header (a custom header cannot come from a form or a link on another site) and the content, with the same checks as the form.
  app.post("/api/publish", bodyLimit({ maxSize: MAX_PUBLISH_BYTES, onError: (c) => c.json({ error: "too_large" }, 413) }), async (c) => {
    const session = c.get("session");
    if (!session) return c.json({ error: "unauthenticated" }, 401);
    if (!canPublish(session) || c.req.header("X-Portal") !== "publish") return c.json({ error: "forbidden" }, 403);
    if (!queue) return c.json({ error: "unavailable" }, 503);
    const request = parseRequest(await c.req.json().catch(() => null));
    if (!request) return c.json({ error: "invalid", message: "O pedido veio fora do formato." }, 400);
    const problems = problemsOf(request, options.sharepointOrigin ?? null);
    if (Object.keys(problems).length > 0) return c.json({ error: "invalid", message: "O formulário tem campos para corrigir.", problems }, 422);
    try {
      await queue.add(request, session.name);
    } catch (error) {
      log({ event: "SERVER_ERROR", detail: `publish: ${error instanceof Error ? error.message : String(error)}` });
      return c.json({ error: "upstream", message: "Não foi possível enviar a solicitação agora. Tente de novo, ou copie o arquivo e mande para o time do portal." }, 502);
    }
    return c.json({ status: "queued" }, 202);
  });

  for (const [path, allow] of Object.entries(PUBLIC_ROUTES)) app.all(path, (c) => methodNotAllowed(c, allow));

  app.use("*", ...staticFiles.middleware);
  app.notFound((c) => (c.get("session") ? staticFiles.notFound(c) : c.text("Não encontrado.\n", 404)));

  app.onError((error, c) => {
    log({ event: "SERVER_ERROR", detail: error.message });
    return c.text("Erro interno.\n", 500);
  });

  return app;
}

function headerOptions(secure: boolean) {
  return {
    xFrameOptions: "DENY",
    referrerPolicy: "strict-origin-when-cross-origin",
    crossOriginOpenerPolicy: "same-origin",
    permissionsPolicy: { camera: false, microphone: false, geolocation: false, payment: false, usb: false },
    strictTransportSecurity: secure ? "max-age=31536000; includeSubDomains" : false,
  } as const;
}
