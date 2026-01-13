<script setup lang="ts" generic="N extends SankeyInputNode, L extends SankeyInputLink">
import { computed, ref, useSlots, useTemplateRef } from "vue";
import {
  SankeyInputNode,
  SankeyInputLink,
  SankeyNodeAlign,
  Sankey,
} from "@unovis/ts";

import {
  VisSingleContainer,
  VisSankey,
  VisTooltip,
  VisBulletLegend,
} from "@unovis/vue";

import Tooltip from "../Tooltip.vue";

import { LegendPosition } from "../../types";
import { SankeyChartProps } from "./types";

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const props = withDefaults(defineProps<SankeyChartProps<N, L>>(), {
  duration: 600,
  legendPosition: LegendPosition.BottomCenter,
  legendStyle: undefined,
  hideLegend: false,
  padding: () => ({
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  }),
  nodeWidth: 10,
  nodeAlign: SankeyNodeAlign.Justify,
  nodePadding: 10,
  iterations: 32,
  highlightSubtreeOnHover: false,
  labelMaxWidth: 70,
  tooltip: () => ({
    followCursor: true,
  }),
});

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverNode = ref<any>();

const isLegendTop = computed(() => props.legendPosition.startsWith("top"));

const legendAlignment = computed(() => {
  if (props.legendPosition.includes("left")) return "flex-start";
  if (props.legendPosition.includes("right")) return "flex-end";
  return "center";
});

function onNodeHover(d: any) {
  hoverNode.value = d;
}
</script>

<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: isLegendTop ? 'column-reverse' : 'column',
      gap: 'var(--vis-legend-spacing)',
    }"
    @click="emit('click', $event)"
  >
    <VisSingleContainer
      :padding="padding"
      :height="height"
      :duration="duration"
    >
      <VisTooltip
        v-if="!hideTooltip"
        :followCursor="props.tooltip.followCursor"
        :show-delay="props.tooltip.showDelay"
        :hide-delay="props.tooltip.hideDelay"
        :triggers="{
          [Sankey.selectors.node]: (d: any) => {
            onNodeHover(d);
            return d ? slotWrapperRef?.innerHTML : '';
          },
        }"
      />
      <VisSankey
        :data="data"
        :label="label"
        :subLabel="subLabel"
        :nodeColor="nodeColor"
        :linkColor="linkColor"
        :linkValue="linkValue"
        :nodeWidth="nodeWidth"
        :nodeAlign="nodeAlign"
        :nodePadding="nodePadding"
        :nodeSort="nodeSort"
        :linkSort="linkSort"
        :iterations="iterations"
        :highlightSubtreeOnHover="highlightSubtreeOnHover"
        :labelFontSize="labelFontSize"
        :labelColor="labelColor"
        :labelMaxWidth="labelMaxWidth"
      />
    </VisSingleContainer>

    <div
      v-if="!props.hideLegend && props.categories"
      :style="{
        display: 'flex',
        justifyContent: legendAlignment,
      }"
    >
      <VisBulletLegend
        :style="[
          props.legendStyle,
          'display: flex; gap: var(--vis-legend-spacing);',
        ]"
        :items="
          Object.values(props.categories).map((item) => ({
            ...item,
            color: Array.isArray(item.color) ? item.color[0] : item.color,
          }))
        "
      />
    </div>

    <div ref="slotWrapper" style="display: none">
      <slot v-if="slots.tooltip" name="tooltip" :node="hoverNode" />
      <slot v-else-if="hoverNode" name="fallback">
        <Tooltip
          :data="hoverNode"
          :categories="props.categories ?? {}"
          :title-formatter="
            (d: any) => d.label || d.id || 'Node'
          "
        />
      </slot>
    </div>
  </div>
</template>
