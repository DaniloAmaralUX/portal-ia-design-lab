import { CATALOG_COMMIT, MARKETPLACE_CHANNEL, MARKETPLACE_NAME, MARKETPLACE_URL, REPO_WEB_URL } from "@/data/catalog-index";
import type { Plugin, Skill } from "@/data/types";

const MARKETPLACE_SOURCE = `${MARKETPLACE_URL}#${MARKETPLACE_CHANNEL}`;

export const marketplaceAdd = `/plugin marketplace add ${MARKETPLACE_SOURCE}`;
export const cliMarketplaceAdd = `claude plugin marketplace add ${MARKETPLACE_SOURCE}`;

export function pluginInstall(plugin: string): string {
  return `/plugin install ${plugin}@${MARKETPLACE_NAME}`;
}

export function cliPluginInstall(plugin: string): string {
  return `claude plugin install ${plugin}@${MARKETPLACE_NAME}`;
}

export const marketplaceUpdate = `/plugin marketplace update ${MARKETPLACE_NAME}`;
export const cliMarketplaceUpdate = `claude plugin marketplace update ${MARKETPLACE_NAME}`;

export const pluginManage = "/plugin manage";

export function cliPluginUpdate(plugin: string): string {
  return `claude plugin update ${plugin}@${MARKETPLACE_NAME}`;
}

export function pluginUninstall(plugin: string): string {
  return `/plugin uninstall ${plugin}@${MARKETPLACE_NAME}`;
}

export function cliPluginUninstall(plugin: string): string {
  return `claude plugin uninstall ${plugin}@${MARKETPLACE_NAME}`;
}

export const cliMarketplaceRemove = `claude plugin marketplace remove ${MARKETPLACE_NAME}`;

const marketplaceSource = { source: "git", url: MARKETPLACE_URL, ref: MARKETPLACE_CHANNEL };

const enabledPluginsOf = (plugins: string | string[]) =>
  Object.fromEntries((typeof plugins === "string" ? [plugins] : plugins).map((p) => [`${p}@${MARKETPLACE_NAME}`, true]));

export function teamSettings(plugins: string | string[]): string {
  return JSON.stringify({ extraKnownMarketplaces: { [MARKETPLACE_NAME]: { source: marketplaceSource } }, enabledPlugins: enabledPluginsOf(plugins) }, null, 2);
}

// The Owner pastes this in the Claude admin. It registers the marketplace and turns the suggestions on, and nothing more: a managed
// enabledPlugins forces the plugin on and nobody can turn it off, so it waits for plugins in the supported state. autoUpdate keeps
// the marketplace and its plugins refreshing in the background, and pluginSuggestionMarketplaces is what lets the relevance blocks
// of the plugins do something, since a suggestion installs nothing. The README of the skills repository shows the same JSON, key by
// key and in the same order, and e2e/managed-settings.spec.ts compares the two.
const TRUST_MESSAGE = "Os plugins do marketplace da Pitang passam pelo validador e pela revisão do MR. Em caso de dúvida, abra uma issue no repositório skills.";
const OFFICIAL_MARKETPLACE = { source: "github", repo: "anthropics/claude-plugins-official" };

// The optional block of the README, the allowlist: the official marketplace registered too, since the allowlist registers nothing, the
// allowlist itself, and the end of the sideload flags. The three go together or not at all.
function managedDocument(withAllowlist: boolean) {
  const host = new URL(MARKETPLACE_URL).hostname.replaceAll(".", "\\.");
  return {
    extraKnownMarketplaces: {
      [MARKETPLACE_NAME]: { source: marketplaceSource, autoUpdate: true },
      ...(withAllowlist && { "claude-plugins-official": { source: OFFICIAL_MARKETPLACE } }),
    },
    pluginSuggestionMarketplaces: [MARKETPLACE_NAME],
    pluginTrustMessage: TRUST_MESSAGE,
    ...(withAllowlist && {
      strictKnownMarketplaces: [{ source: "hostPattern", hostPattern: `^${host}$` }, OFFICIAL_MARKETPLACE, { source: "skills-dir" }],
      disableSideloadFlags: true,
    }),
  };
}

export function managedSettings(): string {
  return JSON.stringify(managedDocument(false), null, 2);
}

// The whole document of the README, with the optional block, a security decision of Pitang. Without skills-dir the plugins kept in
// ~/.claude/skills stop loading, and disableSideloadFlags shuts the --plugin-dir path of the .zip.
export function managedSettingsWithAllowlist(): string {
  return JSON.stringify(managedDocument(true), null, 2);
}

export function unzipCommand(zipName: string): string {
  return `unzip ~/Downloads/${zipName} -d ~/.claude/skills/`;
}

export function removeFolders(folders: string[]): string {
  return `rm -r ${folders.map((folder) => `~/.claude/skills/${folder}`).join(" ")}`;
}

export function invokeFromPlugin(skill: Skill): string {
  return `/${skill.plugin}:${skill.slug}`;
}

export function invokeStandalone(skill: Skill): string {
  return `/${skill.slug}`;
}

export function pluginFolderUrl(plugin: Plugin): string {
  return `${REPO_WEB_URL}/-/tree/${CATALOG_COMMIT}/${plugin.path}`;
}

export function skillFolderUrl(skill: Skill): string {
  return `${REPO_WEB_URL}/-/tree/${CATALOG_COMMIT}/${skill.path}`;
}

export function skillFileUrl(skill: Skill, file: string): string {
  return `${REPO_WEB_URL}/-/blob/${CATALOG_COMMIT}/${skill.path}/${file}`;
}
