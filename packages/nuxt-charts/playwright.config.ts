import { defineConfig, devices } from "@playwright/test";

// Two modes, same specs:
//   dev  - exercises the module's optimizeDeps/transpile setup, which only
//          runs during Vite pre-bundling.
//   prod - exercises `nuxt build` output, a different module graph that can
//          break (bad externals, missing SSR deps) while dev is green.
const mode = process.env.NUXT_CHARTS_E2E_MODE === "prod" ? "prod" : "dev";
const port = process.env.NUXT_CHARTS_E2E_PORT ?? (mode === "prod" ? "3211" : "3210");
const baseURL = `http://127.0.0.1:${port}`;

const command =
  mode === "prod"
    ? `pnpm nuxi build playground && node playground/.output/server/index.mjs`
    : `pnpm nuxi dev playground --host 127.0.0.1 --port ${port}`;

export default defineConfig({
  testDir: "./e2e",
  outputDir: `test-results/${mode}`,
  workers: 1,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "off",
    video: "off",
    screenshot: "only-on-failure",
  },
  webServer: {
    command,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    // The prod run builds before serving, so it needs a longer runway.
    timeout: mode === "prod" ? 300_000 : 120_000,
    env: { HOST: "127.0.0.1", PORT: port, NITRO_PORT: port },
  },
  projects: [{ name: `chromium-${mode}`, use: { ...devices["Desktop Chrome"] } }],
});
