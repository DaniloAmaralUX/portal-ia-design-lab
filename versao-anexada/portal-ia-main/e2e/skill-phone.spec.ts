import { devices, expect, test, type Locator } from "@playwright/test";
import { loadRelease } from "../scripts/skills-source";

// A skill page on a phone shows whole what a person reads to choose and to call the skill: the path of each file, the command, and
// the names of the other skills of the plugin. Cut with an ellipsis, thirty files of a skill read the same.
const release = loadRelease();
const longest = <T,>(items: T[], size: (item: T) => number) => items.reduce((a, b) => (size(b) > size(a) ? b : a));
const deepFiles = longest(release.skills, (s) => Math.max(0, ...s.files.map((f) => f.length)));
const longCommand = longest(release.skills, (s) => `/${s.plugin}:${s.slug}`.length);
const longSlug = longest(release.skills, (s) => s.slug.length);
// The one seen broken inside its name, "/requirements:pg-spec-promote-to-" and "memory".
const promote = release.skills.find((s) => s.slug === "pg-spec-promote-to-memory") ?? longCommand;
const longTitles = longest(release.plugins, (p) => Math.max(0, ...release.skills.filter((s) => s.plugin === p.name).map((s) => s.title.length)));
const ofLongTitles = release.skills.find((s) => s.plugin === longTitles.name);
if (!ofLongTitles) throw new Error(`The plugin ${longTitles.name} has no skill.`);

const whole = (text: Locator) => text.evaluate((el) => el.scrollWidth <= el.clientWidth + 1 && getComputedStyle(el).textOverflow !== "ellipsis");

test.use({ viewport: { width: 375, height: 812 }, userAgent: devices["Pixel 7"].userAgent, isMobile: true, hasTouch: true });

test("every file of the skill shows its whole path", async ({ page }) => {
  await page.goto(`/plugins/${deepFiles.plugin}/${deepFiles.slug}`);
  const files = page.getByRole("button", { name: /^(Ver|Baixar) / });
  await expect(files.first()).toBeVisible();
  for (const file of await files.all()) {
    const name = (await file.getAttribute("aria-label"))?.replace(/^(Ver|Baixar) /, "") ?? "";
    const path = file.locator("span").filter({ hasText: name.slice(name.lastIndexOf("/") + 1) }).first();
    await expect(path).toContainText(name.slice(name.lastIndexOf("/") + 1));
    expect(await whole(path), name).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

// The lines the plugin and the skill of the command take in its button, and whether the skill fits alone on a line of the button.
async function commandLines(chip: Locator, plugin: string, slug: string) {
  return chip.evaluate(
    (el, [first, second]) => {
      const texts: Text[] = [];
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (walk.nextNode()) texts.push(walk.currentNode as Text);
      const rows = (data: string) => {
        const node = texts.find((t) => t.data === data);
        if (!node) return [];
        const range = document.createRange();
        range.selectNodeContents(node);
        return [...new Set([...range.getClientRects()].map((r) => Math.round(r.top)))];
      };
      const box = [...el.querySelectorAll("span")].find((span) => span.textContent === first + second);
      if (!box) return { plugin: [], slug: [], fits: false };
      // The width the skill takes on one line, in the font of the button.
      const probe = document.createElement("span");
      probe.textContent = second;
      probe.style.cssText = "position: absolute; visibility: hidden; white-space: nowrap";
      box.append(probe);
      const width = probe.getBoundingClientRect().width;
      probe.remove();
      return { plugin: rows(first), slug: rows(second), fits: width <= box.clientWidth };
    },
    [plugin, slug],
  );
}

for (const skill of new Set([promote, longCommand])) {
  const plugin = `/${skill.plugin}:`;
  const command = `${plugin}${skill.slug}`;
  test(`the command ${command} shows whole, broken only after the plugin, the skill on a line of its own`, async ({ page }) => {
    await page.goto(`/plugins/${skill.plugin}/${skill.slug}`);
    const chip = page.getByRole("button", { name: `Copiar o comando ${command}` }).first();
    const text = chip.locator("span", { hasText: command }).first();
    await expect(text).toHaveText(command);
    expect(await whole(text)).toBe(true);
    const lines = await commandLines(chip, plugin, skill.slug);
    expect(lines.plugin, "the plugin").toHaveLength(1);
    expect(lines.fits, "the skill fits a line of the button").toBe(true);
    expect(lines.slug, "the skill, on one line").toHaveLength(1);
    // Where the command wraps, the skill starts the line below the plugin.
    expect(lines.slug[0] ?? 0).toBeGreaterThanOrEqual(lines.plugin[0] ?? 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  });
}

test.describe("320 px", () => {
  test.use({ viewport: { width: 320, height: 760 } });

  test("a skill whose name is longer than the button breaks inside it, on lines of its own below the plugin, and copies whole", async ({ page }) => {
    const plugin = `/${longSlug.plugin}:`;
    const command = `${plugin}${longSlug.slug}`;
    await page.goto(`/plugins/${longSlug.plugin}/${longSlug.slug}`);
    const chip = page.getByRole("button", { name: `Copiar o comando ${command}` }).first();
    const lines = await commandLines(chip, plugin, longSlug.slug);
    expect(lines.fits, "the case of this test: the skill alone is longer than the button").toBe(false);
    expect(lines.plugin).toHaveLength(1);
    expect(lines.slug.length).toBeGreaterThan(1);
    expect(Math.min(...lines.slug)).toBeGreaterThan(lines.plugin[0] ?? 0);
    expect(await whole(chip.locator("span", { hasText: command }).first())).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await page.evaluate(() => {
      const copied: string[] = [];
      Object.assign(window, { copied });
      Object.defineProperty(navigator, "clipboard", { value: { writeText: (text: string) => (copied.push(text), Promise.resolve()) } });
    });
    await chip.click();
    expect(await page.evaluate(() => (window as unknown as { copied: string[] }).copied)).toEqual([command]);
  });
});

test("the names of the other skills of the plugin show whole", async ({ page }) => {
  await page.goto(`/plugins/${ofLongTitles.plugin}/${ofLongTitles.slug}`);
  const others = page.getByRole("heading", { name: "Mais do plugin" }).locator("xpath=following-sibling::ul[1]").getByRole("link");
  await expect(others.first()).toBeVisible();
  for (const link of await others.all()) {
    const title = link.locator("span").first();
    expect(await whole(title), (await title.textContent()) ?? "").toBe(true);
  }
});
