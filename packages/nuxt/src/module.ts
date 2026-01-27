import { defineNuxtModule, createResolver } from "@nuxt/kit";
import { resolveComponents, resolveImports } from "./core";

export interface ModuleOptions {
  /**
   * Prefix for component names
   * @default ''
   */
  prefix?: string;

  /**
   * Register global components
   * @default true
   */
  global?: boolean;

  /**
   * Use auto-imports (recommended)
   * @default true
   */
  autoImports?: boolean;

  /**
   * Components to include (empty array means all components)
   * @default []
   */
  include?: string[];
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-charts",
    configKey: "nuxtCharts",
    compatibility: {
      nuxt: ">=3",
    },
  },
  defaults: {
    prefix: "",
    global: true,
    autoImports: true,
    include: [],
  },
  hooks: {
    "vite:extendConfig": (config, { isClient }) => {
      if (isClient) {
        const _config = config as any;
        // 1. Ensure the SSR flag is explicitly false for the client build
        // This addresses the "we should not pass ssr in the client config" comment
        _config.build = _config.build || {};
        _config.ssr = false;

        // 2. The other half of the PR fix: Force-optimize the problematic CJS deps
        _config.optimizeDeps = _config.optimizeDeps || {};
        _config.optimizeDeps.include = _config.optimizeDeps.include || [];

        const cjsDeps = ["to-px", "vue-chrts"];

        for (const dep of cjsDeps) {
          if (!_config.optimizeDeps.include.includes(dep)) {
            _config.optimizeDeps.include.push(dep);
          }
        }
      }
    },
  },
  async setup(options, nuxt) {
    const deps = ["vue-chrts", "to-px"];

    // Transpile ESM dependencies
    nuxt.options.build.transpile = nuxt.options.build.transpile || [];
    nuxt.options.build.transpile.push(...deps);

    // Force bundle SSR-breaking dependencies to be processed by Vite
    nuxt.options.vite.ssr = nuxt.options.vite.ssr || {};
    nuxt.options.vite.ssr.noExternal = nuxt.options.vite.ssr.noExternal || [];
    if (Array.isArray(nuxt.options.vite.ssr.noExternal)) {
      nuxt.options.vite.ssr.noExternal.push(...deps);
    }

    const { resolve } = createResolver(import.meta.url);
    const runtimePath = resolve("./runtime/vue-chrts");

    // Initialize auto-imports and components
    resolveImports(options, runtimePath);
    resolveComponents(options, runtimePath);
  },
});
