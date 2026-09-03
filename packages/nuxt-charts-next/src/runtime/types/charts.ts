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
import type { DitherVariant } from "../utils/dither";
import type { BackgroundVariant } from "../utils/background";
import type {
  AreaFillVariant,
  BarVariant,
  DotVariant,
  LegendIndicatorVariant,
  RadarVariant,
  RadialVariant,
  StrokeVariant,
  TooltipRoundness,
  TooltipVariant,
} from "../utils/variants";
import type {
  AxisConfig,
  AxisId,
  BulletLegendItemInterface,
  ChartPadding,
  ChartTheme,
  CrosshairConfig,
  MarkerConfig,
  TooltipConfig,
  YAxisConfig,
  axisFormatter,
} from "./shared";

/**
 * Chrome styling shared by every chart, cartesian or polar. Each field selects
 * one of the built-in variants; omit them all for the shipped defaults.
 */
export interface ChartStyleProps {
  /** Shape of the colour swatch beside each legend entry. Default `rounded-square`. */
  legendVariant?: LegendIndicatorVariant;
  /** Tooltip surface treatment. `frosted-glass` blurs what sits behind it. */
  tooltipVariant?: TooltipVariant;
  /** Tooltip corner radius preset. Default `lg`. */
  tooltipRoundness?: TooltipRoundness;
  /**
   * Render a shimmering placeholder in place of the chart.
   *
   * It stands in for the chart rather than covering it: a real chart with no
   * data draws its axes against an empty domain, which reads as "there is
   * nothing here" instead of "this is still loading".
   */
  loading?: boolean;
  /** Text in the loading pill. Set to `""` to show the silhouette alone. */
  loadingLabel?: string;
}

/**
 * Props common to the cartesian charts (area, bar, line, bubble). Centralises
 * axis / legend / tooltip / grid options so each chart interface only adds its
 * own specifics.
 */
export interface CartesianChartBaseProps<T> extends ChartStyleProps {
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
  /**
   * Additional y-axes keyed by id, for plotting series with different units on
   * independent scales. Reference an id from a category's `yAxis` field:
   *
   * ```ts
   * const categories = {
   *   temperature: { name: "Temp", yAxis: "temp" },
   *   humidity: { name: "Humidity", yAxis: "pct" },
   * };
   * const yAxes = {
   *   temp: { orientation: "left", label: "°C" },
   *   pct: { orientation: "right", label: "%" },
   * };
   * ```
   *
   * Series without a `yAxis` fall back to the primary axis configured by the
   * top-level `yLabel` / `yDomain` / `yAxisConfig` props.
   */
  yAxes?: Record<AxisId, YAxisConfig>;
  /** Tooltip behaviour config. */
  tooltip?: TooltipConfig;
  /** Reference lines drawn across the plot area. New in v3. */
  referenceLines?: ReferenceLineConfig[];
  /**
   * Synchronise tooltip / hover across charts sharing the same `syncId`.
   * New in v3 (forwarded to the `vccs` container).
   */
  syncId?: string;
  /** Force only the first and last ticks (maps to `vccs` `interval="preserveStartEnd"`). */
  minMaxTicksOnly?: boolean;
  /** Explicit x-axis tick values (maps to `vccs` axis `ticks`). */
  xExplicitTicks?: (number | string | Date)[];
  /** Explicit y-axis tick values (maps to `vccs` axis `ticks`). */
  yExplicitTicks?: (number | string | Date)[];
  /** @deprecated Unovis-only; no effect. */
  crosshairConfig?: CrosshairConfig<T>;
  /**
   * Per-chart appearance overrides (grid, axis, legend, hover, tooltip). Layers
   * over the global `--vc-*` token defaults; omit to use the shipped theme.
   */
  theme?: ChartTheme;
  /**
   * Decorative texture painted behind the plot area, faded out toward the
   * chart's edges. Omit for a plain background.
   */
  backgroundPattern?: BackgroundVariant;
}

