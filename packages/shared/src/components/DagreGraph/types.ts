import type { BulletLegendItemInterface, TooltipConfig } from "../../types";
import { LegendPosition } from "../../types";

export type DagreRankDir = "TB" | "BT" | "LR" | "RL";
export type DagreAlign = "UL" | "UR" | "DL" | "DR";
export type DagreRanker = "network-simplex" | "tight-tree" | "longest-path";
export type NodeShape = "circle" | "square" | "triangle" | "diamond";
export type LinkArrowPosition = "start" | "end" | "both" | "none";

export interface DagreLayoutSettings {
  rankdir?: DagreRankDir;
  align?: DagreAlign;
  nodesep?: number;
  edgesep?: number;
  ranksep?: number;
  ranker?: DagreRanker;
  marginx?: number;
  marginy?: number;
}

export interface GraphNodeDatum {
  id: string;
  label?: string;
  level?: number;
  [key: string]: any;
}

export interface GraphLinkDatum {
  source: string;
  target: string;
  label?: string;
  [key: string]: any;
}

export interface GraphData<N = GraphNodeDatum, L = GraphLinkDatum> {
  nodes: N[];
  links: L[];
}

export interface DagreGraphProps<N = GraphNodeDatum, L = GraphLinkDatum> {
  data: GraphData<N, L>;
  height?: number;
  width?: number;
  dagreLayoutSettings?: DagreLayoutSettings;
  nodeSize?: number | ((node: N, index: number) => number);
  nodeLabel?: (node: N, index: number) => string;
  nodeShape?: NodeShape | ((node: N, index: number) => NodeShape);
  nodeFill?: string | ((node: N, index: number) => string);
  nodeStroke?: string | ((node: N, index: number) => string);
  nodeStrokeWidth?: number | ((node: N, index: number) => number);
  linkArrow?: LinkArrowPosition;
  linkLabel?: (link: L, index: number) => string;
  linkStroke?: string | ((link: L, index: number) => string);
  linkWidth?: number | ((link: L, index: number) => number);
  linkCurvature?: number;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  hideTooltip?: boolean;
  zoomEnabled?: boolean;
  zoomScaleExtent?: [number, number];
  nodeDraggingEnabled?: boolean;
  hideLegend?: boolean;
  legendPosition?: LegendPosition;
  legendStyle?: string | Record<string, string>;
  legendItems?: BulletLegendItemInterface[];
  tooltipTitleFormatter?: (node: N) => string | number;
  tooltipContentFormatter?: (node: N) => string;
  tooltip?: TooltipConfig;
  duration?: number;
}
