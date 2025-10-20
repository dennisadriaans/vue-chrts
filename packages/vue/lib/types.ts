import { AreaChartProps } from "./components/AreaChart/types";
import { BarChartProps } from "./components/BarChart/types";
import { LineChartProps } from "./components/LineChart/types";
import { DonutChartProps } from "./components/DonutChart/types";
import { BubbleChartProps } from "./components/BubbleChart/types";
import { TimelineProps, TimelineLegendItem } from "./components/Timeline/types";

enum LegendPosition {
  TopLeft = "top-left",
  TopCenter = "top-center",
  TopRight = "top-right",
  BottomLeft = "bottom-left",
  BottomCenter = "bottom-center",
  BottomRight = "bottom-right",
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
  color?: string | Array<string>;
  className?: string;
  shape?: "circle" | "square" | "triangle" | "diamond";
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
  type TimelineProps,
  type TimelineLegendItem
};

export type axisFormatter =
  | ((tick: number, i?: number, ticks?: number[]) => string)
  | ((tick: Date, i?: number, ticks?: Date[]) => string);

export interface AxisConfig {
  tickLine?: boolean;
  tickTextFontSize?: string;
  tickTextColor?: string;
  tickFormat?: axisFormatter;
  tickTextAlign?: "left" | "right" | "center";
  tickTextAngle?: number;
  tickTextWidth?: number;
  tickTextFitMode?: "wrap" | "trim";
  tickTextTrimType?: "start" | "middle" | "end";
  tickTextForceWordBreak?: boolean;
  tickTextSeparator?: string | readonly string[];
  minMaxTicksOnly?: boolean;
  minMaxTicksOnlyShowGridLines?: boolean;
  tickValues?: readonly number[] | readonly Date[];
}

export interface MarkerConfig {
  type?: "circle" | "square" | "triangle" | "diamond";
  size?: number;
  strokeWidth?: number;
  color?: string;
  strokeColor?: string;
}

export interface CrosshairConfig {
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
}
