import { expect, test } from "@playwright/test";
import { MAX_CLS, measure } from "./vitals";

// The figures of the guide used to have no size, so each one pushed the text down when it loaded, and an address with an anchor
// ended up away from its title.
test("an address with an anchor lands on its title, and the figures do not shift the page", async ({ page }) => {
  const { cls } = await measure(page, "/metodo/estudo-de-caso#gates");
  const title = page.getByRole("heading", { name: /Os 3 gates revisáveis/ });
  await expect(title).toBeVisible();
  await expect(title).toBeInViewport();
  test.info().annotations.push({ type: "vitals", description: `CLS ${cls.toFixed(4)}` });
  expect(cls).toBeLessThan(MAX_CLS);
});

test("every figure of a guide carries its width and height", async ({ page }) => {
  await page.goto("/metodo/estudo-de-caso");
  await expect(page.locator("main h1").first()).toBeVisible();
  const images = page.locator("article img");
  expect(await images.count()).toBeGreaterThan(0);
  for (const image of await images.all()) {
    await expect(image).toHaveAttribute("width", /^\d+$/);
    await expect(image).toHaveAttribute("height", /^\d+$/);
    await expect(image).toHaveClass(/max-w-full/);
    await expect(image).toHaveClass(/h-auto/);
  }
});
