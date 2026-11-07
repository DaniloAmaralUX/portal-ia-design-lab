import { expect, test } from "@playwright/test";

test.describe("the outline of a guide with chapters", () => {
  test("is on the right from 1280 px, with the sections of the open chapter, and the menu lists only the guides", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/metodo/compozy/rules");
    const outline = page.getByRole("complementary", { name: "Neste guia" });
    await expect(outline).toBeVisible();
    await expect(outline.getByText("Como funciona", { exact: true })).toBeVisible();
    await expect(outline.getByRole("link", { name: "Rules escopadas por path" })).toHaveAttribute("aria-current", "page");
    const menu = page.getByRole("navigation", { name: "Método" });
    await expect(menu.getByRole("link", { name: "Rules escopadas por path" })).toHaveCount(0);
    await expect(menu.getByRole("link", { name: "SDD com Compozy" })).toHaveAttribute("aria-current", "true");
    await expect(menu.getByRole("link", { name: "SDD com Compozy" })).toHaveAttribute("data-status", "active");
    await page.locator("#frontend-pitang-pedidos-web").evaluate((el) => el.scrollIntoView({ block: "start" }));
    await expect(outline.getByRole("link", { name: "Frontend · Pitang.Pedidos.Web" })).toHaveAttribute("aria-current", "true");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1280);
  });

  test("leaves the text its width, reaching into the empty margin on the right", async ({ page }) => {
    for (const [width, least] of [[1280, 660], [1440, 740]] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/metodo/compozy/rules");
      await expect(page.getByRole("complementary", { name: "Neste guia" })).toBeVisible();
      expect(await page.locator("pre").first().evaluate((el) => el.getBoundingClientRect().width)).toBeGreaterThanOrEqual(least);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  });

  test("numbers each chapter as the guide does", async ({ page }) => {
    await page.goto("/metodo/compozy/pipeline");
    const outline = page.getByRole("complementary", { name: "Neste guia" });
    await expect(outline.getByRole("link", { name: "1.6 O pipeline Compozy" })).toHaveAttribute("aria-current", "page");
    await expect(outline.getByRole("link", { name: "1.3 Rules escopadas por path" })).toBeVisible();
  });

  test("fades at the bottom while the list goes on below, and not at its end", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/metodo/compozy");
    const box = page.getByRole("complementary", { name: "Neste guia" }).locator("[data-more]");
    await expect(box).toHaveAttribute("data-more", "true");
    await box.evaluate((el) => el.scrollTo({ top: el.scrollHeight, behavior: "instant" }));
    await expect(box).toHaveAttribute("data-more", "false");
  });

  test("from 1024 to 1279 px sits in the menu, under the open guide", async ({ page }) => {
    await page.setViewportSize({ width: 1279, height: 800 });
    await page.goto("/metodo/compozy/rules");
    await expect(page.getByRole("complementary", { name: "Neste guia" })).toBeHidden();
    const menu = page.getByRole("navigation", { name: "Método" });
    await expect(menu.getByRole("link", { name: "1.3 Rules escopadas por path" })).toHaveAttribute("aria-current", "page");
    await expect(menu.getByRole("link", { name: "1.4 Skills do Compozy" })).toBeVisible();
    await expect(page.locator("details", { hasText: "Neste guia" })).toBeHidden();
  });

  test("is folded above the text under 1024 px, where there is no menu", async ({ page }) => {
    await page.setViewportSize({ width: 1023, height: 800 });
    await page.goto("/metodo/compozy/rules");
    const details = page.locator("details", { hasText: "Neste guia" });
    await expect(details).toBeVisible();
    expect(await details.evaluate((el) => (el as HTMLDetailsElement).open)).toBe(false);
  });

  test("the folded outline opens from anywhere on its card", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/metodo/compozy/pipeline");
    const card = page.locator("details", { hasText: "Neste guia" });
    await card.click({ position: { x: 6, y: 5 } });
    await expect(card).toHaveAttribute("open", "");
  });

  test("a guide read whole has its sections on the right, and none in the menu", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/metodo/estudo-de-caso");
    await expect(page.getByRole("complementary", { name: "Nesta página" }).getByRole("link", { name: "O resultado" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Método" }).getByRole("link", { name: "O resultado" })).toHaveCount(0);
  });
});

