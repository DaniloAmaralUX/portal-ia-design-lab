import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { LOGIN_SCREEN } from "./session";

test("the account comes from /api/me, and the page HTML carries no one's data", async ({ page }) => {
  const me = await page.request.get("/api/me");
  expect(await me.json()).toEqual({ name: "Test Person", email: "test.person@pitang.com", canPublish: true });
  const html = await (await page.request.get("/")).text();
  expect(html).not.toContain("test.person@pitang.com");
});

test("the header shows the initials, and the card, named after the person, shows the e-mail", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: "Conta de Test Person" });
  await expect(button).toHaveText("TP");
  await button.click();
  const card = page.getByRole("dialog", { name: "Test Person" });
  await expect(card).toContainText("test.person@pitang.com");
  // The card wraps the e-mail instead of cutting it with an ellipsis, so a long address shows whole.
  const email = card.getByText("test.person@pitang.com");
  expect(await email.evaluate((el) => [getComputedStyle(el).whiteSpace, getComputedStyle(el).textOverflow])).toEqual(["normal", "clip"]);
  const result = await new AxeBuilder({ page }).include("#account-menu").withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
  expect(result.violations.map((v) => v.id)).toEqual([]);
});

test("the Sair button ends the session and goes back to the login screen", async ({ page }) => {
  await page.goto("/academy");
  await page.getByRole("button", { name: "Conta de Test Person" }).click();
  await page.locator("#account-menu").getByRole("button", { name: "Sair" }).click();
  await expect(page.getByRole("heading", LOGIN_SCREEN)).toBeVisible();
  await page.goto("/academy");
  await expect(page.getByRole("heading", LOGIN_SCREEN)).toBeVisible();
});

test("Sair keeps the focus while the server answers", async ({ page }) => {
  await page.route("**/auth/logout", async (route) => {
    await new Promise((done) => setTimeout(done, 1500));
    await route.continue();
  });
  await page.goto("/academy");
  await page.getByRole("button", { name: "Conta de Test Person" }).click();
  const card = page.getByRole("dialog", { name: "Test Person" });
  await card.getByRole("button", { name: "Sair" }).focus();
  await page.keyboard.press("Enter");
  const leaving = card.getByRole("button", { name: "Saindo…" });
  await expect(leaving).toHaveAttribute("aria-disabled", "true");
  await expect(leaving).toBeFocused();
  await expect(page.getByRole("heading", LOGIN_SCREEN)).toBeVisible();
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 320, height: 720 } });

  test("the account sits in the menu drawer, and the header fits in 320 px", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Conta de Test Person" })).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await page.getByRole("button", { name: "Abrir o menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Menu" });
    await expect(drawer.getByText("Test Person")).toBeVisible();
    await expect(drawer.getByRole("button", { name: "Sair" })).toBeVisible();
  });
});
