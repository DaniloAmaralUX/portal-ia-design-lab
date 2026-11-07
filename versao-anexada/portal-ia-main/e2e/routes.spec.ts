import { expect, test } from "@playwright/test";
import { REPRESENTATIVE_PAGES, routes } from "./routes";

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme });

    for (const route of routes()) {
      test(`${route} opens without errors`, async ({ page }) => {
        const errors: string[] = [];
        page.on("console", (m) => {
          if (m.type() === "error") errors.push(m.text());
        });
        page.on("pageerror", (e) => errors.push(e.message));
        await page.goto(route);
        await expect(page.locator("main h1").first()).toBeVisible();
        await expect(page.locator("[data-error-page]")).toHaveCount(0);
        expect(errors).toEqual([]);
      });
    }
  });
}

test.describe("320 px", () => {
  test.use({ viewport: { width: 320, height: 720 } });

  for (const route of REPRESENTATIVE_PAGES) {
    test(`${route} does not scroll sideways`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("main h1").first()).toBeVisible();
      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(width).toBeLessThanOrEqual(320);
    });
  }
});

test("an address that does not exist answers 200, and the router draws the not-found page", async ({ page }) => {
  const response = await page.goto("/academy/sdd");
  expect(response?.status()).toBe(200);
  await expect(page.locator('[data-error-page="not-found"]')).toBeVisible();
});

test("a file that does not exist answers 404", async ({ request }) => {
  expect((await request.get("/assets/does-not-exist-abc.js")).status()).toBe(404);
  expect((await request.get("/plugins/pr-review/does-not-exist.md", { headers: { accept: "text/html" } })).status()).toBe(404);
});

test("a Catálogo link keeps its filters", async ({ page }) => {
  await page.goto("/explorar?modo=manual&ordem=az");
  await expect(page.getByRole("combobox", { name: "Como a skill dispara", exact: true })).toHaveValue("manual");
  await expect(page.getByRole("combobox", { name: "Ordenar", exact: true })).toHaveValue("az");
});

test("the example in the search of the Catálogo fits a 320 px phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/explorar");
  const fits = await page.locator("#explore-search").evaluate((el) => {
    const input = el as HTMLInputElement;
    const style = getComputedStyle(input);
    const pen = document.createElement("canvas").getContext("2d");
    if (!pen) return false;
    pen.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    return pen.measureText(input.placeholder).width <= input.clientWidth;
  });
  expect(fits).toBe(true);
});

test("chapters marked as read stay marked", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("academy:read-chapters:v1", JSON.stringify(["em-portugues"])));
  await page.goto("/academy/glossario");
  const nav = page.getByRole("navigation", { name: "Academy" });
  await expect(nav.getByRole("link", { name: /Estudar em português/ }).getByRole("img", { name: "lido" })).toBeVisible();
});

test("an item revealed on scroll that stops in the first screen shows whole", async ({ page }) => {
  // The opening of the home page, which plays once in the tab, fades too: marked as seen, it leaves only the reveal to measure.
  await page.addInitScript(() => sessionStorage.setItem("intro:home", "1"));
  for (const [width, height] of [[1440, 900], [390, 844]] as const) {
    await page.setViewportSize({ width, height });
    for (const route of ["/", "/metodo", "/academy", "/plugins"]) {
      await page.goto(route);
      await page.waitForTimeout(400);
      const faded = await page.evaluate(() =>
        [...document.querySelectorAll(".reveal-children > *")].filter((el) => {
          const box = el.getBoundingClientRect();
          const seen = Math.min(box.bottom, innerHeight) - Math.max(box.top, 0);
          return seen > box.height * 0.4 && Number(getComputedStyle(el).opacity) < 0.99;
        }).length,
      );
      expect(faded, `${route} at ${width} px`).toBe(0);
    }
  }
});

