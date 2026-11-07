import { devices, expect, test } from "@playwright/test";
import { MAX_CLS, MAX_LCP_MS, measure, PHONE_PROFILE, PROFILE } from "./vitals";

const ROUTES = ["/", "/explorar", "/metodo/compozy/adocao", "/ferramentas", "/ferramentas/catalyst-toolkit"];
const SCREENS = [
  { name: "laptop", profile: PROFILE, use: {} },
  {
    name: "phone of 375 px",
    profile: PHONE_PROFILE,
    use: { viewport: { width: 375, height: 812 }, userAgent: devices["Pixel 7"].userAgent, isMobile: true, hasTouch: true },
  },
];

// Part of npm run test:e2e, on a laptop like the ones the portal is opened on. The pipeline leaves out the tag: the pod of the shared runner times its own CPU, not the page.
for (const { name, profile, use } of SCREENS) {
  test.describe(name, () => {
    test.use(use);
    for (const route of ROUTES) {
      test(`${route} paints its biggest content within ${MAX_LCP_MS} ms and does not shift`, { tag: "@vitals" }, async ({ page }) => {
        const { lcp, cls } = await measure(page, route, { profile });
        test.info().annotations.push({ type: "vitals", description: `LCP ${Math.round(lcp)} ms, CLS ${cls.toFixed(4)}, in ${profile.cpuSlowdown}x CPU and ${profile.downloadKbps} kbps with ${profile.latencyMs} ms` });
        expect(lcp).toBeGreaterThan(0);
        expect(lcp).toBeLessThanOrEqual(MAX_LCP_MS);
        expect(cls).toBeLessThanOrEqual(MAX_CLS);
      });
    }
  });
}
