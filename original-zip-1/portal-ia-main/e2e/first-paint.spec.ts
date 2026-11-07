import { expect, test } from "@playwright/test";

// The first paint is the skeleton of index.html, and it stays until the page has something to show: in between, a slow phone would
// show a blank frame, as if the page had broken.
test("between the skeleton of index.html and the page, the screen is never blank", async ({ page }) => {
  await page.addInitScript(() => {
    const state = { skeleton: false, blank: false };
    Object.assign(window, { firstPaint: state });
    const observer = new MutationObserver(() => {
      const root = document.getElementById("root");
      if (!root) return;
      if (document.querySelector("main h1")) return observer.disconnect();
      if (root.querySelector(":scope > [aria-hidden]")) state.skeleton = true;
      else if (state.skeleton && ![...root.querySelectorAll("*")].some((el) => el.getBoundingClientRect().height > 0)) state.blank = true;
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  for (const route of ["/", "/ferramentas", "/metodo/compozy/pipeline", "/plugins/pr-review/pg-revisar-seguranca"]) {
    await page.goto(route);
    await expect(page.locator("main h1").first()).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { firstPaint: { skeleton: boolean; blank: boolean } }).firstPaint), route).toEqual({ skeleton: true, blank: false });
  }
});
