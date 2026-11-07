import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin, ViteDevServer } from "vite";

// The login page and the profile of the portal on the dev server, to work on them with the reload of Vite. The BFF is not here,
// so this plugin answers its public routes and imitates its gate: the page comes from the same bff/login-page.ts, the profile is
// an example account, always the same, and a page opened before "Entrar" falls on the login page, as in production. What
// remembers the "Entrar" is a cookie of the preview, with no account in it, that the BFF does not read; the dev server still
// hands every file to whoever reaches it, so the cookie locks and opens nothing (security-bff.md: no other way in than Microsoft's).
// The example account publishes, so the pages of /publicar open on the dev server.
const EXAMPLE_ACCOUNT = { name: "Ana Exemplo", email: "ana.exemplo@pitang.com", canPublish: true };
const SIGNED_IN_COOKIE = "login-preview";
const COOKIE_ATTRIBUTES = "Path=/; HttpOnly; SameSite=Lax";
const LOGIN_PAGE = "/entrar";

// The fonts of the page come from the packages, as the build takes them.
const FONTS = {
  inter: "/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  montserrat: "/node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2",
};

// The page and what it draws with: a change in them reloads it. The page runs on the server, out of the reach of the HMR.
const PAGE_SOURCES = ["/bff/login-page.ts", "/src/shared/brand.ts", "/src/shared/intro.ts", "/src/shared/pitang-logo.ts", "/src/shared/theme.ts"];

type LoginPage = {
  renderLoginPage: (options: { returnPath: string; error: string | null; fonts: typeof FONTS; nonce: string }) => string;
  parseLoginError: (param: string | null) => string | null;
};
type App = { safeReturnPath: (raw: string | null) => string };
type Route = (context: { server: ViteDevServer; req: IncomingMessage; res: ServerResponse; url: URL }) => Promise<void> | void;

function send(res: ServerResponse, status: number, type: string, body: string) {
  res.writeHead(status, { "Content-Type": type }).end(body);
}

function redirect(res: ServerResponse, location: string, cookie?: string) {
  res.writeHead(302, cookie ? { Location: location, "Set-Cookie": cookie } : { Location: location }).end();
}

function signedIn(req: IncomingMessage): boolean {
  return (req.headers.cookie ?? "").split(";").some((pair) => pair.trim() === `${SIGNED_IN_COOKIE}=1`);
}

// What the gate of the BFF takes for a page: a GET that accepts HTML. A module, a font or a fetch passes.
function isPage(req: IncomingMessage): boolean {
  return (req.method === "GET" || req.method === "HEAD") && (req.headers.accept ?? "").includes("text/html");
}

// The return path of the real login, which keeps the page from leading out of the site.
async function returnPathOf(server: ViteDevServer, raw: string | null): Promise<string> {
  const { safeReturnPath } = (await server.ssrLoadModule("/bff/app.ts")) as App;
  return safeReturnPath(raw);
}

const ROUTES: Record<string, Route> = {
  "GET /api/me": ({ req, res }) =>
    signedIn(req)
      ? send(res, 200, "application/json", JSON.stringify(EXAMPLE_ACCOUNT))
      : send(res, 401, "application/json", JSON.stringify({ error: "unauthenticated" })),
  // The real logout asks for this header against CSRF, and the preview keeps the same contract with the site.
  "POST /auth/logout": ({ req, res }) => {
    if (req.headers["x-portal"] !== "logout") return send(res, 403, "text/plain; charset=utf-8", "Pedido recusado.\n");
    res.setHeader("Set-Cookie", `${SIGNED_IN_COOKIE}=; Max-Age=0; ${COOKIE_ATTRIBUTES}`);
    send(res, 200, "application/json", JSON.stringify({ destination: "/" }));
  },
  // The send of /publicar, with the contract of the BFF (the session, and the X-Portal header against CSRF) and no bucket: it answers
  // that the request was queued, to work on the screen. The checks of the content and the queue are the BFF's, in bff/app.ts and bff/queue.ts.
  "POST /api/publish": async ({ req, res }) => {
    if (!signedIn(req)) return send(res, 401, "application/json", JSON.stringify({ error: "unauthenticated" }));
    if (req.headers["x-portal"] !== "publish") return send(res, 403, "application/json", JSON.stringify({ error: "forbidden" }));
    await new Promise((done) => setTimeout(done, 700));
    send(res, 202, "application/json", JSON.stringify({ status: "queued" }));
  },
  "GET /auth/login": async ({ server, res, url }) => {
    redirect(res, await returnPathOf(server, url.searchParams.get("volta")), `${SIGNED_IN_COOKIE}=1; ${COOKIE_ATTRIBUTES}`);
  },
  [`GET ${LOGIN_PAGE}`]: async ({ server, req, res, url }) => {
    const returnPath = await returnPathOf(server, url.searchParams.get("volta"));
    if (signedIn(req)) return redirect(res, returnPath);
    const { renderLoginPage, parseLoginError } = (await server.ssrLoadModule("/bff/login-page.ts")) as LoginPage;
    const html = renderLoginPage({ returnPath, error: parseLoginError(url.searchParams.get("erro")), fonts: FONTS, nonce: "" });
    // The client of Vite, so the page reloads when its code changes.
    send(res, 200, "text/html; charset=utf-8", html.replace("</head>", '<script type="module" src="/@vite/client"></script>\n</head>'));
  },
};

// The gate: a page asked before "Entrar" falls on the login page, with the way back to it, as the BFF does.
const gate: Route = async ({ server, res, url }) => {
  const volta = await returnPathOf(server, url.pathname + url.search);
  redirect(res, `${LOGIN_PAGE}?${new URLSearchParams({ volta }).toString()}`);
};

export function loginPreview(): Plugin {
  return {
    name: "login-preview",
    apply: "serve",
    configureServer(server) {
      server.watcher.on("change", (file) => {
        if (PAGE_SOURCES.some((source) => file.endsWith(source))) server.ws.send({ type: "full-reload" });
      });
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const route = ROUTES[`${req.method} ${url.pathname}`] ?? (isPage(req) && !signedIn(req) ? gate : undefined);
        if (!route) return next();
        Promise.resolve(route({ server, req, res, url })).catch(next);
      });
    },
  };
}
