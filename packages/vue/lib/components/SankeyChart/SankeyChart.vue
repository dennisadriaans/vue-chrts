<script setup lang="ts" generic="N extends SankeyInputNode, L extends SankeyInputLink">
import { computed, useSlots } from "vue";
import {
  SankeyInputNode,
  SankeyInputLink,
  SankeyNodeAlign,
  Sankey,
} from "@unovis/ts";
import { useHoverTooltip } from "../../composables/useHoverTooltip";

import {
  VisSingleContainer,
  VisSankey,
  VisTooltip,
  VisBulletLegend,
} from "@unovis/vue";

import Tooltip from "../Tooltip.vue";

import { LegendPosition } from "../../enums";
import { SankeyChartProps } from "./SankeyChart";

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const props = withDefaults(defineProps<SankeyChartProps<N, L>>(), {
  duration: 600,
  legendPosition: LegendPosition.BottomCenter,
  legendStyle: undefined,
  hideLegend: false,
  hideTooltip: false,
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
  // Passed straight to VisSankey, so leaving it undefined would override
  // Unovis' own `l => l.value` default and size every link from NaN.
  // Function-typed props take the accessor itself, not a factory returning it.
  linkValue: (link: L) => (link as { value?: number }).value ?? 0,
  tooltip: () => ({
    followCursor: true,
  }),
});

const slots = useSlots();
const { slotWrapperRef, hoverValues: hoverNode } = useHoverTooltip<any>();

const isLegendTop = computed(() => props.legendPosition.startsWith("top"));

const legendAlignment = computed(() => {
  if (props.legendPosition.includes("left")) return "flex-start";
  if (props.legendPosition.includes("right")) return "flex-end";
  return "center";
});

function onNodeHover(d: any) {
  hoverNode.value = d;
}

// Must be a stable object reference (not created inline in the template).
// `@unovis/vue`'s VisTooltip wrapper deep-compares its forwarded props on every
// render, and a *new* `triggers` object (with new function closures) on every
// render — which happens whenever `data` changes — reads as "props changed",
// causing it to call the underlying tooltip's `.render()` with no arguments,
// which clears its content to "". That happens even with the mouse sitting
// still, with no new hover at all.
const tooltipTriggers = {
  [Sankey.selectors.node]: (d: any) => {
    onNodeHover(d);
    return d ? slotWrapperRef.value?.innerHTML : "";
  },
};
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
        ref="tooltip"
        v-if="!hideTooltip"
        :followCursor="props.tooltip?.followCursor"
        :show-delay="props.tooltip?.showDelay"
        :hide-delay="props.tooltip?.hideDelay"
        :triggers="tooltipTriggers"
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
