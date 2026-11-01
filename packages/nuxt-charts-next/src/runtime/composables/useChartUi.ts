import { computed, inject, provide, type CSSProperties, type InjectionKey } from "vue";
import { tv, useAppConfig } from "#nuxt-charts";
import {
  chart as chartTheme,
  componentThemes,
  type ChartComponentThemeName,
  type ChartSlot,
  type ChartThemeConfig,
  type ChartUi,
  type NuxtChartsAppConfig,
  type SlotValue,
} from "../theme";
import type { TooltipRoundness, TooltipVariant } from "../utils/variants";
import type { ChartTheme } from "../types/shared";

/** Slots a Nuxt UI `UChart` override (`appConfig.ui.chart.slots`) can share with us. */
const UCHART_SHARED_SLOTS = [
  "root",
  "tooltip",
  "tooltipTitle",
  "tooltipRow",
  "tooltipIndicator",
  "tooltipLabel",
  "tooltipValue",
] as const;

function joinSlot(a: SlotValue, b: SlotValue): SlotValue {
  if (b === undefined) return a;
  // A Nuxt UI replacer replaces rather than appends; `tv` resolves it.
  if (typeof b === "function" || a === undefined || typeof a === "function") return b;
  return [a, b].flat().join(" ");
}

/**
 * Layer one component theme over another, the way `tv({ extend })` does:
 * slot and variant classes concatenate (tailwind-merge lets the later layer
 * win a conflict), default variants override, compound variants accumulate.
 */
export function mergeThemes(base: ChartThemeConfig, layer: ChartThemeConfig | undefined): ChartThemeConfig {
  if (!layer) return base;
  const slots: Record<string, SlotValue> = { ...base.slots };
  for (const [key, value] of Object.entries(layer.slots ?? {})) slots[key] = joinSlot(slots[key], value);

  const variants: NonNullable<ChartThemeConfig["variants"]> = { ...base.variants };
  for (const [name, values] of Object.entries(layer.variants ?? {})) {
    const merged = { ...variants[name] };
    for (const [option, value] of Object.entries(values)) {
      const prev = merged[option];
      if (typeof value === "string" || typeof prev === "string" || prev === undefined) {
        merged[option] = typeof value === "string" && typeof prev === "string" ? `${prev} ${value}` : value;
      } else {
        const slotMap = { ...prev };
        for (const [slot, cls] of Object.entries(value)) slotMap[slot] = joinSlot(slotMap[slot], cls);
        merged[option] = slotMap;
      }
    }
    variants[name] = merged;
  }

  return {
    slots,
    variants,
    defaultVariants: { ...base.defaultVariants, ...layer.defaultVariants },
    compoundVariants: [...(base.compoundVariants ?? []), ...(layer.compoundVariants ?? [])],
  };
}

/** Keep only the `UChart` slots we render too, so its `base`/`center` do not leak in. */
function sharedUChartLayer(config: ChartThemeConfig | undefined): ChartThemeConfig | undefined {
  const slots = config?.slots;
  if (!slots) return undefined;
  const picked: Record<string, SlotValue> = {};
  for (const key of UCHART_SHARED_SLOTS) if (slots[key] !== undefined) picked[key] = slots[key];
  return { slots: picked };
}

/**
 * The full theme for one component, lowest precedence first:
 * shipped chart theme → component theme → `appConfig.ui.chart` (the user's
 * Nuxt UI `UChart` overrides, so both chart families match) →
 * `appConfig.nuxtCharts.chart` → `appConfig.nuxtCharts.<component>`.
 */
export function resolveChartTheme(
  name: ChartComponentThemeName,
  appConfig: { ui?: { chart?: ChartThemeConfig }; nuxtCharts?: NuxtChartsAppConfig } | undefined,
): ChartThemeConfig {
  let theme = mergeThemes(chartTheme as ChartThemeConfig, componentThemes[name]);
  theme = mergeThemes(theme, sharedUChartLayer(appConfig?.ui?.chart));
  theme = mergeThemes(theme, appConfig?.nuxtCharts?.chart);
  theme = mergeThemes(theme, appConfig?.nuxtCharts?.[name]);
  return theme;
}

type SlotFns = Record<string, (props?: { class?: unknown }) => string>;

