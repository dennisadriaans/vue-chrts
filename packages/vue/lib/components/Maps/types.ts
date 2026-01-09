/**
 * Represents a geographic point on a TopoJSON map.
 * Used to mark specific locations with optional styling.
 */
export type MapPoint = {
  /**
   * Unique identifier for the point.
   */
  id: string;
  /**
   * Latitude coordinate of the point.
   */
  latitude: number;
  /**
   * Longitude coordinate of the point.
   */
  longitude: number;
  /**
   * Optional color override for this specific point.
   * If not provided, the default point color will be used.
   */
  color?: string;
  /**
   * Additional custom properties for the point.
   * Can be used to store metadata for tooltips, labels, or interactions.
   */
  [key: string]: any;
};

/**
 * Represents a link (connection) between two points on a TopoJSON map.
 * Used to visualize relationships or flows between geographic locations.
 */
export type MapLink = {
  /**
   * Source point of the link.
   * Can be a point ID, numeric index, or MapPoint object.
   */
  source: string | number | MapPoint;
  /**
   * Target point of the link.
   * Can be a point ID, numeric index, or MapPoint object.
   */
  target: string | number | MapPoint;
  /**
   * Optional color override for this specific link.
   * If not provided, the default link color will be used.
   */
  color?: string;
  /**
   * Optional width override for this specific link in pixels.
   * If not provided, the default link width will be used.
   */
  width?: number;
};

/**
 * Represents a geographic area (region, country, state, etc.) on a TopoJSON map.
 * Used to color or highlight specific geographic regions.
 */
export type MapArea = {
  /**
   * Unique identifier for the area.
   * Should match the ID in the TopoJSON feature properties.
   */
  id: string;
  /**
   * Optional color override for this specific area.
   * If not provided, the default area color will be used.
   */
  color?: string;
  /**
   * Additional custom properties for the area.
   * Can be used to store metadata for tooltips, labels, or interactions.
   */
  [key: string]: any;
};

/**
 * Complete data structure for a TopoJSON map visualization.
 * Contains all geographic elements to be rendered on the map.
 */
export type MapData = {
  /**
   * Array of points to display on the map.
   * Optional - omit if no points are needed.
   */
  points?: MapPoint[];
  /**
   * Array of links to display on the map.
   * Optional - omit if no links are needed.
   */
  links?: MapLink[];
  /**
   * Array of areas to highlight or color on the map.
   * Optional - omit if no custom area styling is needed.
   */
  areas?: MapArea[];
};

/**
 * Props for the TopoJSONMap component.
 * Provides a customizable map visualization using TopoJSON topology data.
 */
export interface TopoJSONMapProps {
  // Required Props
  /**
   * Type of predefined map to display.
   * Determines which TopoJSON topology to load.
   * - 'uk': United Kingdom map
   * - 'france': France map
   * - 'usa': United States map
   */
  mapType: 'uk' | 'france' | 'usa';
  /**
   * The data to be visualized on the map.
   * Includes points, links, and areas.
   */
  data: MapData;
  
  // Optional Configuration Props
  /**
   * Width of the map in pixels.
   * If not specified, the map will use a default width.
   */
  width?: number;
  /**
   * Height of the map in pixels.
   * If not specified, the map will use a default height.
   */
  height?: number;
  
  // Zoom Configuration
  /**
   * If true, disables zoom and pan interactions.
   * @default false
   */
  disableZoom?: boolean;
  /**
   * Initial zoom factor for the map.
   * @default 1
   */
  zoomFactor?: number;
  /**
   * Zoom extent limits as [min, max].
   * Controls how far users can zoom in and out.
   * @default [0.5, 10]
   */
  zoomExtent?: [number, number];
  /**
   * Duration of zoom animations in milliseconds.
   * @default 300
   */
  zoomDuration?: number;
  
  // Point Configuration
  /**
   * If true, automatically fits the map viewport to include all points.
   * Useful for ensuring all data is visible.
   * @default false
   */
  mapFitToPoints?: boolean;
  /**
   * Color for map points.
   * Can be a static color string or a function that returns a color based on the point data.
   */
  pointColor?: string | ((d: MapPoint) => string);
  /**
   * Radius for map points in pixels.
   * Can be a static number or a function that returns a radius based on the point data.
   */
  pointRadius?: number | ((d: MapPoint) => number);
  /**
   * Stroke width for map points in pixels.
   * Can be a static number or a function that returns a stroke width based on the point data.
   */
  pointStrokeWidth?: number | ((d: MapPoint) => number);
  /**
   * CSS cursor style for map points.
   * Can be a static cursor string or a function that returns a cursor based on the point data.
   * @example 'pointer', 'default', 'help'
   */
  pointCursor?: string | ((d: MapPoint) => string);
  /**
   * Function to generate labels for map points.
   * The returned string will be displayed near the point.
   */
  pointLabel?: (d: MapPoint) => string;
  /**
   * Position of the point label relative to the point.
   * @default 'top'
   */
  pointLabelPosition?: 'top' | 'bottom' | 'left' | 'right';
  
  // Link Configuration
  /**
   * Color for map links.
   * Can be a static color string or a function that returns a color based on the link data.
   */
  linkColor?: string | ((d: MapLink) => string);
  /**
   * Width for map links in pixels.
   * Can be a static number or a function that returns a width based on the link data.
   */
  linkWidth?: number | ((d: MapLink) => number);
  /**
   * CSS cursor style for map links.
   * Can be a static cursor string or a function that returns a cursor based on the link data.
   */
  linkCursor?: string | ((d: MapLink) => string);
  
  // Area Configuration
  /**
   * Color for map areas.
   * Can be a static color string or a function that returns a color based on the area data.
   */
  areaColor?: string | ((d: MapArea) => string);
  /**
   * CSS cursor style for map areas.
   * Can be a static cursor string or a function that returns a cursor based on the area data.
   */
  areaCursor?: string | ((d: MapArea) => string);
  
  // Heatmap Mode
  /**
   * If true, enables heatmap visualization mode.
   * Points will be rendered as a blurred heatmap instead of discrete markers.
   * @default false
   */
  heatmapMode?: boolean;
  /**
   * Standard deviation for the Gaussian blur in heatmap mode.
   * Higher values create more diffuse heatmap effects.
   * @default 10
   */
  heatmapModeBlurStdDeviation?: number;
  /**
   * Zoom level threshold at which to switch from heatmap to discrete points.
   * Useful for performance optimization.
   * @default 1.5
   */
  heatmapModeZoomLevelThreshold?: number;
  
  // Projection (optional - use D3 projection if custom needed)
  /**
   * Optional custom D3 geographic projection.
   * If not provided, a default projection suitable for the mapType will be used.
   * @see https://github.com/d3/d3-geo#projections
   */
  projection?: any;
}
