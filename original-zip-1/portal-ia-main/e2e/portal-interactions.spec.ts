import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("clipboard fallback restores the trigger and removes its temporary field", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.reject(new Error("Unavailable")) } });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Copiar o comando do marketplace", exact: true }).click();
  await expect(page.getByRole("button", { name: "Copiado", exact: true })).toBeFocused();
  await expect(page.locator("textarea[readonly]")).toHaveCount(0);
});

test("the section menu announces its open state and returns keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 950 });
  await page.goto("/metodo/sdd");
  const trigger = page.locator('button[aria-haspopup="dialog"][aria-expanded]');
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "Fechar", exact: true }).click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});
