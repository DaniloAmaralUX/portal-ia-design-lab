import { expect, test } from "@playwright/test";

// The chapter text comes in its own chunks. On a slow network it arrives after the router has tried to scroll to the anchor, so the page used to stay at the top of the chapter.
const CHAPTER_CHUNKS = /\/assets\/(estudo-de-caso|_virtual_guide-text)-[\w-]+\.js$/;

test("an address with an anchor lands on its title when the chapter comes slowly", async ({ page }) => {
  await page.route(CHAPTER_CHUNKS, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });
  await page.goto("/metodo/estudo-de-caso#gates");
  const title = page.getByRole("heading", { name: /Os 3 gates revisáveis/ });
  await expect(title).toBeVisible();
  // Whole on screen is the proof: the page that stays at the top of the chapter leaves this title far below. The exact gap to the header
  // is not: it varies by a few pixels with the machine, and on the CI runner the title stopped 2 px under the header.
  await expect(title).toBeInViewport({ ratio: 1 });
});
