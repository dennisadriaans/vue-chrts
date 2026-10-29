import type { GeoProjection } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology, GeometryObject } from "topojson-specification";
import type { LegendPosition } from "../enums";
import type { ChartStyleProps } from "./charts";
import type { BulletLegendItemInterface, ChartPadding, ChartTheme, axisFormatter } from "./shared";

export type MapAccessor<T, V> = V | ((datum: T, index: number) => V);
export type MapProjectionName = "mercator" | "equalEarth" | "naturalEarth" | "equirectangular" | "orthographic" | "albersUsa";
/** Pass a projection name, a configured D3 projection, or a factory returning one. */
export type MapProjection = MapProjectionName | GeoProjection | (() => GeoProjection);
export type MapGeometry = FeatureCollection | Feature | Geometry | Topology<Record<string, GeometryObject>>;
export type MapRegionName = "world" | "europe" | "asia" | "oceania" | "usa";
export interface MapRegion { lat: { min: number; max: number }; lng: { min: number; max: number } }
export interface MapPoint {
  id: string | number;
  latitude: number;
  longitude: number;
  label?: string;
  color?: string;
  radius?: number;
  [key: string]: unknown;
}
export interface MapLink<P extends MapPoint = MapPoint> {
  source: string | number | P;
  target: string | number | P;
  color?: string;
  width?: number;
  label?: string;
  [key: string]: unknown;
}
export interface MapArea { id: string | number; color?: string; value?: number; [key: string]: unknown }
export interface MapData<A extends MapArea = MapArea, P extends MapPoint = MapPoint, L extends MapLink<P> = MapLink<P>> {
  areas?: A[];
  points?: P[];
  links?: L[];
}
/** Area accessors and tooltips receive joined row data and the original feature. */
export type MapFeature<A extends MapArea = MapArea> = A & { properties: Record<string, unknown>; feature: Feature };
export interface MapPin {
  lat: number;
  lng: number;
  id?: string | number;
  label?: string;
  color?: string;
  radius?: number;
  svgOptions?: { color?: string; radius?: number; strokeColor?: string; strokeWidth?: number; strokeOpacity?: number };
  data?: Record<string, unknown>;
  [key: string]: unknown;
}
export interface MapLegendItem { color: string; label: string }
export interface MapDot extends MapPin { x: number; y: number; countryId?: string }
export interface PrecomputedMap {
  width: number;
  height: number;
  points: Record<string, MapDot>;
  region?: MapRegion;
  grid?: "vertical" | "diagonal";
  projection?: MapProjectionName;
  countries?: string[];
  /** Projection metadata used by getPin. */
  scale?: number;
  translate?: [number, number];
  /** Legacy Mercator bounds from maps precomputed with nuxt-charts v2. */
  X_MIN?: number;
  Y_MAX?: number;
  X_RANGE?: number;
  Y_RANGE?: number;
  ystep?: number;
}
export interface MapZoom { x: number; y: number; k: number }
export interface MapMarkSlot<T> {
  values: T;
  x?: number;
  y?: number;
  path?: string;
  color: string;
  radius?: number;
  scale: number;
  projection: GeoProjection;
}
export interface MapOverlaySlot {
  width: number;
  height: number;
  transform: MapZoom;
  projection: GeoProjection;
}
export type MapTooltipSlot<A extends MapArea, P extends MapPoint, L extends MapLink<P>> =
  | { kind: "feature"; values: MapFeature<A> }
  | { kind: "point"; values: P }
  | { kind: "link"; values: L };
export type DottedMapTooltipSlot =
  | { kind: "pin"; values: MapPin }
  | { kind: "dot"; values: MapDot };
