/**
 * Per-chart prop interfaces.
 *
 * These deliberately mirror the `nuxt-charts` v2 (`vue-chrts`) API so existing
 * templates keep working after the engine swap to `vccs`. Props that were
 * Unovis-only and have no `vccs` analog are kept and marked `@deprecated`
 * (inert), so old templates type-check without surfacing errors.
 *
 * Generics (`T`, `N`, `L`) flow the user's row type through, giving `keyof T`
 * autocomplete on axis keys and typed formatters.
 */
import type { CurveType, DonutType, LegendPosition, Orientation } from "../enums";
import type {
  AxisConfig,
  BulletLegendItemInterface,
  ChartPadding,
  CrosshairConfig,
  MarkerConfig,
  TooltipConfig,
  axisFormatter,
} from "./shared";

/**
 * Props common to the cartesian charts (area, bar, line, bubble). Centralises
 * axis / legend / tooltip / grid options so each chart interface only adds its
 * own specifics.
 */
export interface CartesianChartBaseProps<T> {
  /** The data to render. Each element is one data point. */
  data: T[];
  /** Chart height in pixels. */
  height: number;
  /** Optional x-axis label. */
  xLabel?: string;
  /** Optional y-axis label. */
  yLabel?: string;
  /** Optional per-side chart padding. */
  padding?: ChartPadding;
  /**
   * Maps each category key to its legend representation (label, colour).
   * The keys are the data properties plotted as series.
   */
  categories: Record<string, BulletLegendItemInterface>;
  /** Formats x-axis ticks. */
  xFormatter?: axisFormatter;
  /** Formats y-axis ticks. */
  yFormatter?: axisFormatter;
  /** Custom formatter for tooltip titles. */
  tooltipTitleFormatter?: (data: T) => string | number;
  /** Desired number of x-axis ticks. */
  xNumTicks?: number;
  /** Desired number of y-axis ticks. */
  yNumTicks?: number;
  /** Hide the legend. */
  hideLegend?: boolean;
  /** Hide the tooltip. */
  hideTooltip?: boolean;
  /** Legend position. */
  legendPosition?: LegendPosition;
  /** Inline style for the legend container. */
  legendStyle?: string | Record<string, string>;
  /** Show the x-axis domain (axis) line. */
  xDomainLine?: boolean;
  /** Show the y-axis domain (axis) line. */
  yDomainLine?: boolean;
  /** Show x-axis tick lines. */
  xTickLine?: boolean;
  /** Show y-axis tick lines. */
  yTickLine?: boolean;
  /** Show vertical grid lines. */
  xGridLine?: boolean;
  /** Show horizontal grid lines. */
  yGridLine?: boolean;
  /** Hide the x-axis entirely. */
  hideXAxis?: boolean;
  /** Hide the y-axis entirely. */
  hideYAxis?: boolean;
  /** Fixed x-axis domain as `[min, max]`. */
  xDomain?: [number | undefined, number | undefined];
  /** Fixed y-axis domain as `[min, max]`. */
  yDomain?: [number | undefined, number | undefined];
  /** Animation duration in milliseconds. */
  duration?: number;
  /** Axis appearance config for the x-axis. */
  xAxisConfig?: AxisConfig;
  /** Axis appearance config for the y-axis. */
  yAxisConfig?: AxisConfig;
  /** Tooltip behaviour config. */
  tooltip?: TooltipConfig;
  /** @deprecated Unovis-only; no effect. */
  minMaxTicksOnly?: boolean;
  /** @deprecated Unovis-only; no effect. */
  xExplicitTicks?: (number | string | Date)[];
  /** @deprecated Unovis-only; no effect. */
  yExplicitTicks?: (number | string | Date)[];
  /** @deprecated Unovis-only; no effect. */
  crosshairConfig?: CrosshairConfig<T>;
}

export interface AreaChartProps<T> extends CartesianChartBaseProps<T> {
  /** Curve interpolation for the area outline. */
  curveType?: CurveType;
  /** Render only the line, hiding the area fill. */
  hideArea?: boolean;
  /** Gradient stops for the area fill. */
  gradientStops?: Array<{ offset: string; stopOpacity: number }>;
  /** Line width in pixels. Default 2. */
  lineWidth?: number;
  /** Stack the areas instead of overlaying them. */
  stacked?: boolean;
  /** @deprecated Unovis-only; no effect. */
  lineDashArray?: number[][];
  /** @deprecated Unovis-only; no effect. */
  markerConfig?: MarkerConfig;
}

export type LineChartProps<T> = Omit<AreaChartProps<T>, "hideArea" | "gradientStops">;

/** Value-label config for bar charts. */
export interface ValueLabel {
  label: (d: unknown, index: number) => string | number;
  labelSpacing?: number;
  backgroundColor?: string;
  color?: string;
  labelFontSize?: number;
}

