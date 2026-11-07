import { expect, test as setup } from "@playwright/test";
import { SESSION_FILE } from "./session";

setup("signs in with the test account", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Entrar com a Microsoft" }).click();
  await expect(page.locator("main h1").first()).toBeVisible();
  await page.context().storageState({ path: SESSION_FILE });
});
