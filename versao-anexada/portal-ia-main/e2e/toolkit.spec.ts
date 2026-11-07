import { expect, test, type Page } from "@playwright/test";

const PAGE = "/ferramentas/catalyst-toolkit";
const COMMAND = "npm i -g @pitang/catalyst-toolkit";
const WINDOWS = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";
// The Desktop Chrome of Playwright says it is on Windows; a phone opens the first time on the macOS.
const PHONE = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36";
const FIRST_TIME = "Primeira vez neste computador?";

// The parts of the travelling title that the page animates, from its first frame on: the transition runs in a third of a second, too
// fast to catch by asking after a click.
async function watchTravel(page: Page) {
  await page.addInitScript(() => {
    const seen: string[] = [];
    Object.assign(window, { travelled: seen });
    const look = () => {
      for (const animation of document.getAnimations()) {
        const pseudo = (animation.effect as KeyframeEffect | null)?.pseudoElement;
        if (pseudo?.includes("travelling-title") && !seen.includes(pseudo)) seen.push(pseudo);
      }
      requestAnimationFrame(look);
    };
    requestAnimationFrame(look);
  });
  return {
    seen: () => page.evaluate(() => [...(window as unknown as { travelled: string[] }).travelled]),
    forget: () => page.evaluate(() => void ((window as unknown as { travelled: string[] }).travelled.length = 0)),
  };
}

// The bar of the install and the button beside it, inside the width of the window, with nothing past its edge.
async function barFits(page: Page, width: number) {
  for (const box of [await page.locator("#instale").boundingBox(), await page.locator("#instale").getByRole("link", { name: "Primeiro uso" }).boundingBox()]) {
    expect(box && box.x >= 0 && box.x + box.width <= width, `${width}`).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth), `${width}: the page`).toBeLessThanOrEqual(width);
}

test("the top of the page names the tool once, in the mark, and installs from the first screen", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(PAGE);
  await expect(page.getByRole("heading", { level: 1, name: "Catalyst Toolkit" })).toBeVisible();
  await expect(page.locator("main header").getByText("Catalyst Toolkit", { exact: true })).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Você está em" })).toHaveCount(0);
  await expect(page.getByText(COMMAND, { exact: true }).first()).toBeInViewport();
  await expect(page.getByRole("button", { name: `Copiar: ${COMMAND}` }).first()).toBeInViewport();
  await expect(page.getByRole("link", { name: "Primeiro uso" }).first()).toHaveAttribute("href", `${PAGE}/primeiro-uso`);
  await expect(page.getByText(FIRST_TIME)).toBeInViewport();
});

test("the first time opens the steps of the system, numbered, with a tab per system and the arrows between them", async ({ page }) => {
  await page.goto(PAGE);
  await page.getByText(FIRST_TIME).click();
  const tabs = page.getByRole("tablist", { name: "Seu sistema" });
  await expect(tabs.getByRole("tab")).toHaveText(["macOS", "Linux", "Windows"]);
  await expect(tabs.locator('[role="tab"] > svg[aria-hidden="true"]')).toHaveCount(3);
  await tabs.getByRole("tab", { name: "macOS" }).click();
  const mac = page.getByRole("tabpanel", { name: "macOS" });
  await expect(mac.getByRole("listitem")).toHaveCount(5);
  await expect(mac).toContainText("Node 22");
  await expect(mac.getByRole("link", { name: "Criar o token" })).toHaveAttribute("href", "https://gitlab.pitang.com/-/user_settings/personal_access_tokens");
  await expect(mac.getByRole("button", { name: `Copiar: ${COMMAND}` })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "Linux" })).toBeFocused();
  await expect(page.getByRole("tabpanel", { name: "Linux" })).toContainText("sudo apt-get install -y bubblewrap");
  await page.keyboard.press("ArrowRight");
  const windows = page.getByRole("tabpanel", { name: "Windows" });
  await expect(windows).toContainText("O catalyst roda no WSL2");
  await expect(windows.getByRole("listitem").first()).toContainText("wsl --install");
});

test.describe("on Windows", () => {
  test.use({ userAgent: WINDOWS });

  test("the first time opens on the tab of the system of the browser", async ({ page }) => {
    await page.goto(PAGE);
    await page.getByText(FIRST_TIME).click();
    await expect(page.getByRole("tab", { name: "Windows" })).toHaveAttribute("aria-selected", "true");
  });
});

