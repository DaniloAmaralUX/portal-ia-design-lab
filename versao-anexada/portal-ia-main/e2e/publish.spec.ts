import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// The test account is in the list of who publishes (e2e/test-server.ts). The person outside it is /api/me answering canPublish false.
const VIDEO = "https://pitangconsult-my.sharepoint.com/personal/x/_layouts/15/embed.aspx?UniqueId=abc&embed=%7B%7D";
const EMBED = `<iframe src="${VIDEO.replace("&", "&amp;")}" width="640" height="360" title="Gravação"></iframe>`;

async function passesAxe(page: Page) {
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
}

test("the account menu leads who publishes to the two forms", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Conta de Test Person" }).click();
  await page.locator("#account-menu").getByRole("link", { name: "Publicar no Academy" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Publicar no Academy" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Intervalo técnico/ })).toHaveAttribute("href", "/publicar/intervalo-tecnico");
  await expect(page.getByRole("link", { name: /Aula de treinamento/ })).toHaveAttribute("href", "/publicar/treinamento");
  await passesAxe(page);
});

test("the form of a break marks what is missing, then sends and, with no GitLab on the server, hands the file to copy", async ({ page }) => {
  await page.goto("/publicar/intervalo-tecnico");
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByText("Corrija os 6 campos marcados.")).toBeVisible();
  await expect(page.getByLabel("Título", { exact: true })).toBeFocused();
  await passesAxe(page);

  await page.getByLabel("Título", { exact: true }).fill("Revisão de PR com o pr-review");
  await expect(page.getByLabel("Endereço da página")).toHaveValue("revisao-de-pr-com-o-pr-review");
  await page.getByLabel("Data da gravação").fill("2026-10-20");
  await page.getByLabel("Resumo", { exact: true }).fill("As seis revisões de PR, uma por ângulo.");
  await page.getByLabel("Gravação", { exact: true }).fill(EMBED);
  await page.getByLabel("Texto da página").fill("## A pauta\n\n- O ângulo de segurança.");
  await page.getByLabel("Área").selectOption("engenharia");
  await page.getByRole("button", { name: "Enviar" }).click();

  await expect(page.getByRole("heading", { name: "O envio automático não está ligado" })).toBeFocused();
  await expect(page.getByText("src/content/intervals/revisao-de-pr-com-o-pr-review.md")).toBeVisible();
  const file = page.locator("section[aria-labelledby='send-result'] pre");
  await expect(file).toContainText(`video: ${VIDEO}`);
  await expect(file).toContainText("area: engenharia");
});

test("the tab Visualizar draws the text as the page of the break will, and Escrever brings the text back", async ({ page }) => {
  await page.goto("/publicar/intervalo-tecnico");
  await page.getByLabel("Texto da página").fill("## A pauta\n\n- O ângulo de **segurança**.");
  await page.getByRole("tab", { name: "Visualizar" }).click();
  const preview = page.getByRole("tabpanel", { name: "Visualizar" });
  await expect(preview.getByRole("heading", { level: 2, name: "A pauta" })).toBeVisible();
  await expect(preview.locator("li strong")).toHaveText("segurança");
  await expect(page.getByLabel("Texto da página")).toBeHidden();
  await passesAxe(page);
  await page.getByRole("tab", { name: "Visualizar" }).press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Escrever" })).toBeFocused();
  await expect(page.getByLabel("Texto da página")).toHaveValue("## A pauta\n\n- O ângulo de **segurança**.");
});

test("a long text scrolls inside the tab Visualizar, as it does inside the field", async ({ page }) => {
  await page.goto("/publicar/intervalo-tecnico");
  await page.getByLabel("Texto da página").fill(Array.from({ length: 40 }, (_, i) => `- Item ${i + 1} da pauta.`).join("\n"));
  await page.getByRole("tab", { name: "Visualizar" }).click();
  const preview = page.getByRole("tabpanel", { name: "Visualizar" });
  expect(await preview.evaluate((el) => el.scrollHeight > el.clientHeight && getComputedStyle(el).overflowY === "auto")).toBe(true);
});

