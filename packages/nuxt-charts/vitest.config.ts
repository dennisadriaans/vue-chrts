import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Playwright owns e2e/; run it with `pnpm test:e2e`.
    exclude: ["e2e/**", "node_modules/**", "dist/**", "playground/**"],
    passWithNoTests: true,
  },
});
