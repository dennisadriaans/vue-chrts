// Re-export everything from shared package
export {
  LegendPosition,
  CurveType,
  Orientation,
  DonutType,
} from "@vue-chrts/shared";

export type {
  BulletLegendItemInterface,
  axisFormatter,
  AxisConfig,
  MarkerConfig,
  CrosshairConfig,
  TooltipConfig,
  AreaChartProps,
  BarChartProps,
  BarChartPropsBase,
  ValueLabel,
  LineChartProps,
  DonutChartProps,
  BubbleChartProps,
  SizeOptions,
  GanttChartProps,
} from "@vue-chrts/shared";

// Vue-specific component types
export type {
  DagreGraphProps,
  GraphNodeDatum,
  GraphLinkDatum,
  GraphData,
  DagreLayoutSettings,
  DagreRankDir,
  DagreAlign,
  DagreRanker,
  NodeShape,
  LinkArrowPosition,
} from "./components/DagreGraph/types";

export type { SankeyChartProps } from "./components/SankeyChart/types";
export type { DualChartProps } from "./components/DualChart/types";
export type { MapsData } from "./components/Maps/TopoJSONMap/types";
export type { DottedMapProps } from "./components/Maps/DottedMap/types";
