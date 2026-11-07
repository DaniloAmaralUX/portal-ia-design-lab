import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC = path.resolve(import.meta.dirname, "../src");
const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

type Source = { file: string; name: string; ext: string; text: string };

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "content" ? [] : walk(full);
    return [full];
  });
}

const sources: Source[] = walk(SRC)
  .filter((file) => /\.tsx?$/.test(file) && !file.endsWith(".d.ts") && !file.endsWith("routeTree.gen.ts"))
  .map((file) => {
    const ext = path.extname(file);
    return { file: path.relative(SRC, file).split(path.sep).join("/"), name: path.basename(file, ext), ext, text: readFileSync(file, "utf8") };
  });

const inUi = (s: Source) => s.file.startsWith("components/ui/");
const inRoutes = (s: Source) => s.file.startsWith("routes/");
const entries = new Set(["main.tsx", "router.tsx"]);
const components = (s: Source) => [...s.text.matchAll(/^export (?:async )?(?:function|const) ([A-Z]\w*)/gm)].map((m) => m[1]);

describe("src/ structure", () => {
  it("has an index.ts, the public API, in every feature", () => {
    const features = readdirSync(path.join(SRC, "features"), { withFileTypes: true }).filter((e) => e.isDirectory());
    expect(features.length).toBeGreaterThan(0);
    for (const feature of features) expect(existsSync(path.join(SRC, "features", feature.name, "index.ts")), feature.name).toBe(true);
  });

  it("names a .tsx file after its component in PascalCase, and a .tsx with no component in kebab-case", () => {
    for (const s of sources.filter((x) => x.ext === ".tsx" && !inUi(x) && !inRoutes(x) && !entries.has(x.file))) {
      const [first] = components(s);
      if (first) expect(s.name, s.file).toBe(first);
      else expect(s.name, s.file).toMatch(KEBAB);
    }
  });

  it("names every .ts file in kebab-case", () => {
    for (const s of sources.filter((x) => x.ext === ".ts" && !inRoutes(x))) expect(s.name.replace(/\.test$/, ""), s.file).toMatch(KEBAB);
  });

  it("exports one component per file, outside the ui primitives", () => {
    for (const s of sources.filter((x) => x.ext === ".tsx" && !inUi(x) && !inRoutes(x))) expect(components(s).length, `${s.file}: ${components(s).join(", ")}`).toBeLessThanOrEqual(1);
  });

  it("names every list the browser stores with a version, so a change of shape bumps the key instead of reusing it", () => {
    const keys = sources.flatMap((s) => [...s.text.matchAll(/createStoredSet\(\s*"([^"]+)"/g)].map((m) => `${s.file}: ${m[1] ?? ""}`));
    expect(keys.length).toBeGreaterThan(0);
    expect(keys.filter((key) => !/:[a-z-]+:v\d+$/.test(key))).toEqual([]);
  });

  it("keeps nothing but the route in a route file", () => {
    for (const s of sources.filter((x) => inRoutes(x) && x.ext === ".tsx")) {
      const declared = [...s.text.matchAll(/^(?:function|class|type|interface) (\w+)|^(?:export )?(?:const|let) (\w+)/gm)].map((m) => m[1] ?? m[2]);
      expect(declared.filter((n) => n !== "Route"), s.file).toEqual([]);
    }
  });
});
