import type { GeoProjection } from "d3-geo";
import { axisFormatter, BulletLegendItemInterface } from "../../../types";

export type MapsData<T extends Record<string, any>> = {
  mapFeatureKey: keyof T;
  data: any;
  topojson: any;
  zoomFactor?: number;
  projection?: GeoProjection;
  areaColor?: string | ((d: any) => string);
  areaCursor?: string | ((d: any) => string);
  height?: string | number;
  width?: string | number;
  fitView?: boolean;
  fitViewPadding?: number;
  hideTooltip?: boolean;
  tooltipTitleFormatter?: (data: T) => string | number;
  yFormatter?: axisFormatter;
  categories?: Record<string, BulletLegendItemInterface>;
};