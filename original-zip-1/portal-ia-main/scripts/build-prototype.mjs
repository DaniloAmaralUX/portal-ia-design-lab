import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stdout } from 'node:process';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(site, '.prototype-vercel');
await mkdir(path.join(target, 'api'), { recursive: true });
await mkdir(path.join(target, 'public'), { recursive: true });
await cp(path.join(site, 'dist/client'), path.join(target, 'private-client'), { recursive: true });
// Helpers live outside api so Vercel cannot turn them into extra public functions.
await cp(path.join(site, 'src/prototype-host/login-page.mjs'), path.join(target, 'login-page.mjs'));
await writeFile(path.join(target, 'api/gateway.mjs'), (await readFile(path.join(site, 'src/prototype-host/gateway.mjs'), 'utf8')).replace("'./login-page.mjs'", "'../login-page.mjs'"));
await writeFile(path.join(target, 'package.json'), JSON.stringify({ name: 'portal-ia-prototype', private: true, type: 'module', engines: { node: '24.x' } }, null, 2));
await writeFile(path.join(target, 'public/robots.txt'), 'User-agent: *\nDisallow: /\n');
await writeFile(path.join(target, '.vercelignore'), '.vercel\n.env*\n.git\n');
await writeFile(path.join(target, 'vercel.json'), JSON.stringify({ framework: null, buildCommand: '', installCommand: '', outputDirectory: 'public', functions: { 'api/gateway.mjs': { includeFiles: 'private-client/**' } }, rewrites: [{ source: '/(.*)', destination: '/api/gateway?path=/$1' }] }, null, 2));
stdout.write(`Protected prototype prepared: ${target}\n`);
