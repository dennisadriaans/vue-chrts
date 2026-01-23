
export type MapPoint = {
  id: string;
  latitude: number;
  longitude: number;
  color?: string;
  [key: string]: any; // Allow additional custom properties
}

export type MapLink = {
  source: string | number | MapPoint;
  target: string | number | MapPoint;
  color?: string;
  width?: number;
}

export type MapArea = {
  id: string;
  color?: string;
  [key: string]: any; // Allow additional custom properties
}

export type MapData = {
  points?: MapPoint[];
  links?: MapLink[];
  areas?: MapArea[];
}

export interface TopoJSONMapProps {
  data: MapData;
  
  // Optional Configuration Props
  width?: number;
  height?: number;
  
  // Zoom Configuration
  disableZoom?: boolean;
  zoomFactor?: number;
  zoomExtent?: [number, number];
  zoomDuration?: number;
  
  // Point Configuration
  mapFitToPoints?: boolean;
  pointColor?: string | ((d: MapPoint) => string);
  pointRadius?: number | ((d: MapPoint) => number);
  pointStrokeWidth?: number | ((d: MapPoint) => number);
  pointCursor?: string | ((d: MapPoint) => string);
  pointLabel?: (d: MapPoint) => string;
  
  // Link Configuration
  linkColor?: string | ((d: MapLink) => string);
  linkWidth?: number | ((d: MapLink) => number);
  linkCursor?: string | ((d: MapLink) => string);
  
  // Area Configuration
  areaColor?: string | ((d: MapArea) => string);
  areaCursor?: string | ((d: MapArea) => string);
  
  // Heatmap Mode
  heatmapMode?: boolean;
  heatmapModeBlurStdDeviation?: number;
  heatmapModeZoomLevelThreshold?: number;
  
  // Projection (optional - use D3 projection if custom needed)
  projection?: any;
}