test("the line under the mark writes the word in pixels, erases it and writes the next, in a width that does not move", async ({ page }) => {
  await page.goto(PAGE);
  const line = page.getByText(/^Deixa o seu projeto pronto para/);
  await expect(line).toContainText("Claude Code, Codex e agentes de IA");
  const word = line.locator("svg[data-word]");
  const width = (await word.boundingBox())?.width;
  await expect(word).toHaveAttribute("data-word", "CLAUDE CODE");
  await expect(word).toHaveAttribute("data-word", "CODEX", { timeout: 10_000 });
  expect((await word.boundingBox())?.width).toBe(width);
});

test("the mark of the catalyst shows at once, faint, lights up letter by letter behind a caret, and stands whole within 1.2 s", async ({ page }) => {
  await page.goto(PAGE);
  const mark = page.getByRole("heading", { level: 1 }).locator("svg");
  const letters = mark.locator(".typed-letter");
  await expect(letters).toHaveCount(15);
  // No letter waits hidden: the typing is a finish over a mark that is there from the first paint.
  expect(await letters.evaluateAll((all) => all.every((el) => Number(getComputedStyle(el).opacity) >= 0.29))).toBe(true);
  const ends = await mark.evaluate((svg) => svg.getAnimations({ subtree: true }).map((a) => Number(a.effect?.getComputedTiming().endTime)));
  expect(Math.max(0, ...ends)).toBeLessThanOrEqual(1_200);
  const carets = mark.locator(".typed-caret");
  await expect.poll(() => carets.evaluateAll((all) => all.every((el) => getComputedStyle(el).opacity === "0")), { timeout: 3_000 }).toBe(true);
  expect(await letters.evaluateAll((all) => all.every((el) => getComputedStyle(el).opacity === "1"))).toBe(true);
});

test("the video of the casa plays in a loop, with no sound, inline, with its poster", async ({ page }) => {
  await page.goto(PAGE);
  const video = page.getByRole("figure", { name: /^A casa do catalyst/ }).locator("video");
  await expect(video).toHaveJSProperty("loop", true);
  await expect(video).toHaveJSProperty("muted", true);
  await expect(video).toHaveAttribute("playsinline", "");
  await expect(video).toHaveAttribute("poster", /casa-poster.*\.png$/);
  await expect(video.locator("source")).toHaveCount(2);
});

test("the video is its own pause, with no button over it: a click or a key stops the motion of the top and starts it again", async ({ page }) => {
  await page.goto(PAGE);
  const figure = page.getByRole("figure", { name: /^A casa do catalyst/ });
  const video = figure.locator("video");
  const word = page.locator("svg[data-word]");
  await expect(figure.getByRole("button")).toHaveCount(1);
  await expect(page.getByRole("button", { name: /animação/ })).toHaveCount(0);
  const playing = figure.getByRole("button", { name: "Vídeo da casa do catalyst. Clique para pausar." });
  await expect(playing).toHaveCSS("cursor", "pointer");
  await playing.click();
  await expect(video).toHaveJSProperty("paused", true);
  const held = await word.getAttribute("data-word");
  const letters = await word.locator("path").getAttribute("d");
  await page.mouse.move(0, 0);
  await page.waitForTimeout(2_500);
  expect(await word.locator("path").getAttribute("d")).toBe(letters);
  await expect(word).toHaveAttribute("data-word", held ?? "");
  await figure.getByRole("button", { name: "Vídeo da casa do catalyst. Clique para retomar." }).focus();
  await page.keyboard.press("Space");
  await expect(video).toHaveJSProperty("paused", false);
  await page.keyboard.press("Enter");
  await expect(video).toHaveJSProperty("paused", true);
});

