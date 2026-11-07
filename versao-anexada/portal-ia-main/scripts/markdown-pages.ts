import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createServer, type Plugin, type ViteDevServer } from "vite";
import { catalog } from "./catalog.ts";

type MachineReadable = {
  markdownPaths(): Promise<string[]>;
  markdownFor(pathname: string): Promise<string | null>;
};

const MODULE = "/src/lib/machine-readable.ts";

// The Markdown of the pages (src/lib/machine-readable.ts) uses the site's aliases and import.meta.glob, so a Vite server loads it, the same way for dev and for the build.
async function load(server: ViteDevServer): Promise<MachineReadable> {
  return (await server.ssrLoadModule(MODULE)) as MachineReadable;
}

export function markdownPages(): Plugin {
  let root = "";
  let alias: Record<string, string> = {};
  let building = false;
  return {
    name: "pitang-markdown-pages",
    configResolved(config) {
      root = config.root;
      alias = { "@": path.join(config.root, "src") };
      building = config.command === "build";
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url ?? "").split("?")[0] ?? "";
        if (!pathname.endsWith(".md") || pathname.startsWith("/src/")) return next();
        load(server)
          .then((pages) => pages.markdownFor(decodeURIComponent(pathname)))
          .then((text) => {
            if (text === null) return next();
            res.setHeader("Content-Type", "text/markdown; charset=utf-8");
            res.end(text);
          })
          .catch(next);
      });
    },
    async closeBundle() {
      // Vitest and the dev server also close the bundle; only a build writes the files.
      if (!building || this.environment.name !== "client") return;
      const outDir = path.resolve(root, this.environment.config.build.outDir);
      const server = await createServer({
        configFile: false,
        root,
        logLevel: "silent",
        appType: "custom",
        resolve: { alias },
        plugins: [catalog()],
        server: { middlewareMode: true, hmr: false, watch: null },
        optimizeDeps: { noDiscovery: true, include: [] },
      });
      try {
        const pages = await load(server);
        let count = 0;
        for (const pathname of await pages.markdownPaths()) {
          const text = await pages.markdownFor(pathname);
          if (text === null) throw new Error(`The page ${pathname} is listed but has no Markdown.`);
          const file = path.join(outDir, pathname);
          mkdirSync(path.dirname(file), { recursive: true });
          writeFileSync(file, text);
          count += 1;
        }
        console.warn(`Wrote the Markdown of ${count} pages in ${outDir}.`);
      } finally {
        await server.close();
      }
    },
  };
}
