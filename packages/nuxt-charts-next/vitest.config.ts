import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

// The Vue plugin is needed so component tests can import `.vue` SFCs directly;
// the pure-utility tests do not depend on it.
export default defineConfig({
  plugins: [vue()],
});
