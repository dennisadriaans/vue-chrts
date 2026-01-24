export type MapRegion = {
  lat: { min: number; max: number };
  lng: { min: number; max: number };
};

export type MapPin = {
  lat: number;
  lng: number;
  svgOptions?: {
    color?: string;
    radius?: number;
    strokeColor?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
  };
  data?: Record<string, unknown>;
};

export interface DottedMapProps {
  mapHeight?: number;
  mapWidth?: number;
  countries?: string[];
  region?: MapRegion;
  grid?: "vertical" | "diagonal";
  avoidOuterPins?: boolean;
  pins?: MapPin[];
  precomputedMap?: string | object;
  color?: string;
  dotSize?: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  shape?: "circle" | "hexagon";
  countryColors?: Record<string, string>;
  backgroundColor?: string;
}

export type DottedWorldMapProps = DottedMapProps;

export interface MapVariant {
  mapWidth?: number;
  mapHeight?: number;
  dotSize?: number;
  grid?: "vertical" | "diagonal";
  shape?: "circle" | "hexagon";
  countryColors?: Record<string, string>;
  strokeWidth?: number;
  strokeOpacity?: number;
  countries?: string[];
  region?: MapRegion;
  pins?: MapPin[];
  color?: string;
  defaultZoom?: number;
}

export type MapRegionName = "world" | "europe" | "asia" | "oceania" | "usa";

export interface MapLegendItem {
  color: string;
  label: string;
}

export interface ZoomConfig {
  min: number;
  max: number;
  step: number;
  default: number;
}
