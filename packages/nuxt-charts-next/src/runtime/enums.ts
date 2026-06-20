/**
 * Public enums, preserved from `nuxt-charts` v2 for API compatibility.
 *
 * These are real TS `enum`s so the IDE surfaces member options on `.` and
 * string-literal completion in templates. Each value maps to a `vccs`
 * primitive via the typed lookup tables in `./utils`.
 */

/**
 * Position of the chart legend.
 *
 * Translated to `vccs` `<Legend>` `align` / `verticalAlign` / `layout`
 * via {@link import('./utils/legend').legendPositionToLegendProps}.
 */
export enum LegendPosition {
  TopLeft = "top-left",
  TopCenter = "top-center",
  TopRight = "top-right",
  BottomLeft = "bottom-left",
  BottomCenter = "bottom-center",
  BottomRight = "bottom-right",
}

/**
 * Curve interpolation used to connect data points in line / area charts.
 *
 * Translated to the `vccs` curve `type` string union via
 * {@link import('./utils/curve').curveTypeToVccs}.
 */
export enum CurveType {
  Basis = "basis",
  BasisClosed = "basisClosed",
  BasisOpen = "basisOpen",
  Bundle = "bundle",
  Cardinal = "cardinal",
  CardinalClosed = "cardinalClosed",
  CardinalOpen = "cardinalOpen",
  CatmullRom = "catmullRom",
  CatmullRomClosed = "catmullRomClosed",
  CatmullRomOpen = "catmullRomOpen",
  Linear = "linear",
  LinearClosed = "linearClosed",
  MonotoneX = "monotoneX",
  MonotoneY = "monotoneY",
  Natural = "natural",
  Step = "step",
  StepAfter = "stepAfter",
  StepBefore = "stepBefore",
}

/**
 * Orientation of a bar chart's bars.
 *
 * Maps to the `vccs` chart container `layout` prop.
 */
export enum Orientation {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

/**
 * Shape of a donut / pie chart.
 *
 * `Full` renders a complete ring; `Half` renders a semicircle gauge.
 */
export enum DonutType {
  Half = "half",
  Full = "full",
}