export interface AreaChartProps<T> extends CartesianChartBaseProps<T> {
  /** The data key used for the category (x) axis. */
  xAxis?: keyof T;
  /** Curve interpolation for the area outline. */
  curveType?: CurveType;
  /** Render only the line, hiding the area fill. */
  hideArea?: boolean;
  /**
   * Vertical fade-out for the area fill. Default `true`. Set `false` for a flat
   * fill. When `dither` is also set, the fade is applied as a mask over the
   * dither pattern instead of replacing it.
   */
  gradient?: boolean;
  /** Gradient stops for the area fade. Overrides the default opacity ramp. */
  gradientStops?: Array<{ offset: string; stopOpacity: number }>;
  /**
   * Fill the area with a tiling halftone dot pattern. `true` uses the `bayer`
   * variant. Composes with `gradient` (the vertical fade) unless `gradient` is
   * `false`.
   */
  dither?: boolean | DitherVariant;
  /** Tile edge length in px for the dither pattern. Default 8. */
  ditherTile?: number;
  /**
   * Opacity of the solid colour wash painted under the dither dots, which is
   * what makes a dithered area fade from colour at the top to transparent at
   * the domain line like a normal gradient fill, instead of showing bare dots.
   * Defaults to the top `gradientStops` opacity; set `0` for dots only.
   */
  ditherWash?: number;
  /** Line width in pixels. Default 2. */
  lineWidth?: number;
  /** Stack the areas instead of overlaying them. */
  stacked?: boolean;
  /**
   * With `stacked`, normalise each x position to 100% so the chart shows the
   * mix rather than the totals. Ignored when the areas are overlaid.
   */
  percent?: boolean;
  /**
   * SVG `stroke-dasharray` for dashed lines. Accepts the v2 `number[][]` form
   * (flattened to a dash pattern) or a ready CSS string like `"6 4"`.
   */
  lineDashArray?: number[][] | string;
  /** Per-series marker (dot) configuration. Renders dots on the area outline. */
  markerConfig?: MarkerConfig;
  /**
   * Texture for the area fill. Layers over the plain colour-to-transparent
   * fade: `gradient` (the default) keeps it, `solid` flattens it, and
   * `dotted` / `lines` / `hatched` cut a texture out of the series colour.
   *
   * Ignored when `dither` is set — a dithered fill is its own texture.
   */
  variant?: AreaFillVariant;
  /**
   * Outline treatment. `dashed` uses a static `3 3` dash; `animated-dashed`
   * marches the dashes along the path.
   */
  strokeVariant?: StrokeVariant;
  /**
   * Point markers drawn on the outline. Unlike `markerConfig` (which styles
   * per series), this applies one built-in marker style to every series.
   */
  dotVariant?: DotVariant;
  /** Base radius of a `dotVariant` marker in pixels. Default 3. */
  dotSize?: number;
  /** Wrap each series in a soft outer glow. */
  glow?: boolean;
}

export type LineChartProps<T> = Omit<
  AreaChartProps<T>,
  "hideArea" | "gradient" | "gradientStops" | "dither" | "ditherTile" | "ditherWash" | "variant"
>;

/**
 * A reference line drawn across a cartesian chart. New in v3 — maps onto the
 * `vccs` `<ReferenceLine>`. Provide `x` for a vertical line or `y` for a
 * horizontal one (matching the respective axis value).
 */