test("the form of a break refuses an address that another break has", async ({ page }) => {
  await page.goto("/publicar/intervalo-tecnico");
  await page.getByLabel("Endereço da página").fill("comparativo-de-ferramentas-de-sdd");
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByText("Já existe um intervalo com este endereço. Escolha outro.")).toBeVisible();
});

test("a lesson of a course that exists is its next number, and a new course writes its course.md too", async ({ page }) => {
  await page.goto("/publicar/treinamento");
  await expect(page.getByText(/^Esta será a aula \d+ de Claude Cowork\.$/)).toBeVisible();
  await page.getByLabel("Treinamento", { exact: true }).selectOption({ label: "Um treinamento novo" });
  await page.getByLabel("Nome do treinamento").fill("Claude Code na prática");
  await expect(page.getByText("Esta será a aula 1 de Claude Code na prática.")).toBeVisible();
  await page.getByLabel("Resumo do treinamento").fill("Duas aulas de Claude Code para engenharia.");
  await page.getByLabel("Título da aula").fill("Aula 1");
  await page.getByLabel("Data da gravação").fill("2026-10-22");
  await page.getByLabel("Resumo", { exact: true }).fill("A primeira aula.");
  await page.getByLabel("Gravação", { exact: true }).fill(VIDEO);
  await page.getByLabel("Texto da página").fill("O que a aula mostrou.");
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByRole("heading", { name: "O envio automático não está ligado" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Os arquivos" })).toBeVisible();
  await expect(page.getByText("src/content/trainings/claude-code-na-pratica/course.md")).toBeVisible();
  await expect(page.getByText("src/content/trainings/claude-code-na-pratica/1.md")).toBeVisible();
  await passesAxe(page);
});

test("who is not on the list sees no form, and the menu has no link to publish", async ({ page }) => {
  await page.route("**/api/me", (route) => route.fulfill({ json: { name: "Test Person", email: "test.person@pitang.com", canPublish: false } }));
  await page.goto("/publicar/intervalo-tecnico");
  await expect(page.getByText("Esta página é de quem publica no Academy")).toBeVisible();
  await expect(page.getByRole("button", { name: "Enviar" })).toHaveCount(0);
  await page.getByRole("button", { name: "Conta de Test Person" }).click();
  await expect(page.locator("#account-menu").getByRole("link", { name: "Publicar no Academy" })).toHaveCount(0);
});

test("every field of the forms is at least 16px, so the iPhone does not zoom in on focus", async ({ page }) => {
  await page.goto("/publicar/intervalo-tecnico");
  const sizes = await page.locator("main").locator("input, textarea, select").evaluateAll((els) => els.map((el) => [el.id, parseFloat(getComputedStyle(el).fontSize)]));
  expect(sizes.length).toBeGreaterThan(6);
  expect(sizes.filter(([, size]) => (size as number) < 16)).toEqual([]);
});

test("nothing is sent before the person sends, and a form with problems sends nothing", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/publish", (route) => {
    calls += 1;
    return route.fulfill({ status: 202, json: { status: "queued" } });
  });
  await page.goto("/publicar/intervalo-tecnico");
  await page.getByLabel("Título", { exact: true }).fill("Revisão de PR");
  await expect(page.locator("section[aria-labelledby='send-result']")).toHaveCount(0);
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByText(/Corrija os \d+ campos marcados\./)).toBeVisible();
  expect(calls).toBe(0);
});

