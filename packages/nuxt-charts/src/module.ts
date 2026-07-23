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

  /**
   * Auto-import the shared enums/types (CurveType, LegendPosition, Orientation,
   * DonutType, BulletLegendItemInterface, MarkerConfig, CrosshairConfig,
   * AxisConfig, TooltipConfig).
   *
   * Set to `false` when running this module alongside `nuxt-charts-next` so the
   * v3 module owns those names (avoids duplicate auto-imports and nominal enum
   * type clashes). Map-specific helpers (getMap, getPin, geoMercator, the
   * TopoJSON constants, MapRegion, MapPin) are always auto-imported when
   * `autoImports` is enabled.
   * @default true
   */
  sharedImports?: boolean;
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
    sharedImports: true,
  },
  async setup(options, nuxt) {
    // Deliberately do NOT transpile vue-chrts (or @unovis/ts, @unovis/vue —
    // they already ship compiled ESM). build.transpile marks a package
    // external for client dep pre-bundling, which conflicts with listing the
    // same package in optimizeDeps.include below: esbuild aborts with
    // `The entry point "vue-chrts" cannot be marked as external`
    // (Nuxt 4.4 / Vite 7). Pre-bundling alone handles the CJS interop that
    // transpiling was meant to fix.
    //
    // Strip the entry after all modules have run, in case a layer or another
    // module added it.
    nuxt.hook("modules:done", () => {
      nuxt.options.build.transpile = nuxt.options.build.transpile.filter(
        (entry) => entry !== "vue-chrts",
      );
    });

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

      const config = viteConfig as { optimizeDeps?: { include?: string[] } };
      config.optimizeDeps ??= {};
      config.optimizeDeps.include ??= [];

      const entries = [
        "vue-chrts",
        ...(unovisTsDir ? ["@unovis/ts"] : []),
        ...(unovisVueDir ? ["@unovis/vue"] : []),
      ];

      for (const entry of entries) {
        if (!config.optimizeDeps.include.includes(entry)) {
          config.optimizeDeps.include.push(entry);
        }
      }
    });

    const { resolve } = createResolver(import.meta.url);
    const runtimePath = resolve("./runtime/vue-chrts");

    // Initialize auto-imports and components
    resolveImports(options, import.meta.url);
    resolveComponents(options, runtimePath);

    // Ensure the website (and other consumers) can resolve vue-chrts even under
    // pnpm isolation when this module is loaded alongside nuxt-charts-next.
    const vueChrtsDir = resolvePackageDir("vue-chrts");
    if (vueChrtsDir) {
      nuxt.options.alias["vue-chrts"] = vueChrtsDir;
    }
  },
});
