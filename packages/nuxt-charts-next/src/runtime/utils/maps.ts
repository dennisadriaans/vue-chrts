import { geoAlbersUsa, geoArea, geoContains, geoEqualEarth, geoEquirectangular, geoMercator, geoNaturalEarth1, geoOrthographic, geoPath } from "d3-geo";
import type { GeoProjection, GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry, Polygon, MultiPolygon } from "geojson";
import type { Topology, GeometryObject } from "topojson-specification";
import world from "../data/world.json";
import type { MapAccessor, MapBaseProps, MapGeometry, MapInteractionKind, MapProjection, MapRegion, MapRegionName } from "../types/maps";

export interface MapMark {
  key: string;
  kind: MapInteractionKind;
  values: Record<string, unknown>;
  path?: string;
  x?: number;
  y?: number;
  radius?: number;
  polygon?: string;
  color: string;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  dasharray?: string;
  cursor?: string;
  label?: string;
  showLabel?: boolean;
}

export const MAP_REGIONS: Record<Exclude<MapRegionName, "world">, MapRegion> = {
  usa: { lat: { min: 24, max: 50 }, lng: { min: -125, max: -66 } },
  europe: { lat: { min: 34, max: 72 }, lng: { min: -25, max: 45 } },
  asia: { lat: { min: -10, max: 55 }, lng: { min: 60, max: 150 } },
  oceania: { lat: { min: -50, max: 0 }, lng: { min: 110, max: 180 } },
};
export const DEFAULT_MAP_REGION: MapRegion = { lat: { min: -60, max: 85 }, lng: { min: -180, max: 180 } };

export function mapValue<T, V>(accessor: MapAccessor<T, V> | undefined, datum: T, index: number, fallback: V): V {
  return typeof accessor === "function" ? (accessor as (d: T, i: number) => V)(datum, index) : accessor ?? fallback;
}

/** D3 uses clockwise exterior rings. Normalize RFC 7946 input without mutating it. */
function normalizeGeometry(geometry: Geometry | null): Geometry | null {
  if (!geometry) return null;
  if (geometry.type === "GeometryCollection") return { ...geometry, geometries: geometry.geometries.map(g => normalizeGeometry(g)!) };
  if (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon") return geometry;
  const orient = (rings: Polygon["coordinates"]) => rings.map((ring, index) => {
    const large = geoArea({ type: "Polygon", coordinates: [ring] }) > 2 * Math.PI;
    return large === (index === 0) ? [...ring].reverse() : ring;
  });
  return geometry.type === "Polygon"
    ? { ...geometry, coordinates: orient(geometry.coordinates) }
    : { ...geometry, coordinates: geometry.coordinates.map(orient) };
}

export function mapFeatures(source?: MapGeometry, objectName?: string): FeatureCollection {
  const input = source ?? world as FeatureCollection;
  let collection: FeatureCollection;
  if (input.type === "Topology") {
    const topology = input as Topology<Record<string, GeometryObject>>;
    const name = objectName ?? (topology.objects.countries ? "countries" : topology.objects.land ? "land" : Object.keys(topology.objects)[0]);
    const object = name ? topology.objects[name] : undefined;
    if (!object) throw new Error(`TopoJSON object "${name ?? ""}" was not found. Set mapFeatureKey to an object in your topology.`);
    const converted = feature(topology, object);
    collection = converted.type === "FeatureCollection" ? converted : { type: "FeatureCollection", features: [converted] };
  } else if (input.type === "FeatureCollection") collection = input;
  else if (input.type === "Feature") collection = { type: "FeatureCollection", features: [input] };
  else collection = { type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: input }] };
  return { type: "FeatureCollection", features: collection.features.filter(f => f.geometry).map(f => ({ ...f, geometry: normalizeGeometry(f.geometry)! })) };
}

export function regionGeometry(region: MapRegion): MultiPolygon {
  // Subdivide wide regions so the spherical boundary follows parallels rather than one great arc.
  const polygons: Polygon["coordinates"][] = [];
  const end = region.lng.max < region.lng.min ? region.lng.max + 360 : region.lng.max;
  for (let left = region.lng.min; left < end; left += 30) {
    const right = Math.min(left + 30, end);
    polygons.push([[[left, region.lat.min], [left, region.lat.max], [right, region.lat.max], [right, region.lat.min], [left, region.lat.min]]]);
  }
  return { type: "MultiPolygon", coordinates: polygons };
}

export function inRegion(coordinates: [number, number], region?: MapRegion): boolean {
  if (!region) return true;
  const [lng, lat] = coordinates;
  const longitude = region.lng.min <= region.lng.max ? lng >= region.lng.min && lng <= region.lng.max : lng >= region.lng.min || lng <= region.lng.max;
  return longitude && lat >= region.lat.min && lat <= region.lat.max;
}

export function createMapProjection(option: MapProjection | undefined, geometry: GeoPermissibleObjects, width: number, height: number, props: Pick<MapBaseProps, "fitView" | "fitViewPadding" | "padding">, region?: MapRegion): GeoProjection {
  const names = { mercator: geoMercator, equalEarth: geoEqualEarth, naturalEarth: geoNaturalEarth1, equirectangular: geoEquirectangular, orthographic: geoOrthographic, albersUsa: geoAlbersUsa };
  const projection = typeof option === "string" ? names[option]() : typeof option === "function" ? ("stream" in option ? option : option()) : geoNaturalEarth1();
  if (region && region.lng.min > region.lng.max && (option === undefined || typeof option === "string")) projection.rotate([-(region.lng.min + region.lng.max + 360) / 2, 0]);
  if (props.fitView !== false) {
    const padding = props.padding;
    const base = typeof padding === "number" ? padding : props.fitViewPadding ?? 12;
    const sides = typeof padding === "object" ? padding : {};
    projection.fitExtent([[sides.left ?? base, sides.top ?? base], [Math.max(base + 1, width - (sides.right ?? base)), Math.max(base + 1, height - (sides.bottom ?? base))]], geometry);
  }
  return projection;
}

/** Use the projection stream for point visibility: orthographic's back face must be clipped. */
export function projectMapPoint(projection: GeoProjection, coordinates: [number, number], path = geoPath(projection)): [number, number] | undefined {
  if (!coordinates.every(Number.isFinite) || Math.abs(coordinates[1]) > 90) return;
  const point = projection(coordinates);
  if (!point?.every(Number.isFinite) || !path({ type: "Point", coordinates })) return;
  return point;
}

export function mapCountryId(feature: Feature, index: number): string {
  return String(feature.id ?? feature.properties?.iso_a3 ?? feature.properties?.ISO_A3 ?? feature.properties?.name ?? index);
}

export function containsMapPoint(collection: FeatureCollection, coordinates: [number, number]): boolean {
  return collection.features.some(f => geoContains(f, coordinates));
}
