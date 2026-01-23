// Map region bounds (used by both old DottedWorldMap and new DottedMap)
export type MapRegion = {
  lat: { min: number; max: number }
  lng: { min: number; max: number }
}

// Map pin types
export type MapPin = {
  lat: number
  lng: number
  svgOptions?: {
    color?: string
    radius?: number
    strokeColor?: string
    strokeWidth?: number
    strokeOpacity?: number
  }
  data?: Record<string, unknown>
}

// Props for the core DottedMap component (formerly DottedWorldMap)
export interface DottedMapProps {
  /**
   * The height of the map in dots.
   * If specified, width will be calculated automatically to preserve aspect ratio.
   */
  mapHeight?: number
  /**
   * The width of the map in dots.
   * If specified, height will be calculated automatically to preserve aspect ratio.
   */
  mapWidth?: number
  /**
   * Array of ISO 3166-1 alpha-3 country codes to include in the map.
   * If omitted, the whole world is used.
   */
  countries?: string[]
  /**
   * Specific region to display.
   */
  region?: MapRegion
  /**
   * How points should be aligned.
   * @default 'vertical'
   */
  grid?: 'vertical' | 'diagonal'
  /**
   * If true, prevent adding pins when they are outside of region/countries.
   * @default false
   */
  avoidOuterPins?: boolean
  /**
   * Array of pins to add to the map.
   */
  pins?: MapPin[]
  /**
   * Precomputed map data (JSON string or object).
   * If provided, it will be used instead of computing the map from scratch.
   */
  precomputedMap?: string | object
  /**
   * Default color of the dots.
   * @default '#ffffff'
   */
  color?: string
  /**
   * Default size (radius) of the dots.
   * @default 0.5
   */
  dotSize?: number
  /**
   * Stroke color of the dots.
   */
  strokeColor?: string
  /**
   * Stroke width of the dots.
   */
  strokeWidth?: number
  /**
   * Stroke opacity of the dots.
   */
  strokeOpacity?: number
  /**
   * Shape of the dots.
   * @default 'circle'
   */
  shape?: 'circle' | 'hexagon'
  /**
   * Custom colors for specific countries.
   */
  countryColors?: Record<string, string>
  /**
   * Background color of the map container.
   */
  backgroundColor?: string
}

// Backwards compatibility alias
export type DottedWorldMapProps = DottedMapProps

// Map variant configuration
export interface MapVariant {
  mapWidth?: number
  mapHeight?: number
  dotSize?: number
  grid?: 'vertical' | 'diagonal'
  shape?: 'circle' | 'hexagon'
  /**
   * Custom colors for specific countries.
   */
  countryColors?: Record<string, string>
  strokeWidth?: number
  strokeOpacity?: number
  countries?: string[]
  region?: MapRegion
  pins?: MapPin[]
  color?: string
  defaultZoom?: number
}

// Supported regions
export type MapRegionName = 'world' | 'europe' | 'asia' | 'oceania' | 'usa'

// Legend item for map
export interface MapLegendItem {
  color: string
  label: string
}

// Zoom control configuration
export interface ZoomConfig {
  min: number
  max: number
  step: number
  default: number
}
