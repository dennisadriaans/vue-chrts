/**
 * The styling seam between the charts and their host.
 *
 * Defaults are standalone: no Nuxt UI, a `tv` stand-in that applies only the
 * caller's classes, no app config. That is what Storybook, Vitest or a plain
 * Vue + Vite app get when they import `nuxt-charts/components` directly.
 *
 * Under Nuxt the module's plugin calls {@link configureCharts} before any chart
 * renders: with `@nuxt/ui` installed it hands over Nuxt UI's own `tv`, its
 * `useAppConfig` and the app's theme colour names. A Vue + Vite app using
 * Nuxt UI through `@nuxt/ui/vite` can do the same by hand:
 *
 * ```ts
 * import { tv } from "@nuxt/ui/utils/tv";
 * import { configureCharts } from "nuxt-charts/components";
 * configureCharts({ nuxtUi: true, tv, useAppConfig: () => appConfig });
 * ```
 */
import { tv as standaloneTv } from "./theme/tv-standalone";

type SlotFn = (props?: { class?: unknown }) => string;

export interface ChartsRuntimeConfig {
  /** tailwind-variants `tv`; Nuxt UI's when it is installed. */
  tv: (config: unknown) => (variants?: Record<string, unknown>) => Record<string, SlotFn>;
  /** Reads the app config (`ui.chart`, `nuxtCharts.*`). Called during component setup. */
  useAppConfig: () => Record<string, unknown>;
  /** Whether Nuxt UI's tokens and utilities are available. */
  nuxtUi: boolean;
  /** Nuxt UI theme colour names that resolve to `var(--ui-<name>)`. */
  themeColors: string[];
}

export const chartsConfig: ChartsRuntimeConfig = {
  tv: standaloneTv as unknown as ChartsRuntimeConfig["tv"],
  useAppConfig: () => ({}),
  nuxtUi: false,
  themeColors: [],
};

/** Configure how charts are styled. Later calls override earlier ones per key. */
export function configureCharts(config: Partial<ChartsRuntimeConfig>): void {
  Object.assign(chartsConfig, config);
}
