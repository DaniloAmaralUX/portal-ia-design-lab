import { expect, test, type Locator, type Page } from "@playwright/test";

// How much of the conversation the terminal shows: its text, without the rest of each line, which it keeps invisible so the box
// has its final size from the start.
function typed(page: Page): Promise<number> {
  return page.locator("[data-terminal-screen]").evaluate((el) => {
    const shown = el.cloneNode(true) as HTMLElement;
    for (const rest of shown.querySelectorAll(".invisible")) rest.remove();
    return shown.textContent?.length ?? 0;
  });
}

test("the demo of the terminal plays by itself and holds while the pointer is over it", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Instalar", exact: true }).click();
  await page.locator("[data-terminal-screen]").scrollIntoViewIfNeeded();
  const start = await typed(page);
  await expect.poll(() => typed(page)).toBeGreaterThan(start);
  await page.locator("[data-terminal-screen]").hover();
  const held = await typed(page);
  await page.waitForTimeout(1500);
  expect(await typed(page)).toBe(held);
  await page.mouse.move(0, 0);
  await expect.poll(() => typed(page)).toBeGreaterThan(held);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the terminal shows the whole conversation at once, and it stays as it is", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Instalar", exact: true }).click();
    const whole = await typed(page);
    expect(whole).toBeGreaterThan(0);
    await page.waitForTimeout(1500);
    expect(await typed(page)).toBe(whole);
  });
});

test.describe("the next steps of the role", () => {
  const forYou = (page: Page) => page.locator('section[aria-labelledby="para-voce-title"]');

  test("the home page asks for the role, keeps it after a reload and lets the person change it", async ({ page }) => {
    await page.goto("/");
    await expect(forYou(page).getByRole("heading", { name: "Qual é o seu papel?" })).toBeVisible();
    await forYou(page).getByRole("button", { name: "Engenheiro de testes" }).click();
    await expect(forYou(page)).toBeFocused();
    await expect(forYou(page).getByRole("heading", { name: "Por onde começar" })).toBeVisible();
    await expect(forYou(page).getByRole("link", { name: /^Capacitação/ })).toHaveAttribute("href", "/academy/trilhas/qualidade");
    await expect(forYou(page).getByRole("link", { name: /^Roteiro de Qualidade/ })).toHaveAttribute("href", "/primeiros-passos");

    await page.reload();
    await expect(forYou(page).getByRole("heading", { name: "Por onde começar" })).toBeVisible();
    await forYou(page).getByRole("button", { name: "Trocar o papel" }).click();
    await expect(forYou(page).getByRole("heading", { name: "Qual é o seu papel?" })).toBeVisible();
    await expect(forYou(page)).toBeFocused();
  });

  test("opening a track does not choose the role", async ({ page }) => {
    await page.goto("/academy/trilhas/engenharia");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goto("/");
    await expect(forYou(page).getByRole("heading", { name: "Qual é o seu papel?" })).toBeVisible();
  });

  test("a guide left halfway is there to continue", async ({ page }) => {
    await page.goto("/");
    await forYou(page).getByRole("button", { name: "Desenvolvedor de software" }).click();
    await page.goto("/metodo/compozy");
    await expect(page.locator('section[aria-labelledby="capitulos"] a').first()).toBeVisible();
    const chapters = await page
      .locator('section[aria-labelledby="capitulos"] a')
      .evaluateAll((links) => links.map((a) => new URL((a as HTMLAnchorElement).href).pathname));
    const [first, second] = chapters.map((path) => path.replace("/metodo/", ""));
    await page.evaluate((id) => localStorage.setItem("academy:read-chapters:v1", JSON.stringify([id])), first);

    await page.goto("/");
    await expect(forYou(page).getByRole("heading", { name: "Continue de onde parou" })).toBeVisible();
    await expect(forYou(page).getByRole("link", { name: /^Capacitação/ })).toHaveAttribute("href", "/academy/trilhas/engenharia");
    await expect(forYou(page).getByRole("link", { name: /^Continuar a leitura/ })).toHaveAttribute("href", `/metodo/${second}`);
  });
});

// How many boxes start on each row, top to bottom: a grid of two with four boxes is [2, 2].
function rowsOf(boxes: { top: number }[]) {
  const tops = boxes.map((box) => Math.round(box.top));
  return [...new Set(tops)].sort((a, b) => a - b).map((top) => tops.filter((t) => t === top).length);
}

const boxesOf = (items: Locator, card: string) =>
  items.evaluateAll(
    (els, selector) =>
      els.map((el) => {
        const { top, left, width } = ((selector && el.closest(selector)) || el).getBoundingClientRect();
        return { top, left, width };
      }),
    card,
  );

test.describe("1366 px", () => {
  test.use({ viewport: { width: 1366, height: 900 } });

  test("the four areas lay out two by two, and an area with no skills says they come soon", async ({ page }) => {
    await page.goto("/");
    const section = page.locator('section[aria-labelledby="areas-title"]');
    const areas = section.locator("h3 a[href^='/explorar']");
    await expect(areas).toHaveCount(4);
    const cards = await boxesOf(areas, ".rounded-2xl");
    expect(rowsOf(cards)).toEqual([2, 2]);
    expect(new Set(cards.map((card) => Math.round(card.left))).size).toBe(2);
    await expect(section).not.toContainText(/(^|\D)0\s+skills/);
  });

  test("with no role chosen, the four roles take two rows of two, each as wide as its cell, the name of each on one line", async ({ page }) => {
    await page.goto("/");
    const roles = page.locator('section[aria-labelledby="para-voce-title"]').getByRole("button");
    await expect(roles).toHaveCount(4);
    const chips = await boxesOf(roles, "");
    expect(rowsOf(chips)).toEqual([2, 2]);
    const [a, b, c, d] = chips.map((chip) => ({ left: Math.round(chip.left), width: Math.round(chip.width) }));
    expect([c?.left, d?.left]).toEqual([a?.left, b?.left]);
    expect(new Set(chips.map((chip) => Math.round(chip.width))).size).toBe(1);
    // The lines the name of each role takes in its chip, and the height of the chip.
    const names = await roles.evaluateAll((buttons) =>
      buttons.map((button) => {
        const name = [...button.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
        const range = document.createRange();
        if (name) range.selectNodeContents(name);
        const lines = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
        return { lines, height: Math.round(button.getBoundingClientRect().height) };
      }),
    );
    expect(names.map((name) => name.lines)).toEqual([1, 1, 1, 1]);
    expect(new Set(names.map((name) => name.height)).size).toBe(1);
  });
});
