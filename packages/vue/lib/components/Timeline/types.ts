import { BulletLegendItemInterface, CrosshairConfig, LegendPosition } from "../../types";

export interface TimelineLegendItem {
  name: string;
  color: string;
}

export interface TimelineProps<T extends Record<string, any>> {
  data: T[];
  labelWidth?: number;
  height?: number;
  title?: string;
  categories: Record<string, BulletLegendItemInterface>;
  x: (d: T) => number;
  length: (d: T) => number;
  type: (d: T) => string;
  getTooltipText?: (label: string, index: number, data: T[]) => string;
  showLabels?: boolean;
  hideTooltip?: boolean;
  crosshairConfig?: CrosshairConfig;
  lineWidth?: number;
  rowHeight?: number;
  legendPosition?: LegendPosition;
  legendStyle?: Record<string, string>;
  hideLegend?: boolean;
}
