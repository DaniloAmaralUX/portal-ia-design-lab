import { expect, test } from "@playwright/test";

test("the trainings list one card for each course, which opens the page of the course with its lessons in order", async ({ page }) => {
  await page.goto("/academy/treinamentos");
  await page.getByRole("link", { name: /Claude Cowork/ }).click();
  await expect(page).toHaveURL(/\/academy\/treinamentos\/claude-cowork$/);
  await expect(page.getByRole("heading", { level: 1, name: "Claude Cowork" })).toBeVisible();
  const lessons = page.getByRole("region", { name: "As aulas" });
  await expect(lessons.getByRole("listitem")).toHaveText([/Aula 1/, /Aula 2/, /Aula 3/]);
  await lessons.getByRole("link", { name: /Aula 2/ }).click();
  await expect(page).toHaveURL(/\/academy\/treinamentos\/claude-cowork\/2$/);
});

test("a lesson says where it sits in its course, marks itself in the sequence and leads to the next one", async ({ page }) => {
  await page.goto("/academy/treinamentos/claude-cowork/2");
  await expect(page.getByRole("heading", { level: 1, name: "Aula 2" })).toBeVisible();
  await expect(page.getByText("Aula 2 de 3")).toBeVisible();
  const lessons = page.getByRole("region", { name: "As aulas de Claude Cowork" });
  await expect(lessons.locator("[aria-current=page]")).toHaveText(/Aula 2/);
  await lessons.getByRole("link", { name: /Próxima aula/ }).click();
  await expect(page).toHaveURL(/\/academy\/treinamentos\/claude-cowork\/3$/);
  await expect(page.getByRole("link", { name: /Próxima aula/ })).toHaveCount(0);
});

for (const address of ["/academy/treinamentos/esse-curso-nao-existe", "/academy/treinamentos/claude-cowork/9", "/academy/treinamentos/claude-cowork/aula"]) {
  test(`${address} opens the error page`, async ({ page }) => {
    await page.goto(address);
    await expect(page.locator("[data-error-page]")).toBeVisible();
  });
}
