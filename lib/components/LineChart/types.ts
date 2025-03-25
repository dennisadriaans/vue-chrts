import {
  BulletLegendItemInterface,
  CurveType,
  LegendPosition,
} from "../../types";

export interface LineChartProps<T> {
  /**
   * The data to be displayed in the line chart.
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
   * A record mapping category keys to `BulletLegendItemInterface` objects.
   * This defines the visual representation and labels for each category in the chart's legend.
   */
  categories: Record<string, BulletLegendItemInterface>;
  /**
   * A function that formats the x-axis tick labels.
   * @param item The x-axis value to be formatted.
   * @param idx The index of the data point.
   * @returns The formatted x-axis label.
   */
  xFormatter: (item: T, idx: number) => string | number;
  /**
   * An optional function that formats the y-axis tick labels.
   * @param i The value to be formatted.
   * @param idx The index of the data point.
   * @returns The formatted y-axis label.
   */
  yFormatter?: (i: number, idx: number) => string;
  /**
   * The type of curve to use for the line chart.
   * See `CurveType` for available options.
   */
  curveType?: CurveType;
  /**
   * If `true`, hides the chart tooltip.
   */
  hideTooltip?: boolean;
  /**
   * The desired number of ticks on the y-axis.
   */
  yNumTicks?: number;
  /**
   * The desired number of ticks on the x-axis.
   */
  xNumTicks?: number;
  /**
   * If `true`, hides the chart legend.
   */
  hideLegend?: boolean;
  /**
   * Optional position for the legend, if applicable.
   * See `LegendPosition` for available options.
   */
  legendPosition?: LegendPosition;
  /**
   * If `true`, displays grid lines along the x-axis.
   */
  xGridLine?: boolean;
  /**
   * If `true`, displays a domain line (axis line) along the x-axis.
   */
  xDomainLine?: boolean;
  /**
   * If `true`, displays grid lines along the y-axis.
   */
  yGridLine?: boolean;
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
}
