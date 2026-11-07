import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { Release } from "../src/data/types.ts";
import { buildConfig } from "./build-config.ts";

const SITE = path.resolve(import.meta.dirname, "..");
const CACHE = path.join(SITE, "node_modules/.cache/pitang-release.json");

export function skillsDir(): string {
  const dir = buildConfig().skillsDir;
  if (!existsSync(path.join(dir, "scripts/catalogo.mjs"))) {
    throw new Error(`The skills repository is not at ${dir}: it has no scripts/catalogo.mjs. Set SKILLS_DIR to a clone of it.`);
  }
  return dir;
}

// The generator lives in the skills repository and reads it with the same reader its validator uses; the portal only runs it.
type Generator = { separarSkill(text: string): { frontmatter: string; corpo: string } };

export async function generator(): Promise<Generator> {
  return (await import(pathToFileURL(path.join(skillsDir(), "scripts/catalogo.mjs")).href)) as Generator;
}

function git(dir: string, ...args: string[]): string {
  return execFileSync("git", ["--no-optional-locks", "-C", dir, ...args], { encoding: "utf8" }).trim();
}

// The catalog says which release it shows, so the checkout has to be what the ref names: a ref that does not resolve is a typo, and a
// ref that is not the HEAD would label other content as the release. A change that is not committed is allowed on the machine, so
// whoever writes a skill sees the result, and refused in a CI, where the catalog is the one of a commit.
export function assertSkillsSource({ dir, ref, ci }: { dir: string; ref: string; ci: boolean }): void {
  if (ref) {
    let resolved: string;
    try {
      resolved = execFileSync("git", ["--no-optional-locks", "-C", dir, "rev-parse", "--verify", "--quiet", `${ref}^{commit}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    } catch {
      throw new Error(`SKILLS_REF is ${ref}, and the skills repository at ${dir} has no such ref. Fetch it, or fix SKILLS_REF.`);
    }
    const head = git(dir, "rev-parse", "HEAD");
    if (resolved !== head) {
      throw new Error(`SKILLS_REF is ${ref} (${resolved.slice(0, 12)}), but the skills checkout at ${dir} is at ${head.slice(0, 12)}, not the HEAD of that ref. Check out ${ref}, so the catalog shows what it names.`);
    }
  }
  if (ci && git(dir, "status", "--porcelain")) {
    throw new Error(`The skills checkout at ${dir} has changes that are not committed, and a CI builds the catalog of a commit only.`);
  }
}

let memo: Release | undefined;

// The same checkout, ref and changes give the same catalog, so a build, the tests and the browser tests share one run of the generator.
export function loadRelease(): Release {
  if (memo) return memo;
  const dir = skillsDir();
  const { skillsRef: ref, ci } = buildConfig();
  assertSkillsSource({ dir, ref, ci });
  const changes = createHash("sha1").update(git(dir, "status", "--porcelain")).update(git(dir, "diff", "HEAD")).digest("hex");
  const key = JSON.stringify([dir, ref, git(dir, "rev-parse", "HEAD"), changes]);
  try {
    const cached = JSON.parse(readFileSync(CACHE, "utf8")) as { key: string; release: Release };
    if (cached.key === key) return (memo = cached.release);
  } catch {
    // no cache yet, or an unreadable one: run the generator
  }
  const args = [path.join(dir, "scripts/catalogo.mjs"), dir, ...(ref ? ["--ref", ref] : [])];
  let output: string;
  try {
    output = execFileSync(process.execPath, args, { encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "pipe"] });
  } catch (error) {
    throw new Error(`The skills repository did not become a catalog:\n${(error as { stderr?: string }).stderr ?? String(error)}`, { cause: error });
  }
  memo = JSON.parse(output) as Release;
  mkdirSync(path.dirname(CACHE), { recursive: true });
  writeFileSync(CACHE, JSON.stringify({ key, release: memo }));
  return memo;
}

export function readSkillsFile(relative: string): Buffer {
  return readFileSync(path.join(skillsDir(), relative));
}
