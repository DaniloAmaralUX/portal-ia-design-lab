import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { chaptersOf } from "../src/lib/guide-text";
import { getGuide } from "../src/data/guides";

const guide = getGuide("compozy");
if (!guide) throw new Error("The Compozy guide is missing.");
const source = readFileSync(path.join(import.meta.dirname, "../src/content/guides/compozy.md"), "utf8");
const chapter = chaptersOf(guide, source).chapters.find((c) => c.id === "adocao");
if (!chapter) throw new Error("The adocao chapter is missing.");

test("every heading id a chapter writes in the source ends up on the page", async ({ page }) => {
  const ids = [...chapter.source.matchAll(/\{#([\w-]+)\}\s*$/gm)].map((m) => m[1] ?? "");
  expect(ids.length).toBeGreaterThan(0);
  await page.goto("/metodo/compozy/adocao");
  await expect(page.locator("main h1").first()).toBeVisible();
  for (const id of ids) await expect(page.locator(`[id="${id}"]`), id).toHaveCount(1);
  await expect(page.getByText("{#")).toHaveCount(0);
});

test("an acronym shows what it means on hover", async ({ page }) => {
  await page.goto("/metodo/compozy/adocao");
  const acronym = page.locator("abbr.acronym").first();
  await acronym.scrollIntoViewIfNeeded();
  await acronym.hover();
  await expect(page.getByRole("tooltip")).toBeVisible();
});

test("the Method lists the SDD summary first and the tools beneath it, as alternatives", async ({ page }) => {
  await page.goto("/metodo");
  const tools = page.getByRole("list", { name: /Passo a passo por ferramenta/ });
  await expect(tools).toBeVisible();
  const names = await tools.getByRole("link", { name: /^Ler:/ }).evaluateAll((links) => links.map((a) => a.getAttribute("aria-label")));
  expect(names).toEqual(["Ler: SDD com Compozy", "Ler: SDD com OpenSpec", "Ler: SDD com Spec Kit"]);
  await expect(tools.getByRole("link", { name: "Ler: Guia SDD" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Ler: Guia SDD" })).toBeVisible();
});
