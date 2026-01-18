import {
  BulletLegendItemInterface,
  Orientation,
  LegendPosition,
  axisFormatter,
  AxisConfig,
} from "./index";

export type BarChartPropsBase<T> = {
  /**
   * The data to be displayed in the bar chart.
   * Each element of the array represents a data point.
   * The structure of 'T' should be compatible with the chart's rendering logic.
   */
  data: T[];
  /**
   * If `true`, creates a stacked bar chart instead of grouped bars.
   */
  stacked?: boolean;
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
   * The desired number of ticks on the y-axis.
   */
  yNumTicks?: number;
  /**
   * Force only first and last ticks on the x-axis.
   */
  minMaxTicksOnly?: boolean;
  /**
   * The desired number of ticks on the x-axis.
   */
  xNumTicks?: number;
  /**
   * Force specific ticks on the x-axis.
   */
  xExplicitTicks?: (number | string | Date)[];
  /**
   * An array of property keys from the data object type 'T' to be used for the y-axis values.
   */
  yAxis: (keyof T)[];
  /**
   * The padding between groups of bars in pixels.
   */
  groupPadding?: number;
  /**
   * Fractional padding between the bars in the range of [0,1). Default: 0
   */
  barPadding?: number;
  /**
   * Rounded corners for top bars. Boolean or number (to set the radius in pixels). Default: 2
   */
  radius?: number;
  /**
   * If `true`, hides the chart legend.
   */
  hideLegend?: boolean;
  /**
   * If `true`, hides the chart tooltip.
   */
  hideTooltip?: boolean;
  /**
   * The orientation of the bars (vertical or horizontal).
   * See `Orientation` for available options.
   */
  orientation?: Orientation;
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
   * Specific spacing between stacked and grouped bars in pixels.
   * Only applicable if `stackAndGrouped` is `true`.
   */
  stackedGroupedSpacing?: number;

  /**
   * Axis configuration object for customizing the appearance of the axes.
   */
  xAxisConfig?: AxisConfig;
  /**
   * Axis configuration object for customizing the appearance of the axes.
   */
  yAxisConfig?: AxisConfig;
};

export type BarChartProps<T> = BarChartPropsBase<T> & {
  /**
   * Whether the bars should be stacked and grouped.
   * If true, `valueLabel` is optional and `xAxis` is required.
   */
  stackAndGrouped?: boolean;
  /**
   * Configuration for the value label display.
   * Required if `stackAndGrouped` is false and `xAxis` is present.
   * Optional otherwise.
   */
  valueLabel?: ValueLabel;
  /**
   * The data key for the X-axis.
   * Required if `stackAndGrouped` is true, or if `stackAndGrouped` is false AND `valueLabel` is present.
   */
  xAxis?: keyof T;
};

export type ValueLabel = {
  label: (d: any, index: number) => string | number;
  labelSpacing?: number;
  backgroundColor?: string;
  color?: string;
  labelFontSize?: number;
};
