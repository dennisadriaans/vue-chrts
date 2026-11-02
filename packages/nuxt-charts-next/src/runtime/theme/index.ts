import chart from "./chart";
import metricChart from "./metric-chart";
import statusTrackerChart from "./status-tracker-chart";

export { chart, metricChart, statusTrackerChart };

/**
 * `app.config` key of every themable component, in Nuxt UI's camelCase
 * convention. Each is configured under `appConfig.nuxtCharts.<key>`;
 * `appConfig.nuxtCharts.chart` applies to all of them.
 */
export type ChartComponentThemeName =
  | "areaChart"
  | "barChart"
  | "lineChart"
  | "donutChart"
  | "bubbleChart"
  | "radarChart"
  | "radialBarChart"
  | "funnelChart"
  | "sankeyChart"
  | "candlestickChart"
  | "statusTrackerChart"
  | "metricChart"
  | "dataChart"
  | "heatmapChart"
  | "dottedMap"
  | "topoJsonMap";

/** Component-specific theme layered over the shared {@link chart} theme. */
export const componentThemes: Partial<Record<ChartComponentThemeName, ChartThemeConfig>> = {
  metricChart,
  statusTrackerChart,
};

/** A slot's classes, or a Nuxt UI replacer `(defaults) => classes`. */
export type SlotValue = string | string[] | ((defaults: string) => string) | undefined;

/** The Nuxt UI / tailwind-variants component-theme shape. */
export interface ChartThemeConfig {
  slots?: Record<string, SlotValue>;
  variants?: Record<string, Record<string, string | Record<string, SlotValue>>>;
  defaultVariants?: Record<string, unknown>;
  compoundVariants?: Record<string, unknown>[];
}

type SlotsOf<T> = T extends { slots: infer S } ? keyof S : never;

/** Every slot name a chart theme can carry. */
export type ChartSlot =
  | SlotsOf<typeof chart>
  | SlotsOf<typeof metricChart>
  | SlotsOf<typeof statusTrackerChart>;

/** Class value accepted by a `ui` slot (Vue `class` binding shape). */
export type ChartClassValue = string | Record<string, boolean> | ChartClassValue[] | null | undefined | false;

/**
 * The per-instance `ui` prop: classes merged into each slot with
 * tailwind-merge, exactly like a Nuxt UI component's `ui` prop.
 */
export type ChartUi = Partial<Record<ChartSlot, ChartClassValue | ((defaults: string) => string)>>;

/** The `appConfig.nuxtCharts` shape. */
export type NuxtChartsAppConfig = Partial<Record<"chart" | ChartComponentThemeName, ChartThemeConfig>>;
