import { defineNuxtModule } from "@nuxt/kit";
import { resolveComponents, resolveImports } from "./core";

export interface ModuleOptions {
  /**
   * Prefix for component names.
   * @default ''
   */
  prefix?: string;

  /**
   * Register components globally (no explicit import needed in templates).
   * @default true
   */
  global?: boolean;

  /**
   * Auto-import enums and types.
   * @default true
   */
  autoImports?: boolean;

  /**
   * Components to include. Empty means all.
   * @default []
   */
  include?: string[];
}

/**
 * Entries Vite should pre-bundle into ESM.
 *
 * `vccs` ships ESM but pulls in CJS deps (notably `eventemitter3`) via deep
 * default imports. Pre-bundling `vccs` itself converts those to ESM. The
 * `vccs > eventemitter3` deep notation explicitly forces the problematic
 * transitive dep — listing `eventemitter3` on its own would fail to resolve
 * under pnpm strict isolation (it isn't in the consumer's root).
 */
const VCCS_DEPS = ["vccs", "motion-v", "vccs > eventemitter3"];

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
  setup(options, nuxt) {
    // Deliberately do NOT add vccs to build.transpile. Transpiling it makes
    // Vite serve its ESM (and its raw CJS deps like eventemitter3) directly via
    // @fs URLs, which breaks the `import EventEmitter from 'eventemitter3'`
    // default-import under ESM. Pre-bundling via optimizeDeps (below) is what
    // converts those CJS deps to interop-safe ESM instead.

    // Force Vite to pre-bundle vccs and its CJS transitive deps into ESM.
    // Done via vite:extendConfig (client only) because Nuxt 4 / Vite 6
    // environment configs override base nuxt.options.vite.optimizeDeps.
    nuxt.hook("vite:extendConfig", (viteConfig, { isClient }) => {
      if (!isClient) return;
      // `optimizeDeps` is typed read-only on the resolved config; mutate the
      // include list in place (creating it once via a writable view if absent).
      const config = viteConfig as { optimizeDeps?: { include?: string[] } };
      config.optimizeDeps ??= {};
      config.optimizeDeps.include ??= [];
      const include = config.optimizeDeps.include;
      for (const dep of VCCS_DEPS) {
        if (!include.includes(dep)) include.push(dep);
      }
    });

    resolveImports(options, import.meta.url);
    resolveComponents(options, import.meta.url);
  },
});
