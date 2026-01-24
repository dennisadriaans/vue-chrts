export enum LegendPosition {
  TopLeft = "top-left",
  TopCenter = "top-center",
  TopRight = "top-right",
  BottomLeft = "bottom-left",
  BottomCenter = "bottom-center",
  BottomRight = "bottom-right",
}

export enum CurveType {
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

export enum Orientation {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

export enum DonutType {
  Half = "half",
  Full = "full",
}

export type {
  BulletLegendItemInterface,
  axisFormatter,
  AxisConfig,
  MarkerConfig,
  CrosshairConfig
} from "@vue-chrts/shared";

export type AreaChartCategory = import("@vue-chrts/shared").BulletLegendItemInterface;