export interface ReferenceLineConfig {
  /** X-axis value for a vertical line. */
  x?: number | string;
  /** Y-axis value for a horizontal line. */
  y?: number | string;
  /** Line colour. Default `#888`. */
  color?: string;
  /** Line width in pixels. Default 1. */
  strokeWidth?: number;
  /** Optional label drawn alongside the line. */
  label?: string | number;
  /** SVG dash pattern, e.g. `"3 3"`. */
  strokeDasharray?: string;
}

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
  /**
   * With `stacked`, normalise each category to 100% so the chart shows the mix
   * rather than the totals. Ignored when the bars are grouped.
   */
  percent?: boolean;
  /** Bar orientation (vertical = column, horizontal = bar). */
  orientation?: Orientation;
  /** Rounded corner radius for bars in pixels. Default 2. */
  radius?: number;
  /**
   * Gap between bars within a group. Number = px, string = percent (e.g. `"2%"`).
   * Lower values pull grouped bars closer. Default `4` (vccs).
   */
  barGap?: number | string;
  /**
   * Gap between category groups. Number = px, string = percent (e.g. `"10%"`).
   * Default `"10%"` (vccs).
   */
  barCategoryGap?: number | string;
  /**
   * @deprecated Prefer `barGap`. Still forwarded as `barGap` when `barGap` is omitted.
   */
  barPadding?: number;
  /**
   * @deprecated Prefer `barCategoryGap`. Still forwarded as `barCategoryGap` when
   * `barCategoryGap` is omitted.
   */
  groupPadding?: number;
  /** Value-label config. */
  valueLabel?: ValueLabel;
  /**
   * Bar render variant.
   *
   * `"solid"` is the default rectangle bar. `"cubes"` draws a vertical stack of
   * rounded squares — it works with single, grouped, and stacked (`stacked`)
   * series; for stacks only the first series draws the ghost column, and each
   * series fills its own cube range.
   *
   * The remaining variants keep the rectangle and change how it is painted:
   * `"hatched"` (diagonal stripes), `"duotone"` / `"duotone-reverse"` (a
   * vertical split between a solid and a faded half), `"gradient"` (fading out
   * toward the baseline), and `"stripped"` (a faint body under a solid cap).
   */
  variant?: BarVariant;
  /** Gap between cubes in px when `variant="cubes"`. Default 2. */
  cubeGap?: number;
  /** Corner radius per cube when `variant="cubes"`. Default 2. */
  cubeRadius?: number;
  /**
   * Preferred cube edge length in px when `variant="cubes"`. Default 10.
   * Clamped to the bar band width so columns stay straight and centered.
   */
  cubeSize?: number;
  /**
   * When set below `cubeSize`, cubes taper from `cubeSize` at the top of the
   * plot to this size at the baseline. Size follows absolute chart Y so every
   * horizontal line shares one cube size. Opacity also fades top → bottom
   * (see `cubeMinOpacity`). Omit for uniform cubes.
   */
  cubeMinSize?: number;
  /**
   * Floor fill-opacity when size-tapering (top stays 1). Default `0.05`.
   * Only applies when `cubeMinSize` is set.
   */
  cubeMinOpacity?: number;
  /** Fill for empty/ghost cubes when `variant="cubes"`. */
  cubeEmptyColor?: string;
  /** Wrap each bar in a soft outer glow. */
  glow?: boolean;
  /**
   * Render the final bar as a projection: a hollow diagonal hatch with an
   * outline, rather than a filled bar. Use it when the last period is still
   * accruing and its value is not yet comparable to the others.
   */
  bufferBar?: boolean;
  /**
   * Dim every bar except the hovered one, so a single column stands out of a
   * dense chart. Has no effect while the pointer is outside the plot.
   */
  hoverHighlight?: boolean;
  /**
   * Dim every bar except the tallest, so the peak reads at a glance. Combines
   * with `hoverHighlight`: hovering then promotes the hovered column instead.
   */
  maxHighlight?: boolean;
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

/** v2 accepted Unovis-style function accessors; v3 also accepts row field keys. */
export type BubbleAccessor<T> = keyof T | ((datum: T) => number | string | Date | null | undefined);

export interface BubbleChartProps<T> extends CartesianChartBaseProps<T> {
  /** Data key or accessor for the bubble's x value. */
  xAccessor: BubbleAccessor<T>;
  /** Data key or accessor for the bubble's y value. */
  yAccessor: BubbleAccessor<T>;
  /** Data key or accessor for the bubble's size value. */
  sizeAccessor?: BubbleAccessor<T>;
  /** Data key used to split points into colour-coded series. */
  categoryKey: keyof T;
  /**
   * Bubble size range mapped through `ZAxis` as `[min, max]` area.
   * Default `[60, 400]` (matches typical Recharts scatter sizing).
   */
  sizeRange?: [number, number];
  /** Bubble fill opacity. */
  opacity?: number;
  /** Options controlling bubble sizes. */
  sizeOptions?: SizeOptions;
}

