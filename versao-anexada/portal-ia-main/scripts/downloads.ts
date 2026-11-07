import path from "node:path";
import { zipSync, type Zippable } from "fflate";
import type { Plugin } from "vite";
import { zipName } from "../src/shared/zip-name.ts";
import { loadRelease, readSkillsFile } from "./skills-source.ts";

function addFiles(folder: string, files: string[], prefix: string, destination: Zippable, when: Date) {
  for (const file of files) destination[`${prefix}/${file}`] = [readSkillsFile(path.posix.join(folder, file)), { mtime: when }];
}

export function buildZips(): Map<string, Uint8Array> {
  const release = loadRelease();
  const when = new Date(`${release.commitDate}T12:00:00Z`);
  const pluginByName = new Map(release.plugins.map((p) => [p.name, p]));
  const skillBySlug = new Map(release.skills.map((s) => [s.slug, s]));
  const zips = new Map<string, Uint8Array>();
  for (const plugin of release.plugins) {
    const files: Zippable = {};
    addFiles(plugin.path, plugin.files, plugin.name, files, when);
    zips.set(zipName(plugin.name, plugin.version), zipSync(files, { level: 9 }));
  }
  for (const skill of release.skills) {
    const files: Zippable = {};
    for (const slug of [skill.slug, ...skill.requires]) {
      const own = skillBySlug.get(slug);
      if (!own) throw new Error(`${skill.slug} requires ${slug}, which is not in the catalog`);
      addFiles(own.path, own.files, slug, files, when);
    }
    const version = pluginByName.get(skill.plugin)?.version ?? "";
    zips.set(zipName(skill.slug, version), zipSync(files, { level: 9 }));
  }
  return zips;
}

const VIRTUAL = "virtual:downloads";
const ACERVO = "/acervo/";

// The plugins' own files, as the pages open them: acervo/<plugin>/<path inside the plugin>.
function acervoFiles(): Map<string, string> {
  const release = loadRelease();
  const files = new Map<string, string>();
  for (const plugin of release.plugins) {
    for (const file of plugin.files) files.set(`acervo/${plugin.name}/${file}`, path.posix.join(plugin.path, file));
  }
  return files;
}

// The .zip files and the acervo come from the skills repository: the build writes them in dist/client, and the dev server serves them, so no copy goes to git.
export function downloads(): Plugin {
  let zipCache: Map<string, Uint8Array> | null = null;
  const zips = () => (zipCache ??= buildZips());
  return {
    name: "pitang-downloads",
    resolveId(id) {
      return id === VIRTUAL ? `\0${VIRTUAL}` : undefined;
    },
    load(id) {
      if (id !== `\0${VIRTUAL}`) return undefined;
      const sizes = Object.fromEntries([...zips()].map(([name, zip]) => [name, zip.byteLength]));
      return `export default ${JSON.stringify(sizes)};`;
    },
    configureServer(server) {
      server.middlewares.use("/downloads/", (req, res) => {
        const name = decodeURIComponent((req.url ?? "").split("?")[0].replace(/^\//, ""));
        const zip = zips().get(name);
        if (!zip) {
          res.statusCode = 404;
          return res.end();
        }
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename="${name}"`);
        res.end(Buffer.from(zip));
      });
      server.middlewares.use(ACERVO, (req, res) => {
        const name = `acervo/${decodeURIComponent((req.url ?? "").split("?")[0].replace(/^\//, ""))}`;
        const source = acervoFiles().get(name);
        if (!source) {
          res.statusCode = 404;
          return res.end();
        }
        res.end(readSkillsFile(source));
      });
    },
    generateBundle() {
      if (this.environment.name !== "client") return;
      for (const [name, zip] of zips()) this.emitFile({ type: "asset", fileName: `downloads/${name}`, source: zip });
      for (const [name, source] of acervoFiles()) this.emitFile({ type: "asset", fileName: name, source: readSkillsFile(source) });
    },
  };
}
