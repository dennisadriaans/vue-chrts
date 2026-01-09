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
import DottedMap from "./components/Maps/DottedMap/index.vue";
import DottedMapCore from "./components/Maps/DottedMap/core.vue";
// Backwards compatibility alias
import DottedWorldMap from "./components/Maps/DottedMap/core.vue";
export * from "./components/Maps/DottedMap/types";
export { getMap, getPin, DEFAULT_WORLD_REGION } from "./components/Maps/DottedMap/mapUtils";

import {
    LegendPosition,
    CurveType,
    Orientation,
    MarkerConfig,
    CrosshairConfig,
    DonutType,
    type BulletLegendItemInterface,
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
    DottedMapCore,
    DottedWorldMap,
    Orientation,
    CurveType,
    LegendPosition,
    DonutType
};

export type {
    BulletLegendItemInterface,
    MarkerConfig,
    CrosshairConfig
}