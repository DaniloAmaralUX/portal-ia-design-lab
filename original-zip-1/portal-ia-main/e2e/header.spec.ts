import { expect, test } from "@playwright/test";

// A laptop with a classic scrollbar, which takes 15 px of the window. Playwright starts the headless browser with its scrollbars
// hidden; without that flag, the page draws a classic one, and the header has 15 px less than the window, as on such a laptop.
test.use({ launchOptions: { ignoreDefaultArgs: ["--hide-scrollbars"] } });
const CLASSIC_SCROLLBAR = "html { overflow-y: scroll } ::-webkit-scrollbar { width: 15px } ::-webkit-scrollbar-thumb { background: #888 }";
const SECTIONS = ["Manifesto", "Academy", "Método", "Ferramentas", "Catálogo", "Contribuir"];

test("from 896 px the header shows the six sections, beside a classic scrollbar, with nothing past the screen", async ({ page }) => {
  await page.setViewportSize({ width: 895, height: 800 });
  await page.goto("/");
  await page.addStyleTag({ content: CLASSIC_SCROLLBAR });
  await expect(page.getByRole("navigation", { name: "Principal" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Abrir o menu" })).toBeVisible();
  for (const width of [896, 1024, 1080, 1152, 1280, 1366]) {
    await page.setViewportSize({ width, height: 800 });
    const nav = page.getByRole("navigation", { name: "Principal" });
    await expect(nav.getByRole("link"), `${width}`).toHaveText(SECTIONS);
    const fit = await page.getByRole("banner").evaluate((header) => {
      const screen = document.documentElement.clientWidth;
      const shown = [...header.querySelectorAll("a, button")].filter((el) => el.getBoundingClientRect().width > 0);
      const name = (el: Element) => el.getAttribute("aria-label") ?? el.textContent?.trim() ?? "";
      const links = [...header.querySelectorAll('nav[aria-label="Principal"] a')].map((el) => el.getBoundingClientRect());
      const menu = header.querySelector('nav[aria-label="Principal"]')?.getBoundingClientRect();
      const account = header.querySelector('button[aria-label^="Conta de"]');
      const avatar = account?.getBoundingClientRect();
      const right = account?.parentElement?.getBoundingClientRect();
      return {
        scrollbar: window.innerWidth - screen,
        past: shown.filter((el) => el.getBoundingClientRect().right > screen + 0.5).map(name),
        sections: links.length === 6 && links.every((r) => r.width > 0 && r.left >= 0 && r.right <= screen),
        avatar: Boolean(avatar && avatar.width > 0 && avatar.left >= 0 && avatar.right <= screen),
        apart: menu && right ? Math.round(right.left - menu.right) : -1,
      };
    });
    expect(fit.scrollbar, `${width}: the classic scrollbar`).toBe(15);
    expect(fit.past, `${width}: past the screen`).toEqual([]);
    expect(fit.sections, `${width}: the six sections inside the screen`).toBe(true);
    expect(fit.avatar, `${width}: the avatar whole`).toBe(true);
    expect(fit.apart, `${width}: the menu clear of the search and the account`).toBeGreaterThanOrEqual(0);
  }
});

test("between 896 and 1152 px the search is its icon, with the name and the shortcut of the field, and from 1152 px the field", async ({ page }) => {
  await page.goto("/");
  for (const [width, field] of [[1000, false], [1151, false], [1152, true], [1280, true]] as const) {
    await page.setViewportSize({ width, height: 800 });
    const search = page.getByRole("banner").getByRole("button", { name: "Buscar no site" });
    await expect(search, `${width}`).toHaveCount(1);
    await expect(search).toHaveAttribute("aria-keyshortcuts", "Meta+K Control+K");
    expect((await search.boundingBox())?.width ?? 0, `${width}`).toBeGreaterThan(field ? 100 : 0);
    if (!field) expect((await search.boundingBox())?.width, `${width}`).toBeLessThanOrEqual(36);
  }
  await page.getByRole("banner").getByRole("button", { name: "Buscar no site" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});
