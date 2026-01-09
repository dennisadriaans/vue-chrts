/**
 * Map region bounds defining the geographic area to display.
 * Used to specify a custom region for the dotted map.
 */
export interface DottedMapRegion {
  /**
   * Latitude range for the region.
   */
  lat: { min: number; max: number };
  /**
   * Longitude range for the region.
   */
  lng: { min: number; max: number };
}

/**
 * Alias for backwards compatibility.
 * @deprecated Use DottedMapRegion instead.
 */
export type MapRegion = DottedMapRegion;

/**
 * Represents a pin (marker) on the dotted map.
 * Pins are displayed as SVG elements at specific geographic coordinates.
 */
export interface DottedMapPin {
  /**
   * Latitude coordinate of the pin.
   */
  lat: number;
  /**
   * Longitude coordinate of the pin.
   */
  lng: number;
  /**
   * Optional SVG styling options for the pin.
   */
  svgOptions?: {
    /**
     * Fill color of the pin.
     */
    color?: string;
    /**
     * Radius of the pin in pixels.
     */
    radius?: number;
    /**
     * Stroke color of the pin.
     */
    strokeColor?: string;
    /**
     * Stroke width of the pin.
     */
    strokeWidth?: number;
    /**
     * Stroke opacity of the pin (0-1).
     */
    strokeOpacity?: number;
  };
  /**
   * Additional custom data associated with the pin.
   * Can be used to store metadata for tooltips or interactions.
   */
  data?: Record<string, unknown>;
}

/**
 * Alias for backwards compatibility.
 * @deprecated Use DottedMapPin instead.
 */
export type MapPin = DottedMapPin;

/**
 * Props for the DottedMap component.
 * Provides a highly customizable dotted world map visualization.
 */
export interface DottedMapProps {
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
   * Examples: ['USA', 'GBR', 'FRA', 'DEU']
   * If omitted, the whole world is displayed.
   */
  countries?: string[];
  /**
   * Specific geographic region to display.
   * Allows focusing on a particular area of the world.
   */
  region?: DottedMapRegion;
  /**
   * Grid alignment pattern for the dots.
   * - 'vertical': Standard vertical grid alignment
   * - 'diagonal': Diagonal hexagonal-style alignment
   * @default 'vertical'
   */
  grid?: 'vertical' | 'diagonal';
  /**
   * If true, prevents adding pins when they are outside of the specified region or countries.
   * Useful for ensuring all pins fall within the visible map area.
   * @default false
   */
  avoidOuterPins?: boolean;
  /**
   * Array of pins (markers) to display on the map.
   * Each pin represents a specific location with optional styling.
   */
  pins?: DottedMapPin[];
  /**
   * Precomputed map data (JSON string or object).
   * If provided, it will be used instead of computing the map from scratch.
   * This can significantly improve performance for complex maps.
   */
  precomputedMap?: string | object;
  /**
   * Default color of the map dots.
   * @default '#ffffff'
   */
  color?: string;
  /**
   * Default size (radius) of the map dots.
   * @default 0.5
   */
  dotSize?: number;
  /**
   * Stroke color for the map dots.
   * If not specified, dots will not have a stroke.
   */
  strokeColor?: string;
  /**
   * Stroke width for the map dots in pixels.
   * Only applies if strokeColor is specified.
   */
  strokeWidth?: number;
  /**
   * Stroke opacity for the map dots (0-1).
   * Only applies if strokeColor is specified.
   */
  strokeOpacity?: number;
  /**
   * Shape of the map dots.
   * - 'circle': Standard circular dots
   * - 'hexagon': Hexagonal dots
   * @default 'circle'
   */
  shape?: 'circle' | 'hexagon';
  /**
   * Background color of the map container.
   * Useful for creating contrast with the map dots.
   */
  backgroundColor?: string;
  /**
   * If true, renders the map as a raw SVG string for maximum performance.
   * Note: This disables interactive features like pan and zoom.
   * @default false
   */
  useRawSvg?: boolean;
}

/**
 * Alias for backwards compatibility.
 * @deprecated Use DottedMapProps instead.
 */
export type DottedWorldMapProps = DottedMapProps;

/**
 * Configuration for map variants.
 * Used internally to manage different map configurations.
 */
export interface MapVariant {
  /**
   * The width of the map in dots.
   */
  mapWidth?: number;
  /**
   * The height of the map in dots.
   */
  mapHeight?: number;
  /**
   * Default size (radius) of the map dots.
   */
  dotSize?: number;
  /**
   * Grid alignment pattern for the dots.
   */
  grid?: 'vertical' | 'diagonal';
  /**
   * Shape of the map dots.
   */
  shape?: 'circle' | 'hexagon';
  /**
   * Stroke width for the map dots in pixels.
   */
  strokeWidth?: number;
  /**
   * Stroke opacity for the map dots (0-1).
   */
  strokeOpacity?: number;
  /**
   * Array of ISO 3166-1 alpha-3 country codes to include in the map.
   */
  countries?: string[];
  /**
   * Specific geographic region to display.
   */
  region?: MapRegion;
  /**
   * Array of pins (markers) to display on the map.
   */
  pins?: MapPin[];
  /**
   * Default color of the map dots.
   */
  color?: string;
  /**
   * Default zoom level for the map.
   */
  defaultZoom?: number;
}

/**
 * Predefined region names for quick map configuration.
 * These correspond to commonly used geographic regions.
 */
export type MapRegionName = 'world' | 'europe' | 'asia' | 'oceania' | 'usa';

/**
 * Legend item for the map.
 * Used to display color-coded information about map data.
 */
export interface MapLegendItem {
  /**
   * Color associated with this legend item.
   */
  color: string;
  /**
   * Label text for this legend item.
   */
  label: string;
}

/**
 * Configuration for zoom controls.
 * Defines the zoom behavior and limits for the map.
 */
export interface ZoomConfig {
  /**
   * Minimum allowed zoom level.
   */
  min: number;
  /**
   * Maximum allowed zoom level.
   */
  max: number;
  /**
   * Zoom step increment for zoom in/out actions.
   */
  step: number;
  /**
   * Default zoom level when the map is first loaded.
   */
  default: number;
}
