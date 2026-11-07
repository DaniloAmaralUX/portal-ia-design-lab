import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";

// The scripts of deploy/ run under sh, which a Windows shell outside Git Bash does not have: there the tests skip, and the CI runs them.
const hasSh = spawnSync("sh", ["-c", "exit 0"]).status === 0;
const shIt = hasSh || process.env.CI ? it : it.skip;

const SCRIPT = path.resolve(import.meta.dirname, "../deploy/write-build-env.sh");
const folder = mkdtempSync(path.join(tmpdir(), "build-env-"));
const URL = "https://gitlab.example.test/group/skills.git";

afterAll(() => rmSync(folder, { recursive: true, force: true }));

function run(env: Record<string, string>, name: string) {
  const target = path.join(folder, name);
  const result = spawnSync("sh", [SCRIPT, target], { env: { PATH: process.env.PATH ?? "", ...env }, encoding: "utf8" });
  return { status: result.status, err: result.stderr, written: existsSync(target) ? readFileSync(target, "utf8") : null };
}

describe("deploy/write-build-env.sh", () => {
  shIt("writes the three variables after checking them", () => {
    expect(run({ SKILLS_REPO_URL: URL, SKILLS_CHANNEL: "stable" }, "a")).toMatchObject({ status: 0, written: `SKILLS_REPO_URL=${URL}\nSKILLS_CHANNEL=stable\nSHAREPOINT_ORIGIN=\n` });
    expect(run({ SKILLS_REPO_URL: URL, SHAREPOINT_ORIGIN: "https://empresa.sharepoint.com" }, "c")).toMatchObject({
      status: 0,
      written: expect.stringContaining("SHAREPOINT_ORIGIN=https://empresa.sharepoint.com\n") as string,
    });
    expect(run({ SKILLS_REPO_URL: "https://gitlab.example.test:8443/group/sub-group/skills.git" }, "b")).toMatchObject({ status: 0, written: expect.stringContaining("SKILLS_CHANNEL=\n") as string });
  });

  shIt.each([
    ["a line break in the URL", { SKILLS_REPO_URL: `${URL}\nSKILLS_CHANNEL=evil` }, "line break"],
    ["a line break in the channel", { SKILLS_REPO_URL: URL, SKILLS_CHANNEL: "stable\nNODE_OPTIONS=--inspect" }, "line break"],
    ["a carriage return", { SKILLS_REPO_URL: `${URL}\r`, SKILLS_CHANNEL: "" }, "line break"],
    ["no URL", { SKILLS_CHANNEL: "stable" }, "SKILLS_REPO_URL"],
    ["http", { SKILLS_REPO_URL: "http://gitlab.example.test/group/skills.git" }, "SKILLS_REPO_URL"],
    ["a credential", { SKILLS_REPO_URL: "https://gitlab-ci-token:secret@gitlab.example.test/group/skills.git" }, "SKILLS_REPO_URL"],
    ["a query", { SKILLS_REPO_URL: `${URL}?x=1` }, "SKILLS_REPO_URL"],
    ["a space", { SKILLS_REPO_URL: "https://gitlab.example.test/group/my skills.git" }, "SKILLS_REPO_URL"],
    ["a shell metacharacter", { SKILLS_REPO_URL: "https://gitlab.example.test/group/$(id).git" }, "SKILLS_REPO_URL"],
    ["a channel with a space", { SKILLS_REPO_URL: URL, SKILLS_CHANNEL: "my channel" }, "SKILLS_CHANNEL"],
    ["a channel that starts with a dash", { SKILLS_REPO_URL: URL, SKILLS_CHANNEL: "-flag" }, "SKILLS_CHANNEL"],
    ["a line break in the SharePoint origin", { SKILLS_REPO_URL: URL, SHAREPOINT_ORIGIN: "https://empresa.sharepoint.com\nNODE_OPTIONS=--inspect" }, "line break"],
    ["a SharePoint origin over http", { SKILLS_REPO_URL: URL, SHAREPOINT_ORIGIN: "http://empresa.sharepoint.com" }, "SHAREPOINT_ORIGIN"],
    ["another host in place of SharePoint", { SKILLS_REPO_URL: URL, SHAREPOINT_ORIGIN: "https://empresa.sharepoint.com.evil.com" }, "SHAREPOINT_ORIGIN"],
    ["a SharePoint origin with a path", { SKILLS_REPO_URL: URL, SHAREPOINT_ORIGIN: "https://empresa.sharepoint.com/sites/time" }, "SHAREPOINT_ORIGIN"],
  ])("refuses %s and writes nothing", (_name, env, message) => {
    const result = run(env, `refused-${_name.replaceAll(" ", "-")}`);
    expect(result.status).toBe(1);
    expect(result.err).toContain(message);
    expect(result.written).toBeNull();
  });
});
