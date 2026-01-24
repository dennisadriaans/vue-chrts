export type MapPoint = {
  id: string;
  latitude: number;
  longitude: number;
  color?: string;
  [key: string]: any;
};

export type MapLink = {
  source: string | number | MapPoint;
  target: string | number | MapPoint;
  color?: string;
  width?: number;
};

export type MapArea = {
  id: string;
  color?: string;
  [key: string]: any;
};

export type MapData = {
  points?: MapPoint[];
  links?: MapLink[];
  areas?: MapArea[];
};

export interface TopoJSONMapProps {
  data: MapData;
  width?: number;
  height?: number;
  disableZoom?: boolean;
  zoomFactor?: number;
  zoomExtent?: [number, number];
  zoomDuration?: number;
  mapFitToPoints?: boolean;
  pointColor?: string | ((d: MapPoint) => string);
  pointRadius?: number | ((d: MapPoint) => number);
  pointStrokeWidth?: number | ((d: MapPoint) => number);
  pointCursor?: string | ((d: MapPoint) => string);
  pointLabel?: (d: MapPoint) => string;
  linkColor?: string | ((d: MapLink) => string);
  linkWidth?: number | ((d: MapLink) => number);
  linkCursor?: string | ((d: MapLink) => string);
  areaColor?: string | ((d: MapArea) => string);
  areaCursor?: string | ((d: MapArea) => string);
  heatmapMode?: boolean;
  heatmapModeBlurStdDeviation?: number;
  heatmapModeZoomLevelThreshold?: number;
  projection?: any;
}
