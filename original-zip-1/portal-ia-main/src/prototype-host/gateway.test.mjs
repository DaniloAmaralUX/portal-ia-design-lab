/* global fetch */
import { test, after } from 'node:test';
import { URLSearchParams } from 'node:url';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { createGateway, safeReturnPath } from './gateway.mjs';

const password = randomBytes(24).toString('base64url');
const handler = createGateway({ password, root: path.resolve('dist/client') });
const server = createServer((request, response) => { void handler(request, response).catch(() => { response.statusCode = 500; response.end('error'); }); });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
after(() => new Promise((resolve) => server.close(resolve)));
const request = (url, options = {}) => fetch(origin + url, { redirect: 'manual', ...options });
const login = (value, extra = {}) => request('/auth/prototype', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ password: value, volta: '/academy' }), ...extra });

test('all entry points and resources require authentication', async () => {
  const page = await request('/', { headers: { Accept: 'text/html' } });
  assert.equal(page.status, 303);
  assert.match(page.headers.get('location'), /^\/entrar/);
  for (const url of ['/api/me', '/private-client/index.html', '/assets/any.js', '/manifesto.md', '/ferramentas/catalyst-toolkit.md', '/api/gateway?path=/index.html']) assert.equal((await request(url)).status, 401, url);
  const entry = await request('/entrar');
  const html = await entry.text();
  assert.match(html, /type="password"/);
  assert.ok(!html.includes(password));
  assert.equal(entry.headers.get('cache-control'), 'private, no-store, max-age=0');
});

test('bad passwords and cross-origin submissions never set a session', async () => {
  const bad = await login('incorrect');
  assert.equal(bad.status, 303);
  assert.match(bad.headers.get('location'), /erro=senha/);
  assert.equal(bad.headers.get('set-cookie'), null);
  assert.equal((await login(password, { headers: { Origin: 'https://other.example' } })).status, 403);
  assert.equal((await login(password, { headers: { Origin: 'invalid' } })).status, 403);
});

test('correct password unlocks pages and assets, and tampering is rejected', async () => {
  const response = await login(password);
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), '/academy');
  const header = response.headers.get('set-cookie');
  assert.match(header, /HttpOnly; Secure; SameSite=Lax/);
  const cookie = header.split(';')[0];
  const headers = { Cookie: cookie };
  const page = await request('/academy/trilhas/engenharia', { headers });
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /<script nonce="[\w-]+"/);
  const scripts = (await readdir('dist/client/assets')).filter((name) => name.startsWith('index-') && name.endsWith('.js'));
  const asset = await request(`/assets/${scripts[0]}`, { headers });
  assert.equal(asset.status, 200);
  assert.match(asset.headers.get('content-type'), /javascript/);
  assert.equal(asset.headers.get('vercel-cdn-cache-control'), 'no-store');
  assert.equal((await request('/api/me', { headers })).status, 200);
  assert.equal((await request('/private-client/index.html', { headers })).status, 404);
  assert.equal((await request('/api/me', { headers: { Cookie: cookie.slice(0, -1) + (cookie.endsWith('a') ? 'b' : 'a') } })).status, 401);
  assert.equal((await request('/auth/logout', { method: 'POST', headers })).status, 403);
  const logout = await request('/auth/logout', { method: 'POST', headers: { ...headers, 'X-Portal': 'logout' } });
  assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
  assert.equal((await request('/api/publish', { method: 'POST', headers })).status, 405);
});

test('unsafe redirects are normalized and absent secrets fail closed', async () => {
  for (const value of ['https://other.example', '//other.example', '/%5c%5cother.example', '/%0d%0aLocation:evil', '/auth/prototype', '/entrar']) assert.equal(safeReturnPath(value), '/');
  const closed = createServer(createGateway({ password: undefined }));
  await new Promise((resolve) => closed.listen(0, '127.0.0.1', resolve));
  try { assert.equal((await fetch(`http://127.0.0.1:${closed.address().port}/`)).status, 503); } finally { await new Promise((resolve) => closed.close(resolve)); }
});

test('the public preview opens without a password and remains read-only', async () => {
  const publicServer = createServer(createGateway({ publicAccess: true, root: path.resolve('dist/client') }));
  await new Promise((resolve) => publicServer.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${publicServer.address().port}`;
  try {
    const page = await fetch(base + '/', { redirect: 'manual' });
    assert.equal(page.status, 200);
    assert.equal(page.headers.get('set-cookie'), null);
    const html = await page.text();
    assert.match(html, /<script nonce="[\w-]+"/);
    assert.ok(!html.includes('type="password"'));
    const assets = (await readdir('dist/client/assets')).filter((name) => name.startsWith('index-') && name.endsWith('.js'));
    assert.equal((await fetch(base + `/assets/${assets[0]}`)).status, 200);
    const account = await fetch(base + '/api/me');
    assert.equal(account.status, 200);
    assert.equal((await account.json()).canPublish, false);
    const oldEntry = await fetch(base + '/entrar', { redirect: 'manual' });
    assert.equal(oldEntry.status, 303);
    assert.equal(oldEntry.headers.get('location'), '/');
    assert.equal((await fetch(base + '/api/publish', { method: 'POST' })).status, 405);
    assert.equal((await fetch(base + '/private-client/index.html')).status, 404);
    assert.equal((await fetch(base + '/api/gateway?path=/.env')).status, 400);
  } finally {
    await new Promise((resolve) => publicServer.close(resolve));
  }
});
