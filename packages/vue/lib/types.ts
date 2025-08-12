import { AreaChartProps } from "./components/AreaChart/types";
import { BarChartProps } from "./components/BarChart/types";
import { LineChartProps } from "./components/LineChart/types";
import { DonutChartProps } from "./components/DonutChart/types";
import { BubbleChartProps } from "./components/BubbleChart/types";
import { CandlestickChartProps } from "./components/CandleStickChart/types";

enum LegendPosition {
  Top = "top",
  Bottom = "bottom",
}

enum CurveType {
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

interface BulletLegendItemInterface {
  name: string | number;
  color?: string;
  className?: string;
  shape?: any;
  inactive?: boolean;
  hidden?: boolean;
  pointer?: boolean;
}

enum Orientation {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

export {
  LegendPosition,
  CurveType,
  Orientation,
  type AreaChartProps,
  type BarChartProps,
  type LineChartProps,
  type DonutChartProps,
  type BulletLegendItemInterface,
  type BubbleChartProps,
  type CandlestickChartProps
};

export type axisFormatter =
  | ((tick: number, i?: number, ticks?: number[]) => string)
  | ((tick: Date, i?: number, ticks?: Date[]) => string);

export interface MarkerConfig {
  type?: "circle" | "square" | "triangle" | "diamond";
  size?: number;
  strokeWidth?: number;
  color?: string;
  strokeColor?: string;
}

export interface CrosshairConfig {
  /**
   * The color of the crosshair line. Accepts any valid CSS color string.
   * Example: '#f00', 'rgba(0,0,0,0.5)', 'blue'
   */
  color?: string;
  /**
   * The stroke color of the crosshair line. Accepts any valid CSS color string.
   */
  strokeColor?: string;
  /**
   * The stroke width of the crosshair line in pixels.
   */
  strokeWidth?: number;
}