test("the page of the tool and its last chapter end with no date of update, and the chapter keeps the way to support", async ({ page }) => {
  await page.goto(PAGE);
  await expect(page.locator("main")).not.toContainText("Atualizado em");
  await page.goto(`${PAGE}/problemas`);
  await expect(page.locator("main").getByRole("link", { name: "Suporte" })).toBeVisible();
  await expect(page.locator("main")).not.toContainText("Atualizado em");
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the mark shows whole, the first word stands still, and the video is its poster", async ({ page }) => {
    await page.goto(PAGE);
    const mark = page.getByRole("heading", { level: 1 }).locator("svg");
    expect(await mark.locator(".typed-letter").evaluateAll((all) => all.every((el) => getComputedStyle(el).animationName === "none" && getComputedStyle(el).opacity === "1"))).toBe(true);
    expect(await mark.locator(".typed-caret").evaluateAll((all) => all.every((el) => getComputedStyle(el).opacity === "0"))).toBe(true);
    const word = page.locator("svg[data-word]");
    await page.waitForTimeout(4_500);
    await expect(word).toHaveAttribute("data-word", "CLAUDE CODE");
    await expect(word.locator("rect")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Vídeo da casa/ })).toHaveCount(0);
    const figure = page.getByRole("figure", { name: /^A casa do catalyst/ });
    await expect(figure.locator("video")).toHaveCount(0);
    await expect(figure.locator("img")).toHaveAttribute("src", /casa-poster/);
  });

  test("Ferramentas stands still, and its card opens the tool with no travel", async ({ page }) => {
    const travel = await watchTravel(page);
    await page.setViewportSize({ width: 1366, height: 860 });
    await page.goto("/ferramentas");
    const moving = page.locator(".tool-tile, .animate-arrive");
    await expect(moving).not.toHaveCount(0);
    expect(await moving.evaluateAll((all) => all.every((el) => getComputedStyle(el).animationName === "none"))).toBe(true);
    await page.getByRole("link", { name: "Conhecer o Catalyst Toolkit" }).click();
    await expect(page).toHaveURL(PAGE);
    await page.waitForTimeout(600);
    expect(await travel.seen()).toEqual([]);
  });
});

test.describe("without the View Transitions API", () => {
  test("the card of Ferramentas opens the tool at once, and its mark types itself in", async ({ page }) => {
    await page.addInitScript(() => Reflect.deleteProperty(Document.prototype, "startViewTransition"));
    await page.goto("/ferramentas");
    await page.getByRole("link", { name: "Conhecer o Catalyst Toolkit" }).click();
    await expect(page).toHaveURL(PAGE);
    await expect(page.getByRole("heading", { level: 1 }).locator("svg .typed-letter")).toHaveCount(15);
  });
});

const MARKS = ["Claude", "OpenAI", "Cursor", "Google Gemini", "Antigravity", "Grok", "OpenCode", "Windsurf"];

test("around the top of Ferramentas float the marks of the agents of AI, for the eye only, clear of the text, and in a row on the phone", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 860 });
  await page.goto("/ferramentas");
  const tiles = page.locator('[data-tiles="around"] .tool-tile');
  expect(await tiles.evaluateAll((all) => all.map((el) => el.getAttribute("data-logo")))).toEqual(MARKS);
  // The marks are a picture: no sentence of the page names an agent the tools do not work with yet.
  await expect(page.locator("body")).not.toContainText(/OpenAI|Cursor|Gemini|Antigravity|Grok|OpenCode|Windsurf/);
  for (const tile of await tiles.all()) await expect(tile).toBeVisible();
  // The page comes in within 1.2 s: the parts of the top, the card and the tiles, all but their float.
  const entrance = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => a instanceof CSSAnimation && a.animationName !== "tile-float" && (a.effect as KeyframeEffect | null)?.target?.closest("main"))
      .map((a) => Number(a.effect?.getComputedTiming().endTime)),
  );
  expect(entrance.length).toBeGreaterThan(0);
  expect(Math.max(...entrance)).toBeLessThanOrEqual(1_200);
  // They float on, each at its own pace and phase: the float never ends, and no two tiles swing together.
  const floats = await tiles.evaluateAll((all) =>
    all.map((el) => {
      const float = el.getAnimations().find((a) => a instanceof CSSAnimation && a.animationName === "tile-float");
      const timing = float?.effect?.getTiming();
      return { iterations: timing?.iterations, direction: timing?.direction, pace: `${String(timing?.duration)} ${timing?.delay}` };
    }),
  );
  for (const float of floats) expect(float).toMatchObject({ iterations: Infinity, direction: "alternate" });
  expect(new Set(floats.map((float) => float.pace)).size).toBe(8);
  const art = page.locator('[aria-hidden="true"]:has(> .tool-tile)');
  await expect(art).toHaveCount(2);
  await expect(art.locator("a, button, input, [tabindex]")).toHaveCount(0);
  for (const width of [1024, 1366, 1920]) {
    await page.setViewportSize({ width, height: 860 });
    const covered = await page.evaluate(() => {
      const text = [...document.querySelectorAll("header h1 > span, header p")].map((el) => el.getBoundingClientRect());
      return [...document.querySelectorAll('[data-tiles="around"] .tool-tile')].filter((tile) => {
        const a = tile.getBoundingClientRect();
        return text.some((b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top);
      }).length;
    });
    expect(covered, `${width}`).toBe(0);
  }
  await page.setViewportSize({ width: 400, height: 860 });
  for (const tile of await tiles.all()) await expect(tile).toBeHidden();
  await expect(page.locator('[data-tiles="row"] .tool-tile').first()).toBeVisible();
});

