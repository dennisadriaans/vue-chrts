import { BulletLegendItemInterface, LegendPosition, TooltipConfig } from "../../types";
import { SankeyInputNode, SankeyInputLink, SankeyNodeAlign } from "@unovis/ts";

export type SankeyChartProps<N extends SankeyInputNode, L extends SankeyInputLink> = {
  data: {
    nodes: N[];
    links: L[];
  };
  height: number;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  categories?: Record<string, BulletLegendItemInterface>;
  hideLegend?: boolean;
  legendPosition?: LegendPosition;
  legendStyle?: string | Record<string, string>;
  label?: (node: N) => string;
  subLabel?: (node: N) => string;
  nodeColor?: (node: N) => string;
  linkColor?: (link: L) => string;
  linkValue?: (link: L) => number;
  nodeWidth?: number;
  nodeAlign?: SankeyNodeAlign;
  nodePadding?: number;
  nodeSort?: (node1: any, node2: any) => number;
  linkSort?: (link1: any, link2: any) => number;
  iterations?: number;
  hideTooltip?: boolean;
  tooltip?: TooltipConfig;
  highlightSubtreeOnHover?: boolean;
  labelFontSize?: number;
  labelColor?: (node: N) => string;
  labelMaxWidth?: number;
  duration?: number;
};
