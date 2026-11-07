import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ["src/**/*.test.ts", "bff/**/*.test.ts", "scripts/**/*.test.ts"],
      environment: "node",
      // The tests that run git, the generator of the skills and the zips take more than the default 5 s on a Windows machine.
      testTimeout: 30_000,
    },
  }),
);
