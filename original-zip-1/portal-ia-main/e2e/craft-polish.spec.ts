import { expect, test, type Page } from "@playwright/test";

async function typed(page: Page) {
  return page.locator("[data-terminal-screen]").evaluate((screen) => {
    const clone = screen.cloneNode(true) as HTMLElement;
    clone.querySelectorAll(".invisible").forEach((node) => node.remove());
    return clone.textContent?.length ?? 0;
  });
}

test("explicit pause survives pointer and focus leaving the terminal", async ({ page }) => {
  await page.goto("/");
  const start = await typed(page);
  await expect.poll(() => typed(page)).toBeGreaterThan(start);
  await page.getByRole("button", { name: "Pausar demonstração" }).click();
  await page.getByRole("textbox", { name: "O que você precisa fazer?" }).focus();
  await page.mouse.move(0, 0);
  const paused = await typed(page);
  await page.waitForTimeout(1800);
  expect(await typed(page)).toBe(paused);
  await page.getByRole("button", { name: "Retomar demonstração" }).click();
  await page.getByRole("textbox", { name: "O que você precisa fazer?" }).focus();
  await page.mouse.move(0, 0);
  await expect.poll(() => typed(page)).toBeGreaterThan(paused);
});

test("changing motion preference immediately stops autoplay without reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Pausar demonstração" })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: "Pausar demonstração" })).toHaveCount(0);
  const whole = await typed(page);
  expect(whole).toBeGreaterThan(200);
  await page.waitForTimeout(1600);
  expect(await typed(page)).toBe(whole);
  expect(await page.locator("[data-terminal-screen]").evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(page.locator("main")).not.toContainText("undefined skills");
});

test("frequent search opens instantly and restores focus on Escape", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Buscar no site" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("keyboard activation has no press movement and card reading stays still", async ({ page }) => {
  await page.goto("/");
  const theme = page.getByRole("button", { name: "Usar tema escuro" });
  await theme.focus();
  await page.keyboard.down("Space");
  expect(await theme.evaluate((el) => getComputedStyle(el).scale)).toBe("none");
  await page.keyboard.up("Space");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Peça em português.O Claude faz do jeito Pitang.");
  const cards = page.locator(".reveal-children > *");
  expect(await cards.evaluateAll((nodes) => nodes.every((el) => getComputedStyle(el).animationName === "none"))).toBe(true);
});
