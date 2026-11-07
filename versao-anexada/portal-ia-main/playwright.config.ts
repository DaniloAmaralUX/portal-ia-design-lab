import { defineConfig, devices } from "@playwright/test";
import { SESSION_FILE } from "./e2e/session";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  // Playwright counts the cores of the machine, and in the Kubernetes pod of the runner that is the whole node, not the CPU of the
  // pod: too many browsers at once starve each other, and the tests fail on time. The Playwright docs recommend few workers in CI.
  workers: process.env.CI ? 2 : undefined,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [["list"], ["junit", { outputFile: "e2e-results.xml" }]] : "list",
  use: {
    baseURL: "http://localhost:5191",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "login", testMatch: /login\.setup\.ts/ },
    { name: "chromium", use: { ...devices["Desktop Chrome"], storageState: SESSION_FILE }, dependencies: ["login"] },
  ],
  webServer: {
    command: "node e2e/test-server.ts",
    url: "http://localhost:5191/health",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
