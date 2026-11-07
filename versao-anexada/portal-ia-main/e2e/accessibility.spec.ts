import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { REPRESENTATIVE_PAGES } from "./routes";

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme, reducedMotion: "reduce" });

    for (const route of REPRESENTATIVE_PAGES) {
      test(`${route} passes axe`, async ({ page }) => {
        test.slow();
        await page.goto(route);
        await expect(page.locator("main h1").first()).toBeVisible();
        // The title comes from the head of the route, a render after the heading: axe run in between reports a page without title.
        await expect(page).toHaveTitle(/\S/);
        await page.evaluate(() => document.fonts.ready);
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        const violations = result.violations.map(
  (v) =>
    `${v.id} (${v.nodes.length}): ` +
    v.nodes
      .slice(0, 3)
      .map((n) => `${n.target.join(" ")} -> ${n.any[0]?.message}`)
      .join(" | "),
);
        expect(violations).toEqual([]);
      });
    }
  });
}

// A code block, a table or a command wider than its box scrolls, and a screen reader lists it as a region: two of them on the page
// need two names. On a phone, more of them scroll.
for (const [route, width] of [
  ["/ferramentas/catalyst-toolkit/instalar", 1366],
  ["/metodo/compozy/config", 1366],
  ["/", 375],
  ["/primeiros-passos", 375],
  ["/plugins/requirements/pg-spec-create", 375],
  ["/metodo/estudo-de-caso", 375],
] as const) {
  test(`the regions that scroll on ${route} at ${width} px carry names of their own`, async ({ page }) => {
    await page.setViewportSize({ width, height: 860 });
    await page.goto(route);
    await expect(page.locator("main h1").first()).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const result = await new AxeBuilder({ page }).withRules(["landmark-unique"]).analyze();
    expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
  });
}

// A table of a guide whose first column names its rows has a corner with nothing to say: an empty header there is a column with no
// name for a screen reader.
for (const route of ["/metodo/especificacao/o-produto-do-trabalho", "/metodo/historias-de-usuario/o-produto-do-trabalho", "/metodo/historias-de-usuario/as-duas-skills-e-o-ciclo-de-vida-da-historia"]) {
  test(`the tables of ${route} name every header`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main h1").first()).toBeVisible();
    const result = await new AxeBuilder({ page }).withRules(["empty-table-header"]).analyze();
    expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
  });
}