test("the block of a new course opens by height and stays out of the tab order and the reader while closed", async ({ page }) => {
  await page.goto("/publicar/treinamento");
  const block = page.locator("fieldset", { hasText: "O treinamento novo" });
  const height = () => block.evaluate((el) => el.getBoundingClientRect().height);
  expect(await block.evaluate((el) => el.closest("[inert]") !== null)).toBe(true);
  await page.getByLabel("Treinamento", { exact: true }).selectOption({ label: "Um treinamento novo" });
  await expect(page.getByRole("textbox", { name: "Nome do treinamento" })).toBeVisible();
  expect(await block.evaluate((el) => el.closest("[inert]") !== null)).toBe(false);
  expect(await height()).toBeGreaterThan(200);
  await page.getByLabel("Treinamento", { exact: true }).selectOption({ index: 0 });
  expect(await block.evaluate((el) => el.closest("[inert]") !== null)).toBe(true);
});

test("with reduced motion the block of a new course has no transition to wait for", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/publicar/treinamento");
  const wrapper = page.locator("fieldset", { hasText: "O treinamento novo" }).locator("xpath=ancestor::div[contains(@class,'grid')][1]");
  expect(parseFloat(await wrapper.evaluate((el) => getComputedStyle(el).transitionDuration))).toBeLessThan(0.001);
});

async function fillInterval(page: Page) {
  await page.goto("/publicar/intervalo-tecnico");
  await page.getByLabel("Título", { exact: true }).fill("Revisão de PR");
  await page.getByLabel("Data da gravação").fill("2026-10-20");
  await page.getByLabel("Resumo", { exact: true }).fill("As seis revisões.");
  await page.getByLabel("Gravação", { exact: true }).fill(VIDEO);
  await page.getByLabel("Texto da página").fill("O que foi mostrado.");
}

test("Enviar sends the request with the header of the BFF, tells it went to analysis, with no link to the GitLab, and publishes another from an empty form", async ({ page }) => {
  let seen: { header: string | undefined; body: unknown } | null = null;
  await page.route("**/api/publish", async (route) => {
    seen = { header: route.request().headers()["x-portal"], body: route.request().postDataJSON() as unknown };
    await route.fulfill({ status: 202, json: { status: "queued" } });
  });
  await fillInterval(page);
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByRole("heading", { name: "Solicitação enviada para análise" })).toBeFocused();
  await expect(page.getByText("Sua solicitação foi enviada para análise.")).toBeVisible();
  await expect(page.getByRole("link", { name: /Merge Request/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Enviar", exact: true })).toHaveCount(0);
  expect(seen).toMatchObject({ header: "publish", body: { kind: "interval", draft: { slug: "revisao-de-pr", title: "Revisão de PR", area: "" } } });
  await passesAxe(page);
  await page.getByRole("button", { name: "Publicar outro" }).click();
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue("");
  await expect(page.getByRole("button", { name: "Enviar", exact: true })).toBeVisible();
});

test("Enviar shows what the BFF refused with no file to copy, and keeps the file to copy when the server failed", async ({ page }) => {
  await page.route("**/api/publish", (route) => route.fulfill({ status: 409, json: { error: "conflict", message: "Já existe um conteúdo com este endereço. Escolha outro endereço, ou outro número de aula." } }));
  await fillInterval(page);
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByRole("heading", { name: "Não foi possível enviar a solicitação" })).toBeFocused();
  await expect(page.getByText("Já existe um conteúdo com este endereço.")).toBeVisible();
  await expect(page.locator("section[aria-labelledby='send-result'] pre")).toHaveCount(0);

  await page.unroute("**/api/publish");
  await page.route("**/api/publish", (route) => route.fulfill({ status: 502, json: { error: "upstream", message: "Não foi possível enviar a solicitação agora. Tente de novo, ou copie o arquivo e mande para o time do portal." } }));
  await page.getByRole("button", { name: "Enviar" }).click();
  await expect(page.getByText("Não foi possível enviar a solicitação agora.")).toBeVisible();
  await expect(page.locator("section[aria-labelledby='send-result'] pre")).toContainText("title: Revisão de PR");
});
