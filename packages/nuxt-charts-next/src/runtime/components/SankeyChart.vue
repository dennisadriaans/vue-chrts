<script setup lang="ts" generic="N extends SankeyInputNode, L extends SankeyInputLink">
import { computed, h, ref } from "vue";
import { Sankey, Tooltip, type TooltipContentProps } from "vccs";
import ChartContainer from "./internal/ChartContainer";
import ChartSkeleton from "./internal/ChartSkeleton.vue";
import ChartTooltip from "./internal/ChartTooltip.vue";
import type {
  SankeyChartProps,
  SankeyInputLink,
  SankeyInputNode,
} from "../types/charts";
import { themeToVars } from "../utils/theme";

const props = withDefaults(defineProps<SankeyChartProps<N, L>>(), {
  nodeWidth: 10,
  nodePadding: 10,
  iterations: 32,
  duration: 800,
});

defineSlots<{
  node(props: {
    payload: Record<string, unknown>;
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
  }): unknown;
  link(props: {
    payload: Record<string, unknown>;
    index: number;
    d: string;
    linkWidth: number;
    fill: string;
  }): unknown;
}>();

const themeVars = computed(() => themeToVars(props.theme));
const activeColor = ref<string>();

const tooltipContent = (tooltipProps: TooltipContentProps) =>
  h(ChartTooltip, {
    ...tooltipProps,
    payload: tooltipProps.payload?.map((item) => ({
      ...item,
      color: activeColor.value ?? item.color,
    })),
    variant: props.tooltipVariant,
    roundness: props.tooltipRoundness,
  });

const nodeLabel = (node: unknown) => {
  const input = node as N;
  return props.label?.(input) ?? String(input.name ?? input.id ?? "");
};

const resolvedNodeColor = (node: unknown) =>
  props.nodeColor?.(node as N) ?? "var(--chart-color-0)";

const resolvedLinkColor = (link: unknown) => {
  const layoutLink = link as L & { __source?: string | number };
  const inputLink = layoutLink.__source === undefined
    ? layoutLink
    : { ...layoutLink, source: layoutLink.__source };
  return props.linkColor?.(inputLink as L) ?? "var(--chart-color-0)";
};

function handleMouseEnter(item: unknown, type: "node" | "link") {
  activeColor.value = type === "node"
    ? resolvedNodeColor(item)
    : resolvedLinkColor(item);
}

function handleMouseLeave() {
  activeColor.value = undefined;
}

/**
 * d3-sankey resolves links by node index. Preserve the friendlier v2 API by
 * translating links that refer to a node's `id`; numeric index links pass
 * through unchanged.
 */
const chartData = computed(() => {
  const nodes = props.data.nodes.map((node) => ({ ...node }));
  const ids = new Map<unknown, number>();
  props.data.nodes.forEach((node, index) => {
    if (node.id !== undefined) ids.set(node.id, index);
  });

  const resolveEndpoint = (endpoint: string | number) =>
    ids.has(endpoint) ? ids.get(endpoint)! : endpoint;

  return {
    nodes,
    links: props.data.links.map((link) => ({
      ...link,
      __source: link.source,
      source: resolveEndpoint(link.source),
      target: resolveEndpoint(link.target),
      value: props.linkValue?.(link) ?? link.value ?? 0,
    })),
  };
});
</script>

<template>
  <div
    class="vc-sankey vue-chrts"
    :style="{ position: 'relative', width: '100%', height: `${height}px`, ...themeVars }"
  >
    <ChartSkeleton
      v-if="loading"
      :height="height"
      shape="bars"
      :label="loadingLabel ?? 'Loading'"
    />
    <ChartContainer v-else width="100%" height="100%">
      <Sankey
        :data="chartData"
        :width="0"
        :height="0"
        :node-width="nodeWidth"
        :node-padding="nodePadding"
        :iterations="iterations"
        :margin="padding ?? { top: 8, right: 72, bottom: 8, left: 72 }"
        :is-animation-active="duration > 0"
        :transition="{ duration: duration / 1000, ease: 'easeOut' }"
        :on-mouse-enter="handleMouseEnter"
        :on-mouse-leave="handleMouseLeave"
      >
        <template #node="nodeProps">
          <slot name="node" v-bind="nodeProps">
            <rect
              :x="nodeProps.x"
              :y="nodeProps.y"
              :width="nodeProps.width"
              :height="nodeProps.height"
              :fill="resolvedNodeColor(nodeProps.payload)"
              stroke="var(--vc-surface, #fff)"
            />
            <text
              :x="nodeProps.payload.depth === 0 ? nodeProps.x - 8 : nodeProps.x + nodeProps.width + 8"
              :y="nodeProps.y + nodeProps.height / 2"
              :text-anchor="nodeProps.payload.depth === 0 ? 'end' : 'start'"
              dominant-baseline="middle"
              fill="var(--vc-tick-color)"
              font-size="var(--vc-tick-size)"
            >{{ nodeLabel(nodeProps.payload) }}</text>
          </slot>
        </template>
        <template #link="linkProps">
          <slot name="link" v-bind="linkProps">
            <path
              :d="linkProps.d"
              fill="none"
              :stroke="resolvedLinkColor(linkProps.payload)"
              :stroke-width="linkProps.linkWidth"
              stroke-opacity="0.25"
            />
          </slot>
        </template>
        <Tooltip
          v-if="!hideTooltip"
          :content="tooltipContent"
          :is-animation-active="false"
        />
      </Sankey>
    </ChartContainer>
  </div>
</template>
