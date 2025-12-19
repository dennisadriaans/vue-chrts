import type {
  axisFormatter,
  LegendPosition,
  CrosshairConfig,
  AxisConfig,
  MarkerConfig,
} from "../../types";
import type { BulletLegendItemInterface, Orientation, CurveType } from "@unovis/ts";

export interface DualChartProps<T> {
  /**
   * The data to be displayed in the dual chart.
   */
  data: T[];

  /**
   * The height of the chart in pixels.
   */
  height: number;

  /**
   * If `true`, creates a stacked bar chart instead of grouped bars.
   */
  stacked?: boolean;

  /**
   * An array of property keys from the data object type 'T' to be used for the bar y-axis values.
   */
  barYAxis: (keyof T)[];

  /**
   * A record mapping bar category keys to `BulletLegendItemInterface` objects.
   */
  barCategories: Record<string, BulletLegendItemInterface>;

  /**
   * An array of property keys from the data object type 'T' to be used for the line y-axis values.
   */
  lineYAxis?: (keyof T)[];

  /**
   * A record mapping line category keys to `BulletLegendItemInterface` objects.
   */
  lineCategories?: Record<string, BulletLegendItemInterface>;

  /**
   * An array of property keys from the data object type 'T' to be used for the area y-axis values.
   */
  areaYAxis?: (keyof T)[];

  /**
   * A record mapping area category keys to `BulletLegendItemInterface` objects.
   */
  areaCategories?: Record<string, BulletLegendItemInterface>;

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
   */
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  /**
   * Optional formatter for x-axis ticks.
   */
  xFormatter?: axisFormatter;

  /**
   * Optional formatter for y-axis ticks.
   */
  yFormatter?: axisFormatter;

  /**
   * Use custom formatter for tooltip titles
   */
  tooltipTitleFormatter?: (data: T) => string | number;

  /**
   * The type of curve to use for lines and areas.
   */
  curveType?: CurveType;

  /**
   * The width of lines in pixels. Default is 2px.
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
   * The padding between groups of bars in pixels.
   */
  groupPadding?: number;

  /**
   * Fractional padding between the bars in the range of [0,1). Default: 0.2
   */
  barPadding?: number;

  /**
   * Rounded corners for top bars. Number in pixels. Default: 0
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
   */
  orientation?: Orientation;

  /**
   * Optional position for the legend.
   */
  legendPosition?: LegendPosition;

  /**
   * Optional style object for the legend container.
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
   * Axis configuration object for customizing the appearance of the x-axis.
   */
  xAxisConfig?: AxisConfig;

  /**
   * Axis configuration object for customizing the appearance of the y-axis.
   */
  yAxisConfig?: AxisConfig;

  /**
   * Crosshair configuration object.
   */
  crosshairConfig?: CrosshairConfig;

  /**
   * If `true`, hides the area fill for area charts (displays only the line).
   */
  hideArea?: boolean;

  /**
   * Edit the gradient stops for the area fill.
   */
  gradientStops?: Array<{ offset: string; stopOpacity: number }>;

  /**
   * A record mapping marker keys to show custom patterns.
   */
  markerConfig?: MarkerConfig;

  /**
   * Line dash array for area lines, see SVG's stroke-dasharray.
   */
  lineDashArray?: number[][];
}
