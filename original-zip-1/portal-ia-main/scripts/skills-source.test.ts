import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { assertSkillsSource } from "./skills-source.ts";

let dir = "";
let first = "";

const git = (...args: string[]) =>
  execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@example.invalid", "-c", "commit.gpgsign=false", ...args], { cwd: dir, encoding: "utf8" }).trim();

beforeAll(() => {
  dir = mkdtempSync(path.join(tmpdir(), "skills-source-"));
  git("init", "-q", "--initial-branch=stable");
  writeFileSync(path.join(dir, "file.txt"), "one");
  git("add", "file.txt");
  git("commit", "-q", "-m", "one");
  first = git("rev-parse", "HEAD");
  git("branch", "behind");
  writeFileSync(path.join(dir, "file.txt"), "two");
  git("commit", "-q", "-am", "two");
});

afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("the skills checkout the catalog is built from", () => {
  it("takes any checkout when no ref is asked for", () => {
    expect(() => assertSkillsSource({ dir, ref: "", ci: false })).not.toThrow();
  });

  it("takes the ref that is the HEAD", () => {
    expect(() => assertSkillsSource({ dir, ref: "stable", ci: true })).not.toThrow();
  });

  it("refuses a ref that does not exist, instead of using it as a label", () => {
    expect(() => assertSkillsSource({ dir, ref: "no-such-release", ci: false })).toThrow(/no-such-release.*no such ref/s);
  });

  it("refuses a ref that exists but is not the HEAD", () => {
    expect(first).not.toBe(git("rev-parse", "HEAD"));
    expect(() => assertSkillsSource({ dir, ref: "behind", ci: false })).toThrow(/behind.*not the HEAD/s);
    git("tag", "v0", first);
    expect(() => assertSkillsSource({ dir, ref: "v0", ci: false })).toThrow(/v0.*not the HEAD/s);
  });

  it("lets a change that is not committed through on the machine, and refuses it in the CI", () => {
    writeFileSync(path.join(dir, "file.txt"), "changed on the machine");
    expect(() => assertSkillsSource({ dir, ref: "stable", ci: false })).not.toThrow();
    expect(() => assertSkillsSource({ dir, ref: "stable", ci: true })).toThrow(/changes that are not committed/);
    git("checkout", "--", "file.txt");
    writeFileSync(path.join(dir, "new.txt"), "untracked");
    expect(() => assertSkillsSource({ dir, ref: "stable", ci: true })).toThrow(/changes that are not committed/);
    rmSync(path.join(dir, "new.txt"));
    expect(() => assertSkillsSource({ dir, ref: "stable", ci: true })).not.toThrow();
  });
});
