import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.use({ reducedMotion: "reduce" });

for (const width of [320, 390, 1024, 1440]) {
  test(`Chanh Dai keeps the complete portal usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const routes = ["/", "/academy", "/academy/trilhas/produto", "/metodo", "/metodo/compozy/rules", "/ferramentas/catalyst-toolkit", "/ferramentas/catalyst-toolkit/instalar", "/explorar", "/manifesto", "/academy/treinamentos/claude-cowork/2"];
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("main h1").first()).toBeVisible();
      await expect(page.locator("[data-error-page]")).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (width >= 1024 && route.endsWith("/catalyst-toolkit/instalar")) await expect(page.getByRole("link", { name: "2 Instalar", exact: true }).first()).toBeVisible();
      if (["/", "/academy", "/metodo/compozy/rules"].includes(route)) {
        const scan = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        expect(scan.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
      }
      if (["/", "/metodo/compozy/rules"].includes(route)) await page.screenshot({ path: `node_modules/.cache/final-chanh-${width}-${route.replaceAll("/", "_")}.png` });
    }
  });
}

test("search, palette, theme and installation remain functional", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "O que você precisa fazer?" }).fill("requisitos");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await expect(page).toHaveURL(/explorar\?q=requisitos/);
  await page.goBack();
  await page.getByRole("button", { name: "Buscar no site" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Usar tema escuro" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const scan = await new AxeBuilder({ page }).include("main").analyze();
  expect(scan.violations.map(item => item.id)).toEqual([]);
  await expect(page.locator('section[aria-labelledby="como-title"]').getByRole("button", { name: /^Copiar o comando/ }).first()).toBeVisible();
});

test("handoff links to this isolated branch beside the theme switch", async ({ page }) => {
  await page.goto("/");
  const handoff = page.getByRole("link", { name: "Código desta versão no GitHub (abre em outra aba)" });
  await expect(handoff).toHaveAttribute("href", "https://github.com/DaniloAmaralUX/portal-ia-design-lab/tree/handoff/portal-original-ui-audit/original-zip-1/portal-ia-main");
  await expect(handoff).toHaveAttribute("target", "_blank");
  expect(await handoff.evaluate((link) => link.previousElementSibling?.getAttribute("aria-label"))).toMatch(/^Usar tema/);
  for (const width of [320, 360, 390, 768, 896, 1024, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await expect(handoff).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
