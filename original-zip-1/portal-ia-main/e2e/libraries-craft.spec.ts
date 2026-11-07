import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("the mode tabs work by keyboard and preserve an unfinished search", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("textbox", { name: "O que você precisa fazer?" });
  await search.fill("documentar API");
  const explore = page.getByRole("tab", { name: "Explorar", exact: true });
  await explore.focus();
  await explore.press("ArrowRight");
  const install = page.getByRole("tab", { name: "Instalar", exact: true });
  await expect(install).toBeFocused();
  await expect(install).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { name: "Instale uma vez. Depois, é só pedir." })).toBeVisible();
  await expect(search).toHaveCount(0);
  await install.press("Home");
  await expect(explore).toBeFocused();
  await expect(search).toHaveValue("documentar API");
});

test("a denied microphone never prevents searching or starts a fake recording", async ({ page }) => {
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException("Denied for test", "NotAllowedError"));
  });
  await page.goto("/");
  const mic = page.getByRole("button", { name: "Visualizar microfone", exact: true });
  await expect(mic).toHaveAttribute("aria-pressed", "false");
  await mic.click();
  await expect(page.getByRole("status").filter({ hasText: "Microfone bloqueado" })).toBeVisible();
  await expect(mic).toHaveAttribute("aria-pressed", "false");
  const search = page.getByRole("textbox", { name: "O que você precisa fazer?" });
  await search.fill("revisar");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/explorar\?q=revisar$/);
});

test("the microphone starts only on request and releases its stream when the mode changes", async ({ page }) => {
  await page.addInitScript(() => {
    const state = { requests: 0, streams: [] as MediaStream[] };
    Object.assign(window, { microphoneTest: state });
    navigator.mediaDevices.getUserMedia = () => {
      state.requests++;
      const audio = new AudioContext();
      const destination = audio.createMediaStreamDestination();
      const oscillator = audio.createOscillator();
      oscillator.connect(destination);
      oscillator.start();
      state.streams.push(destination.stream);
      return Promise.resolve(destination.stream);
    };
  });
  await page.goto("/");
  const state = () => page.evaluate(() => {
    const testState = (window as unknown as { microphoneTest: { requests: number; streams: MediaStream[] } }).microphoneTest;
    return { requests: testState.requests, tracks: testState.streams.flatMap((s) => s.getTracks().map((t) => t.readyState)) };
  });
  expect(await state()).toEqual({ requests: 0, tracks: [] });
  await page.getByRole("button", { name: "Visualizar microfone", exact: true }).click();
  await expect(page.getByRole("button", { name: "Parar visualização do microfone", exact: true })).toHaveAttribute("aria-pressed", "true");
  expect(await state()).toEqual({ requests: 1, tracks: ["live"] });
  await page.getByRole("tab", { name: "Instalar", exact: true }).click();
  await expect.poll(state).toEqual({ requests: 1, tracks: ["ended"] });
  await page.getByRole("tab", { name: "Explorar", exact: true }).click();
  await expect(page.getByRole("button", { name: "Visualizar microfone", exact: true })).toHaveAttribute("aria-pressed", "false");
  expect(await state()).toEqual({ requests: 1, tracks: ["ended"] });
});

test("collapsing a row removes its controls from the focus order immediately", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Instalar", exact: true }).click();
  const first = page.getByRole("button", { name: "01 Adicione o marketplace", exact: true });
  await first.focus();
  const panel = page.locator(`[id="${await first.getAttribute("aria-controls")}"]`);
  await first.press("Enter");
  await expect(first).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toHaveAttribute("inert", "");
  await expect(first).toBeFocused();
  await first.press("Tab");
  await expect(page.getByRole("button", { name: "02 Instale o plugin da sua área", exact: true })).toBeFocused();
});

test("the desktop shell follows the measured reference grid", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const rail = await page.getByRole("navigation", { name: "Navegação do portal", exact: true }).boundingBox();
  const content = await page.locator(".library-content").boundingBox();
  expect(rail?.width).toBe(200);
  expect(Math.round((content?.x ?? 0) - (rail?.x ?? 0) - (rail?.width ?? 0))).toBe(56);
  const item = page.getByRole("navigation", { name: "Navegação do portal", exact: true }).getByRole("link", { name: "Skills", exact: true });
  await item.hover();
  const highlight = item.locator("..").locator('[data-slot="fluid-hover-highlight"]');
  await expect(highlight).toBeVisible();
  await expect.poll(async () => {
    const target = await item.boundingBox();
    const shown = await highlight.boundingBox();
    return Math.abs((target?.x ?? -1000) - (shown?.x ?? 1000)) + Math.abs((target?.width ?? -1000) - (shown?.width ?? 1000));
  }).toBeLessThan(1);
});

test("the redesigned home stays accessible and fits narrow screens in both themes", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const dark of [false, true]) {
      await page.evaluate((next) => { localStorage.setItem("theme", next ? "dark" : "light"); }, dark);
      await page.reload();
      await expect(page.getByRole("heading", { name: "Portal IA", exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      const result = await new AxeBuilder({ page }).analyze();
      expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    }
  }
  expect(errors).toEqual([]);
});
