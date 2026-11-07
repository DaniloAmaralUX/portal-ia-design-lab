import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import { URL, URLSearchParams } from 'node:url';
import { loginPage } from './login-page.mjs';

const COOKIE = '__Host-portal-prototype';
const TTL = 8 * 60 * 60;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.zip': 'application/zip', '.txt': 'text/plain; charset=utf-8' };
const digest = (value) => createHash('sha256').update(value).digest();
const equal = (left, right) => timingSafeEqual(digest(left), digest(right));

export function safeReturnPath(input) {
  if (typeof input !== 'string' || input.length > 2048 || !input.startsWith('/') || input.startsWith('//') || /[\\\r\n]/.test(input)) return '/';
  try { const decoded = decodeURIComponent(input); if (decoded.startsWith('//') || /[\\\r\n]/.test(decoded)) return '/'; } catch { return '/'; }
  return input.startsWith('/auth/') || input.startsWith('/entrar') ? '/' : input;
}

function signature(payload, password) {
  return createHmac('sha256', password).update(`portal-prototype-v1:${payload}`).digest('base64url');
}

function authenticated(cookie, password) {
  const value = (cookie ?? '').split(';').map((s) => s.trim()).find((s) => s.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!value || value.length > 256) return false;
  const [expires, nonce, sig, extra] = value.split('.');
  const now = Math.floor(Date.now() / 1000);
  return !extra && /^\d+$/.test(expires ?? '') && Number(expires) > now && Number(expires) <= now + TTL && /^[\w-]{24}$/.test(nonce ?? '') && Boolean(sig) && equal(sig, signature(`${expires}.${nonce}`, password));
}

function setCookie(response, password, clear = false) {
  const expires = Math.floor(Date.now() / 1000) + TTL;
  const payload = `${expires}.${randomBytes(18).toString('base64url')}`;
  const value = clear ? '' : `${payload}.${signature(payload, password)}`;
  response.setHeader('Set-Cookie', `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${clear ? 0 : TTL}`);
}

async function formBody(request) {
  if (Number(request.headers['content-length'] ?? 0) > 2048) throw new Error('body-too-large');
  if (request.body !== undefined) {
    const body = typeof request.body === 'object' && request.body !== null ? new URLSearchParams(request.body).toString() : String(request.body);
    if (Buffer.byteLength(body) > 2048) throw new Error('body-too-large');
    return new URLSearchParams(body);
  }
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    const buffer = Buffer.from(chunk);
    length += buffer.length;
    if (length > 2048) throw new Error('body-too-large');
    chunks.push(buffer);
  }
  return new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
}

export function createGateway({ password, root = path.join(process.cwd(), 'private-client') }) {
  const privateRoot = path.resolve(root);
  return async function gateway(request, response) {
    const nonce = randomBytes(18).toString('base64url');
    response.setHeader('Cache-Control', 'private, no-store, max-age=0');
    response.setHeader('CDN-Cache-Control', 'no-store');
    response.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    response.setHeader('Vary', 'Cookie');
    response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Referrer-Policy', 'same-origin');
    response.setHeader('Permissions-Policy', 'camera=(), geolocation=(), microphone=(self)');
    response.setHeader('Content-Security-Policy', `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; frame-src https://pitangconsult-my.sharepoint.com`);
    const send = (status, content, type = 'text/plain; charset=utf-8') => {
      response.statusCode = status;
      response.setHeader('Content-Type', type);
      response.end(request.method === 'HEAD' ? undefined : content);
    };
    const redirect = (location) => { response.setHeader('Location', location); send(303, ''); };
    if (typeof password !== 'string' || password.length < 20) return send(503, 'Prévia indisponível.');
    const url = new URL(request.url ?? '/', `https://${request.headers.host ?? 'localhost'}`);
    let pathname;
    try { pathname = decodeURIComponent(url.searchParams.get('path') ?? url.pathname); } catch { return send(400, 'Caminho inválido.'); }
    if (!pathname.startsWith('/') || /[\\:%]/.test(pathname) || [...pathname].some((c) => c.charCodeAt(0) < 32) || pathname.split('/').some((part) => part.startsWith('.'))) return send(400, 'Caminho inválido.');
    const authed = authenticated(request.headers.cookie, password);
    if (pathname === '/auth/prototype' && request.method === 'POST') {
      const origin = request.headers.origin;
      try { if (!origin || new URL(origin).host !== request.headers.host) return send(403, 'Pedido recusado.'); } catch { return send(403, 'Pedido recusado.'); }
      let body;
      try { body = await formBody(request); } catch { return send(413, 'Pedido muito grande.'); }
      const destination = safeReturnPath(body.get('volta'));
      if (!equal(body.get('password') ?? '', password)) return redirect(`/entrar?erro=senha&volta=${encodeURIComponent(destination)}`);
      setCookie(response, password);
      return redirect(destination);
    }
    if (pathname === '/entrar' && ['GET', 'HEAD'].includes(request.method)) {
      if (authed) return redirect(safeReturnPath(url.searchParams.get('volta')));
      return send(200, loginPage(safeReturnPath(url.searchParams.get('volta')), url.searchParams.get('erro') === 'senha'), 'text/html; charset=utf-8');
    }
    if (!authed) {
      if (pathname === '/' || (request.headers.accept ?? '').includes('text/html')) return redirect(`/entrar?volta=${encodeURIComponent(safeReturnPath(pathname))}`);
      return send(401, 'Acesso restrito.');
    }
    if (pathname === '/auth/logout' && request.method === 'POST') {
      if (request.headers['x-portal'] !== 'logout') return send(403, 'Pedido recusado.');
      setCookie(response, password, true);
      return send(200, JSON.stringify({ destination: '/entrar' }), 'application/json');
    }
    if (!['GET', 'HEAD'].includes(request.method)) return send(405, 'A prévia não recebe publicações.');
    if (pathname === '/api/me') return send(200, JSON.stringify({ name: 'Revisão do protótipo', email: '', canPublish: false }), 'application/json');
    if (pathname.startsWith('/api/') || pathname.startsWith('/auth/') || pathname.startsWith('/private-client/')) return send(404, 'Não encontrado.');
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    let file = path.resolve(privateRoot, relative);
    if (path.relative(privateRoot, file).startsWith('..') || path.isAbsolute(path.relative(privateRoot, file))) return send(400, 'Caminho inválido.');
    try {
      const info = await stat(file);
      if (!info.isFile()) throw new Error('not-file');
    } catch {
      if (path.extname(pathname)) return send(404, 'Não encontrado.');
      file = path.join(privateRoot, 'index.html');
    }
    try {
      const type = MIME[path.extname(file)] ?? 'application/octet-stream';
      let data = await readFile(file);
      if (file.endsWith('.html')) data = Buffer.from(data.toString('utf8').replace(/<script\b/g, `<script nonce="${nonce}"`));
      return send(200, data, type);
    } catch { return send(404, 'Não encontrado.'); }
  };
}

export default function handler(request, response) {
  return createGateway({ password: process.env.PROTOTYPE_PASSWORD })(request, response);
}
