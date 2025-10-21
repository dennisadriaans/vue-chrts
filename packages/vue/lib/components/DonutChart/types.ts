import { BulletLegendItemInterface, LegendPosition } from "../../types";

export type DonutChartProps = {
  /**
   * The type of donut chart to render.
   * See `DonutType` for available options.
   */
  type?: DonutType;
  /**
   * The data to be displayed in the donut chart.
   * Each number in the array represents a segment value.
   */
  data: number[];
  /**
   * The arc width of the chart in pixels.
   */
  arcWidth?: number;
  /**
   * The height of the chart in pixels.
   */
  height: number;
  /**
   * The radius of the donut in pixels.
   */
  radius: number;
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
   * Optional style object for the legend container. Allows custom CSS styling.
   */
  legendStyle?: string | Record<string, string>;
  /**
   * A record mapping category keys to `BulletLegendItemInterface` objects.
   * This defines the visual representation and labels for each category in the chart's legend.
   */
  categories: Record<string, BulletLegendItemInterface>;

  /**
   * Pad angle. Default: 0
   */
  padAngle?: number;
};

enum DonutType {
  Half = "half",
  Full = "full",
}

export { DonutType };
