import { createRequire } from "node:module";
import { dirname } from "node:path";
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

/**
 * Resolve the directory of a package through another package's resolution context.
 * This handles pnpm strict isolation where transitive deps aren't accessible
 * from the direct consumer's node_modules.
 */
function resolvePackageDir(
  packageName: string,
  fromPackage?: string,
): string | undefined {
  try {
    const _require = fromPackage
      ? createRequire(createRequire(import.meta.url).resolve(fromPackage))
      : createRequire(import.meta.url);
    return dirname(_require.resolve(`${packageName}/package.json`));
  } catch {
    return undefined;
  }
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
  async setup(options, nuxt) {
    // Only transpile vue-chrts itself. Do NOT transpile @unovis/ts or
    // @unovis/vue — they already ship compiled ESM. Adding them to
    // build.transpile causes Nuxt/Vite to serve their files directly via
    // @fs/ URLs instead of pre-bundling, which breaks CJS interop for
    // their transitive dependencies (striptags, d3-collection, etc.).
    if (!nuxt.options.build.transpile.includes("vue-chrts")) {
      nuxt.options.build.transpile.push("vue-chrts");
    }

    // Resolve @unovis package directories through vue-chrts.
    // In pnpm strict mode, @unovis/ts and @unovis/vue are only accessible
    // through vue-chrts's own node_modules, not from the consumer's root.
    const unovisTsDir = resolvePackageDir("@unovis/ts", "vue-chrts");
    const unovisVueDir = resolvePackageDir("@unovis/vue", "vue-chrts");

    // Register aliases so Vite (and Nuxt) can resolve @unovis packages
    // regardless of the package manager's hoisting strategy.
    if (unovisTsDir) {
      nuxt.options.alias["@unovis/ts"] = unovisTsDir;
    }
    if (unovisVueDir) {
      nuxt.options.alias["@unovis/vue"] = unovisVueDir;
    }

    // Use the vite:extendConfig hook to inject optimizeDeps directly into
    // the final Vite config. This is necessary because:
    // 1. Nuxt 4 / Vite 6 environment configs override base
    //    nuxt.options.vite.optimizeDeps with their own defaults.
    // 2. The "A > B" deep-dependency notation may be stripped by Nuxt's
    //    config preprocessor when set via nuxt.options.vite.
    //
    // Pre-bundling @unovis/ts converts all its CJS transitive deps
    // (striptags, d3-collection, throttle-debounce, etc.) to ESM
    // automatically — no need to list them individually.
    nuxt.hook("vite:extendConfig", (viteConfig, { isClient }) => {
      if (!isClient) return;

      viteConfig.optimizeDeps ??= {};
      viteConfig.optimizeDeps.include ??= [];

      const entries = [
        "vue-chrts",
        ...(unovisTsDir ? ["@unovis/ts"] : []),
        ...(unovisVueDir ? ["@unovis/vue"] : []),
      ];

      for (const entry of entries) {
        if (!viteConfig.optimizeDeps.include!.includes(entry)) {
          viteConfig.optimizeDeps.include!.push(entry);
        }
      }
    });

    const { resolve } = createResolver(import.meta.url);
    const runtimePath = resolve("./runtime/vue-chrts");

    // Initialize auto-imports and components
    resolveImports(options, runtimePath);
    resolveComponents(options, runtimePath);
  },
});
