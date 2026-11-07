import { expect, test } from "@playwright/test";

// The site reads the text files of a skill with fetch, from /acervo, which answers with a sandbox policy: the policy of that response
// does not touch a fetch, so the file still shows in the sheet.
test("a text file of a skill opens in the sheet, though /acervo is sandboxed", async ({ page }) => {
  await page.goto("/plugins/pr-review/pg-revisar-seguranca");
  await expect(page.locator("main h1").first()).toBeVisible();
  const files = page.locator("#arquivos");
  await files.getByRole("button", { name: "Ver SKILL.md" }).click();
  const sheet = page.getByRole("dialog", { name: /SKILL\.md/ });
  await expect(sheet.locator("pre")).toContainText("name: pg-revisar-seguranca");
  await expect(sheet).not.toContainText("Não deu para ler o arquivo");
});
