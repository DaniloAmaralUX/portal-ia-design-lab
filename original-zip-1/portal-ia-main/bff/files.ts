import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Context, MiddlewareHandler } from "hono";
import type { SecureHeadersVariables } from "hono/secure-headers";
import { serveStatic } from "@hono/node-server/serve-static";

export type LoginFonts = { inter?: string; montserrat?: string };

const ASSETS = /^\/assets\//;
// The acervo holds the plugins' own files, which the site only hands out. Their HTML is not a page of this site.
export const PLUGIN_FILES = /^\/acervo\//i;

const FILE_EXTENSION = /\.[a-z0-9]+$/i;
const TECHNICAL_PATH = /^\/(api|auth)\//;

function isPageRequest(c: Context): boolean {
  return (c.req.header("Accept") ?? "").includes("text/html") && !FILE_EXTENSION.test(c.req.path) && !TECHNICAL_PATH.test(c.req.path);
}

// The build's pages carry the nonce of each response in every <script, so only those scripts run under the BFF's policy.
function withNonce(html: string, nonce: string): string {
  return html.replace(/<script(?=[\s>])/g, `<script nonce="${nonce}"`);
}

export function createStaticFiles(folder: string) {
  const root = path.resolve(folder);
  const appShellFile = path.join(root, "index.html");
  if (!existsSync(appShellFile)) throw new Error(`The site build is missing: ${appShellFile} does not exist. Run npm run build first.`);
  const appShell = readFileSync(appShellFile, "utf8");

  // serveStatic refuses percent signs, dot segments and double slashes in the path, and only reads inside root.
  const files = serveStatic({ root, precompressed: true });

  const headers: MiddlewareHandler = async (c, next) => {
    await next();
    const type = c.res.headers.get("Content-Type") ?? "";
    if (type.startsWith("text/html")) {
      c.res.headers.set("Cache-Control", "no-store");
      return;
    }
    if (!c.res.ok) return;
    if (c.req.path.endsWith(".md")) c.res.headers.set("Content-Type", "text/markdown; charset=utf-8");
    // A .br or .gz may stand beside the file, so the answer depends on Accept-Encoding even when this one went out plain.
    if (!/accept-encoding/i.test(c.res.headers.get("Vary") ?? "")) c.res.headers.append("Vary", "Accept-Encoding");
    c.res.headers.set("Cache-Control", ASSETS.test(c.req.path) ? "private, max-age=31536000, immutable" : "private, no-cache");
    const modified = c.res.headers.get("Last-Modified");
    const since = c.req.header("If-Modified-Since");
    if (modified && since && Date.parse(since) >= Date.parse(modified)) {
      c.res = new Response(null, { status: 304, headers: { "Last-Modified": modified, "Cache-Control": c.res.headers.get("Cache-Control") ?? "", Vary: c.res.headers.get("Vary") ?? "" } });
      // Setting c.res copies the headers of the response it replaces, the file's length and encoding among them.
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Encoding");
    }
  };

  const pages: MiddlewareHandler<{ Variables: SecureHeadersVariables }> = async (c, next) => {
    await next();
    const nonce = c.get("secureHeadersNonce");
    const type = c.res.headers.get("Content-Type") ?? "";
    if (!nonce || !type.startsWith("text/html") || PLUGIN_FILES.test(c.req.path) || c.req.method === "HEAD") return;
    if (c.res.headers.has("Content-Encoding")) throw new Error(`HTML must not be precompressed, it takes the nonce: ${c.req.path}`);
    const html = withNonce(await c.res.text(), nonce);
    const responseHeaders = new Headers(c.res.headers);
    responseHeaders.delete("Content-Length");
    c.res = new Response(html, { status: c.res.status, headers: responseHeaders });
    // Setting c.res copies the headers of the response it replaces, so the length of the file without the nonces comes back.
    c.res.headers.delete("Content-Length");
  };

  return {
    middleware: [pages, headers, files],
    // The site is a SPA: the router draws every address, the not-found page included, so a page request that no file answers gets the shell with 200. A file that does not exist is a 404.
    notFound: (c: Context) => (isPageRequest(c) ? c.html(appShell) : c.text("Não encontrado.\n", 404)),
  };
}

export function findLoginFonts(folder: string): LoginFonts {
  const assets = path.join(path.resolve(folder), "assets");
  if (!existsSync(assets)) return {};
  const names = readdirSync(assets);
  const find = (prefix: string) => names.find((name) => name.startsWith(prefix) && name.endsWith(".woff2"));
  const inter = find("inter-latin-wght-normal");
  const montserrat = find("montserrat-latin-wght-normal");
  return { inter: inter && `/assets/${inter}`, montserrat: montserrat && `/assets/${montserrat}` };
}
