import { expect, test } from "@playwright/test";

test("the internal design library has no public gallery route", async ({ page }) => {
  await page.goto("/design-system");
  await expect(page.locator('[data-error-page="not-found"]')).toBeVisible();
  await expect(page.locator(".ds-catalog, #library-file")).toHaveCount(0);
  await expect(page.locator('a[href="/design-system"]')).toHaveCount(0);
});

test("mobile controls preserve native focus and closing behavior", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 950 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Abrir o menu", exact: true });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Menu", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Fechar", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  const theme = page.getByRole("button", { name: "Usar tema escuro", exact: true });
  await theme.focus();
  await page.keyboard.press("Space");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("button", { name: "Usar tema claro", exact: true })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("pausing during the terminal reset keeps the completed conversation visible", async ({ page }) => {
  test.setTimeout(60_000);
  await page.clock.install();
  await page.goto("/");
  const screen = page.locator("[data-terminal-screen]");
  await expect(screen).toBeVisible();
  let clearing = false;
  for (let step = 0; step < 500 && !clearing; step++) {
    await page.clock.runFor(100);
    clearing = await screen.evaluate((el) => el.classList.contains("opacity-0"));
  }
  expect(clearing).toBe(true);
  await page.getByRole("button", { name: "Pausar demonstração", exact: true }).click();
  await page.getByRole("textbox", { name: "O que você precisa fazer?", exact: true }).focus();
  await page.mouse.move(0, 0);
  await page.clock.runFor(600);
  await expect(screen).not.toHaveClass(/opacity-0/);
  expect(await screen.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  await expect(page.getByRole("button", { name: "Retomar demonstração", exact: true })).not.toHaveAttribute("aria-pressed");
});