export interface BarChartProps<T> extends CartesianChartBaseProps<T> {
  /** The data keys (series) plotted on the value axis. */
  yAxis: (keyof T)[];
  /** The data key used for the category axis. */
  xAxis?: keyof T;
  /** Stack the bars instead of grouping them. */
  stacked?: boolean;
  /** Bar orientation (vertical = column, horizontal = bar). */
  orientation?: Orientation;
  /** Rounded corner radius for bars in pixels. Default 2. */
  radius?: number;
  /** Fractional padding between bars in `[0, 1)`. */
  barPadding?: number;
  /** Padding between bar groups in pixels. */
  groupPadding?: number;
  /** Value-label config. */
  valueLabel?: ValueLabel;
  /** @deprecated Unovis-only; no effect. Use `stacked`. */
  stackAndGrouped?: boolean;
  /** @deprecated Unovis-only; no effect. */
  stackedGroupedSpacing?: number;
}

/** Options controlling bubble (scatter) point sizes. */
export interface SizeOptions {
  minRadius?: number;
  maxRadius?: number;
}

export interface BubbleChartProps<T> extends CartesianChartBaseProps<T> {
  /** Data key for the bubble's x value. */
  xAccessor: keyof T;
  /** Data key for the bubble's y value. */
  yAccessor: keyof T;
  /** Data key for the bubble's size value. */
  sizeAccessor?: keyof T;
  /** Data key used to split points into colour-coded series. */
  categoryKey: keyof T;
  /** Bubble size range as `[min, max]` radius. Default `[1, 20]`. */
  sizeRange?: [number, number];
  /** Bubble fill opacity. */
  opacity?: number;
  /** Options controlling bubble sizes. */
  sizeOptions?: SizeOptions;
}

export interface DonutChartProps<T = unknown> {
  /** Segment values, in the same order as `categories`. */
  data: number[];
  /** Maps each segment to its legend representation (label, colour). */
  categories: Record<string, BulletLegendItemInterface>;
  /** Full ring or half-circle gauge. */
  type?: DonutType;
  /** Chart height in pixels. */
  height?: number;
  /** Outer radius in pixels. */
  radius: number;
  /** Ring thickness in pixels (outer radius minus inner radius). */
  arcWidth?: number;
  /** Angular padding between segments. */
  padAngle?: number;
  /** Hide the legend. */
  hideLegend?: boolean;
  /** Legend position. */
  legendPosition?: LegendPosition;
  /** Inline style for the legend container. */
  legendStyle?: string | Record<string, string>;
  /** Hide the tooltip. */
  hideTooltip?: boolean;
  /** Custom formatter for tooltip titles. */
  tooltipTitleFormatter?: (data: T) => string | number;
  /** Tooltip behaviour config. */
  tooltip?: TooltipConfig;
  /** Animation duration in milliseconds. */
  duration?: number;
}

/** A Sankey node. Extend with your own fields. */
export interface SankeyInputNode {
  id?: string | number;
  [key: string]: unknown;
}

/** A Sankey link between two nodes. */
export interface SankeyInputLink {
  source: string | number;
  target: string | number;
  value?: number;
  [key: string]: unknown;
}

export type SankeyNodeAlign = "justify" | "left" | "right" | "center";

export interface SankeyChartProps<
  N extends SankeyInputNode = SankeyInputNode,
  L extends SankeyInputLink = SankeyInputLink,
> {
  /** Nodes and links describing the flow. */
  data: { nodes: N[]; links: L[] };
  /** Chart height in pixels. */
  height: number;
  /** Optional per-side chart padding. */
  padding?: ChartPadding;
  /** Maps category keys to legend representation. */
  categories?: Record<string, BulletLegendItemInterface>;
  /** Hide the legend. */
  hideLegend?: boolean;
  /** Legend position. */
  legendPosition?: LegendPosition;
  /** Inline style for the legend container. */
  legendStyle?: string | Record<string, string>;
  /** Node label accessor. */
  label?: (node: N) => string;
  /** Node colour accessor. */
  nodeColor?: (node: N) => string;
  /** Link colour accessor. */
  linkColor?: (link: L) => string;
  /** Link value accessor. */
  linkValue?: (link: L) => number;
  /** Node width in pixels. Default 10. */
  nodeWidth?: number;
  /** Node alignment method. Default `justify`. */
  nodeAlign?: SankeyNodeAlign;
  /** Vertical separation between nodes in pixels. Default 10. */
  nodePadding?: number;
  /** Layout iterations. Default 32. */
  iterations?: number;
  /** Hide the tooltip. */
  hideTooltip?: boolean;
  /** Tooltip behaviour config. */
  tooltip?: TooltipConfig;
  /** Animation duration in milliseconds. */
  duration?: number;
}
