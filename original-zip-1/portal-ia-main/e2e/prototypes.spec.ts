import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const variant of ["craft", "chanhdai", "nove"]) {
  for (const width of [1440, 390]) {
    test(`${variant} stays usable at ${width}px`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`/prototipos/${variant}`);
      await expect(page.locator(".portal-prototype h1")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.getByRole("button", { name: "Abrir busca", exact: true }).click();
      const search = page.getByRole("dialog").getByRole("textbox", { name: "Buscar no portal" });
      await expect(search).toBeVisible();
      await search.fill("revisão de código");
      await search.press("Enter");
      await expect(page).toHaveURL(/\/explorar\?q=/);
      await expect(page.getByRole("searchbox").first()).toHaveValue("revisão de código");
      expect(errors).toEqual([]);
    });
  }
  test(`${variant} has accessible contrast and control names`, async ({ page }) => {
    await page.goto(`/prototipos/${variant}`);
    await expect(page.locator(".portal-prototype h1")).toBeVisible();
    const result = await new AxeBuilder({ page }).include(".portal-prototype").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(result.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
  });
}

test("Nove comparison selection can be added and cleared with the keyboard", async ({ page }) => {
  await page.goto("/prototipos/nove#compare");
  const add = page.getByRole("button", { name: "Adicionar", exact: true }).first();
  await add.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status").filter({ hasText: "1 seção selecionada" })).toBeVisible();
  await page.getByRole("button", { name: "Limpar seleção" }).click();
  await expect(page.getByRole("button", { name: "Adicionar", exact: true })).toHaveCount(3);
});
