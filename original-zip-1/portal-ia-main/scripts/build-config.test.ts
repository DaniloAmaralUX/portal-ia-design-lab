import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BUILD_VARIABLES, loadBuildEnvironment, readBuildConfig } from "./build-config.ts";

const valid = { SKILLS_REPO_URL: "https://gitlab.example.com/group/skills.git" };

describe("the configuration of the build", () => {
  it("reads the clone URL and falls back to the sibling folder, no ref and the stable channel", () => {
    expect(readBuildConfig(valid)).toEqual({
      skillsDir: path.resolve(import.meta.dirname, "../../skills"),
      skillsRef: "",
      repoUrl: valid.SKILLS_REPO_URL,
      channel: "stable",
      ci: false,
      sharepointOrigin: null,
    });
  });

  it("takes the SharePoint origin of the recordings only as an https origin under sharepoint.com", () => {
    expect(readBuildConfig({ ...valid, SHAREPOINT_ORIGIN: "https://empresa.sharepoint.com" }).sharepointOrigin).toBe("https://empresa.sharepoint.com");
    expect(() => readBuildConfig({ ...valid, SHAREPOINT_ORIGIN: "https://evil.example.com" })).toThrow("SHAREPOINT_ORIGIN");
  });

  it("knows it runs in a CI only when CI is true", () => {
    expect(readBuildConfig({ ...valid, CI: "true" }).ci).toBe(true);
    for (const value of ["", "false", "1", undefined]) expect(readBuildConfig({ ...valid, CI: value }).ci).toBe(false);
  });

  it("reads the optional values", () => {
    expect(readBuildConfig({ ...valid, SKILLS_DIR: "/tmp/clone", SKILLS_REF: "release/1.2", SKILLS_CHANNEL: "next" })).toMatchObject({
      skillsDir: path.resolve("/tmp/clone"),
      skillsRef: "release/1.2",
      channel: "next",
    });
  });

  it.each(["", " ", undefined])("stops without SKILLS_REPO_URL (%j) and names the variable", (value) => {
    expect(() => readBuildConfig({ SKILLS_REPO_URL: value })).toThrow("SKILLS_REPO_URL");
  });

  it.each([
    ["not an URL", "gitlab.example.com/group/skills.git", "absolute URL"],
    ["http", "http://gitlab.example.com/group/skills.git", "https"],
    ["a credential", "https://gitlab-ci-token:secret@gitlab.example.com/group/skills.git", "credential"],
    ["a user", "https://ana@gitlab.example.com/group/skills.git", "credential"],
    ["no .git", "https://gitlab.example.com/group/skills", ".git"],
    ["a query", "https://gitlab.example.com/group/skills.git?ref=1", ".git"],
  ])("refuses SKILLS_REPO_URL with %s", (_name, value, reason) => {
    expect(() => readBuildConfig({ SKILLS_REPO_URL: value })).toThrow(new RegExp(`SKILLS_REPO_URL.*${reason}`));
  });

  it.each([
    ["SKILLS_CHANNEL", "has space"],
    ["SKILLS_CHANNEL", "-flag"],
    ["SKILLS_CHANNEL", "a..b"],
    ["SKILLS_REF", "--upload-pack=x"],
    ["SKILLS_REF", "branch.lock"],
  ])("refuses %s=%s", (name, value) => {
    expect(() => readBuildConfig({ ...valid, [name]: value })).toThrow(name);
  });

  it("takes from the .env only the variables of the build, and lets the environment of the process win", () => {
    const before = process.env.SKILLS_REPO_URL;
    const folder = mkdtempSync(path.join(os.tmpdir(), "build-config-"));
    try {
      writeFileSync(
        path.join(folder, ".env"),
        ["SKILLS_REPO_URL=https://from-file.example.com/skills.git", "SKILLS_CHANNEL=from-file", "SESSION_SECRET=not-a-real-secret-for-the-test", "MICROSOFT_CLIENT_SECRET=another-fake-value"].join("\n"),
      );
      process.env.SKILLS_CHANNEL = "from-process";
      delete process.env.SKILLS_REPO_URL;
      const loaded = loadBuildEnvironment(folder);
      expect(Object.keys(loaded).sort()).toEqual([...BUILD_VARIABLES].sort());
      expect(loaded.SKILLS_REPO_URL).toBe("https://from-file.example.com/skills.git");
      expect(loaded.SKILLS_CHANNEL).toBe("from-process");
      expect(JSON.stringify(loaded)).not.toContain("not-a-real-secret");
    } finally {
      delete process.env.SKILLS_CHANNEL;
      if (before !== undefined) process.env.SKILLS_REPO_URL = before;
      rmSync(folder, { recursive: true, force: true });
    }
  });
});
