import { defineNuxtModule, createResolver, addVitePlugin } from "@nuxt/kit";
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
    const deps = [
      "vue-chrts",
      "@unovis/ts",
      "@unovis/vue",
      "d3-geo",
      "proj4",
      "@turf/boolean-point-in-polygon"
    ];

    // Optimize dependencies for Vite
    addVitePlugin(() => ({
      name: "nuxt-charts:config",
      configEnvironment(name, config) {
        if (name === "client") {
          config.optimizeDeps = config.optimizeDeps || {};
          config.optimizeDeps.include = config.optimizeDeps.include || [];
          config.optimizeDeps.include.push(...deps);
        } else if (name === "server") {
          config.ssr = config.ssr || {};
          config.ssr.noExternal = config.ssr.noExternal || [];
          if (Array.isArray(config.ssr.noExternal)) {
            config.ssr.noExternal.push(...deps);
          }
        }
      },
      // Fallback for Vite 5/4
      config(config) {
        config.optimizeDeps = config.optimizeDeps || {};
        config.optimizeDeps.include = config.optimizeDeps.include || [];
        deps.forEach((dep) => {
          if (!config.optimizeDeps!.include!.includes(dep)) {
            config.optimizeDeps!.include!.push(dep);
          }
        });

        config.ssr = config.ssr || {};
        config.ssr.noExternal = config.ssr.noExternal || [];
        if (Array.isArray(config.ssr.noExternal)) {
          deps.forEach((dep) => {
            if (!config.ssr!.noExternal!.includes(dep)) {
              (config.ssr!.noExternal as string[]).push(dep);
            }
          });
        }
      },
    }));

    const { resolve } = createResolver(import.meta.url);
    const runtimePath = resolve("./runtime/vue-chrts");

    // Initialize auto-imports and components
    resolveImports(options, runtimePath);
    resolveComponents(options, runtimePath);
  },
});
