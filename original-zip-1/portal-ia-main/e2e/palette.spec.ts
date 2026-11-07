import { expect, test, type Page } from "@playwright/test";

async function search(page: Page, text: string) {
  await page.goto("/");
  await expect(page.locator("main h1").first()).toBeVisible();
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox").fill(text);
}

test("the palette lists the Manifesto among the pages before anything is typed", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main h1").first()).toBeVisible();
  await page.keyboard.press("Control+k");
  const pages = page.getByRole("group", { name: "Páginas" });
  await expect(pages.getByRole("option", { name: /Manifesto/ })).toBeVisible();
  await pages.getByRole("option", { name: /Manifesto/ }).click();
  await expect(page).toHaveURL(/\/manifesto$/);
});

test.describe("the palette opens each kind of result", () => {
  test("a skill", async ({ page }) => {
    await search(page, "pg-revisar-seguranca");
    await page.getByRole("option", { name: /Revisar a segurança de um PR/ }).first().click();
    await expect(page).toHaveURL(/\/plugins\/pr-review\/pg-revisar-seguranca$/);
  });

  test("a plugin", async ({ page }) => {
    await search(page, "documentação técnica");
    await page.getByRole("option", { name: /Documentação técnica/ }).first().click();
    await expect(page).toHaveURL(/\/plugins\/technical-documentation$/);
  });

  test("a page, with and without a parameter", async ({ page }) => {
    await search(page, "glossário");
    await page.getByRole("option", { name: /Glossário/ }).first().click();
    await expect(page).toHaveURL(/\/academy\/glossario$/);
    await search(page, "roteiro de qualidade");
    await page.getByRole("option", { name: /Roteiro de Qualidade/ }).first().click();
    await expect(page).toHaveURL(/\/metodo\/roteiros\/qualidade$/);
  });

  test("a chapter of a guide", async ({ page }) => {
    await search(page, "pipeline do compozy");
    await page.getByRole("group", { name: "Guias" }).getByRole("option").first().click();
    await expect(page).toHaveURL(/\/metodo\/compozy\/pipeline/);
  });

  test("a course and a lesson of the trainings", async ({ page }) => {
    await search(page, "claude cowork");
    await page.getByRole("group", { name: "Treinamentos" }).getByRole("option").first().click();
    await expect(page).toHaveURL(/\/academy\/treinamentos\/claude-cowork$/);
    await search(page, "claude cowork aula 2");
    await page.getByRole("group", { name: "Treinamentos" }).getByRole("option", { name: /Aula 2/ }).click();
    await expect(page).toHaveURL(/\/academy\/treinamentos\/claude-cowork\/2$/);
  });

  test("a technical break", async ({ page }) => {
    await search(page, "comparativo de ferramentas de sdd");
    await page.getByRole("group", { name: "Intervalos técnicos" }).getByRole("option").first().click();
    await expect(page).toHaveURL(/\/academy\/intervalos\/comparativo-de-ferramentas-de-sdd$/);
  });

  test("a section of the manifesto", async ({ page }) => {
    await search(page, "pé de IA pitangueira manifesto");
    await page.getByRole("group", { name: "Guias" }).getByRole("option").first().click();
    await expect(page).toHaveURL(/\/manifesto/);
  });
});

test("a long list of results fades at the bottom while more is below, and the footer says how many", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox").fill("revisar");
  const list = page.getByRole("listbox", { name: "Resultados da busca" });
  await expect(list).toHaveAttribute("data-more", "true");
  await expect(page.getByRole("dialog").locator("span[aria-hidden]", { hasText: /^\d+\s+resultados$/ })).toBeVisible();
  await list.evaluate((el) => el.scrollTo({ top: el.scrollHeight, behavior: "instant" }));
  await expect(list).toHaveAttribute("data-more", "false");
});


test("with nothing typed, the palette lists the pages opened last and the searches that led somewhere", async ({ page }) => {
  await page.goto("/plugins/pr-review/pg-revisar-seguranca");
  await expect(page.locator("main h1").first()).toBeVisible();
  await page.goto("/metodo/compozy/pipeline");
  await expect(page.locator("main h1").first()).toBeVisible();
  await search(page, "glossário");
  await page.getByRole("option", { name: /Glossário/ }).first().click();
  await expect(page).toHaveURL(/\/academy\/glossario$/);

  await page.keyboard.press("Control+k");
  const recent = page.getByRole("group", { name: "Abertas recentemente" });
  await expect(recent.getByRole("option")).toHaveCount(2);
  await expect(recent.getByRole("option").first()).toContainText(/pipeline/i);
  await expect(recent.getByRole("option").nth(1)).toContainText("Revisar a segurança de um PR");

  await page.getByRole("group", { name: "Buscas recentes" }).getByRole("option", { name: "glossário" }).click();
  await expect(page.getByRole("combobox")).toHaveValue("glossário");
});
