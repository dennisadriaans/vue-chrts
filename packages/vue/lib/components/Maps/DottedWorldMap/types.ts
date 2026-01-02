export interface DottedMapRegion {
  lat: { min: number; max: number };
  lng: { min: number; max: number };
}

export interface DottedMapPin {
  lat: number;
  lng: number;
  svgOptions?: {
    color?: string;
    radius?: number;
    strokeColor?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
  };
  data?: any;
}

export interface DottedWorldMapProps {
  /**
   * The height of the map in dots.
   * If specified, width will be calculated automatically to preserve aspect ratio.
   */
  mapHeight?: number;
  /**
   * The width of the map in dots.
   * If specified, height will be calculated automatically to preserve aspect ratio.
   */
  mapWidth?: number;
  /**
   * Array of ISO 3166-1 alpha-3 country codes to include in the map.
   * If omitted, the whole world is used.
   */
  countries?: string[];
  /**
   * Specific region to display.
   */
  region?: DottedMapRegion;
  /**
   * How points should be aligned.
   * @default 'vertical'
   */
  grid?: 'vertical' | 'diagonal';
  /**
   * If true, prevent adding pins when they are outside of region/countries.
   * @default false
   */
  avoidOuterPins?: boolean;
  /**
   * Array of pins to add to the map.
   */
  pins?: DottedMapPin[];
  /**
   * Precomputed map data (JSON string or object).
   * If provided, it will be used instead of computing the map from scratch.
   */
  precomputedMap?: string | object;
  /**
   * Default color of the dots.
   * @default '#ffffff'
   */
  color?: string;
  /**
   * Default size (radius) of the dots.
   * @default 0.5
   */
  dotSize?: number;
  /**
   * Stroke color of the dots.
   */
  strokeColor?: string;
  /**
   * Stroke width of the dots.
   */
  strokeWidth?: number;
  /**
   * Stroke opacity of the dots.
   */
  strokeOpacity?: number;
  /**
   * Shape of the dots.
   * @default 'circle'
   */
  shape?: 'circle' | 'hexagon';
  /**
   * Background color of the map container.
   */
  backgroundColor?: string;
  /**
   * Height of the component container.
   * @default '600px'
   */
  height?: string | number;
  /**
   * If true, render the map as a raw SVG string for maximum performance.
   * Note: This disables Unovis interactivity features.
   * @default false
   */
  useRawSvg?: boolean;
}
