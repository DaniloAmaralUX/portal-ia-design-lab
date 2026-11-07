import { BRAND_NAME, SITE_NAME } from "../src/shared/brand.ts";
import { INTRO_SEEN_KEY } from "../src/shared/intro.ts";
import { PITANG_SYMBOL_PATH, PITANG_WORDMARK_PATH } from "../src/shared/pitang-logo.ts";
import { THEME_KEY } from "../src/shared/theme.ts";
import type { LoginFonts } from "./files.ts";

// The log and the code use the English code; the page address keeps the Portuguese value of ?erro=, and the page the message.
export const LOGIN_ERRORS = {
  account: { param: "conta", message: "A conta que você usou não é de quem trabalha na Pitang. Entre com a conta do seu e-mail da Pitang." },
  cancelled: { param: "cancelado", message: "O login foi cancelado. Entre de novo quando quiser." },
  failed: { param: "falhou", message: "Não deu para entrar com a Microsoft. Tente de novo." },
  expired: { param: "expirou", message: "O login demorou demais e expirou. Tente de novo." },
} as const;

export type LoginError = keyof typeof LOGIN_ERRORS;

export function parseLoginError(param: string | null | undefined): LoginError | null {
  const codes = Object.keys(LOGIN_ERRORS) as LoginError[];
  return codes.find((code) => LOGIN_ERRORS[code].param === param) ?? null;
}

// The login page needs less than the site: scripts only with its nonce, and only its own fonts and logo.
export function loginPageDirectives<Source>(nonceSource: Source) {
  return {
    "default-src": ["'none'"],
    "script-src": [nonceSource],
    "style-src": ["'unsafe-inline'"],
    "font-src": ["'self'"],
    "img-src": ["'self'"],
    "form-action": ["'self'"],
    "base-uri": ["'none'"],
    "frame-ancestors": ["'none'"],
  } as Record<string, (string | Source)[]>;
}

const HTML_ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => HTML_ENTITIES[c] ?? c);

// The theme, before the first paint, and the mark of the opening of the site, cleared for the sign-in (src/shared/intro.ts).
const PAGE_SCRIPT = `(function () {
  try { sessionStorage.removeItem(${JSON.stringify(INTRO_SEEN_KEY)}); } catch (e) {}
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem(${JSON.stringify(THEME_KEY)}); } catch (e) {}
  var dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  root.classList.toggle("dark", dark);
  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("theme");
    var label = function () {
      var text = dark ? "Usar tema claro" : "Usar tema escuro";
      button.setAttribute("aria-label", text);
      button.title = text;
    };
    label();
    button.addEventListener("click", function () {
      dark = !dark;
      root.classList.toggle("dark", dark);
      try { localStorage.setItem(${JSON.stringify(THEME_KEY)}, dark ? "dark" : "light"); } catch (e) {}
      label();
    });
  });
})();`;

const SUN =
  '<svg class="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
const MOON =
  '<svg class="moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