test.describe("on a phone of 375 px", () => {
  test.use({ viewport: { width: 375, height: 812 }, userAgent: PHONE, isMobile: true, hasTouch: true });

  test("the eight marks show in a row between the sentence and the card, inside the screen, floating on, for the eye only", async ({ page }) => {
    await page.goto("/ferramentas");
    const row = page.locator('[data-tiles="row"]');
    await expect(row).toHaveAttribute("aria-hidden", "true");
    const tiles = row.locator(".tool-tile");
    expect(await tiles.evaluateAll((all) => all.map((el) => el.getAttribute("data-logo")))).toEqual(MARKS);
    for (const tile of await tiles.all()) await expect(tile).toBeInViewport();
    const boxes = await tiles.evaluateAll((all) => all.map((el) => el.getBoundingClientRect().toJSON() as DOMRect));
    for (const box of boxes) expect(box.left >= 0 && box.right <= 375, JSON.stringify(box)).toBe(true);
    const sentence = await page.locator("main header p").boundingBox();
    const card = await page.locator("main article").boundingBox();
    expect(Math.min(...boxes.map((box) => box.top))).toBeGreaterThan((sentence?.y ?? 0) + (sentence?.height ?? 0));
    expect(Math.max(...boxes.map((box) => box.bottom))).toBeLessThan(card?.y ?? 0);
    const iterations = await tiles.evaluateAll((all) => all.map((el) => el.getAnimations().find((a) => a instanceof CSSAnimation && a.animationName === "tile-float")?.effect?.getTiming().iterations));
    expect(iterations).toEqual(MARKS.map(() => Infinity));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  });
});

