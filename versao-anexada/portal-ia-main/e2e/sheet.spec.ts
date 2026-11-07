import { expect, test } from "@playwright/test";

// What left the sheet: the line on the format check and the links to GitLab, to an issue, to the Markdown and to the changelog.
const REMOVED = /Formato verificado|Fora da release|Pasta no GitLab|Abrir issue|Página em Markdown|Novidades do catálogo/;

test("the sheet of a skill keeps every row", async ({ page }) => {
  await page.goto("/plugins/pr-review/pg-revisar-seguranca");
  const sheet = page.locator("aside").first();
  for (const label of ["Plugin", "Área", "Modo", "Versão", "Atualizada em", "Mantida por", "Estado", "Na lista de skills", "No projeto", "Arquivos"]) {
    await expect(sheet).toContainText(label);
  }
});

for (const route of ["/plugins/pr-review/pg-revisar-seguranca", "/plugins/pr-review"]) {
  test(`${route}: the sheet has no format line and no links`, async ({ page }) => {
    await page.goto(route);
    const sheet = page.locator("aside").first();
    await expect(sheet.getByRole("heading", { name: "Ficha técnica" })).toBeVisible();
    await expect(sheet.getByText(REMOVED)).toHaveCount(0);
  });
}

test("the values of the sheet wrap evenly, and on a phone they go under their labels", async ({ page }) => {
  const style = (el: Element) => [
    getComputedStyle(el).getPropertyValue("text-wrap-style"),
    getComputedStyle(el).textAlign,
    getComputedStyle(el.parentElement as Element).flexDirection,
  ];
  await page.goto("/plugins/pr-review");
  expect(await page.locator("dd").first().evaluate(style)).toEqual(["pretty", "right", "row"]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/plugins/pr-review");
  expect(await page.locator("dd").first().evaluate(style)).toEqual(["pretty", "start", "column"]);
});

