import { BulletLegendItemInterface, Orientation, LegendPosition } from "../../types";

export interface BarChartProps<T> {
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
   * A record mapping category keys to `BulletLegendItemInterface` objects.
   * This defines the visual representation and labels for each category in the chart's legend.
   */
  categories: Record<string, BulletLegendItemInterface>;
  /**
   * A function that formats the x-axis tick labels.
   * @param i The x-axis key of the item to be formatted.
   * @param idx The index of the data point (optional).
   * @returns The formatted x-axis label.
   */
  xFormatter: (i: number, idx?: number) => string | number;
  /**
   * An optional function that formats the y-axis tick labels.
   * @param i The y-axis key of the item to be formatted.
   * @param idx The index of the data point (optional).
   * @returns The formatted y-axis label or value.
   */
  yFormatter?: (i: number, idx?: number) => string | number;
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
  xExplicitTicks?: number;
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
};