/**
 * Candlestick (OHLC) chart props. New in v3 — no `vccs` primitive exists, so the
 * adapter composes a `vccs` `<ComposedChart>` (for the real axes, grid, scales
 * and tooltip) with a custom candle layer drawn from the axis scales exposed by
 * `vccs`'s public hooks.
 *
 * Each row in `data` is one candle. Accessors name the OHLC fields; the default
 * accessors read `label`/`open`/`high`/`low`/`close`/`volume`, so a row shaped
 * like `{ label, open, high, low, close, volume? }` works with no config.
 */
export interface CandlestickChartProps<T> {
  /** The data to render. Each element is one candle. */
  data: T[];
  /** Chart height in pixels. */
  height: number;
  /** Row field used for the x (category) axis label. Default `"label"`. */
  xAccessor?: keyof T;
  /** Row field for the open price. Default `"open"`. */
  openAccessor?: keyof T;
  /** Row field for the high price. Default `"high"`. */
  highAccessor?: keyof T;
  /** Row field for the low price. Default `"low"`. */
  lowAccessor?: keyof T;
  /** Row field for the close price. Default `"close"`. */
  closeAccessor?: keyof T;
  /** Optional row field for the traded volume. Default `"volume"`. */
  volumeAccessor?: keyof T;
  /** Colour for rising candles (close ≥ open). Default `#10b981`. */
  upColor?: string;
  /** Colour for falling candles (close < open). Default `#ef4444`. */
  downColor?: string;
  /** Max candle body width in pixels. Default 18. */
  candleWidth?: number;
  /** Wick (high-low line) width in pixels. Default 1.5. */
  wickWidth?: number;
  /** Draw a volume histogram beneath the candles. Default false. */
  showVolume?: boolean;
  /** Optional x-axis label. */
  xLabel?: string;
  /** Optional y-axis label. */
  yLabel?: string;
  /** Formats y-axis ticks and tooltip prices. */
  yFormatter?: (value: number) => string;
  /** Formats x-axis (category) ticks. Receives the row index. */
  xFormatter?: (index: number) => string;
  /** Custom formatter for tooltip titles. */
  tooltipTitleFormatter?: (data: T) => string | number;
  /** Desired number of y-axis ticks. */
  yNumTicks?: number;
  /** Fixed y-axis domain as `[min, max]`. Defaults to the data's low/high range. */
  yDomain?: [number | undefined, number | undefined];
  /** Show vertical grid lines. Default false. */
  xGridLine?: boolean;
  /** Show horizontal grid lines. Default true. */
  yGridLine?: boolean;
  /** Hide the x-axis entirely. */
  hideXAxis?: boolean;
  /** Hide the y-axis entirely. */
  hideYAxis?: boolean;
  /** Hide the tooltip. */
  hideTooltip?: boolean;
  /** Tooltip behaviour config. */
  tooltip?: TooltipConfig;
}

export interface DonutChartProps<T = unknown> extends ChartStyleProps {
  /** Segment values, in the same order as `categories`. */
  data: number[];
  /** Maps each segment to its legend representation (label, colour). */
  categories: Record<string, BulletLegendItemInterface>;
  /** Full ring or half-circle gauge. */
  type?: DonutType;
  /**
   * Segment treatment. `gradient` paints each segment with a diagonal ramp of
   * its own colour instead of a flat fill. Omit for flat segments.
   */
  variant?: "flat" | "gradient";
  /** Wrap each segment in a soft outer glow. */
  glow?: boolean;
  /** Chart height in pixels. */
  height?: number;
  /**
   * Outer radius in pixels. When omitted or `0`, the ring auto-fits the
   * container (recommended). Pass a number to pin an explicit outer radius.
   */
  radius?: number;
  /** Ring thickness in pixels (outer radius minus inner radius). Default 40. */
  arcWidth?: number;
  /** Angular padding between segments, in degrees. */
  padAngle?: number;
  /**
   * Outline colour drawn around each segment. Defaults to `'none'`; pass a
   * colour to separate segments with a border (e.g. the card background).
   */
  stroke?: string;
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
  /**
   * Per-chart appearance overrides (legend, hover, tooltip). Layers over the
   * global `--vc-*` token defaults; omit to use the shipped theme.
   */
  theme?: ChartTheme;
  /** Animation duration in milliseconds. */
  duration?: number;
}

