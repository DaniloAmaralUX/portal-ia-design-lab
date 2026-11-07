import { expect, test } from "@playwright/test";

test("the skill's .md includes its SKILL.md and what it does in the project", async ({ request }) => {
  const response = await request.get("/plugins/pr-review/pg-revisar-seguranca.md");
  expect(response.headers()["content-type"]).toContain("text/markdown");
  const text = await response.text();
  expect(text).toContain("## O que ela faz no seu projeto");
  expect(text).toContain("## SKILL.md");
});

test("the Markdown of a chapter and of a plugin are served from the build", async ({ request }) => {
  const chapter = await request.get("/metodo/compozy/adocao.md");
  expect(chapter.status()).toBe(200);
  expect(await chapter.text()).toMatch(/^# SDD na prática/);
  const plugin = await request.get("/plugins/pr-review.md");
  expect(plugin.headers()["content-type"]).toContain("text/markdown");
});

test("llms.txt and the JSON catalog are not served any more", async ({ request }) => {
  expect((await request.get("/llms.txt")).status()).toBe(404);
  expect((await request.get("/catalogo.json")).status()).toBe(404);
});