test.describe("the outline of a track", () => {
  test("marks the platform the reading is on with an underline, and not only with colour", async ({ page }) => {
    await page.goto("/academy/trilhas/engenharia#anthropic");
    const label = page.getByRole("complementary", { name: "Nesta página" }).getByRole("link", { name: "Anthropic Academy", exact: true });
    await expect(label).toHaveAttribute("aria-current", "true");
    expect(await label.evaluate((el) => getComputedStyle(el).textDecorationLine)).toBe("underline");
  });

  test("names each phase with its platform, so the three phases of the same name tell apart", async ({ page }) => {
    await page.goto("/academy/trilhas/engenharia");
    const outline = page.getByRole("complementary", { name: "Nesta página" });
    for (const platform of ["Anthropic Academy", "OpenAI Academy", "Microsoft Learn"]) {
      await expect(outline.getByRole("link", { name: `Fundamentos (${platform})` })).toHaveCount(1);
    }
  });

  test("the heading of each phase reads as one phrase", async ({ page }) => {
    await page.goto("/academy/trilhas/engenharia");
    await expect(page.locator("#anthropic-fase-1")).toHaveAccessibleName("Fase 1: Fundamentos");
  });
});

test("the outline of getting started points to anchors in Portuguese", async ({ page }) => {
  await page.goto("/primeiros-passos");
  const outline = page.getByRole("complementary", { name: "Nesta página" });
  await expect(outline.getByRole("link", { name: "Perguntas frequentes" })).toHaveAttribute("href", "#perguntas-frequentes");
  await expect(outline.getByRole("link", { name: "Dispara sozinha ou só manual?" })).toHaveAttribute("href", "#sozinha-ou-manual");
});

