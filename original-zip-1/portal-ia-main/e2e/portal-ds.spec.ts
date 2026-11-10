import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [1440, 390]) {
  test(`portal DS blocks remain usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    for (const route of ["/", "/academy", "/explorar", "/metodo", "/metodo/sdd"]) {
      await page.goto(route);
      await expect(page.locator("main h1").first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: `node_modules/.cache/portal-final-${width}-${route.replaceAll("/", "_") || "home"}.png` });
      const result = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(result.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
    }
    await page.goto("/academy");
    await page.locator('a[href="/academy/trilhas/produto"]:visible').first().click();
    await expect(page).toHaveURL(/academy\/trilhas\/produto/);
    await page.goto("/metodo");
    await page.getByRole("link", { name: /SDD na prática: do PBI ao código revisado/ }).first().click();
    await expect(page).toHaveURL(/metodo\/sdd/);
  });
}