export function renderLoginPage({ returnPath, error, fonts, nonce }: { returnPath: string; error: LoginError | null; fonts: LoginFonts; nonce: string }): string {
  const loginUrl = `/auth/login?volta=${encodeURIComponent(returnPath)}`;
  const fontFaces = [
    fonts.inter && `@font-face{font-family:"Inter Variable";src:url(${fonts.inter}) format("woff2");font-weight:100 900;font-display:swap}`,
    fonts.montserrat &&
      `@font-face{font-family:"Montserrat Variable";src:url(${fonts.montserrat}) format("woff2");font-weight:100 900;font-display:swap}`,
  ]
    .filter(Boolean)
    .join("");
  const alert = error
    ? `<p class="error" role="alert"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>${escapeHtml(LOGIN_ERRORS[error].message)}</p>`
    : "";
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Entrar · ${escapeHtml(SITE_NAME)}</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<script nonce="${escapeHtml(nonce)}">${PAGE_SCRIPT}</script>
<style>
${fontFaces}
:root{color-scheme:light;--background:#fbfaf7;--text:#1d1b18;--muted:#6a635a;--border:#e9e4db;--highlight:#f0ebe3;--brand:#ed1c24;--ease:cubic-bezier(.2,0,0,1)}
.dark{color-scheme:dark;--background:#11100f;--text:#f3f0eb;--muted:#bfb6ab;--border:#2e2a27;--highlight:#26221f}
*{box-sizing:border-box}
body{margin:0;min-height:100dvh;display:grid;place-items:center;padding:3rem 1.25rem;background:var(--background);color:var(--text);font:400 1rem/1.6 "Inter Variable",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{width:100%;max-width:24rem;text-align:center}
.brand{display:flex;align-items:center;justify-content:center;gap:.625rem}
.brand svg{height:26px;width:auto;color:var(--brand)}
.divider{width:1px;height:1.5rem;background:var(--border)}
.name{font:600 1.125rem/1 "Montserrat Variable",system-ui,sans-serif}
h1{margin:2.5rem 0 0;font:700 clamp(1.75rem,1.45rem + 1.4vw,2.125rem)/1.15 "Montserrat Variable",system-ui,sans-serif;letter-spacing:-.01em;text-wrap:balance}
p{margin:.75rem 0 0;color:var(--muted);text-wrap:pretty}
.nowrap{white-space:nowrap}
.button{margin-top:2rem;display:inline-flex;width:100%;height:3rem;align-items:center;justify-content:center;gap:.75rem;border-radius:999px;border:1px solid #8c8c8c;background:#fff;color:#5e5e5e;font-weight:600;text-decoration:none;transition:background-color .12s ease-out,box-shadow .2s var(--ease),transform .12s ease-out}
.button:hover{background:#f3f3f3;box-shadow:0 10px 24px -14px rgb(0 0 0/.45)}
.button:active{transform:scale(.98)}
.dark .button{background:#2f2f2f;color:#fff;border-color:transparent}
.dark .button:hover{background:#3b3b3b}
a:focus-visible,button:focus-visible{outline:2px solid var(--brand);outline-offset:3px}
.error{margin-top:1.25rem;display:flex;gap:.5rem;text-align:left;color:var(--text);font-size:.875rem}
.error svg{flex:none;margin-top:.2rem;color:var(--brand)}
#theme{position:fixed;top:1rem;right:1rem;display:grid;place-items:center;width:2.25rem;height:2.25rem;padding:0;border:0;border-radius:999px;background:transparent;color:var(--muted);cursor:pointer;transition:background-color .12s ease-out,color .12s ease-out,transform .12s ease-out}
#theme:hover{background:var(--highlight);color:var(--text)}
#theme:active{transform:scale(.94)}
#theme svg{grid-area:1/1;transition:opacity .2s var(--ease),transform .2s var(--ease)}
.sun,.dark .moon{opacity:0;transform:scale(.25) rotate(-45deg)}
.dark .sun{opacity:1;transform:none}
@media (prefers-reduced-motion:no-preference){
main>*{animation:rise .55s var(--ease) both}
main>:nth-child(2){animation-delay:.07s}main>:nth-child(3){animation-delay:.14s}main>:nth-child(4){animation-delay:.21s}main>:nth-child(5){animation-delay:.28s}
}
@media (prefers-reduced-motion:reduce){#theme svg{transition:none}}
@keyframes rise{from{opacity:0;transform:translateY(10px)}}
</style>
</head>
<body>
<button id="theme" type="button" aria-label="Trocar o tema">${SUN}${MOON}</button>
<main>
<div class="brand"><svg viewBox="-5 0 326 91" role="img" aria-label="Pitang"><path d="${PITANG_SYMBOL_PATH}" fill="currentColor"/><path d="${PITANG_WORDMARK_PATH}" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/></svg><span class="divider" aria-hidden="true"></span><span class="name">${escapeHtml(BRAND_NAME)}</span></div>
<h1>Entre com a sua conta da Pitang</h1>
<p>O portal é de quem trabalha na Pitang. Entre com a conta Microsoft do seu <span class="nowrap">e-mail</span> da Pitang, a mesma do Outlook e do Teams.</p>
<a class="button" href="${escapeHtml(loginUrl)}"><svg width="20" height="20" viewBox="0 0 21 21" aria-hidden="true"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>Entrar com a Microsoft</a>
${alert}
</main>
</body>
</html>
`;
}
