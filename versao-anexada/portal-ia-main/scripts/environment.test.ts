import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(import.meta.dirname, "..");
const read = (file: string) => readFileSync(path.join(ROOT, file), "utf8");

// The two modules that read the environment: the BFF when it starts, and the build.
const READERS = ["bff/config.ts", "scripts/build-config.ts"];
const GITLAB_BLOCK = "Só no GitLab";
const BLOCKS = ["BFF em produção", "Build", "Só na máquina", GITLAB_BLOCK];

// What the platform provides and the code may read, and where. Vite's own import.meta.env.DEV and BASE_URL are allowed everywhere.
const PLATFORM_READS: Record<string, string[]> = { "playwright.config.ts": ["CI"] };
const VITE_READS = new Set(["DEV", "BASE_URL"]);
// The deploy variables that the pipeline itself produces (the build-image job writes the digest), so nobody sets them.
const PIPELINE_VARIABLES = ["IMAGE"];

type Listed = { name: string; block: string; described: boolean };

function listed(): Listed[] {
  const out: Listed[] = [];
  let block = "";
  let previous = "";
  for (const line of read(".env.example").split("\n")) {
    const heading = /^# ─+ (.+?) ─+$/.exec(line);
    if (heading) block = heading[1] ?? "";
    const variable = /^([A-Z][A-Z0-9_]*)=/.exec(line);
    if (variable) out.push({ name: variable[1] ?? "", block, described: previous.startsWith("#") });
    previous = line;
  }
  return out;
}

function readBy(file: string): string[] {
  const text = read(file);
  const names = [
    ...text.matchAll(/\b(?:required|numberFrom|optional|branchFrom)\(\s*env,\s*"([A-Z][A-Z0-9_]*)"/g),
    ...text.matchAll(/\benv\.([A-Z][A-Z0-9_]*)\b/g),
    ...text.matchAll(/\benv\["([A-Z][A-Z0-9_]*)"\]/g),
  ].map((m) => m[1] ?? "");
  const list = /BUILD_VARIABLES\s*=\s*\[([^\]]*)\]/.exec(text)?.[1] ?? "";
  return [...names, ...[...list.matchAll(/"([A-Z][A-Z0-9_]*)"/g)].map((m) => m[1] ?? "")];
}

function sourceFiles(dir: string): string[] {
  return readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((entry) => {
    const relative = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) return ["node_modules", "content", ".auth"].includes(entry.name) ? [] : sourceFiles(relative);
    return /\.(ts|tsx|mjs)$/.test(entry.name) && !entry.name.endsWith(".test.ts") && !entry.name.endsWith(".d.ts") ? [relative] : [];
  });
}

const example = listed();
const names = example.map((v) => v.name);
const reads = new Set(READERS.flatMap(readBy));

describe(".env.example, the list of the environment variables", () => {
  it("has the four blocks, in order, and describes every variable right above its line", () => {
    expect([...new Set(example.map((v) => v.block))]).toEqual(BLOCKS);
    expect(example.filter((v) => !v.described).map((v) => v.name)).toEqual([]);
    expect(names.filter((name, i) => names.indexOf(name) !== i)).toEqual([]);
  });

  it("lists every variable that the two readers read", () => {
    expect([...reads].filter((name) => !names.includes(name)).sort()).toEqual([]);
  });

  it("lists nothing the readers do not read, outside the block of the GitLab", () => {
    expect(example.filter((v) => v.block !== GITLAB_BLOCK && !reads.has(v.name)).map((v) => v.name)).toEqual([]);
    expect(example.filter((v) => v.block === GITLAB_BLOCK && reads.has(v.name)).map((v) => v.name)).toEqual([]);
  });

  it("keeps in the block of the GitLab only what the pipeline or the deploy use", () => {
    const used = ["deploy/service.yaml", "deploy/render-service.sh", ".gitlab-ci.yml"].map(read).join("\n");
    expect(example.filter((v) => v.block === GITLAB_BLOCK && !new RegExp(`\\b${v.name}\\b`).test(used)).map((v) => v.name)).toEqual([]);
  });

  it("lists every variable that the deploy asks for", () => {
    const service = [...read("deploy/service.yaml").matchAll(/\$\{([A-Z][A-Z0-9_]*)\}/g)].map((m) => m[1] ?? "");
    const script = /for name in ([^;]*?); do/s.exec(read("deploy/render-service.sh"))?.[1]?.replaceAll("\\", " ").split(/\s+/).filter(Boolean) ?? [];
    const rules = /\.publish:[\s\S]*?rules:([\s\S]*?)\n\n/.exec(read(".gitlab-ci.yml"))?.[1] ?? "";
    const publish = [...rules.matchAll(/\$([A-Z][A-Z0-9_]*)/g)].map((m) => m[1] ?? "").filter((name) => !name.startsWith("CI_"));
    const asked = [...new Set([...service, ...script, ...publish])];
    expect(script.length).toBeGreaterThan(0);
    expect(publish.length).toBeGreaterThan(0);
    expect(asked.filter((name) => !names.includes(name) && !PIPELINE_VARIABLES.includes(name)).sort()).toEqual([]);
  });
});

describe("who reads the environment", () => {
  it("reads in the Dockerfile only variables that .env.example lists", () => {
    const inline = [...read("Dockerfile").matchAll(/\bprocess\.env\.([A-Za-z_]\w*)/g)].map((m) => m[1] ?? "");
    expect(inline.length).toBeGreaterThan(0);
    expect(inline.filter((name) => !names.includes(name))).toEqual([]);
  });

  it("is only the two readers, apart from what Vite and the platform provide", () => {
    const files = [...["bff", "src", "scripts", "e2e"].flatMap(sourceFiles), ...readdirSync(ROOT).filter((f) => /\.config\.(ts|mjs)$/.test(f))].filter((f) => !READERS.includes(f));
    const found: string[] = [];
    for (const file of files) {
      const text = read(file);
      for (const m of text.matchAll(/\bprocess\.env(?:\.([A-Za-z_]\w*)|\["([^"]+)"\])?/g)) {
        const name = m[1] ?? m[2];
        if (!name || !(PLATFORM_READS[file] ?? []).includes(name)) found.push(`${file}: ${m[0]}`);
      }
      for (const m of text.matchAll(/\bimport\.meta\.env(?:\.([A-Za-z_]\w*))?/g)) {
        if (!m[1] || !VITE_READS.has(m[1])) found.push(`${file}: ${m[0]}`);
      }
      if (/\bloadEnv\s*\(/.test(text)) found.push(`${file}: loadEnv`);
    }
    expect(found).toEqual([]);
  });
});