/**
 * Radar chart props. New in v3 (no v2 equivalent) — maps onto the `vccs`
 * `RadarChart` + one `<Radar>` per series.
 *
 * Each row in `data` is one spoke (axis) of the radar; `dataKey` names the row
 * field used as the angle-axis label, and each key in `categories` is a numeric
 * series plotted as one overlaid polygon.
 */
export interface RadarChartProps<T> extends ChartStyleProps {
  /** The data to render. Each element is one spoke / angle-axis entry. */
  data: T[];
  /** Chart height in pixels. */
  height: number;
  /** Row field used for the angle-axis (spoke) labels. */
  dataKey: keyof T;
  /** Maps each numeric series key to its legend representation (label, colour). */
  categories: Record<string, BulletLegendItemInterface>;
  /**
   * Polygon treatment. `filled` (the default) paints each series' area;
   * `lines` draws the outline only, which keeps several overlapping series
   * readable.
   */
  variant?: RadarVariant;
  /** Shape of the polar grid. `polygon` (the default) or `circle`. */
  gridType?: "polygon" | "circle";
  /** Point markers on each vertex. Omit for none. */
  dotVariant?: DotVariant;
  /** Base radius of a `dotVariant` marker in pixels. Default 3. */
  dotSize?: number;
  /** Fill opacity of each radar polygon. Default 0.6. */
  fillOpacity?: number;
  /** Formats the angle-axis (spoke) labels. */
  angleFormatter?: (value: unknown, index: number) => string;
  /** Custom formatter for tooltip titles. */
  tooltipTitleFormatter?: (data: T) => string | number;
  /** Hide the legend. */
  hideLegend?: boolean;
  /** Hide the tooltip. */
  hideTooltip?: boolean;
  /** Legend position. */
  legendPosition?: LegendPosition;
  /** Inline style for the legend container. */
  legendStyle?: string | Record<string, string>;
  /** Hide the radius (value) axis. */
  hideRadiusAxis?: boolean;
  /**
   * Angle (in degrees, counter-clockwise from 3 o'clock) along which the radius
   * axis is drawn. Default 90, i.e. straight up from the centre.
   */
  radiusAxisAngle?: number;
  /** Tooltip behaviour config. */
  tooltip?: TooltipConfig;
  /**
   * Per-chart appearance overrides (legend, hover, tooltip). Layers over the
   * global `--vc-*` token defaults; omit to use the shipped theme.
   */
  theme?: ChartTheme;
  /** Animation duration in milliseconds. */
  duration?: number;
}

/**
 * Radial bar chart props. New in v3 — maps onto the `vccs` `RadialBarChart` +
 * `<RadialBar>`. Like {@link DonutChartProps} it takes a positional value list
 * aligned with `categories`.
 */
export interface RadialBarChartProps<T = unknown> extends ChartStyleProps {
  /** Segment values, in the same order as `categories`. */
  data: number[];
  /** Maps each segment to its legend representation (label, colour). */
  categories: Record<string, BulletLegendItemInterface>;
  /** Chart height in pixels. */
  height: number;
  /**
   * Sweep of the track. `full` (the default) runs a complete turn; `semi`
   * renders the upper semicircle as a gauge. Setting it is shorthand for the
   * matching `startAngle` / `endAngle`, which still win when passed explicitly.
   */
  variant?: RadialVariant;
  /** Inner radius in pixels or percent string. Default `'30%'`. */
  innerRadius?: number | string;
  /** Outer radius in pixels or percent string. Default `'100%'`. */
  outerRadius?: number | string;
  /** Start angle in degrees. Default 90. */
  startAngle?: number;
  /** End angle in degrees. Default -270 (full turn). */
  endAngle?: number;
  /** Corner radius of each bar in pixels. */
  cornerRadius?: number;
  /** Draw the faint background track behind each bar. Default true. */
  background?: boolean;
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
  /**
   * Per-chart appearance overrides (legend, hover, tooltip). Layers over the
   * global `--vc-*` token defaults; omit to use the shipped theme.
   */
  theme?: ChartTheme;
  /** Animation duration in milliseconds. */
  duration?: number;
}

