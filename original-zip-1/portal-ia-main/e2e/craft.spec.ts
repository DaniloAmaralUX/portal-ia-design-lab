import { expect, test } from "@playwright/test";

test("clearing the prompt keeps typing focused, and submitting opens the catalog query", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("textbox", { name: "O que você precisa fazer?" });
  await input.fill("documentação");
  await page.getByRole("button", { name: "Limpar a busca", exact: true }).click();
  await expect(input).toBeEmpty();
  await expect(input).toBeFocused();
  await input.fill("revisar");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/explorar\?q=revisar$/);
});

test("installation rows reveal their real command and collapse on a second press", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Instalar", exact: true }).click();
  const section = page.locator('section[aria-labelledby="como-title"]');
  const step = section.getByRole("button", { name: /Instale o plugin da sua área/ });
  await expect(step).toHaveAttribute("aria-expanded", "false");
  await step.click();
  await expect(step).toHaveAttribute("aria-expanded", "true");
  await expect(section.getByText(/\/plugin install requirements@/, { exact: false }).last()).toBeVisible();
  await step.click();
  await expect(step).toHaveAttribute("aria-expanded", "false");
});

test("the learning widget follows the chosen track and saved course completion", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Desenvolvedor de software", exact: true }).click();
  await page.getByRole("link", { name: "Continuar aprendendo", exact: true }).click();
  await expect(page).toHaveURL(/\/academy\/trilhas\/engenharia$/);
  await page.getByRole("button", { name: /^Marcar como feito:/ }).first().click();
  await page.goto("/");
  const plant = page.getByRole("progressbar", { name: /^Sua jornada com IA:/ });
  await expect(plant).toBeVisible();
  await expect.poll(async () => Number(await plant.getAttribute("aria-valuenow"))).toBeGreaterThan(0);
});

test("the motion components stay within a phone and desktop viewport with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("textbox", { name: "O que você precisa fazer?" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (width === 390) await page.screenshot({ path: "test-results/craft-phone.png" });
  }
  expect(errors).toEqual([]);
});
