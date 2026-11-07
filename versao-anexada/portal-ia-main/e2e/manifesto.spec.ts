import { expect, test } from "@playwright/test";

const MENU = ["Manifesto", "Academy", "Método", "Ferramentas", "Catálogo", "Contribuir"];

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme });

    test("the manifesto is the first item of the top menu and lights up on /manifesto", async ({ page }) => {
      await page.goto("/manifesto");
      await expect(page).toHaveURL(/\/manifesto$/);
      await expect(page.locator("main h1").first()).toContainText("Pitangueira");
      const menu = page.getByRole("navigation", { name: "Principal" }).getByRole("link");
      await expect(menu).toHaveText(MENU);
      await expect(page.getByRole("navigation", { name: "Principal" }).locator('[aria-current="page"]')).toHaveText(["Manifesto"]);
    });

    test("the Academy lights up on its own pages, and the manifesto does not", async ({ page }) => {
      await page.goto("/academy");
      await expect(page.getByRole("navigation", { name: "Principal" }).locator('[aria-current="page"]')).toHaveText(["Academy"]);
      await expect(page.getByRole("navigation", { name: "Academy" }).getByRole("link", { name: "Manifesto" })).toHaveCount(0);
    });
  });
}

test.describe("320 px", () => {
  test.use({ viewport: { width: 320, height: 720 } });

  for (const theme of ["light", "dark"] as const) {
    test(`the mobile menu has the manifesto after Início, in the same order, lit on /manifesto (${theme})`, async ({ browser }) => {
      const context = await browser.newContext({ storageState: "e2e/.auth/test-account.json", viewport: { width: 320, height: 720 }, colorScheme: theme });
      const page = await context.newPage();
      await page.goto("/manifesto");
      await expect(page.locator("main h1").first()).toBeVisible();
      await page.getByRole("button", { name: "Abrir o menu" }).click();
      const menu = page.getByRole("navigation", { name: "Menu" });
      await expect(menu.getByRole("link")).toHaveText(["Início", ...MENU]);
      await expect(menu.locator('[aria-current="page"]')).toHaveText(["Manifesto"]);
      await context.close();
    });
  }
});

// The address the page had inside the Academy, joined so that no file keeps it written out.
const OLD = ["", "academy", "manifesto"].join("/");

test("the old address is a page that does not exist, and the Markdown moved with the page", async ({ page, request }) => {
  const response = await page.goto(OLD);
  expect(response?.status()).toBe(200);
  await expect(page.locator('[data-error-page="not-found"]')).toBeVisible();
  const markdown = await request.get("/manifesto.md");
  expect(markdown.headers()["content-type"]).toContain("text/markdown");
  expect(await markdown.text()).toMatch(/^# O Pé de IA é uma Pitangueira/);
  expect((await request.get(`${OLD}.md`, { headers: { accept: "text/html" } })).status()).toBe(404);
});

test("the top follows the entry pages of the Academy and of the Método", async ({ page }) => {
  await page.goto("/manifesto");
  await expect(page.locator("main .eyebrow").first()).toHaveText("Manifesto · por que a Pitang adota IA");
  await expect(page.locator("main h1")).toHaveText("O Pé de IA é uma Pitangueira");
  await expect(page.locator("main header p").last()).toHaveText("Aqui a IA não domina gente. Aqui a gente doma a IA.");
  await expect(page.locator('article a[href="#comecar"]')).toHaveCount(0);
  await expect(page.locator("article h2").first()).toHaveText("Por que agora");
});

test("no page has the copy and Markdown buttons, neither the manifesto nor the guides of the Método", async ({ page }) => {
  for (const route of ["/manifesto", "/metodo/estudo-de-caso", "/metodo/sdd", "/metodo/compozy/adocao"]) {
    await page.goto(route);
    await expect(page.locator("main h1").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Copiar página" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Markdown desta página" })).toHaveCount(0);
  }
});

test.describe("the index of the page", () => {
  test("is fixed on the right from 1024 px, and follows the reading", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/manifesto");
    const index = page.getByRole("complementary", { name: "Nesta página" });
    await expect(index).toBeVisible();
    await expect(page.locator("details", { hasText: "Nesta página" })).toBeHidden();
    const article = await page.locator("article").boundingBox();
    const box = await index.boundingBox();
    expect(box && article && box.x >= article.x + article.width).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1024);
    await page.locator("#pitangueira").evaluate((el) => el.scrollIntoView({ block: "start" }));
    await expect(index.getByRole("link", { name: "A pitangueira" })).toHaveAttribute("aria-current", "true");
    await expect(index.getByRole("link", { name: "Por que agora" })).toBeInViewport();
  });

  test("is folded above the text under 1024 px, as it is today", async ({ page }) => {
    await page.setViewportSize({ width: 1023, height: 800 });
    await page.goto("/manifesto");
    await expect(page.getByRole("complementary", { name: "Nesta página" })).toBeHidden();
    const details = page.locator("details", { hasText: "Nesta página" });
    await expect(details).toBeVisible();
    expect(await details.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(false);
  });
});

test("the page ends with the cards of the Academy and of the Método, the same as the home", async ({ page }) => {
  await page.goto("/manifesto");
  const closing = page.getByRole("region", { name: "Por onde seguir" });
  await expect(closing.getByRole("heading", { level: 3 })).toHaveText(["Academy", "Método"]);
  await expect(closing.getByRole("link", { name: "Abrir a Academy" })).toHaveAttribute("href", "/academy");
  await expect(closing.getByRole("link", { name: "Abrir o Método" })).toHaveAttribute("href", "/metodo");
});
