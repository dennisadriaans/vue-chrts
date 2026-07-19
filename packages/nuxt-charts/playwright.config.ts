import { defineConfig, devices } from "@playwright/test";

const port = process.env.NUXT_CHARTS_E2E_PORT ?? "3210";
const baseURL = `http://127.0.0.1:${port}`;

// The dev server is the system under test: it exercises the module's
// optimizeDeps/transpile setup, which only runs during Vite pre-bundling.
export default defineConfig({
  testDir: "./e2e",
  outputDir: "test-results",
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
    command: `pnpm nuxi dev playground --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
