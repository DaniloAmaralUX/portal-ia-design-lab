import { expect, test } from "@playwright/test";

test("hashed assets come precompressed and cached for a year", async ({ request }) => {
  const home = await (await request.get("/")).text();
  const script = /<script[^>]* src="(\/assets\/[^"]+\.js)"/.exec(home)?.[1];
  expect(script).toBeTruthy();
  const response = await request.get(script ?? "", { headers: { "accept-encoding": "br" } });
  expect(response.status()).toBe(200);
  expect(response.headers()["content-encoding"]).toBe("br");
  expect(response.headers()["cache-control"]).toBe("private, max-age=31536000, immutable");
});

test("every script of a page carries the nonce the policy names", async ({ request }) => {
  const response = await request.get("/", { headers: { accept: "text/html" } });
  const nonce = /script-src [^;]*'nonce-([^']+)'/.exec(response.headers()["content-security-policy"] ?? "")?.[1];
  const html = await response.text();
  expect(nonce).toBeTruthy();
  expect([...html.matchAll(/<script(?![^>]*\bnonce=)/g)]).toHaveLength(0);
  expect([...html.matchAll(/<script[^>]* nonce="([^"]+)"/g)].every((m) => m[1] === nonce)).toBe(true);
});

test("a plugin file in the acervo comes out as it is in the build, without a nonce", async ({ request }) => {
  const response = await request.get("/acervo/technical-documentation/skills/pg-create-api-doc/template.html");
  expect(response.status()).toBe(200);
  expect(await response.text()).not.toContain("nonce=");
  expect(response.headers()["content-security-policy"]).toBe("sandbox; default-src 'none'");
});

test("a page of the site keeps its own policy, with the base-uri closed", async ({ request }) => {
  const policy = (await request.get("/", { headers: { Accept: "text/html" } })).headers()["content-security-policy"] ?? "";
  expect(policy).toContain("base-uri 'none'");
  expect(policy).not.toContain("sandbox");
});

test("the Markdown versions of the pages are served as Markdown", async ({ request }) => {
  const response = await request.get("/plugins/pr-review.md");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("text/markdown; charset=utf-8");
});
