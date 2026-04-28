// Re-export all types
export type * from "./types";

// Explicitly export runtime enums to satisfy Rollup chunking
export * from "./enums";

// Export everything from component barrels
export * from "./components/AreaChart";
export * from "./components/LineChart";
export * from "./components/BarChart";
export * from "./components/DonutChart";
export * from "./components/BubbleChart";
export * from "./components/GanttChart";
export * from "./components/DagreGraph";
export * from "./components/DualChart";
export * from "./components/SankeyChart";
export * from "./components/Maps";

export { getMap, getPin } from "./components/Maps/DottedMap/mapUtils";

// Re-export d3-geo projections so consumers don't need to install d3-geo
export { geoMercator } from 'd3-geo';

// Re-export @unovis/ts map topojson data so consumers don't need to install @unovis/ts
export {
  ChinaTopoJSON,
  FranceTopoJSON,
  GermanyTopoJSON,
  IndiaTopoJSON,
  UKTopoJSON,
  USATopoJSON,
  USCountiesTopoJSON,
  WorldMap110mAlphaTopoJSON,
  WorldMapSimplestTopoJSON,
  WorldMapTopoJSON,
} from '@unovis/ts/maps';
