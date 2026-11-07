import { expect, test } from "@playwright/test";
import { buildConfig } from "../scripts/build-config";
import { loadRelease } from "../scripts/skills-source";

const release = loadRelease();
const { repoUrl: URL, channel: CHANNEL } = buildConfig();
const skill = release.skills.find((s) => s.slug === "pg-revisar-seguranca");
const withRequires = release.skills.find((s) => s.requires.length > 0);
if (!skill || !withRequires) throw new Error("The catalog has no pg-revisar-seguranca or no skill with requires.");
const version = release.plugins.find((p) => p.name === skill.plugin)?.version ?? "";
const INSTALL_COMMAND = `Copiar o comando /plugin install ${skill.plugin}@${release.marketplace.name}`;

const OTHER_HOSTS = /Cursor|Copilot|VS Code|Claude\.ai|npx skills|vscode:\/\/|--plugin-url/;

test.describe("the install panel of a skill", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/plugins/${skill.plugin}/${skill.slug}`);
    await expect(page.locator("#instalar")).toBeVisible();
  });

  test("teaches only Claude Code: no other host, no npx skills, no link that opens another editor", async ({ page }) => {
    const panel = page.locator("#instalar");
    await expect(panel).not.toContainText(OTHER_HOSTS);
    await expect(panel.locator('a[href^="vscode:"]')).toHaveCount(0);
    await expect(panel.locator("[data-host]")).toHaveCount(0);
    await expect(panel).toContainText("A sessão na nuvem (Claude Code na web, ou o Desktop em modo Cloud) não atende projeto do GitLab");
  });

  test("Claude Code: the full clone URL with the channel, the install and the call", async ({ page }) => {
    const panel = page.locator("#instalar");
    await expect(panel).toContainText(`/plugin marketplace add ${URL}#${CHANNEL}`);
    await expect(panel).toContainText(`/plugin install ${skill.plugin}@${release.marketplace.name}`);
    await expect(panel).toContainText(`/${skill.plugin}:${skill.slug}`);
  });

  test("Claude Code: the settings of the team point at the channel and leave auto-update off", async ({ page }) => {
    await page.locator("#instalar").getByText("Para o time do projeto").click();
    const settings = page.locator("#instalar pre").first();
    await expect(settings).toContainText(`"ref": "${CHANNEL}"`);
    await expect(settings).toContainText(`"${skill.plugin}@${release.marketplace.name}": true`);
    await expect(settings).not.toContainText("autoUpdate");
  });

  test("Claude Code: the managed settings of the Owner point at the channel, turn auto-update on and enable no plugin", async ({ page }) => {
    const panel = page.locator("#instalar");
    await panel.getByText("Para a organização, na managed settings").click();
    const settings = panel.locator("pre").filter({ hasText: "autoUpdate" });
    await expect(settings).toContainText('"source": "git"');
    await expect(settings).toContainText(`"url": "${URL}"`);
    await expect(settings).toContainText(`"ref": "${CHANNEL}"`);
    await expect(settings).toContainText('"autoUpdate": true');
    await expect(settings).toContainText('"pluginTrustMessage"');
    await expect(settings).not.toContainText("enabledPlugins");
    await expect(panel).toContainText("Owner");
  });

  test("the .zip without the marketplace: the plugin zip with --plugin-dir, and the skill alone", async ({ page, request }) => {
    const panel = page.locator("#instalar");
    await panel.getByText("Pelo .zip, sem o marketplace").click();
    await expect(panel).toContainText(`claude --plugin-dir ~/Downloads/${skill.plugin}-${version}.zip`);
    await panel.locator("summary", { hasText: "Só esta skill" }).click();
    const zip = panel.getByRole("link", { name: /Baixar \.zip/ }).last();
    await expect(zip).toHaveAttribute("href", new RegExp(`downloads/${skill.slug}-${version}\\.zip$`));
    const response = await request.get((await zip.getAttribute("href")) ?? "");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("zip");
  });

  test("copying the install command shows it was copied, and sends nothing to the server", async ({ page }) => {
    const posts: string[] = [];
    page.on("request", (r) => r.method() === "POST" && posts.push(r.url()));
    await page.locator("#instalar").getByRole("button", { name: INSTALL_COMMAND }).click();
    await expect(page.locator("#instalar").getByRole("button", { name: "Copiado" }).first()).toBeVisible();
    expect(posts).toEqual([]);
  });

  test("a copy that fails says so", async ({ page }) => {
    await page.evaluate(() => {
      Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("blocked")) } });
      document.execCommand = () => false;
    });
    await page.locator("#instalar").getByRole("button", { name: INSTALL_COMMAND }).click();
    await expect(page.getByText("Não deu para copiar")).toBeVisible();
  });
});

test("a skill with requires says, in 'Só esta skill', that the .zip brings the skills it depends on", async ({ page }) => {
  await page.goto(`/plugins/${withRequires.plugin}/${withRequires.slug}`);
  const panel = page.locator("#instalar");
  await panel.locator("summary", { hasText: "Só esta skill" }).click();
  await expect(panel).toContainText("O .zip já traz");
  await expect(panel).not.toContainText(OTHER_HOSTS);
});

test("the panel of a plugin teaches only Claude Code too", async ({ page }) => {
  await page.goto("/plugins/pr-review");
  const panel = page.locator("#instalar");
  await expect(panel).toContainText(`/plugin marketplace add ${URL}#${CHANNEL}`);
  await expect(panel).toContainText("/plugin install pr-review@pitang");
  await expect(panel).not.toContainText(OTHER_HOSTS);
  await expect(panel.locator('a[href^="vscode:"]')).toHaveCount(0);
});
