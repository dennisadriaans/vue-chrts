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

export interface BulletLegendItemInterface {
  name: string | number;
  color?: string | Array<string>;
  className?: string;
  inactive?: boolean;
  hidden?: boolean;
  pointer?: boolean;
}

export enum Orientation {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

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

export type MarkerConfig = {
  id: string,
  config: {
    [key: string]: {
    type?: "circle" | "square" | "triangle" | "diamond";
    size?: number;
    strokeWidth?: number;
    color?: string;
    strokeColor?: string;
  };
  }
};

export interface CrosshairConfig {
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  template?: (d: any) => string;
}

export interface TooltipConfig {
  /**
   * Hide delay in milliseconds. Default: undefined
   */
  hideDelay?: number;
  /**
   * Show delay in milliseconds. Default: undefined
   */
  showDelay?: number;
  /**
   * If `true`, the tooltip will follow the cursor.
   */
  followCursor?: boolean;
}

export * from "./area-chart";
export * from "./bar-chart";
export * from "./bubble-chart";
export * from "./donut-chart";
export * from "./gantt-chart";
export * from "./line-chart";