/**
 * Funnel chart props. New in v3 — maps onto the `vccs` `FunnelChart` +
 * `<Funnel>`. Takes a positional value list aligned with `categories`, like
 * {@link DonutChartProps}.
 */
export interface FunnelChartProps<T = unknown> extends ChartStyleProps {
  /** Stage values, in the same order as `categories`. Largest first reads top-down. */
  data: number[];
  /** Maps each stage to its legend representation (label, colour). */
  categories: Record<string, BulletLegendItemInterface>;
  /** Chart height in pixels. */
  height: number;
  /**
   * Visual variant. `'default'` (the classic trapezoid funnel) or `'layered'`
   * (curved, nested layers with on-shape value / percentage / stage labels and a
   * positioned tooltip). Default `'default'`.
   */
  variant?: "default" | "layered";
  /** Shape of the final (smallest) stage. Default `'triangle'`. */
  lastShapeType?: "triangle" | "rectangle";
  /** Show the value label on each stage. Default true. */
  showValueLabel?: boolean;
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
  /**
   * Per-chart appearance overrides (legend, hover, tooltip). Layers over the
   * global `--vc-*` token defaults; omit to use the shipped theme.
   */
  theme?: ChartTheme;
  /** Animation duration in milliseconds. */
  duration?: number;
}

export interface StatusTrackerDatum {
  status: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
}

/**
 * Status tracker chart props. New in v3 — renders a compact, responsive
 * timeline of categorical status bars, inspired by uptime/status pages.
 *
 * `data` is expected oldest-to-newest. When the container cannot fit every bar,
 * older records are dropped and the newest records stay visible on the right.
 */
export interface StatusTrackerChartProps<T extends StatusTrackerDatum = StatusTrackerDatum> {
  /** Status samples ordered oldest-to-newest. */
  data: T[];
  /** Maps each status key to its display label and colour. */
  categories: Record<string, BulletLegendItemInterface>;
  /** Optional chart title shown in the header. */
  title?: string;
  /** Optional summary shown in the header, e.g. `"99.99% uptime"`. */
  summary?: string | number;
  /** Fixed chart height in pixels. Default 28. */
  height?: number;
  /** Width of each status bar in pixels. Default 8. */
  barWidth?: number;
  /** Gap between status bars in pixels. Default 3. */
  barGap?: number;
  /** Explicit number of bars to render. Overrides responsive fitting. */
  visibleBars?: number;
  /** Label shown under the left edge of the tracker. */
  startLabel?: string;
  /** Label shown under the right edge of the tracker. */
  endLabel?: string;
  /** Status key used for generated empty bars. Default `"empty"`. */
  emptyStatus?: string;
  /** Fallback colour for generated empty bars. Default `"var(--chart-empty-color, #e5e7eb)"`. */
  emptyColor?: string;
  /** Resolve a status key from a datum. Default reads `datum.status`. */
  statusAccessor?: (datum: T, index: number) => string;
  /** Resolve a tooltip/ARIA label from a datum. Default uses `datum.label` or the category name. */
  labelAccessor?: (datum: T, index: number) => string;
  /** Resolve a numeric value shown in tooltips, if provided. Default reads `datum.value`. */
  valueAccessor?: (datum: T, index: number) => number | undefined;
  /** Format numeric values for tooltips. */
  valueFormatter?: (value: number, datum: T, index: number) => string;
  /** Hide the header region. */
  hideHeader?: boolean;
  /** Hide the status legend. */
  hideLegend?: boolean;
  /** Hide native browser tooltips. */
  hideTooltip?: boolean;
  /** Round only the first and last visible bars. Default true. */
  rounded?: boolean;
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
  /**
   * Per-chart appearance overrides (legend, hover, tooltip). Layers over the
   * global `--vc-*` token defaults; omit to use the shipped theme.
   */
  theme?: ChartTheme;
  /** Animation duration in milliseconds. */
  duration?: number;
}
