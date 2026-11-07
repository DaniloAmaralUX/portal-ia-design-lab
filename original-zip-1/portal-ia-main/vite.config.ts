import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { academy } from './scripts/academy-index.ts';
import { catalog } from './scripts/catalog.ts';
import { downloads } from './scripts/downloads.ts';
import { guideImages } from './scripts/guide-images.ts';
import { guideIndex } from './scripts/guide-index.ts';
import { indexHtml } from './scripts/index-html.ts';
import { intervals } from './scripts/intervals.ts';
import { trainings } from './scripts/trainings.ts';
import { loginPreview } from './scripts/login-preview.ts';
import { markdownPages } from './scripts/markdown-pages.ts';

const SITE_VERSION = (
  JSON.parse(readFileSync(path.resolve(import.meta.dirname, 'package.json'), 'utf8')) as { version: string }
).version;

export default defineConfig({
  define: { __SITE_VERSION__: JSON.stringify(SITE_VERSION) },
  plugins: [
    // No code splitting: the code of the site is one file, and only the text comes on demand (stack-react.md).
    tanstackRouter({ target: 'react' }),
    react(),
    tailwindcss(),
    downloads(),
    academy(),
    catalog(),
    guideImages(),
    guideIndex(),
    intervals(),
    trainings(),
    markdownPages(),
    indexHtml(),
    loginPreview(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  // The BFF, the Dockerfile and the tests read the build from dist/client. The code of the site, in one file, passes the 500 kB at
  // which Vite warns; the warning stays for a file that grows past this.
  build: { outDir: 'dist/client', chunkSizeWarningLimit: 1400 },
  server: { port: 5190, strictPort: true },
});
