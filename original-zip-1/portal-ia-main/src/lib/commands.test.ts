import { describe, expect, it } from "vitest";
import { plugins, skills } from "@/data/catalog";
import { CATALOG_COMMIT, MARKETPLACE_CHANNEL, MARKETPLACE_NAME, MARKETPLACE_URL, REPO_WEB_URL } from "@/data/catalog-index";
import { managedSettings, managedSettingsWithAllowlist, marketplaceAdd, pluginFolderUrl, removeFolders, skillFolderUrl, teamSettings, unzipCommand } from "./commands";

describe("the install commands", () => {
  it("add the marketplace by its full clone URL, on the channel of the build", () => {
    expect(MARKETPLACE_URL).toMatch(/^https:\/\/[^/@]+\/.+\.git$/);
    expect(MARKETPLACE_CHANNEL).toBeTruthy();
    expect(marketplaceAdd).toBe(`/plugin marketplace add ${MARKETPLACE_URL}#${MARKETPLACE_CHANNEL}`);
  });

  it("put the channel as the ref in the settings of the team and of the Owner, and turn auto-update on only for the Owner", () => {
    type Settings = {
      extraKnownMarketplaces: Record<string, { source: { source: string; url: string; ref: string }; autoUpdate?: boolean }>;
      enabledPlugins?: Record<string, boolean>;
    };
    for (const text of [teamSettings("pr-review"), managedSettings()]) {
      const settings = JSON.parse(text) as Settings;
      expect(settings.extraKnownMarketplaces[MARKETPLACE_NAME]?.source).toEqual({ source: "git", url: MARKETPLACE_URL, ref: MARKETPLACE_CHANNEL });
    }
    expect((JSON.parse(managedSettings()) as Settings).extraKnownMarketplaces[MARKETPLACE_NAME]?.autoUpdate).toBe(true);
    expect(teamSettings("pr-review")).not.toContain("autoUpdate");
    expect((JSON.parse(teamSettings(["pr-review", "requirements"])) as Settings).enabledPlugins).toEqual({
      [`pr-review@${MARKETPLACE_NAME}`]: true,
      [`requirements@${MARKETPLACE_NAME}`]: true,
    });
  });

  it("keep enabledPlugins out of the managed settings, which register the marketplace, turn the suggestions on and carry the trust message", () => {
    const settings = JSON.parse(managedSettings()) as Record<string, unknown>;
    expect(Object.keys(settings)).toEqual(["extraKnownMarketplaces", "pluginSuggestionMarketplaces", "pluginTrustMessage"]);
    expect(settings.pluginSuggestionMarketplaces).toEqual([MARKETPLACE_NAME]);
    expect(settings.pluginTrustMessage).toMatch(/validador.*revisão do MR.*issue.*skills/);
  });

  it("show the document of the README: the marketplace, the suggestions, the trust message and the optional allowlist, in that order", () => {
    const settings = JSON.parse(managedSettingsWithAllowlist()) as {
      extraKnownMarketplaces: Record<string, { source: Record<string, string>; autoUpdate?: boolean }>;
      pluginSuggestionMarketplaces: string[];
      pluginTrustMessage: string;
      strictKnownMarketplaces: { source: string; hostPattern?: string; repo?: string }[];
      disableSideloadFlags: boolean;
    };
    expect(Object.keys(settings)).toEqual(["extraKnownMarketplaces", "pluginSuggestionMarketplaces", "pluginTrustMessage", "strictKnownMarketplaces", "disableSideloadFlags"]);
    expect(Object.keys(settings.extraKnownMarketplaces)).toEqual([MARKETPLACE_NAME, "claude-plugins-official"]);
    expect(settings.extraKnownMarketplaces[MARKETPLACE_NAME]).toEqual({ source: { source: "git", url: MARKETPLACE_URL, ref: MARKETPLACE_CHANNEL }, autoUpdate: true });
    expect(settings.extraKnownMarketplaces["claude-plugins-official"]).toEqual({ source: { source: "github", repo: "anthropics/claude-plugins-official" } });
    expect(settings.pluginSuggestionMarketplaces).toEqual([MARKETPLACE_NAME]);
    expect(settings.pluginTrustMessage).toBe((JSON.parse(managedSettings()) as { pluginTrustMessage: string }).pluginTrustMessage);
    expect(settings.disableSideloadFlags).toBe(true);
    expect(settings).not.toHaveProperty("enabledPlugins");
  });

  it("make the optional allowlist with the host of the marketplace, the official marketplace and skills-dir, and no other host", () => {
    const list = JSON.parse(managedSettingsWithAllowlist()) as { strictKnownMarketplaces: { source: string; hostPattern?: string; repo?: string }[] };
    expect(list.strictKnownMarketplaces.map((entry) => entry.source)).toEqual(["hostPattern", "github", "skills-dir"]);
    expect(list.strictKnownMarketplaces[1]?.repo).toBe("anthropics/claude-plugins-official");
    const pattern = new RegExp(list.strictKnownMarketplaces[0]?.hostPattern ?? "");
    const host = new URL(MARKETPLACE_URL).hostname;
    expect(pattern.test(host)).toBe(true);
    for (const other of [host.replace(".", "-"), `${host}.evil.test`, `x${host}`, `${host}x`]) expect(pattern.test(other), other).toBe(false);
  });

  it("keep the base managed settings without any part of the optional block", () => {
    const base = managedSettings();
    for (const key of ["strictKnownMarketplaces", "disableSideloadFlags", "claude-plugins-official"]) expect(base).not.toContain(key);
  });

  it("point the code links at the commit the catalog was built from", () => {
    const plugin = plugins[0];
    const skill = skills[0];
    if (!plugin || !skill) throw new Error("empty catalog");
    expect(pluginFolderUrl(plugin)).toBe(`${REPO_WEB_URL}/-/tree/${CATALOG_COMMIT}/${plugin.path}`);
    expect(skillFolderUrl(skill)).toBe(`${REPO_WEB_URL}/-/tree/${CATALOG_COMMIT}/${skill.path}`);
  });

  it("unzip into the folder Claude Code reads and remove only the folders named", () => {
    expect(unzipCommand("pr-review-1.0.0.zip")).toBe("unzip ~/Downloads/pr-review-1.0.0.zip -d ~/.claude/skills/");
    expect(removeFolders(["pg-a", "pg-b"])).toBe("rm -r ~/.claude/skills/pg-a ~/.claude/skills/pg-b");
  });
});
