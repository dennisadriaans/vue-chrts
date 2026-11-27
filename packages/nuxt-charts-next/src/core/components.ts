import { addComponent, createResolver } from "@nuxt/kit";
import type { ModuleOptions } from "../module";

/** Component name -> runtime adapter file (relative to src/runtime/components). */
const COMPONENTS = {
  AreaChart: "AreaChart",
  BarChart: "BarChart",
  LineChart: "LineChart",
  DonutChart: "DonutChart",
  BubbleChart: "BubbleChart",
  RadarChart: "RadarChart",
  RadialBarChart: "RadialBarChart",
  FunnelChart: "FunnelChart",
  SankeyChart: "SankeyChart",
  CandlestickChart: "CandlestickChart",
  StatusTrackerChart: "StatusTrackerChart",
  DottedMap: "DottedMap",
  TopoJSONMap: "TopoJSONMap",
  // Data-aware primitive: renders a serializable `ChartSpec` over raw rows by
  // delegating to the adapters above.
  DataChart: "DataChart",
  // Analytics card over raw rows: headline, delta, range selector, table and CSV export.
  MetricChart: "MetricChart",
  HeatmapChart: "HeatmapChart",
} as const;

export type ComponentName = keyof typeof COMPONENTS;

/**
 * Components whose output depends on the viewer's locale, time zone or the
 * current time, so the server cannot render markup the browser will agree with.
 */
const CLIENT_ONLY_COMPONENTS = new Set<ComponentName>(["DataChart", "MetricChart"]);

/**
 * Register the adapter components with Nuxt.
 *
 * Charts render their SVG on the server at `initialWidth` and re-measure after
 * hydration.
 */
export const resolveComponents = (config: ModuleOptions, resolverUrl: string) => {
  const { prefix, include, global } = config;
  const { resolve } = createResolver(resolverUrl);

  const names = (Object.keys(COMPONENTS) as ComponentName[]).filter((name) =>
    include?.length ? include.includes(name) : true,
  );

  for (const name of names) {
    addComponent({
      name: `${prefix}${name}`,
      filePath: resolve(`./runtime/components/${COMPONENTS[name]}.vue`),
      mode: CLIENT_ONLY_COMPONENTS.has(name) ? "client" : "all",
      global,
    });
  }

};
