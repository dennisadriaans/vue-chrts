import { Sizing } from "@unovis/ts";
import { BulletLegendItemInterface, LegendPosition } from "../../types";
import { SankeyInputLink, SankeyInputNode } from "@unovis/ts/components/sankey/types";

export {
  SankeyInputLink,
  SankeyInputNode
}

export type SankeyChartProps<
  N extends SankeyInputNode,
  L extends SankeyInputLink
> = {
  /**
   * The data to be displayed in the Sankey diagram.
   * Contains nodes and links representing the flow between entities.
   */
  data: {
    nodes: N[];
    links: L[];
  };
  /**
   * The height of the chart in pixels.
   */
  height: number;
  /**
   * The width of the chart in pixels.
   */
  width?: number;
  /**
   * Chart sizing option. Default: Sizing.Fit
   */
  sizing?: Sizing | string;
  /**
   * Optional padding applied to the chart.
   * Allows specifying individual padding values for the top, right, bottom, and left sides.
   */
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  /**
   * A record mapping category keys to `BulletLegendItemInterface` objects.
   * This defines the visual representation and labels for each category in the chart's legend.
   */
  categories?: Record<string, BulletLegendItemInterface>;
  /**
   * If `true`, hides the chart legend.
   */
  hideLegend?: boolean;
  /**
   * Optional position for the legend, if applicable.
   * See `LegendPosition` for available options.
   */
  legendPosition?: LegendPosition;
  /**
   * Optional style object for the legend container. Allows custom CSS styling.
   */
  legendStyle?: string | Record<string, string>;
  /**
   * Node label accessor function or value.
   */
  label?: (node: N) => string;
  /**
   * Node sub-label accessor function or value.
   */
  subLabel?: (node: N) => string;
  /**
   * Node color accessor function or value.
   */
  nodeColor?: (node: N) => string;
  /**
   * Link color accessor function or value.
   */
  linkColor?: (link: L) => string;
  /**
   * Link value accessor function or value.
   */
  linkValue?: (link: L) => number;
  /**
   * Sankey node width in pixels. Default: 10
   */
  nodeWidth?: number;
  /**
   * Sankey node alignment method. Default: 'justify'
   */
  nodeAlign?: SankeyNodeAlign;
  /**
   * Sankey vertical separation between nodes in pixels. Default: 10
   */
  nodePadding?: number;
  /**
   * Sankey horizontal separation between nodes in pixels.
   */
  nodeHorizontalSpacing?: number;
  /**
   * Minimum node height in pixels.
   */
  nodeMinHeight?: number;
  /**
   * Maximum node height in pixels.
   */
  nodeMaxHeight?: number;
  /**
   * Node sorting function.
   */
  nodeSort?: (node1: any, node2: any) => number;
  /**
   * Link sorting function.
   */
  linkSort?: (link1: any, link2: any) => number;
  /**
   * Sankey algorithm iterations. Default: 32
   */
  iterations?: number;
  /**
   * Highlight the corresponding subtree on node / link hover. Default: false
   */
  highlightSubtreeOnHover?: boolean;
  /**
   * Label font size in pixels.
   */
  labelFontSize?: number;
  /**
   * Label color accessor function or value.
   */
  labelColor?: (node: N) => string;
  /**
   * Maximum label width in pixels. Default: 70
   */
  labelMaxWidth?: number;
};