for (const width of [375, 320]) {
  test.describe(`${width} px`, () => {
    test.use({ viewport: { width, height: 760 }, userAgent: PHONE, isMobile: true, hasTouch: true });

    test("the command to install takes one line, never breaking inside the name of the package, and copies whole", async ({ page }) => {
      await page.goto(PAGE);
      const command = page.locator("#instale code").first();
      await expect(command).toHaveText(COMMAND);
      await page.evaluate(() => document.fonts.ready);
      const rows = await command.evaluate((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        return new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;
      });
      expect(rows).toBe(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.evaluate(() => {
        const copied: string[] = [];
        Object.assign(window, { copied });
        Object.defineProperty(navigator, "clipboard", { value: { writeText: (text: string) => (copied.push(text), Promise.resolve()) } });
      });
      await page.locator("#instale").getByRole("button", { name: `Copiar: ${COMMAND}` }).first().click();
      expect(await page.evaluate(() => (window as unknown as { copied: string[] }).copied)).toEqual([COMMAND]);
    });
  });
}

test("the mark of the card travels to the top of the Catalyst Toolkit, arrives whole, and travels back into its card", async ({ page }) => {
  const travel = await watchTravel(page);
  await page.setViewportSize({ width: 1366, height: 860 });
  await page.goto("/ferramentas");
  await expect(page.locator('[data-tiles="around"] .tool-tile[data-arrive]')).toHaveCount(8);
  await page.getByRole("link", { name: "Conhecer o Catalyst Toolkit" }).click();
  await expect(page).toHaveURL(PAGE);
  await expect.poll(travel.seen).toContain("::view-transition-group(travelling-title)");
  const mark = page.getByRole("heading", { level: 1 }).locator("svg");
  await expect(mark).toHaveAttribute("data-vt-target", "title");
  await expect(mark.locator(".typed-letter")).toHaveCount(0);
  await travel.forget();
  await page.goBack();
  await expect(page).toHaveURL("/ferramentas");
  await expect.poll(travel.seen).toContain("::view-transition-group(travelling-title)");
  await expect(page.getByRole("article").locator('svg[data-vt="title"]')).toBeVisible();
  await expect(page.locator(".animate-arrive, .tool-tile[data-arrive]")).toHaveCount(0);
});

test("Ferramentas opens from the menu at the top, with a card for each tool, and the Catalyst Toolkit first", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Ferramentas" }).click();
  await expect(page).toHaveURL("/ferramentas");
  const heading = page.getByRole("heading", { level: 1, name: "Ferramentas Pita.IA" });
  await expect(heading).toBeVisible();
  await expect(heading.getByRole("img", { name: "Pita.IA" })).toBeVisible();
  const card = page.getByRole("article").first();
  await expect(card.getByRole("heading", { name: "Catalyst Toolkit" })).toBeVisible();
  await expect(card.getByRole("link")).toHaveText(["Conhecer o Catalyst Toolkit"]);
  await card.getByRole("link", { name: "Conhecer o Catalyst Toolkit" }).click();
  await expect(page).toHaveURL(PAGE);
  await expect(page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Ferramentas" })).toHaveAttribute("aria-current", "page");
});

test("the page of the tool has no side menu, and its chapters have the menu of Ferramentas", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto(PAGE);
  await expect(page.getByRole("navigation", { name: "Ferramentas" })).toHaveCount(0);
  const cards = page.getByRole("region", { name: "O guia" }).getByRole("link");
  await expect(cards).toHaveCount(5);
  await cards.filter({ hasText: "Diagnosticar com o doctor" }).click();
  await expect(page).toHaveURL(`${PAGE}/doctor`);
  await expect(page.getByRole("navigation", { name: "Ferramentas" }).getByRole("link", { name: "Catalyst Toolkit" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Você está em" }).getByRole("link", { name: "Ferramentas" })).toHaveAttribute("href", "/ferramentas");
  await page.goto(`${PAGE}/problemas`);
  await expect(page.getByRole("link", { name: /Volte à página.*Catalyst Toolkit/ })).toHaveAttribute("href", PAGE);
});

test("neither the Method nor the home carries the toolkit: its way in is the item Ferramentas of the menu at the top", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const route of ["/metodo", "/"]) {
    await page.goto(route);
    await expect(page.locator("main h1").first()).toBeVisible();
    await expect(page.getByRole("complementary", { name: /Catalyst Toolkit/ }), route).toHaveCount(0);
    await expect(page.locator(`main a[href^="${PAGE}"]`), route).toHaveCount(0);
  }
  await expect(page.getByRole("navigation", { name: "Método" })).toHaveCount(0);
  await page.goto("/metodo");
  await expect(page.getByRole("navigation", { name: "Método" }).getByRole("link", { name: "Catalyst Toolkit" })).toHaveCount(0);
  await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Ferramentas" }).click();
  await expect(page).toHaveURL("/ferramentas");
});

test("the short address and the addresses in the Method land on the pages of Ferramentas", async ({ page }) => {
  for (const [from, to] of [
    ["/catalyst", PAGE],
    ["/metodo/catalyst-toolkit", PAGE],
    ["/metodo/catalyst-toolkit/doctor", `${PAGE}/doctor`],
    ["/metodo/catalyst", PAGE],
    ["/metodo/catalyst/doctor", `${PAGE}/doctor`],
    ["/metodo/catalyst/rust", `${PAGE}/o-que-faz`],
  ]) {
    await page.goto(from ?? "/");
    await expect(page, from).toHaveURL(to ?? "/");
    await expect(page.locator("[data-error-page]")).toHaveCount(0);
  }
});

test("the bar of the install and the first time fit whole from 400 to 1920 px, wrapping instead of scrolling", async ({ page }) => {
  for (const width of [400, 768, 1366, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(PAGE);
    await barFits(page, width);
    await page.getByText(FIRST_TIME).click();
    for (const system of ["macOS", "Linux", "Windows"]) {
      await page.getByRole("tab", { name: system }).click();
      await barFits(page, width);
    }
  }
});

test.describe("400 px", () => {
  test.use({ viewport: { width: 400, height: 860 }, userAgent: PHONE });

  test("the command to install and the first time show in the first screen of the phone", async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.getByText(COMMAND, { exact: true }).first()).toBeInViewport();
    await expect(page.getByText(FIRST_TIME)).toBeInViewport();
  });
});
