import { expect, test, type Locator, type Page } from "@playwright/test";

// The wheel scrolls the page also with the cursor over the sticky columns, the menu of the section on the left and the outline on
// the right: a column scrolls what it has left of its own, and then the page goes on.
async function wheelOver(page: Page, column: Locator) {
  const box = await column.boundingBox();
  if (!box) throw new Error("The column is not on the screen.");
  await page.mouse.move(box.x + box.width / 2, box.y + 100);
  for (let i = 0; i < 30; i++) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(16);
  }
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
}

test.describe("1440 px", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("the wheel over the menu of the section scrolls the page", async ({ page }) => {
    await page.goto("/metodo/compozy/pipeline");
    await wheelOver(page, page.getByRole("navigation", { name: "Método" }));
  });

  test("the wheel over the outline of the guide scrolls the page", async ({ page }) => {
    await page.goto("/ferramentas/catalyst-toolkit/instalar");
    await wheelOver(page, page.getByRole("complementary", { name: "Neste guia" }));
  });
});

test("a list that comes in as it scrolls shows whole what is on the screen when the page opens, and the rest waits", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 2000 });
  await page.goto("/metodo");
  const items = page.locator(".reveal-children > *");
  const top = await items.first().evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  // The first item opens with only its top inside the screen, where the reveal, tied to the scroll, would leave it faint.
  await page.setViewportSize({ width: 1280, height: Math.round(top) + 24 });
  await page.reload();
  await expect(items.first()).toHaveAttribute("data-shown", "");
  expect(await items.first().evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  await expect(items.last()).not.toHaveAttribute("data-shown");
});
