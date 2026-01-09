import AreaChart from "./components/AreaChart/AreaChart.vue";
import LineChart from "./components/LineChart/LineChart.vue";
import BarChart from "./components/BarChart/BarChart.vue";
import DonutChart from "./components/DonutChart/DonutChart.vue";
import BubbleChart from "./components/BubbleChart/BubbleChart.vue";
import GanttChart from "./components/GanttChart/GanttChart.vue";
import DagreGraph from "./components/DagreGraph/DagreGraph.vue";
import DualChart from "./components/DualChart/DualChart.vue";
import SankeyChart from "./components/SankeyChart/SankeyChart.vue";
import TopoJSONMap from "./components/Maps/TopoJSONMap/TopoJSONMap.vue";
import DottedMap from "./components/Maps/DottedMap/DottedMap.vue";

// Export map utility functions
export { getMap, getPin } from "./components/Maps/DottedMap/mapUtils";

// Export map constants and helpers
export {
    REGIONS,
    COUNTRIES,
    DEFAULT_ZOOM,
} from "./components/Maps/DottedMap/regions";

export {
    DEFAULT_PIN_OPTIONS,
    createPin,
    WORLD_PINS,
    USA_PINS,
    filterPinsByRegion,
} from "./components/Maps/DottedMap/pins";

import {
    LegendPosition,
    CurveType,
    Orientation,
    MarkerConfig,
    CrosshairConfig,
    DonutType,
    type BulletLegendItemInterface,
    type AreaChartProps,
    type BarChartProps,
    type LineChartProps,
    type DonutChartProps,
    type BubbleChartProps,
    type GanttChartProps,
    type DagreGraphProps,
    type SankeyChartProps,
    type DualChartProps,
    type DottedMapProps,
    type DottedMapPin,
    type DottedMapRegion,
    type MapPin,
    type MapRegion,
    type MapRegionName,
    type MapLegendItem,
    type ZoomConfig,
    type TopoJSONMapProps,
    type MapPoint,
    type MapLink,
    type MapArea,
    type MapData,
    type MapsData,
} from "./types";

export {
    AreaChart,
    LineChart,
    BarChart,
    DonutChart,
    BubbleChart,
    GanttChart,
    DagreGraph,
    DualChart,
    SankeyChart,
    TopoJSONMap,
    DottedMap,
    Orientation,
    CurveType,
    LegendPosition,
    DonutType
};

export type {
    BulletLegendItemInterface,
    MarkerConfig,
    CrosshairConfig,
    AreaChartProps,
    BarChartProps,
    LineChartProps,
    DonutChartProps,
    BubbleChartProps,
    GanttChartProps,
    DagreGraphProps,
    SankeyChartProps,
    DualChartProps,
    DottedMapProps,
    DottedMapPin,
    DottedMapRegion,
    MapPin,
    MapRegion,
    MapRegionName,
    MapLegendItem,
    ZoomConfig,
    TopoJSONMapProps,
    MapPoint,
    MapLink,
    MapArea,
    MapData,
    MapsData,
}