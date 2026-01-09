import type { GeoProjection } from "d3-geo";

/**
 * Data structure for TopoJSON map configuration.
 * Used to define the map topology, data bindings, and projection settings.
 * @template T - The type of the map feature properties
 */
export type MapsData<T extends Record<string, any>> = {
  /**
   * The key in the TopoJSON feature properties to use for matching with data.
   * This is used to bind data to map features.
   */
  mapFeatureKey: keyof T;
  /**
   * The data to be visualized on the map.
   * This can include points, links, and areas.
   */
  data: any;
  /**
   * The TopoJSON topology object defining the map geometry.
   * Should contain the geographic features to render.
   */
  topojson: any;
  /**
   * Zoom factor for the map.
   * Controls the initial zoom level of the map.
   * @default 1
   */
  zoomFactor?: number;
  /**
   * Optional custom D3 geographic projection.
   * If not provided, a default projection will be used.
   */
  projection?: GeoProjection;
};