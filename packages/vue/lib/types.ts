
export interface BulletLegendItemInterface {
  name: string | number;
  color?: string | Array<string>;
  className?: string;
  inactive?: boolean;
  hidden?: boolean;
  pointer?: boolean;
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
