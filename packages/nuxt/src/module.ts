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
  moduleDependencies: {

  },
  async setup(options, nuxt) {
    const deps = ["vue-chrts", "@unovis/ts", "@unovis/vue"];

    // Optimize dependencies for Vite
    nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps || {};
    nuxt.options.vite.optimizeDeps.include = nuxt.options.vite.optimizeDeps.include || [];
    nuxt.options.vite.optimizeDeps.include.push(...deps);

    // Transpile ESM dependencies
    // nuxt.options.build.transpile = nuxt.options.build.transpile || [];
    // nuxt.options.build.transpile.push(...deps);

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
