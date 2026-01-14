import {
  BulletLegendItemInterface,
  CrosshairConfig,
  LegendPosition,
  AxisConfig,
} from '../types';

export interface GanttChartProps<T> {
  /**
   * The data to be displayed in the timeline chart.
   * Each element of the array represents a timeline event or item.
   * The structure of 'T' should be compatible with the chart's rendering logic.
   */
  data: T[];
  /**
   * The width of the label area in pixels.
   * Default: 220
   */
  labelWidth?: number;
  /**
   * The height of the chart in pixels.
   */
  height?: number;
  /**
   * Optional title for the timeline chart.
   */
  title?: string;
  /**
   * A record mapping category keys to `BulletLegendItemInterface` objects.
   * This defines the visual representation and labels for each category in the chart's legend.
   */
  categories: Record<string, BulletLegendItemInterface>;
  /**
   * Accessor function that returns the x-position (start time/value) for each timeline item.
   * @param {T} d - The data item.
   * @returns {number} The x-position value.
   */
  x: (d: T) => number;
  /**
   * Accessor function that returns the length (duration) for each timeline item.
   * @param {T} d - The data item.
   * @returns {number} The length/duration value.
   */
  length: (d: T) => number;
  /**
   * Accessor function that returns the type/category for each timeline item.
   * This determines the color and style of the timeline bar.
   * @param {T} d - The data item.
   * @returns {string} The type/category identifier.
   */
  type: (d: T) => string;

  /**
   * Use custom formatter for tooltip titles
   */
  tooltipTitleFormatter?: (data: T) => string | number;
  /**
   * Optional custom tooltip text generator function.
   * @param {string} label - The label of the item.
   * @param {number} index - The index of the item in the data array.
   * @param {T[]} data - The full data array.
   * @returns {string} The formatted tooltip text.
   */
  getTooltipText?: (label: string, index: number, data: T[]) => string;
  /**
   * The desired number of ticks on the x-axis.
   */
  xNumTicks?: number;
  /**
   * If `true`, displays labels for each timeline row.
   * Default: true
   */
  showLabels?: boolean;
  /**
   * If `true`, hides the chart tooltip.
   */
  hideTooltip?: boolean;
  /**
   * Crosshair configuration object for customizing the appearance of the crosshair line.
   */
  crosshairConfig?: CrosshairConfig;
  /**
   * The width of the timeline bars in pixels.
   * Default: 12
   */
  lineWidth?: number;
  /**
   * The height of each row in the timeline in pixels.
   * Default: 24
   */
  rowHeight?: number;
  /**
   * Optional position for the legend, if applicable.
   * See `LegendPosition` for available options.
   * Default: LegendPosition.TopRight
   */
  legendPosition?: LegendPosition;
  /**
   * Optional style object for the legend container. Allows custom CSS styling.
   */
  legendStyle?: string | Record<string, string>;
  /**
   * If `true`, hides the chart legend.
   */
  hideLegend?: boolean;
  /**
   * If `true`, displays tick lines on the x-axis.
   */
  xTickLine?: boolean;
  xTickFormat?: (tick: number | Date, i?: number, ticks?: number[] | Date[]) => string;
  xMinMaxTicksOnly?: boolean;
  xTickValues?: number[] | Date[];
  xGridLine?: boolean;
  xDomainLine?: boolean;

  /**
   * Axis configuration object for customizing the appearance of the axes.
   */
  xAxisConfig?: AxisConfig;
  /**
   * Axis configuration object for customizing the appearance of the axes.
   */
  yAxisConfig?: AxisConfig;
}
