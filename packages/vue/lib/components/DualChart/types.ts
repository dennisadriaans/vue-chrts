import {
  axisFormatter,
  CrosshairConfig,
  LegendPosition,
  AxisConfig,
  BulletLegendItemInterface,
  Orientation,
} from "../../types";
import type { CurveType } from "@unovis/ts";

export interface DualChartProps<T> {
  /**
   * The data to be displayed in the dual chart.
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
   * Optional label for the y-axis (used for both bar and line by default).
   */
  yLabel?: string;
  /**
   * Optional label for the secondary y-axis (line chart).
   */
  yLabelSecondary?: string;
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
   * A record mapping bar category keys to `BulletLegendItemInterface` objects.
   * This defines the visual representation and labels for bar categories in the chart's legend.
   */
  barCategories: Record<string, BulletLegendItemInterface>;
  /**
   * A record mapping line category keys to `BulletLegendItemInterface` objects.
   * This defines the visual representation and labels for line categories in the chart's legend.
   */
  lineCategories: Record<string, BulletLegendItemInterface>;
  /**
   * An array of property keys from the data object type 'T' to be used for the bar chart y-axis values.
   */
  barYAxis: (keyof T)[];
  /**
   * An array of property keys from the data object type 'T' to be used for the line chart y-axis values.
   */
  lineYAxis: (keyof T)[];
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
   * The type of curve to use for the line chart lines.
   * See `CurveType` for available options.
   */
  curveType?: CurveType;
  /**
   * The width of the line in pixels. Default is 2px.
   */
  lineWidth?: number;
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
   * Optional style object for the legend container. Allows custom CSS styling.
   */
  legendStyle?: string | Record<string, string>;
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
  /**
   * Crosshair configuration object for customizing the appearance of the crosshair line.
   */
  crosshairConfig?: CrosshairConfig;
  /**
   * Axis configuration object for customizing the appearance of the axes.
   */
  xAxisConfig?: AxisConfig;
  /**
   * Axis configuration object for customizing the appearance of the axes.
   */
  yAxisConfig?: AxisConfig;
  /**
   * The domain for the y-axis, specified as a tuple of two values.
   */
  yDomain?: [number | undefined, number | undefined];
  /**
   * The domain for the x-axis, specified as a tuple of two values.
   */
  xDomain?: [number | undefined, number | undefined];
  /**
   * If `true`, creates stacked bars.
   */
  stacked?: boolean;
  /**
   * The padding between groups of bars in pixels.
   */
  groupPadding?: number;
  /**
   * Fractional padding between the bars in the range of [0,1). Default: 0.2
   */
  barPadding?: number;
  /**
   * Rounded corners for top bars. Boolean or number (to set the radius in pixels). Default: 2
   */
  radius?: number;
  /**
   * The orientation of the bars (vertical or horizontal).
   * See `Orientation` for available options.
   */
  orientation?: Orientation;
  /**
   * Animation duration in milliseconds for the chart components.
   */
  duration?: number;
  /**
   * If `true`, the tooltip will follow the cursor.
   */
  followCursor?: boolean;
}
