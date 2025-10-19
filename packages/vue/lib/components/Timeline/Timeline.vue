<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, useSlots, useTemplateRef } from "vue";
import { Timeline } from "@unovis/ts";
import { dateFormatter, getFirstPropertyValue } from "../../utils";
import Tooltip from "../Tooltip.vue";

import {
  VisXYContainer,
  VisBulletLegend,
  VisTooltip,
  VisTimeline,
  VisAxis,
  VisCrosshair,
} from "@unovis/vue";

import { LegendPosition, TimelineProps } from "../../types";

export interface TimelineCategory {
  name: string;
  color?: string | string[];
}

const props = withDefaults(defineProps<TimelineProps<T>>(), {
  labelWidth: 220,
  title: "",
  showLabels: true,
  hideTooltip: false,
  lineWidth: 12,
  rowHeight: 24,
  legendPosition: LegendPosition.TopRight,
});

const slots = useSlots();
const slotWrapper = useTemplateRef<HTMLDivElement>("slotWrapper");
const labelSlotWrapper = useTemplateRef<HTMLDivElement>("labelSlotWrapper");

const labelSlotHoverValue = ref<T>();
const slotValue = ref<T>();

const isLegendTop = computed(() => props.legendPosition.startsWith("top"));

const legendAlignment = computed(() => {
  if (props.legendPosition.includes("left")) return "flex-start";
  if (props.legendPosition.includes("right")) return "flex-end";
  return "center";
});

const triggers = { [Timeline.selectors.label]: generateLabelTooltip };

function generateLabelTooltip(d: T): string {
  labelSlotHoverValue.value = d;
  if (typeof window === "undefined") {
    return "";
  }
  if (labelSlotWrapper.value) {
    return labelSlotWrapper.value.innerHTML;
  }
  return "";
}

const colors = computed(() => {
  const defaultColors = Object.values(props.categories).map(
    (_, index) => `var(--vis-color${index})`
  );
  return Object.values(props.categories).map(
    (c, i) => c.color ?? defaultColors[i]
  );
});
</script>

<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: isLegendTop ? 'column-reverse' : 'column',
      gap: 'var(--vis-legend-spacing)',
    }"
  >
    <VisXYContainer :data="props.data" :height="props.height">
      <VisTimeline
        :x="props.x"
        :length="props.length"
        :lineWidth="props.lineWidth"
        :rowHeight="props.rowHeight"
        :type="props.type"
        :color="colors"
        :labelWidth="props.labelWidth"
        :showLabels="props.showLabels"
      />

      <VisTooltip :triggers="triggers" />
      <VisAxis type="x" :tickFormat="dateFormatter" :numTicks="10" />
    
    </VisXYContainer>

    <div
      v-if="!props.hideLegend"
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

    <div ref="labelSlotWrapper" style="display: none">
      <slot
        v-if="slots.labelTooltip"
        name="labelTooltip"
        :values="labelSlotHoverValue"
      />
      <slot v-else-if="labelSlotHoverValue" name="fallback">
        <Tooltip
          :data="labelSlotHoverValue"
          :categories="categories"
          :toolTipTitle="getFirstPropertyValue(labelSlotHoverValue) ?? ''"
        />
      </slot>
    </div>
  </div>
</template>
