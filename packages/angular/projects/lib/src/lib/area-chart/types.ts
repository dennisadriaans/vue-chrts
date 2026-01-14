import {
  axisFormatter,
  CrosshairConfig,
  LegendPosition,
  MarkerConfig,
  AxisConfig,
} from "../types";
import type { BulletLegendItemInterface, CurveType } from "@unovis/ts";

export interface AreaChartProps<T> {
  /**
   * The data to be displayed in the area chart.
   * Each element of the array represents a data point.
   * The structure of 'T' should be compatible with the chart's rendering logic.
   */
  data: T[];
  /**
   * The height of the chart in pixels.
   */
  height: number;
  /**
   * Optional label for the x-axis.
   */
  xLabel?: string;
  /**
   * Optional label for the y-axis.
   */
  yLabel?: string;
  /**
   * Optional padding applied to the chart.
   * Allows specifying individual padding values for the top, right, bottom, and left sides.
   */
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  /**
   * A record mapping category keys to `BulletLegendItemInterface` objects.
   * This defines the visual representation and labels for each category in the chart's legend.
   */
  categories: Record<string, BulletLegendItemInterface>;

  /**
   * A record mapping marker keys to show custom patterns.
   */
  markerConfig?: MarkerConfig;
  /**
   * @param {number|Date} tick - The value of the tick. This can be a number or a Date object depending on the scale of the x-axis.
   * @param {number} i - The index of the tick in the `ticks` array.
   * @param {(number[]|Date[])} ticks - An array of all tick values for the x-axis.
   * @returns {string} The formatted string representation of the tick.
   */
  xFormatter?: axisFormatter;
  /**
   * @param {number|Date} tick - The value of the tick. This can be a number or a Date object depending on the scale of the y-axis.
   * @param {number} i - The index of the tick in the `ticks` array.
   * @param {(number[]|Date[])} ticks - An array of all tick values for the y-axis.
   * @returns {string} The formatted string representation of the tick.
   */
  yFormatter?: axisFormatter;
  /**
   * Use custom formatter for tooltip titles
   */
  tooltipTitleFormatter?: (data: T) => string | number;
  /**
   * The type of curve to use for the area chart lines.
   * See `CurveType` for available options.
   */
  curveType?: CurveType;
  /**
   * If `true`, hides the area fill, displaying only the line.
   */
  hideArea?: boolean;
  /**
   * Edit the gradient stops for the area fill.
   */
  gradientStops?: Array<{ offset: string; stopOpacity: number }>;
  /**
   * The width of the line in pixels. Default is 2px.
   */
  lineWidth?: number;
  /**
   * Line dash array, see SVG's stroke-dasharray. Default: `undefined`
   */
  lineDashArray?: number[][];
  /**
   * The desired number of ticks on the x-axis.
   */
  xNumTicks?: number;
  /**
   * Force specific ticks on the x-axis.
   */
  xExplicitTicks?: (number | string | Date)[];
  /**
   * Force only first and last ticks on the x-axis.
   */
  minMaxTicksOnly?: boolean;
  /**
   * The desired number of ticks on the y-axis.
   */
  yNumTicks?: number;
  /**
   * Configuration for the x-axis.
   */
  xAxisConfig?: AxisConfig;
  /**
   * Configuration for the y-axis.
   */
  yAxisConfig?: AxisConfig;
  /**
   * Configuration for the crosshair.
   */
  crosshairConfig?: CrosshairConfig;
  /**
   * If `true`, hides the legend.
   */
  hideLegend?: boolean;
  /**
   * The position of the legend.
   */
  legendPosition?: LegendPosition;
  /**
   * Optional style for the legend.
   */
  legendStyle?: Record<string, string>;
  /**
   * If `true`, hides the tooltip.
   */
  hideTooltip?: boolean;
  /**
   * If `true`, the area chart will be stacked.
   */
  stacked?: boolean;
  /**
   * The domain for the y-axis.
   */
  yDomain?: [number, number];
  /**
   * The domain for the x-axis.
   */
  xDomain?: [number, number];
  /**
   * If `true`, hides the x-axis.
   */
  hideXAxis?: boolean;
  /**
   * If `true`, hides the y-axis.
   */
  hideYAxis?: boolean;
  /**
   * If `true`, shows grid lines for the x-axis.
   */
  xGridLine?: boolean;
  /**
   * If `true`, shows grid lines for the y-axis.
   */
  yGridLine?: boolean;
  /**
   * If `true`, shows the domain line for the x-axis.
   */
  xDomainLine?: boolean;
  /**
   * If `true`, shows the domain line for the y-axis.
   */
  yDomainLine?: boolean;
  /**
   * If `true`, shows tick lines for the x-axis.
   */
  xTickLine?: boolean;
  /**
   * If `true`, shows tick lines for the y-axis.
   */
  yTickLine?: boolean;
}
