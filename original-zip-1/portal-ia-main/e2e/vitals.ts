import { expect, type Page } from "@playwright/test";

export const MAX_LCP_MS = 2500;
export const MAX_CLS = 0.1;

export type Vitals = { lcp: number; cls: number };

// The profile the vitals are measured in, Lighthouse's desktop throttling (40 ms of round trip and 10 Mbps each way, with no CPU
// slowdown): the portal is opened on the laptops of the company. Without a fixed profile the number is only the speed of whatever
// machine runs the test. CDP applies it to the network of the tab.
export const PROFILE = { cpuSlowdown: 1, latencyMs: 40, downloadKbps: 10240, uploadKbps: 10240 } as const;
// An average phone on the same network: the CPU four times slower, as the DevTools and the mobile run of Lighthouse slow it down.
export const PHONE_PROFILE = { ...PROFILE, cpuSlowdown: 4 } as const;

export type Profile = typeof PROFILE | typeof PHONE_PROFILE;

async function throttle(page: Page, profile: Profile) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: profile.cpuSlowdown });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: profile.latencyMs,
    downloadThroughput: (profile.downloadKbps * 1024) / 8,
    uploadThroughput: (profile.uploadKbps * 1024) / 8,
  });
}

async function observe(page: Page) {
  await page.addInitScript(() => {
    const vitals = { lcp: 0, cls: 0 };
    Object.assign(window, { __vitals: vitals });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) vitals.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
        if (!entry.hadRecentInput) vitals.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
}

export async function measure(page: Page, route: string, options: { profile?: Profile } = {}): Promise<Vitals> {
  if (options.profile) await throttle(page, options.profile);
  await observe(page);
  await page.goto(route);
  await expect(page.locator("main h1").first()).toBeVisible();
  await page.waitForLoadState("networkidle");
  // The metrics keep arriving for a moment after the load, and the CLS counts until the person acts.
  await page.waitForTimeout(1500);
  return page.evaluate(() => (window as unknown as { __vitals: Vitals }).__vitals);
}

