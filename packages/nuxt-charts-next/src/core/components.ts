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

/** Components that render without measuring the DOM, so they are safe to server-render. */
const SSR_COMPONENTS = new Set<ComponentName>(["DottedMap", "TopoJSONMap", "HeatmapChart"]);

/**
 * Register the adapter components with Nuxt.
 *
 * vccs charts register with `mode: "client"` because they measure the DOM
 * (`ResponsiveContainer`) and is not SSR-renderable; client-only avoids a
 * hydration mismatch and matches the v2 module's behaviour. Geographic charts
 * render SVG on the server and attach resize/zoom behaviour after mounting.
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
      mode: SSR_COMPONENTS.has(name) ? "all" : "client",
      global,
    });
  }

};
