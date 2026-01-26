import type { BulletLegendItemInterface, TooltipConfig } from "../../types";
import { LegendPosition } from "../../enums";

/**
 * Dagre layout direction options
 */
export type DagreRankDir = "TB" | "BT" | "LR" | "RL";

/**
 * Dagre layout alignment options
 */
export type DagreAlign = "UL" | "UR" | "DL" | "DR";

/**
 * Dagre ranking algorithm options
 */
export type DagreRanker = "network-simplex" | "tight-tree" | "longest-path";

/**
 * Node shape options
 */
export type NodeShape = "circle" | "square" | "triangle" | "diamond";

/**
 * Link arrow position options
 */
export type LinkArrowPosition = "start" | "end" | "both" | "none";

/**
 * Configuration for Dagre layout algorithm
 */
export interface DagreLayoutSettings {
  /**
   * Direction of the layout: 'TB' (top-to-bottom), 'BT' (bottom-to-top),
   * 'LR' (left-to-right), 'RL' (right-to-left)
   * @default 'TB'
   */
  rankdir?: DagreRankDir;
  /**
   * Alignment of nodes: 'UL' (up-left), 'UR' (up-right), 'DL' (down-left), 'DR' (down-right)
   */
  align?: DagreAlign;
  /**
   * Horizontal spacing between nodes in pixels
   * @default 50
   */
  nodesep?: number;
  /**
   * Spacing between edges in pixels
   * @default 10
   */
  edgesep?: number;
  /**
   * Vertical spacing between ranks in pixels
   * @default 50
   */
  ranksep?: number;
  /**
   * Algorithm to use for ranking nodes
   * @default 'network-simplex'
   */
  ranker?: DagreRanker;
  /**
   * Horizontal margin in pixels
   * @default 0
   */
  marginx?: number;
  /**
   * Vertical margin in pixels
   * @default 0
   */
  marginy?: number;
}

/**
 * Node data structure for the graph
 */
export interface GraphNodeDatum {
  /**
   * Unique identifier for the node
   */
  id: string;
  /**
   * Display label for the node
   */
  label?: string;
  /**
   * Node level (for hierarchical data)
   */
  level?: number;
  /**
   * Additional data associated with the node
   */
  [key: string]: any;
}

/**
 * Link/Edge data structure for the graph
 */
export interface GraphLinkDatum {
  /**
   * Source node ID
   */
  source: string;
  /**
   * Target node ID
   */
  target: string;
  /**
   * Label for the link
   */
  label?: string;
  /**
   * Additional data associated with the link
   */
  [key: string]: any;
}

/**
 * Graph data structure containing nodes and links
 */
export interface GraphData<N = GraphNodeDatum, L = GraphLinkDatum> {
  /**
   * Array of node data
   */
  nodes: N[];
  /**
   * Array of link data
   */
  links: L[];
}

/**
 * Props for the DagreGraph component
 */
export interface DagreGraphProps<N = GraphNodeDatum, L = GraphLinkDatum> {
  /**
   * The graph data containing nodes and links
   */
  data: GraphData<N, L>;

  /**
   * The height of the graph container in pixels
   * @default 600
   */
  height?: number;

  /**
   * The width of the graph container in pixels
   * @default undefined (auto)
   */
  width?: number;

  /**
   * Dagre layout configuration
   */
  dagreLayoutSettings?: DagreLayoutSettings;

  /**
   * Function or value to determine node size
   * @default 40
   */
  nodeSize?: number | ((node: N, index: number) => number);

  /**
   * Function to extract node label
   */
  nodeLabel?: (node: N, index: number) => string;

  /**
   * Function or value to determine node shape
   */
  nodeShape?: NodeShape | ((node: N, index: number) => NodeShape);

  /**
   * Function or value to determine node fill color
   */
  nodeFill?: string | ((node: N, index: number) => string);

  /**
   * Function or value to determine node stroke color
   */
  nodeStroke?: string | ((node: N, index: number) => string);

  /**
   * Function or value to determine node stroke width
   */
  nodeStrokeWidth?: number | ((node: N, index: number) => number);

  /**
   * Link arrow configuration
   * @default 'end'
   */
  linkArrow?: LinkArrowPosition;

  /**
   * Function to extract link label
   */
  linkLabel?: (link: L, index: number) => string;

  /**
   * Function or value to determine link color
   */
  linkStroke?: string | ((link: L, index: number) => string);

  /**
   * Function or value to determine link width
   */
  linkWidth?: number | ((link: L, index: number) => number);

  /**
   * Link curvature amount (0-1)
   * @default 0
   */
  linkCurvature?: number;

  /**
   * Optional padding applied to the graph
   */
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  /**
   * If true, hides the tooltip
   */
  hideTooltip?: boolean;

  /**
   * Enable zoom and pan controls
   * @default true
   */
  zoomEnabled?: boolean;

  /**
   * Zoom scale extent [min, max]
   * @default [0.1, 10]
   */
  zoomScaleExtent?: [number, number];

  /**
   * Enable node dragging
   * @default false
   */
  nodeDraggingEnabled?: boolean;

  /**
   * If true, hides the legend
   */
  hideLegend?: boolean;

  /**
   * Legend position
   * @default LegendPosition.BottomCenter
   */
  legendPosition?: LegendPosition;

  /**
   * Legend style
   */
  legendStyle?: string | Record<string, string>;

  /**
   * Legend items configuration
   */
  legendItems?: BulletLegendItemInterface[];

  /**
   * Custom formatter for tooltip titles
   */
  tooltipTitleFormatter?: (node: N) => string | number;

  /**
   * Custom formatter for tooltip content
   */
  tooltipContentFormatter?: (node: N) => string;

  /**
   * Configuration object for the chart tooltip.
   */
  tooltip?: TooltipConfig;

  /**
   * Animation duration in milliseconds
   * @default 600
   */
  duration?: number;
}