export interface ChartUiContext {
  /** Resolved classes for one slot, merged with the `ui` prop (and any extras). */
  slot: (name: ChartSlot, extra?: unknown) => string;
  /** Inline overrides from the legacy `theme` prop for HTML chrome. */
  themeStyle: { tooltip: CSSProperties; legendLabel: CSSProperties };
  /** The effective `ui` prop (own merged over inherited), for nested charts. */
  uiProp: () => ChartUi | undefined;
  /**
   * Classes for whichever element is the chart's root (the plot, or the
   * loading / empty state standing in for it): `root` slot + `ui.root` + `class`.
   */
  readonly rootClass: string;
}

export const CHART_UI_KEY: InjectionKey<ChartUiContext> = Symbol("nuxt-charts:ui");

export interface ChartUiInput {
  ui?: ChartUi;
  class?: unknown;
  theme?: ChartTheme;
  tooltipVariant?: TooltipVariant;
  tooltipRoundness?: TooltipRoundness;
}

function chromeStyle(theme: ChartTheme | undefined): ChartUiContext["themeStyle"] {
  const tooltip: Record<string, string> = {};
  const t = theme?.tooltip;
  if (t?.bg) tooltip.backgroundColor = t.bg;
  if (t?.fg) tooltip.color = t.fg;
  if (t?.border) tooltip["--tw-ring-color"] = t.border;
  if (t?.radius) tooltip.borderRadius = t.radius;
  const legendLabel: Record<string, string> = {};
  if (theme?.legend?.color) legendLabel.color = theme.legend.color;
  return { tooltip: tooltip as CSSProperties, legendLabel: legendLabel as CSSProperties };
}

/**
 * Nuxt UI-native styling for a chart component.
 *
 * Resolves the component theme with Nuxt UI's `tv` (tailwind-merge, replacer
 * functions and `appConfig.ui.tv` all behave as in any `U*` component), merges
 * the `ui` prop into every slot, and provides the result to the chart's
 * internal chrome (tooltip, legend, empty and loading states).
 *
 * Nested charts (`MetricChart` → `DataChart` → `AreaChart`) inherit their
 * parent's `ui` prop, so `<MetricChart :ui="{ tooltip: '…' }">` reaches the
 * tooltip of the chart it renders. `class` always stays on its own root.
 */
export function useChartUi(name: ChartComponentThemeName, props: ChartUiInput) {
  const parent = inject(CHART_UI_KEY, null);
  const appConfig = useAppConfig() as Parameters<typeof resolveChartTheme>[1];

  const slots = computed(
    () =>
      tv(resolveChartTheme(name, appConfig))({
        tooltipVariant: props.tooltipVariant,
        tooltipRoundness: props.tooltipRoundness,
      }) as unknown as SlotFns,
  );

  const uiProp = (): ChartUi | undefined => {
    // A parent's `root` styles the parent's own root, never a nested chart's.
    const fromParent = parent?.uiProp();
    let inherited: ChartUi | undefined;
    if (fromParent) {
      const { root: _root, ...rest } = fromParent;
      inherited = Object.keys(rest).length ? rest : undefined;
    }
    if (!inherited) return props.ui;
    if (!props.ui) return inherited;
    const merged: Record<string, unknown> = { ...inherited };
    for (const [key, value] of Object.entries(props.ui)) {
      const prev = merged[key];
      merged[key] = typeof value === "function" || prev === undefined ? value : [prev, value];
    }
    return merged as ChartUi;
  };

  const themeStyle = computed(() => chromeStyle(props.theme));

  const context: ChartUiContext = {
    slot: (slotName, extra) => {
      const own = uiProp()?.[slotName];
      const fn = slots.value[slotName];
      if (!fn) return "";
      // A replacer function must be the last class entry for Nuxt UI's `tv`.
      return fn({ class: typeof own === "function" ? [extra, own] : [own, extra] });
    },
    get themeStyle() {
      return themeStyle.value;
    },
    uiProp,
    get rootClass() {
      return rootClass.value;
    },
  };

  const rootClass = computed(() => context.slot("root", props.class));

  provide(CHART_UI_KEY, context);
  return context;
}

const NOOP_CONTEXT: ChartUiContext = {
  slot: () => "",
  themeStyle: { tooltip: {}, legendLabel: {} },
  uiProp: () => undefined,
  rootClass: "",
};

/** The nearest chart's styling, for internal chrome components. */
export function injectChartUi(): ChartUiContext {
  return inject(CHART_UI_KEY, NOOP_CONTEXT);
}
