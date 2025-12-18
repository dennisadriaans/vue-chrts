<script setup lang="ts" generic="N extends GraphNodeDatum = GraphNodeDatum, L extends GraphLinkDatum = GraphLinkDatum">
import { computed, ref, useSlots, useTemplateRef } from "vue";
import {
  VisSingleContainer,
  VisGraph,
  VisBulletLegend,
  VisTooltip,
} from "@unovis/vue";
import { GraphLayoutType } from "@unovis/ts";
import type { DagreGraphProps, GraphNodeDatum, GraphLinkDatum } from "./types";
import { LegendPosition } from "../../types";

const props = withDefaults(defineProps<DagreGraphProps<N, L>>(), {
  height: 600,
  width: undefined,
  dagreLayoutSettings: () => ({
    rankdir: "TB",
    nodesep: 50,
    ranksep: 100,
    ranker: "network-simplex",
    marginx: 20,
    marginy: 20,
  }),
  nodeSize: 40,
  nodeShape: "circle",
  nodeFill: "#3b82f6",
  nodeStroke: "#1e40af",
  nodeStrokeWidth: 2,
  linkArrow: "end",
  linkStroke: "#9ca3af",
  linkWidth: 2,
  linkCurvature: 0,
  padding: () => ({ top: 20, right: 20, bottom: 20, left: 20 }),
  hideTooltip: false,
  zoomEnabled: true,
  zoomScaleExtent: () => [0.1, 10],
  nodeDraggingEnabled: false,
  hideLegend: true,
  legendPosition: LegendPosition.BottomCenter,
  legendStyle: undefined,
  legendItems: () => [],
  duration: 600,
});

const emit = defineEmits<{
  (e: "click", event: MouseEvent, node?: N): void;
  (e: "nodeClick", node: N): void;
  (e: "linkClick", link: L): void;
}>();

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverNode = ref<N>();

// Compute node size accessor
const nodeSizeAccessor = computed(() => {
  if (typeof props.nodeSize === "function") {
    return props.nodeSize;
  }
  return () => props.nodeSize as number;
});

// Compute node label accessor
const nodeLabelAccessor = computed(() => {
  if (props.nodeLabel) {
    return props.nodeLabel;
  }
  return (node: N) => node.label || node.id;
});

// Compute node shape accessor
const nodeShapeAccessor = computed(() => {
  if (typeof props.nodeShape === "function") {
    return props.nodeShape;
  }
  return () => props.nodeShape as string;
});

// Compute node fill accessor
const nodeFillAccessor = computed(() => {
  if (typeof props.nodeFill === "function") {
    return props.nodeFill;
  }
  return () => props.nodeFill as string;
});

// Compute node stroke accessor
const nodeStrokeAccessor = computed(() => {
  if (typeof props.nodeStroke === "function") {
    return props.nodeStroke;
  }
  return () => props.nodeStroke as string;
});

// Compute node stroke width accessor
const nodeStrokeWidthAccessor = computed(() => {
  if (typeof props.nodeStrokeWidth === "function") {
    return props.nodeStrokeWidth;
  }
  return () => props.nodeStrokeWidth as number;
});

// Compute link label accessor
const linkLabelAccessor = computed(() => {
  if (props.linkLabel) {
    return props.linkLabel;
  }
  return (link: L) => link.label || "";
});

// Compute link stroke accessor
const linkStrokeAccessor = computed(() => {
  if (typeof props.linkStroke === "function") {
    return props.linkStroke;
  }
  return () => props.linkStroke as string;
});

// Compute link width accessor
const linkWidthAccessor = computed(() => {
  if (typeof props.linkWidth === "function") {
    return props.linkWidth;
  }
  return () => props.linkWidth as number;
});

// Compute link arrow config
const linkArrowConfig = computed(() => {
  switch (props.linkArrow) {
    case "start":
      return "start";
    case "end":
      return "end";
    case "both":
      return "both";
    case "none":
      return undefined;
    default:
      return "end";
  }
});

const isLegendTop = computed(() => props.legendPosition.startsWith("top"));

const legendAlignment = computed(() => {
  if (props.legendPosition.includes("left")) return "flex-start";
  if (props.legendPosition.includes("right")) return "flex-end";
  return "center";
});

function onNodeHover(node: N): void {
  hoverNode.value = node;
}

function onNodeClick(node: N, event: MouseEvent): void {
  emit("nodeClick", node);
  emit("click", event, node);
}

function onLinkClick(link: L): void {
  emit("linkClick", link);
}
</script>

<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: isLegendTop ? 'column-reverse' : 'column',
      gap: 'var(--vis-legend-spacing)',
    }"
    class="dagre-graph-container"
  >
    <VisSingleContainer
      :data="data"
      :height="height"
      :width="width"
      :padding="padding"
    >
      <VisTooltip v-if="!hideTooltip" />

      <VisGraph
        :layoutType="GraphLayoutType.Dagre"
        :dagreLayoutSettings="dagreLayoutSettings"
        :nodeSize="nodeSizeAccessor"
        :nodeLabel="nodeLabelAccessor"
        :nodeShape="nodeShapeAccessor"
        :nodeFill="nodeFillAccessor"
        :nodeStroke="nodeStrokeAccessor"
        :nodeStrokeWidth="nodeStrokeWidthAccessor"
        :linkArrow="linkArrowConfig"
        :linkLabel="linkLabelAccessor"
        :linkStroke="linkStrokeAccessor"
        :linkWidth="linkWidthAccessor"
        :linkCurvature="linkCurvature"
        :zoomScaleExtent="zoomScaleExtent"
        :disableZoom="!zoomEnabled"
        :disableDrag="!nodeDraggingEnabled"
        :duration="duration"
        @nodeMouseOver="onNodeHover"
        @nodeClick="onNodeClick"
        @linkClick="onLinkClick"
      />
    </VisSingleContainer>

    <div
      v-if="!hideLegend && legendItems && legendItems.length > 0"
      :style="{
        display: 'flex',
        justifyContent: legendAlignment,
      }"
    >
      <VisBulletLegend
        :style="[
          legendStyle,
          'display: flex; gap: var(--vis-legend-spacing);',
        ]"
        :items="
          legendItems.map((item) => ({
            ...item,
            color: Array.isArray(item.color) ? item.color[0] : item.color,
          }))
        "
      />
    </div>

    <div ref="slotWrapper" style="display: none">
      <slot v-if="slots.tooltip" name="tooltip" :node="hoverNode" />
      <slot v-else-if="hoverNode" name="fallback">
        <div class="dagre-tooltip">
          <div class="font-semibold">
            {{ tooltipTitleFormatter ? tooltipTitleFormatter(hoverNode) : hoverNode.label || hoverNode.id }}
          </div>
          <div v-if="tooltipContentFormatter" class="text-sm text-gray-500">
            {{ tooltipContentFormatter(hoverNode) }}
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