export type MapInteractionKind = "feature" | "point" | "link" | "pin" | "dot";
export interface MapBaseProps extends ChartStyleProps {
  height?: number | string;
  width?: number | string;
  projection?: MapProjection;
  /** Fit the projection to the geometry. Default true. Disable for a preconfigured projection. */
  fitView?: boolean;
  fitViewPadding?: number;
  padding?: number | Partial<ChartPadding>;
  disableZoom?: boolean;
  zoomFactor?: number;
  zoomExtent?: [number, number];
  /** Wheel zoom is opt-in so a map does not capture normal page scrolling. */
  zoomOnScroll?: boolean;
  /** Pixels the map can be dragged past its edges, so it can be nudged even when fully zoomed out. Default 0. */
  panPadding?: number;
  zoomDuration?: number;
  duration?: number;
  showControls?: boolean;
  hideTooltip?: boolean;
  hideLegend?: boolean;
  categories?: Record<string, BulletLegendItemInterface>;
  legendPosition?: LegendPosition;
  legendStyle?: string | Record<string, string>;
  backgroundColor?: string;
  theme?: ChartTheme;
  showGraticule?: boolean;
  showSphere?: boolean;
  graticuleColor?: string;
  sphereColor?: string;
}
export interface TopoJSONMapProps<A extends MapArea = MapArea, P extends MapPoint = MapPoint, L extends MapLink<P> = MapLink<P>> extends MapBaseProps {
  /** Omit geometry to use the bundled world map. */
  topoJson?: MapGeometry;
  geoJson?: MapGeometry;
  /** TopoJSON object name; defaults to countries, land, or the first object. */
  mapFeatureKey?: string;
  /** Property used to join areas to features. Defaults to feature.id. */
  featureId?: string | ((feature: Feature) => string | number);
  data?: MapData<A, P, L>;
  areaColor?: MapAccessor<MapFeature<A>, string>;
  areaCursor?: MapAccessor<MapFeature<A>, string>;
  areaStroke?: MapAccessor<MapFeature<A>, string>;
  areaStrokeWidth?: MapAccessor<MapFeature<A>, number>;
  areaOpacity?: MapAccessor<MapFeature<A>, number>;
  /** Draw this area above its neighbours so a highlight stroke is not covered. */
  activeArea?: string | number;
  /** Numeric field/accessor for an automatically scaled choropleth. */
  value?: keyof A | ((area: MapFeature<A>) => number | undefined);
  colorScale?: (value: number) => string;
  colorRange?: [string, string];
  valueDomain?: [number, number];
  pointColor?: MapAccessor<P, string>;
  pointSize?: MapAccessor<P, number>;
  pointRadius?: MapAccessor<P, number>;
  pointStrokeColor?: MapAccessor<P, string>;
  pointStrokeWidth?: MapAccessor<P, number>;
  pointCursor?: MapAccessor<P, string>;
  pointLabel?: MapAccessor<P, string>;
  showPointLabels?: boolean;
  linkColor?: MapAccessor<L, string>;
  linkWidth?: MapAccessor<L, number>;
  linkCursor?: MapAccessor<L, string>;
  linkDasharray?: MapAccessor<L, string>;
  /** Great-circle routes follow the globe and clip correctly at the date line. */
  linkCurve?: "geodesic" | "straight" | "arc";
  linkCurvature?: number;
  mapFitToPoints?: boolean;
  zoomOnClick?: boolean;
  heatmapMode?: boolean;
  heatmapModeBlurStdDeviation?: number;
  heatmapModeZoomLevelThreshold?: number;
  tooltipTitleFormatter?: (datum: MapFeature<A> | P | L) => string | number;
  yFormatter?: axisFormatter;
}
/** Compatibility name for the v2 TopoJSONMap prop interface. */
export type MapsData<A extends MapArea = MapArea> = TopoJSONMapProps<A>;
export interface DottedMapProps extends MapBaseProps {
  geoJson?: MapGeometry;
  mapFeatureKey?: string;
  regionName?: MapRegionName;
  region?: MapRegion;
  countries?: string[];
  pins?: MapPin[];
  mapHeight?: number;
  mapWidth?: number;
  grid?: "vertical" | "diagonal";
  shape?: "circle" | "hexagon";
  dotSize?: number;
  color?: string;
  countryColors?: Record<string, string>;
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  avoidOuterPins?: boolean;
  precomputedMap?: string | PrecomputedMap;
  defaultZoom?: number;
  showLegend?: boolean;
  legend?: MapLegendItem[];
  maxHeight?: number | string;
  pinColor?: MapAccessor<MapPin, string>;
  pinSize?: MapAccessor<MapPin, number>;
  showPinLabels?: boolean;
  tooltipTitleFormatter?: (datum: MapPin | MapDot) => string | number;
}
