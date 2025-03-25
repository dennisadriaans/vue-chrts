import { AreaChartProps } from "./components/AreaChart/types";
import { BarChartProps } from "./components/BarChart/types";
import { LineChartProps } from "./components/LineChart/types";
import { DonutChartProps } from "./components/DonutChart/types";

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
};
