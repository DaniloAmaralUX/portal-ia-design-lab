import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { getGuide } from "../src/data/guides";
import { chaptersOf } from "../src/lib/guide-text";

async function downloadedScripts(page: Page, route: string): Promise<string[]> {
  const bodies: Promise<string>[] = [];
  page.on("response", (response) => {
    if (new URL(response.url()).pathname.endsWith(".js")) bodies.push(response.text());
  });
  await page.goto(route);
  await expect(page.locator("main h1").first()).toBeVisible();
  await page.waitForLoadState("networkidle");
  return Promise.all(bodies);
}

// A line of the chapter that no other chapter has, to look for in the scripts the page downloaded. It comes from past the start of
// the chapter: the search of the site, in the code of every page, carries the first 400 characters of each one (academy-index.ts).
const PAST_THE_EXCERPT = 1000;

function lineOf(chapterSource: string): string {
  const lines = chapterSource.slice(PAST_THE_EXCERPT).split("\n").slice(1);
  const line = lines.find((l) => l.trim().length > 60 && !l.startsWith("#") && !l.includes("`"));
  if (!line) throw new Error("The chapter has no plain line to look for.");
  return line.trim().slice(0, 60);
}

test("a chapter page downloads its own text and the text of no other chapter", async ({ page }) => {
  const guide = getGuide("compozy");
  if (!guide) throw new Error("The Compozy guide is missing.");
  const source = readFileSync(path.join(import.meta.dirname, "../src/content/guides/compozy.md"), "utf8");
  const { chapters } = chaptersOf(guide, source);
  const own = chapters.find((c) => c.id === "adocao");
  const others = chapters.filter((c) => c.id !== "adocao" && c.source.length > 2 * PAST_THE_EXCERPT);
  expect(own).toBeTruthy();
  const scripts = await downloadedScripts(page, "/metodo/compozy/adocao");
  const joined = scripts.join("\n");
  expect(joined).toContain(JSON.stringify(lineOf(own?.source ?? "")).slice(1, -1));
  for (const other of others.slice(0, 12)) {
    expect(joined, `the text of ${other.id}`).not.toContain(JSON.stringify(lineOf(other.source)).slice(1, -1));
  }
});