test.describe("the presentation", () => {
  test("opens over the chapter, walks the pages with the keys, and leaving goes back to the section of the slide", async ({ page }) => {
    await page.goto("/metodo/compozy/rules");
    await page.getByRole("link", { name: "Apresentação" }).click();
    const deck = page.getByRole("dialog", { name: /^Apresentação: / });
    await expect(deck).toBeVisible();
    await expect(deck.getByText(/^Slide 1 de \d+$/)).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(deck.getByText(/^Slide 2 de \d+$/)).toBeVisible();
    await page.goto("/metodo/compozy/rules?modo=apresentacao&slide=3");
    await expect(page.getByRole("dialog").getByRole("heading", { name: "Backend · Pitang.Pedidos.Api" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page).toHaveURL(/\/metodo\/compozy\/rules#backend-pitang-pedidos-api$/);
    await expect(page.locator("#backend-pitang-pedidos-api")).toBeInViewport();
    await expect(page.locator("#backend-pitang-pedidos-api")).toBeFocused();
  });

  test("leaving after the deck went into another chapter keeps the focus on the section of the slide", async ({ page }) => {
    await page.goto("/metodo/compozy/skills?modo=apresentacao");
    await expect(page.getByRole("dialog").getByText(/^Slide 1 de \d+$/)).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(page).toHaveURL(/\/metodo\/compozy\/rules\?modo=apresentacao&slide=\d+$/);
    await expect(page.getByRole("dialog").getByText(/^Slide (\d+) de \1$/)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/\/metodo\/compozy\/rules#[\w-]+$/);
    // The page took the focus back to its main region on a frame after the dialog closed: two frames let that happen, if it does.
    await page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done()))));
    await expect(page.locator(`[id="${new URL(page.url()).hash.slice(1)}"]`)).toBeFocused();
  });

  test("on a code block wider than the slide, the arrows scroll it, and the keys of the clicker still turn the slide", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/metodo/historias-de-usuario/como-estruturar-o-template-user-storymd-secao-por-secao?modo=apresentacao&slide=8");
    const deck = page.getByRole("dialog");
    await expect(deck.getByRole("heading", { name: /Critérios de Aceite/ })).toBeVisible();
    const code = deck.getByRole("region", { name: /^Trecho de código/ });
    await code.focus();
    const counter = deck.getByText(/^Slide \d+ de \d+$/);
    const before = (await counter.textContent()) ?? "";
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => code.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
    await expect(counter).toHaveText(before);
    await page.keyboard.press("PageDown");
    await expect(counter).not.toHaveText(before);
  });

  test("at the last page the next button keeps the focus, and the keys still turn the slides", async ({ page }) => {
    await page.goto("/manifesto?modo=apresentacao");
    const deck = page.getByRole("dialog", { name: /^Apresentação: / });
    const counter = deck.getByRole("status");
    await expect(counter).toHaveText(/^Slide 1 de \d+$/);
    await page.keyboard.press("End");
    await expect(counter).toHaveText(/^Slide (\d+) de \1$/);
    await page.keyboard.press("ArrowLeft");
    const next = deck.getByRole("button", { name: "Próximo slide" });
    await next.click();
    await expect(counter).toHaveText(/^Slide (\d+) de \1$/);
    await expect(next).toHaveAttribute("aria-disabled", "true");
    await expect(next).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(counter).not.toHaveText(/^Slide (\d+) de \1$/);
  });

  test("leaving by the back button leaves the full screen too", async ({ page }) => {
    await page.goto("/metodo/compozy/rules");
    await page.getByRole("link", { name: "Apresentação" }).click();
    await expect(page.getByRole("dialog", { name: /^Apresentação: / })).toBeVisible();
    await page.keyboard.press("f");
    await expect.poll(() => page.evaluate(() => document.fullscreenElement !== null)).toBe(true);
    await page.goBack();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect.poll(() => page.evaluate(() => document.fullscreenElement !== null)).toBe(false);
  });

  test("goes on into the next chapter after the last page, and back into the last page of the previous one", async ({ page }) => {
    await page.goto("/metodo/compozy/rules?modo=apresentacao");
    await expect(page.getByRole("dialog").getByText(/^Slide 1 de \d+$/)).toBeVisible();
    await page.keyboard.press("End");
    await expect(page.getByRole("dialog").getByText(/^Slide (\d+) de \1$/)).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL(/\/metodo\/compozy\/skills\?modo=apresentacao&slide=1$/);
    await expect(page.getByRole("dialog").getByRole("heading", { name: "1.4 Skills do Compozy", exact: true })).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(page).toHaveURL(/\/metodo\/compozy\/rules\?modo=apresentacao&slide=\d+$/);
    await expect(page.getByRole("dialog").getByText(/^Slide (\d+) de \1$/)).toBeVisible();
  });

  test("starts from the list of the Método, from the cover of a guide and on the manifesto, and the diagram has none", async ({ page }) => {
    await page.goto("/metodo");
    await page.getByRole("link", { name: "Apresentar: Estudo de caso SAAT/PEAT" }).click();
    await expect(page).toHaveURL(/\/metodo\/estudo-de-caso\?modo=apresentacao$/);
    await expect(page.getByRole("dialog", { name: "Apresentação: Estudo de caso SAAT/PEAT" })).toBeVisible();
    await page.goto("/metodo/compozy?modo=apresentacao");
    await expect(page).toHaveURL(/\/metodo\/compozy\/como-usar\?modo=apresentacao$/);
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.goto("/manifesto?modo=apresentacao");
    await expect(page.getByRole("dialog", { name: "Apresentação: O Pé de IA é uma Pitangueira" })).toBeVisible();
    await page.goto("/metodo/esteira");
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.getByRole("link", { name: "Apresentação" })).toHaveCount(0);
  });
});
