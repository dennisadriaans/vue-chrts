import {
  AreaChart,
  BarChart,
  BubbleChart,
  CandlestickChart,
  DonutChart,
  DottedMap,
  FunnelChart,
  HeatmapChart,
  LineChart,
  RadarChart,
  RadialBarChart,
  SankeyChart,
  StatusTrackerChart,
  TopoJSONMap,
} from "../../src/runtime/components";

const traffic = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
];
const trafficCategories = {
  desktop: { name: "Desktop", color: "#2662d9" },
  mobile: { name: "Mobile", color: "#e23670" },
};
const stages = {
  visits: { name: "Visits", color: "#2662d9" },
  signups: { name: "Signups", color: "#e23670" },
  paid: { name: "Paid", color: "#e88c30" },
};

export interface ChartCase {
  component: unknown;
  props: Record<string, unknown>;
  /** Selector that must match in the server HTML for the chart to count as drawn. */
  mark: string;
}

/** One representative configuration per chart that renders on the server. */
export const CHART_CASES: Record<string, ChartCase> = {
  AreaChart: {
    component: AreaChart,
    props: { data: traffic, categories: trafficCategories, height: 300 },
    mark: "path.v-charts-area-area",
  },
  LineChart: {
    component: LineChart,
    props: { data: traffic, categories: trafficCategories, height: 300 },
    mark: "path.v-charts-line-curve",
  },
  BarChart: {
    component: BarChart,
    props: { data: traffic, categories: trafficCategories, xAxis: "month", yAxis: ["desktop", "mobile"], height: 300 },
    mark: ".v-charts-bar-rectangle path",
  },
  BubbleChart: {
    component: BubbleChart,
    props: {
      data: [
        { x: 10, y: 20, size: 5, group: "A" },
        { x: 30, y: 12, size: 9, group: "B" },
        { x: 22, y: 40, size: 3, group: "A" },
      ],
      categories: { A: { name: "Group A", color: "#3b82f6" }, B: { name: "Group B", color: "#22c55e" } },
      xAccessor: "x",
      yAccessor: "y",
      sizeAccessor: "size",
      categoryKey: "group",
      height: 300,
    },
    mark: ".v-charts-scatter-symbol, .v-charts-symbols",
  },
  DonutChart: {
    component: DonutChart,
    props: { data: [5000, 2300, 1200], categories: stages, height: 240 },
    mark: "path.v-charts-sector",
  },
  RadarChart: {
    component: RadarChart,
    props: {
      data: [
        { metric: "Speed", desktop: 120, mobile: 90 },
        { metric: "Reliability", desktop: 98, mobile: 130 },
        { metric: "Comfort", desktop: 86, mobile: 130 },
      ],
      categories: trafficCategories,
      dataKey: "metric",
      height: 300,
    },
    mark: "svg polygon, svg path",
  },
  RadialBarChart: {
    component: RadialBarChart,
    props: { data: [80, 55, 30], categories: stages, height: 300 },
    mark: "path.v-charts-sector",
  },
  FunnelChart: {
    component: FunnelChart,
    props: { data: [5000, 2300, 1200], categories: stages, height: 300 },
    mark: "svg path",
  },
  FunnelChartLayered: {
    component: FunnelChart,
    props: { variant: "layered", data: [5000, 2300, 1200], categories: stages, height: 300 },
    mark: "svg path",
  },
  SankeyChart: {
    component: SankeyChart,
    props: {
      data: {
        nodes: [
          { id: "solar", name: "Solar" },
          { id: "grid", name: "Grid" },
          { id: "homes", name: "Homes" },
        ],
        links: [
          { source: "solar", target: "grid", value: 46 },
          { source: "grid", target: "homes", value: 38 },
        ],
      },
      height: 300,
      duration: 0,
    },
    mark: "svg path, svg rect",
  },
  CandlestickChart: {
    component: CandlestickChart,
    props: {
      data: [
        { label: "Mon", open: 10, high: 14, low: 9, close: 13 },
        { label: "Tue", open: 13, high: 15, low: 11, close: 12 },
        { label: "Wed", open: 12, high: 18, low: 12, close: 17 },
      ],
      height: 300,
    },
    mark: "svg rect",
  },
  StatusTrackerChart: {
    component: StatusTrackerChart,
    props: {
      data: [{ status: "up" }, { status: "up" }, { status: "down" }],
      categories: { up: { name: "Operational", color: "#10b981" }, down: { name: "Outage", color: "#ef4444" } },
    },
    mark: '[data-slot="bar"]',
  },
  HeatmapChart: {
    component: HeatmapChart,
    props: {
      data: [
        { day: "Mon", hour: 9, visits: 120 },
        { day: "Mon", hour: 10, visits: 80 },
        { day: "Tue", hour: 9, visits: 40 },
      ],
      xAxis: "hour",
      yAxis: "day",
      valueKey: "visits",
    },
    mark: '[role="gridcell"], [data-slot="cell"], .vc-heatmap__cell',
  },
  DottedMap: {
    component: DottedMap,
    props: { mapHeight: 30 },
    mark: "svg circle, svg path, svg rect",
  },
  TopoJSONMap: {
    component: TopoJSONMap,
    props: { data: { areas: [{ id: "NL", value: 10 }] }, value: "value" },
    mark: "svg path",
  },
};
