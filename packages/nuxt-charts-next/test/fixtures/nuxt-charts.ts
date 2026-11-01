/**
 * Test stand-in for the module-generated `#nuxt-charts` alias. Defaults to
 * standalone mode (no Nuxt UI); tests that need Nuxt UI mode call `__setNuxtUi`.
 */
import { tv as tailwindTv } from "tailwind-variants";
import { tv as standaloneTv } from "../../src/runtime/theme/tv-standalone";

type AppConfig = Record<string, unknown>;

const state: { nuxtUi: boolean; appConfig: AppConfig } = { nuxtUi: false, appConfig: {} };

// A live binding the runtime reads per call, flipped by `__setNuxtUi`.
// eslint-disable-next-line import/no-mutable-exports
export let nuxtUi = false;
export const themeColors: string[] = [];

export const tv = (config: unknown) =>
  state.nuxtUi ? (tailwindTv as unknown as (c: unknown) => unknown)(config) : standaloneTv(config);

export function useAppConfig(): AppConfig {
  return state.appConfig;
}

/** Switch the fixture into Nuxt UI mode (reset with `false`). */
export function __setNuxtUi(on: boolean, appConfig: AppConfig = {}) {
  state.nuxtUi = on;
  state.appConfig = appConfig;
  nuxtUi = on;
  themeColors.splice(0, themeColors.length, ...(on ? ["primary", "secondary", "success", "info", "warning", "error"] : []));
}
