import type { GeoProjection } from "d3-geo";

export type MapsData<T extends Record<string, any>> = {
  mapFeatureKey: keyof T;
  data: any;
  topojson: any;
  zoomFactor?: number;
  projection?: GeoProjection;
};