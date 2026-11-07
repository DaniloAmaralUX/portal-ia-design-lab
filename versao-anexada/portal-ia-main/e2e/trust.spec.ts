import { expect, test, type Page } from "@playwright/test";
import { loadRelease } from "../scripts/skills-source";
import { LIFECYCLES } from "../src/data/lifecycle";

const release = loadRelease();
const plugin = release.plugins.find((p) => p.name === "pr-review");
const skill = release.skills.find((s) => s.slug === "pg-revisar-seguranca");
const manual = release.skills.find((s) => s.manual);
if (!plugin || !skill || !manual) throw new Error("The catalog has no pr-review, no pg-revisar-seguranca or no manual skill.");

const brDate = (iso: string) => iso.split("-").reverse().join("/");
const sheet = (page: Page) => page.getByRole("complementary").first();

test.describe("a skill page answers the questions of whoever decides to install", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/plugins/${skill.plugin}/${skill.slug}`);
    await expect(page.locator("main h1")).toHaveText(skill.title);
  });

  test("what it does and what it runs", async ({ page }) => {
    await expect(page.getByText(skill.output.split("`")[0] ?? skill.output, { exact: false }).first()).toBeVisible();
    await expect(page.locator("#efeitos")).toContainText("Só lê e responde");
    await expect(page.locator("#efeitos").getByRole("link", { name: "SKILL.md" })).toHaveAttribute("href", "#skill-md");
    await expect(sheet(page)).toContainText("Só lê e responde");
  });

  test("who keeps it, who made it and in which state", async ({ page }) => {
    await expect(sheet(page)).toContainText(`Mantida por${plugin.owner}`);
    const state = LIFECYCLES[plugin.lifecycle];
    await expect(sheet(page)).toContainText(state.label);
    await expect(sheet(page)).toContainText(state.means);
    const byline = page.locator("main section").first();
    await expect(byline).toContainText(`Criada por ${skill.creator}`);
    await expect(byline).not.toContainText("Criada por Pitang");
    for (const name of skill.contributors.filter((n) => n !== skill.creator)) await expect(byline).toContainText(name);
    if (!skill.contributors.some((n) => n !== skill.creator)) await expect(byline).not.toContainText("contribuições");
  });

  test("how recent: the version of the plugin and the date of the last change", async ({ page }) => {
    await expect(sheet(page)).toContainText(`Versão${plugin.version}`);
    await expect(sheet(page)).toContainText(`Atualizada em${brDate(skill.updatedAt)}`);
  });

  test("how many characters it takes in the skill list, and that a manual skill takes none", async ({ page }) => {
    await expect(sheet(page)).toContainText(`${(skill.listChars ?? 0).toLocaleString("pt-BR")} caracteres`);
    await page.goto(`/plugins/${manual.plugin}/${manual.slug}`);
    await expect(sheet(page)).toContainText("Não ocupa a lista");
  });
});

test("the byline names the contributors that the skills repository credits", async ({ page }) => {
  const credited = release.skills.find((s) => s.contributors.some((n) => n !== s.creator));
  test.skip(!credited, "no skill of the catalog credits a contributor");
  if (!credited) return;
  await page.goto(`/plugins/${credited.plugin}/${credited.slug}`);
  const byline = page.locator("main section").first();
  await expect(byline).toContainText(`Criada por ${credited.creator}, com contribuições de`);
  for (const name of credited.contributors) await expect(byline).toContainText(name);
});

test("a plugin page shows the same signals for the plugin", async ({ page }) => {
  await page.goto(`/plugins/${plugin.name}`);
  await expect(page.locator("main h1")).toHaveText(plugin.displayName);
  await expect(sheet(page)).toContainText(`Versão${plugin.version}`);
  await expect(sheet(page)).toContainText(`Atualizado em${brDate(plugin.updatedAt)}`);
  await expect(sheet(page)).toContainText(`Mantido por${plugin.owner}`);
  await expect(sheet(page)).toContainText(LIFECYCLES[plugin.lifecycle].label);
  await expect(sheet(page)).toContainText(`${plugin.listChars.toLocaleString("pt-BR")} caracteres`);
  await expect(page.locator("main section").first()).not.toContainText("Criado por");
});
