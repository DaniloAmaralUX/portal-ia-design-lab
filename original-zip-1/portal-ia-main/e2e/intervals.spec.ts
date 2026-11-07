import { existsSync, readdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

const folder = new URL("../src/content/intervals/", import.meta.url);
const published = existsSync(folder) ? readdirSync(folder).filter((name) => name.endsWith(".md")).length : 0;

test("the Academy menu leads to the technical breaks", async ({ page }) => {
  await page.goto("/academy");
  await page.getByRole("navigation", { name: "Academy" }).getByRole("link", { name: "Intervalos técnicos" }).click();
  await expect(page).toHaveURL(/\/academy\/intervalos$/);
  await expect(page.getByRole("heading", { level: 1, name: "Intervalos técnicos" })).toBeVisible();
});

test("the page lists one card for each break published, or says none is", async ({ page }) => {
  await page.goto("/academy/intervalos");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  if (published === 0) {
    await expect(page.getByText("Nenhum intervalo técnico publicado ainda")).toBeVisible();
  } else {
    await expect(page.locator("main ul > li > a[href^='/academy/intervalos/']")).toHaveCount(published);
  }
});

test("a break that does not exist opens the error page", async ({ page }) => {
  await page.goto("/academy/intervalos/esse-intervalo-nao-existe");
  await expect(page.locator("[data-error-page]")).toBeVisible();
});

test("outside Edge, a break offers its recording in SharePoint, the one SharePoint the policy lets in", async ({ page }) => {
  const response = await page.goto("/academy/intervalos/comparativo-de-ferramentas-de-sdd");
  const frameSource = /frame-src ([^;]+)/.exec(response?.headers()["content-security-policy"] ?? "")?.[1]?.trim();
  await expect(page.getByRole("heading", { level: 1, name: "Comparativo de ferramentas de SDD" })).toBeVisible();
  const frame = page.locator("main iframe");
  await expect(frame).toHaveCount(0);
  const video = await page.getByRole("link", { name: /Assistir no SharePoint/ }).getAttribute("href");
  expect(frameSource).toBe("https://pitangconsult-my.sharepoint.com");
  expect(video?.startsWith(`${frameSource}/`)).toBe(true);
});
