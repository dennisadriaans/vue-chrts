import { axisFormatter, LegendPosition, MarkerConfig } from "../../types";
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
    markerConfig?: Record<string, MarkerConfig>;
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
   * The type of curve to use for the area chart lines.
   * See `CurveType` for available options.
   */
  curveType?: CurveType;
  /**
   * The width of the line in pixels. Default is 2px.
   */
  lineWidth?: number;
  /**
   * Line dash array, see SVG's stroke-dasharray. Default: `undefined`
   */
  lineDashArray?: number[];
  /**
   * The desired number of ticks on the x-axis.
   */
  xNumTicks?: number;
  /**
   * Force specific ticks on the x-axis.
   */
  xExplicitTicks?: number;
  /**
   * Force only first and last ticks on the x-axis.
   */
  minMaxTicksOnly?: boolean;
  /**
   * The desired number of ticks on the y-axis.
   */
  yNumTicks?: number;
  /**
   * If `true`, hides the chart legend.
   */
  hideLegend?: boolean;
  /**
   * If `true`, hides the chart tooltip.
   */
  hideTooltip?: boolean;
  /**
   * Optional position for the legend, if applicable.
   * See `LegendPosition` for available options.
   */
  legendPosition?: LegendPosition;
  /**
   * If `true`, displays a domain line (axis line) along the x-axis.
   */
  xDomainLine?: boolean;
  /**
   * If `true`, displays a domain line (axis line) along the y-axis.
   */
  yDomainLine?: boolean;
  /**
   * If `true`, displays tick lines on the x-axis.
   */
  xTickLine?: boolean;
  /**
   * If `true`, displays tick lines on the y-axis.
   */
  yTickLine?: boolean;
  /**
   * If `true`, displays grid lines along the x-axis.
   */
  xGridLine?: boolean;
  /**
   * If `true`, displays grid lines along the y-axis.
   */
  yGridLine?: boolean;
  /**
   * If `true`, hide the x-axis.
   */
  hideXAxis?: boolean;
  /**
   * If `true`, hide the y-axis.
   */
  hideYAxis?: boolean;
}
