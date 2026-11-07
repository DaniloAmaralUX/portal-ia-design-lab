import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// The scripts of deploy/ run under sh, which a Windows shell outside Git Bash does not have: there the tests skip, and the CI runs them.
const hasSh = spawnSync("sh", ["-c", "exit 0"]).status === 0;
const shIt = hasSh || process.env.CI ? it : it.skip;

const SCRIPT = path.resolve(import.meta.dirname, "../deploy/clone-skills.sh");
const PUBLIC_URL = "https://gitlab.example.test/pitang-agentic/skills.git";
// Each test runs git clone and checkout for real, so the 5 s of the default depends on how busy the machine or the runner is.
const TIMEOUT = 30_000;

let folder = "";
let remote = "";
let work = "";

const git = (cwd: string, ...args: string[]) =>
  execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@example.invalid", "-c", "commit.gpgsign=false", ...args], { cwd, encoding: "utf8" }).trim();

function commit(message: string) {
  writeFileSync(path.join(work, "file.txt"), message);
  git(work, "add", "file.txt");
  git(work, "commit", "-q", "-m", message);
  git(work, "push", "-q", "origin", "HEAD:refs/heads/stable");
  return git(work, "rev-parse", "HEAD");
}

// One job of the pipeline: the script as GitLab runs it, with the clone URL pointed at the temporary remote.
function job(name: string, env: Record<string, string> = {}, envFile?: string) {
  const dir = path.join(folder, name);
  const result = spawnSync("sh", [SCRIPT, ...(envFile ? [path.join(folder, envFile)] : [])], {
    env: {
      PATH: process.env.PATH ?? "",
      HOME: folder,
      GIT_CONFIG_GLOBAL: "/dev/null",
      GIT_CONFIG_COUNT: "1",
      GIT_CONFIG_KEY_0: `url.file://${remote}/.insteadOf`,
      GIT_CONFIG_VALUE_0: "https://gitlab-ci-token:job-token@gitlab.example.test/",
      CI_SERVER_PROTOCOL: "https",
      CI_SERVER_FQDN: "gitlab.example.test",
      CI_JOB_TOKEN: "job-token",
      SKILLS_PROJECT_PATH: "pitang-agentic/skills",
      SKILLS_REF: "stable",
      SKILLS_DIR: dir,
      SKILLS_REPO_URL: PUBLIC_URL,
      ...env,
    },
    encoding: "utf8",
  });
  return { dir, status: result.status, err: result.stderr, out: result.stdout, head: existsSync(dir) ? git(dir, "rev-parse", "HEAD") : null };
}

beforeAll(() => {
  folder = mkdtempSync(path.join(tmpdir(), "clone-skills-"));
  remote = path.join(folder, "remote");
  mkdirSync(path.join(remote, "pitang-agentic"), { recursive: true });
  git(folder, "init", "-q", "--bare", "--initial-branch=stable", path.join(remote, "pitang-agentic/skills.git"));
  work = path.join(folder, "work");
  mkdirSync(work);
  git(work, "init", "-q", "--initial-branch=stable");
  git(work, "remote", "add", "origin", `file://${remote}/pitang-agentic/skills.git`);
}, TIMEOUT);

afterAll(() => rmSync(folder, { recursive: true, force: true }));

describe("deploy/clone-skills.sh", { timeout: TIMEOUT }, () => {
  shIt("clones the channel, takes the token out of the origin and records the commit for the next jobs", () => {
    const first = commit("first");
    const verify = job("verify", {}, "skills.env");
    expect(verify.status).toBe(0);
    expect(verify.head).toBe(first);
    expect(git(verify.dir, "remote", "get-url", "origin")).toBe(PUBLIC_URL);
    expect(readFileSync(path.join(folder, "skills.env"), "utf8")).toBe(`SKILLS_SHA=${first}\n`);
  });

  shIt("puts the next jobs on the commit of the first one, even when the channel moved in between", () => {
    const first = readFileSync(path.join(folder, "skills.env"), "utf8").trim().replace("SKILLS_SHA=", "");
    const second = commit("second");
    expect(second).not.toBe(first);

    const unpinned = job("unpinned");
    expect(unpinned.head).toBe(second);

    for (const name of ["browser", "build-image"]) {
      const pinned = job(name, { SKILLS_SHA: first });
      expect(pinned.status, pinned.err).toBe(0);
      expect(pinned.head).toBe(first);
      // The build resolves SKILLS_REF in the clone and needs it to be HEAD, so the local branch moves with the commit.
      expect(git(pinned.dir, "rev-parse", "stable")).toBe(first);
      expect(git(pinned.dir, "remote", "get-url", "origin")).toBe(PUBLIC_URL);
    }
  });

  shIt("clones only the channel, so the validator of the skills does not compare the release with a main ahead of it", () => {
    git(work, "push", "-q", "origin", "HEAD:refs/heads/main");
    writeFileSync(path.join(work, "file.txt"), "ahead");
    git(work, "commit", "-q", "-am", "ahead");
    git(work, "push", "-q", "origin", "HEAD:refs/heads/main");
    git(work, "reset", "-q", "--hard", "HEAD~1");
    const only = job("only-channel");
    expect(only.status, only.err).toBe(0);
    // The branches, without the origin/HEAD that git 2.39, the one of the CI image, adds to a single-branch clone and 2.50 does not.
    const branches = git(only.dir, "for-each-ref", "--format=%(refname)|%(symref)", "refs/remotes")
      .split("\n")
      .filter((line) => line.endsWith("|"))
      .map((line) => line.slice(0, -1));
    expect(branches).toEqual(["refs/remotes/origin/stable"]);
    expect(spawnSync("git", ["-C", only.dir, "rev-parse", "--verify", "--quiet", "origin/main"]).status).not.toBe(0);
  });

  shIt("fails when the commit of the first job is not in the clone, or is not a full commit", () => {
    const missing = job("missing", { SKILLS_SHA: "0".repeat(40) });
    expect(missing.status).toBe(1);
    expect(missing.err).toContain("is not in the clone");
    const short = job("short", { SKILLS_SHA: "abc1234" });
    expect(short.status).toBe(1);
    expect(short.err).toContain("40-character");
  });
});
