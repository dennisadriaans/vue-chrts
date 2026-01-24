import {
  axisFormatter,
  CrosshairConfig,
  LegendPosition,
  AxisConfig,
  BulletLegendItemInterface,
  Orientation,
  TooltipConfig,
} from "../../types";
import type { CurveType } from "@unovis/ts";

export interface DualChartProps<T> {
  data: T[];
  height: number;
  xLabel?: string;
  yLabel?: string;
  yLabelSecondary?: string;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  barCategories: Record<string, BulletLegendItemInterface>;
  lineCategories: Record<string, BulletLegendItemInterface>;
  barYAxis: (keyof T)[];
  lineYAxis: (keyof T)[];
  xFormatter?: axisFormatter;
  yFormatter?: axisFormatter;
  tooltipTitleFormatter?: (data: T) => string | number;
  curveType?: CurveType;
  lineWidth?: number;
  xNumTicks?: number;
  xExplicitTicks?: (number | string | Date)[];
  minMaxTicksOnly?: boolean;
  yNumTicks?: number;
  hideLegend?: boolean;
  hideTooltip?: boolean;
  legendPosition?: LegendPosition;
  legendStyle?: string | Record<string, string>;
  xDomainLine?: boolean;
  yDomainLine?: boolean;
  xTickLine?: boolean;
  yTickLine?: boolean;
  xGridLine?: boolean;
  yGridLine?: boolean;
  hideXAxis?: boolean;
  hideYAxis?: boolean;
  crosshairConfig?: CrosshairConfig;
  xAxisConfig?: AxisConfig;
  yAxisConfig?: AxisConfig;
  yDomain?: [number | undefined, number | undefined];
  xDomain?: [number | undefined, number | undefined];
  stacked?: boolean;
  groupPadding?: number;
  barPadding?: number;
  radius?: number;
  orientation?: Orientation;
  duration?: number;
  tooltip?: TooltipConfig;
}
