import {
  addPluginTemplate,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
  hasNuxtModule,
  useLogger,
} from "@nuxt/kit";
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
/** Nuxt UI's default theme colours, used if its resolved option is unavailable. */
const DEFAULT_UI_COLORS = ["primary", "secondary", "success", "info", "warning", "error"];

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

    const { resolve } = createResolver(import.meta.url);
    const logger = useLogger("nuxt-charts");
    const nuxtUi = hasNuxtModule("@nuxt/ui");

    // Engine tokens (`--vc-*`, SVG internals) + baseline chrome. Everything is
    // in `@layer vue-chrts`, and it is *prepended* so that layer is declared
    // before Tailwind's `theme, base, components, utilities`: a later-declared
    // layer wins, so the host's utilities (the `ui` / `class` props, Nuxt UI
    // themes) always override the baseline without specificity fights.
    nuxt.options.css.unshift(
      resolve("./runtime/assets/theme.css"),
      resolve("./runtime/assets/components.css"),
    );

    // The styling seam (`runtime/config`). The runtime defaults to standalone
    // so the components also work outside Nuxt (`nuxt-charts/components`).
    // This plugin runs before any chart renders and, with Nuxt UI, hands over
    // Nuxt UI's own `tv` (so tailwind-merge config, replacer functions and
    // `appConfig.ui.tv` behave exactly as in any `U*` component), plus the
    // app config and the app's theme colour names.
    addPluginTemplate({
      filename: "nuxt-charts/plugin.mjs",
      getContents: () => {
        const ui = (nuxt.options as { ui?: { theme?: { colors?: string[] } } }).ui;
        const colors = nuxtUi ? (ui?.theme?.colors ?? DEFAULT_UI_COLORS) : [];
        return [
          `import { defineNuxtPlugin, useAppConfig } from "#app";`,
          nuxtUi ? `import { tv } from "#ui/utils/tv";` : "",
          `import { configureCharts } from ${JSON.stringify(resolve("./runtime/config"))};`,
          ``,
          `export default defineNuxtPlugin({`,
          `  name: "nuxt-charts:config",`,
          `  enforce: "pre",`,
          `  setup() {`,
          `    configureCharts({`,
          `      useAppConfig,`,
          nuxtUi ? `      tv,` : "",
          `      nuxtUi: ${nuxtUi},`,
          `      themeColors: ${JSON.stringify(colors)},`,
          `    });`,
          `  },`,
          `});`,
        ].filter((line) => line !== "").join("\n");
      },
    });

    addTypeTemplate({
      filename: "types/nuxt-charts.d.ts",
      getContents: () => `import type { NuxtChartsAppConfig } from ${JSON.stringify(resolve("./runtime/theme"))};

declare module "@nuxt/schema" {
  interface AppConfigInput {
    /**
     * nuxt-charts component themes, in the Nuxt UI shape
     * (\`{ slots, variants, defaultVariants, compoundVariants }\`).
     * \`chart\` applies to every chart; per-component keys (\`areaChart\`,
     * \`donutChart\`, …) layer on top. \`ui.chart.slots\` (Nuxt UI's
     * \`UChart\`) is inherited first, so one config styles both.
     */
    nuxtCharts?: NuxtChartsAppConfig;
  }
}

export {};
`,
    }, { nuxt: true, node: true });

    if (nuxtUi) {
      // Tailwind only generates classes it has seen. Nuxt UI builds its
      // stylesheet from a template (`ui.css`) listing its \`@source\`s; add
      // our theme directory to it so the default slot classes exist without
      // any setup in the host's CSS.
      const themeDir = resolve("./runtime/theme");
      nuxt.hook("modules:done", () => {
        const template = nuxt.options.build.templates.find((t) => t.filename === "ui.css");
        if (!template?.getContents) {
          logger.warn(
            `Could not register nuxt-charts with Nuxt UI's stylesheet. Add \`@source "${themeDir}";\` to your main CSS.`,
          );
          return;
        }
        const original = template.getContents;
        template.getContents = async (data) => `@source "${themeDir}";\n${await original(data)}`;
      });
    }

    resolveImports(options, import.meta.url);
    resolveComponents(options, import.meta.url);
  },
});
