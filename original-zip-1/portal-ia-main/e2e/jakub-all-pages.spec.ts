import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { routes } from "./routes";

const pages = [...new Set([...routes(), "/publicar", "/publicar/treinamento", "/publicar/intervalo-tecnico", "/explorar?q=nenhum-resultado", "/essa-rota-nao-existe"])];

for (const [theme, width] of [["light", 1440], ["dark", 320]] as const) {
  test.describe(`${theme} at ${width}px`, () => {
    test.use({ colorScheme: theme, reducedMotion: "reduce", viewport: { width, height: 950 } });
    for (const route of pages) {
      test(route, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(route);
        await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), theme === "dark");
        await expect(page.locator("main h1").first()).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(errors).toEqual([]);
        const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
        expect(result.violations.map((issue) => ({ id: issue.id, targets: issue.nodes.map((node) => node.target) }))).toEqual([]);
      });
    }
  });
}
