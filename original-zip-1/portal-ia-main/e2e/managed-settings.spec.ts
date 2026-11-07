import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { buildConfig } from "../scripts/build-config";
import { skillsDir } from "../scripts/skills-source";

// The README of the skills repository and the page of the portal show the same managed settings for the Owner: this reads the first
// JSON after the heading of the README and compares it with the one on the page, key by key and in the same order. The address and
// the channel of the marketplace come from the build, so the README's are replaced by them before the comparison.
function readmeDocument(): unknown {
  const readme = readFileSync(path.join(skillsDir(), "README.md"), "utf8").replace(/\r\n/g, "\n");
  const section = readme.slice(readme.indexOf("### Para a organização inteira: a managed settings"));
  const json = /```json\n([\s\S]*?)\n```/.exec(section)?.[1];
  if (!json) throw new Error("The README of the skills repository has no managed settings JSON.");
  const document = JSON.parse(json) as { extraKnownMarketplaces: Record<string, { source: Record<string, string> }> };
  const marketplace = Object.values(document.extraKnownMarketplaces)[0];
  if (marketplace) Object.assign(marketplace.source, { url: buildConfig().repoUrl, ref: buildConfig().channel });
  return document;
}

test("the managed settings on the page are the ones of the README of the skills repository", async ({ page }) => {
  await page.goto("/primeiros-passos");
  const block = page.locator("#administrar pre").first();
  await expect(block).toBeVisible();
  const shown = JSON.parse((await block.innerText()).trim()) as unknown;
  expect(JSON.stringify(shown, null, 2)).toBe(JSON.stringify(readmeDocument(), null, 2));
});

test("the page carries the warnings of the optional block and of what the admin settings do not reach", async ({ page }) => {
  await page.goto("/primeiros-passos");
  const admin = page.locator("#administrar");
  for (const text of [
    "As três linhas do bloco opcional",
    "admite qualquer repositório",
    "Sem a linha skills-dir",
    "o --mcp-config de quem não usa plugin nenhum",
    "Quem usa Bedrock, Vertex ou um ANTHROPIC_BASE_URL próprio.",
    "não liga o autoUpdate",
  ]) {
    await expect(admin).toContainText(text);
  }
});
