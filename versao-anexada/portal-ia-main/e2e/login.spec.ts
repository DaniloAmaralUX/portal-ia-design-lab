import { readdirSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { INTRO_SEEN_KEY } from "../src/shared/intro";
import { LOGIN_SCREEN } from "./session";

test.use({ storageState: { cookies: [], origins: [] } });

test("any page leads to the login screen, without its content", async ({ page }) => {
  for (const route of ["/", "/academy/trilhas/engenharia", "/metodo/sdd", "/plugins/pr-review", "/nao-existe"]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    const url = new URL(page.url());
    expect(url.pathname, route).toBe("/entrar");
    expect(url.searchParams.get("volta"), route).toBe(route);
    await expect(page.getByRole("heading", LOGIN_SCREEN)).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Principal" })).toHaveCount(0);
  }
});

test("no portal file or data is served without a login", async ({ request }) => {
  const zip = readdirSync("dist/client/downloads").find((name) => name.endsWith(".zip"));
  const js = readdirSync("dist/client/assets").find((name) => name.endsWith(".js"));
  for (const path of ["/metodo/sdd.md", "/academy/index.html", `/downloads/${zip}`, `/assets/${js}`]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(401);
    expect(await response.text(), path).toContain("Entre com a conta Microsoft da Pitang");
  }
});

test("/api/me answers 401 without a session", async ({ request }) => {
  const response = await request.get("/api/me");
  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ error: "unauthenticated" });
});

test("a missing public file gets a plain 404, not the app shell", async ({ request }) => {
  const response = await request.get("/assets/missing-font.woff2");
  expect(response.status()).toBe(404);
  expect(await response.text()).not.toContain("<nav");
});

test("logging in returns to the page the person asked for", async ({ page }) => {
  await page.goto("/metodo/sdd");
  await page.getByRole("link", { name: "Entrar com a Microsoft" }).click();
  await expect(page).toHaveURL(/\/metodo\/sdd$/);
  await expect(page.locator("main h1").first()).toContainText("SDD");
});

test("the opening of the site plays once in the tab, and again after a new sign-in", async ({ page }) => {
  // Read before the site runs: the mark decides the opening before the first paint, and the site sets it on the page later.
  await page.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      const root = document.documentElement;
      root.dataset.loadedWith = "introSeen" in root.dataset ? "no-opening" : "opening";
    });
  });
  const loadedWith = (value: string) => expect(page.locator("html")).toHaveAttribute("data-loaded-with", value);
  await page.goto("/");
  await page.getByRole("link", { name: "Entrar com a Microsoft" }).click();
  await expect(page.locator("main h1").first()).toBeVisible();
  await loadedWith("opening");
  await expect.poll(() => page.evaluate((key) => sessionStorage.getItem(key), INTRO_SEEN_KEY)).not.toBeNull();
  await page.reload();
  await loadedWith("no-opening");
  await page.getByRole("button", { name: "Conta de Test Person" }).click();
  await page.locator("#account-menu").getByRole("button", { name: "Sair" }).click();
  await page.getByRole("link", { name: "Entrar com a Microsoft" }).click();
  await expect(page.locator("main h1").first()).toBeVisible();
  await loadedWith("opening");
});

test("the login screen runs only its own script and cannot be framed by another site", async ({ page }) => {
  const response = await page.goto("/");
  const policy = response?.headers()["content-security-policy"] ?? "";
  expect(policy).toContain("default-src 'none'");
  expect(policy).toContain("frame-ancestors 'none'");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  const nonce = /script-src 'nonce-([^']+)'/.exec(policy)?.[1];
  expect(await page.locator("script").evaluateAll((s) => s.map((el) => el.nonce))).toEqual([nonce]);
});

test("the theme chosen on the login screen carries over to the site", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
  expect(await isDark()).toBe(true);
  await page.getByRole("button", { name: "Usar tema claro" }).click();
  expect(await isDark()).toBe(false);
  await expect(page.getByRole("button", { name: "Usar tema escuro" })).toBeVisible();
  await page.getByRole("link", { name: "Entrar com a Microsoft" }).click();
  await expect(page.locator("main h1").first()).toBeVisible();
  expect(await isDark()).toBe(false);
});

for (const theme of ["light", "dark"] as const) {
  test(`the login screen passes axe in the ${theme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByRole("heading", LOGIN_SCREEN)).toBeVisible();
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
  });
}
