<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from "vue";
import { Timeline, Position } from "@unovis/ts";
import {
  VisXYContainer,
  VisBulletLegend,
  VisTooltip,
  VisTimeline,
  VisAxis,
} from "@unovis/vue";

import { LegendPosition } from "../../types";

export interface TimelineCategory {
  name: string;
  color?: string | string[];
}

const props = withDefaults(
  defineProps<{
    data: T[];
    labelWidth?: number;
    height?: number;
    title?: string;
    categories?: Record<string, TimelineCategory>;
    x: (d: T) => number;
    length: (d: T) => number;
    type: (d: T) => string;
    color: (d: T) => string;
    getTooltipText?: (label: string, index: number, data: T[]) => string;
    dateFormatter?: (date: number) => string;
    showLabels?: boolean;
    hideTooltip?: boolean;
    lineWidth?: number;
    rowHeight?: number;
    legendPosition?: LegendPosition;
    legendStyle?: Record<string, string>;
    hideLegend?: boolean;
  }>(),
  {
    labelWidth: 220,
    height: 500,
    title: "",
    dateFormatter: (date: number) => Intl.DateTimeFormat().format(date),
    showLabels: true,
    hideTooltip: false,
    lineWidth: 12,
    rowHeight: 24,
    legendPosition: LegendPosition.BottomCenter,
    hideLegend: false,
  }
);

const isLegendTop = computed(() => props.legendPosition.startsWith("top"));

const legendAlignment = computed(() => {
  if (props.legendPosition.includes("left")) return "flex-start";
  if (props.legendPosition.includes("right")) return "flex-end";
  return "center";
});

function defaultTooltipText(_: string, i: number): string {
  const item = props.data[i];
  const startDate = props.x(item);
  const endDate = props.x(item) + props.length(item);
  return `
      <div style="width:${props.labelWidth}px">
        ${[startDate, endDate].map(props.dateFormatter).join(" - ")}
      </div>`;
}

const getTooltip = props.getTooltipText
  ? (_: string, i: number) => props.getTooltipText!(_, i, props.data)
  : defaultTooltipText;

const triggers = { [Timeline.selectors.label]: getTooltip };
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
        :color="props.color"
        :labelWidth="props.labelWidth"
        :showLabels="props.showLabels"
      />
      <VisTooltip
        v-if="!props.hideTooltip"
        :horizontal-placement="Position.Right"
        :vertical-placement="Position.Top"
      />
      <VisAxis type="x" :tickFormat="props.dateFormatter" :numTicks="10" />
    </VisXYContainer>
  </div>
</template>
