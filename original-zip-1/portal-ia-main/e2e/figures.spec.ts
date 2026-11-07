import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The pages of the guides that draw a figure of the site: the cycle and the radar of the catalyst, and the flow of OpenSpec.
const WITH_FIGURES = [
  "/ferramentas/catalyst-toolkit/o-que-faz",
  "/ferramentas/catalyst-toolkit/doctor",
  "/metodo/open-spec/fluxo",
];
const RADAR = /^Radar de um projeto de exemplo/;

test("the radar of the guide of the catalyst switches between before and after the init", async ({ page }) => {
  await page.goto("/ferramentas/catalyst-toolkit/doctor");
  const radar = page.getByRole("img", { name: RADAR });
  await expect(radar).toHaveAccessibleName(/Depois do init: R1 em N2, R2 em N1/);
  const before = page.getByRole("button", { name: "Antes do init" });
  await before.click();
  await expect(before).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Depois do init" })).toHaveAttribute("aria-pressed", "false");
  await expect(radar).toHaveAccessibleName(/Antes do init: R1 em N1, R2 em N1/);
});

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme, reducedMotion: "reduce" });

    test("the figures of the guide of the catalyst pass axe", async ({ page }) => {
      test.slow();
      const violations: string[] = [];
      for (const route of WITH_FIGURES) {
        await page.goto(route);
        await expect(page.locator("[data-guide-text] figure").first()).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        const result = await new AxeBuilder({ page })
          .include("[data-guide-text] figure")
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        violations.push(...result.violations.map((v) => `${route} ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`));
      }
      expect(violations).toEqual([]);
    });
  });
}

test.describe("320 px", () => {
  test.use({ viewport: { width: 320, height: 720 } });

  test("the pages of the guide of the catalyst do not scroll sideways with their figures", async ({ page }) => {
    for (const route of WITH_FIGURES) {
      await page.goto(route);
      await expect(page.locator("[data-guide-text] figure").first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBeLessThanOrEqual(320);
    }
  });
});

test("the radar fits its slide whole, with its switch and its key", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/ferramentas/catalyst-toolkit/doctor?modo=apresentacao&slide=7");
  const slide = page.locator('section[aria-roledescription="slide"]');
  await expect(slide.getByRole("img", { name: RADAR })).toBeVisible();
  await expect(slide.getByRole("button", { name: "Depois do init" })).toBeVisible();
  const fits = await slide.evaluate((section) => {
    const content = section.querySelector("[data-slide-content]");
    const stage = section.parentElement;
    return Boolean(content && stage && content.getBoundingClientRect().bottom <= stage.getBoundingClientRect().bottom + 0.5);
  });
  expect(fits).toBe(true);
});

test("the flow of a change in OpenSpec walks the steps, with the diagram, the terminal and the files", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/metodo/open-spec/fluxo");
  const flow = page.getByRole("figure", { name: /^Fluxo de uma change no OpenSpec/ });
  await expect(flow.getByText("passo 1 de 7", { exact: true })).toBeVisible();
  await flow.getByRole("button", { name: "Próximo" }).click();
  await expect(flow.getByText("passo 2 de 7", { exact: true })).toBeVisible();
  await expect(flow.getByRole("button", { name: /^Passo 2 de 7: \/opsx:explore$/ })).toHaveAttribute("aria-current", "step");
  await flow.getByRole("button", { name: /^Passo 3 de 7: \/opsx:propose$/ }).click();
  await expect(flow.getByText("passo 3 de 7", { exact: true })).toBeVisible();
  await expect(flow.getByRole("figure", { name: /Terminal do passo 3: \/opsx:propose exportar-relatorio-csv/ })).toBeVisible();
  await expect(flow.getByRole("list", { name: "Arquivos do passo 3" }).getByText("design.md")).toBeVisible();
  await flow.getByRole("button", { name: "Passo 7: /opsx:archive" }).click();
  await expect(flow.getByRole("button", { name: "Próximo" })).toBeDisabled();
});
