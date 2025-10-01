<script setup lang="ts" generic="T">
import { computed, ref, useSlots, useTemplateRef } from "vue";
import { CurveType, Position } from "@unovis/ts";
import { createMarkers, getFirstPropertyValue, markerShape } from "../../utils";

import Tooltip from "../Tooltip.vue";

import {
  VisAxis,
  VisBulletLegend,
  VisCrosshair,
  VisLine,
  VisXYContainer,
  VisTooltip,
} from "@unovis/vue";

import { LegendPosition } from "../../types";
import { LineChartProps } from "./types";

const emit = defineEmits<{
  (e: "click", event: MouseEvent, values?: T): void;
}>();

const props = withDefaults(defineProps<LineChartProps<T>>(), {
  padding: () => {
    return {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5,
    };
  },
  xNumTicks: (props) =>
    props.data.length > 24 ? 24 / 4 : props.data.length - 1,
  yNumTicks: (props) =>
    props.data.length > 24 ? 24 / 4 : props.data.length - 1,
  crosshairConfig: () => ({
    color: "#666",
  }),
  lineWidth: 2,
});

const svgDefs = computed(() => {
  if (!props.markerConfig) return "";
  return createMarkers(props.markerConfig);
});

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverValues = ref<T>();

function generateTooltipContent(d: T): string {
  if (typeof window === "undefined") {
    return "";
  }
  if (slotWrapperRef.value) {
    return slotWrapperRef.value.innerHTML;
  }
  return "";
}

function onCrosshairUpdate(d: T): string {
  hoverValues.value = d;
  return generateTooltipContent(d);
}

const LegendPositionTop = computed(
  () => props.legendPosition === LegendPosition.Top
);

const defaultColors = Object.values(props.categories).map(
  (i, index) => `var(--vis-color${index})`
);
const color = (key: number) =>
  Object.values(props.categories)[key].color ?? defaultColors[key];
</script>

<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: LegendPositionTop ? 'column-reverse' : 'column',
      gap: '1rem',
    }"
    :class="{ markers: !!props.markerConfig }"
    @click="emit('click', $event, hoverValues)"
  >
    <VisXYContainer
      :data="data"
      :padding="padding"
      :height="height"
      :svgDefs="svgDefs"
      :yDomain="yDomain"
      :xDomain="xDomain"
    >
      <VisTooltip
        :horizontal-placement="Position.Right"
        :vertical-placement="Position.Top"
      />
      <template v-for="(i, iKey) in Object.keys(props.categories)" :key="iKey">
        <VisLine
          :x="(_: any, i: number) => i"
          :y="(d: T) => d[i as keyof typeof d]"
          :color="color(iKey)"
          :curve-type="curveType ?? CurveType.MonotoneX"
          :line-width="lineWidth"
          :lineDashArray="lineDashArray ? lineDashArray[iKey] : undefined"
        />
      </template>
      <VisAxis
        v-if="!hideXAxis"
        type="x"
        :tick-format="xFormatter"
        :label="xLabel"
        :label-margin="8"
        :domain-line="xDomainLine"
        :grid-line="xGridLine"
        :tick-line="xTickLine"
        :num-ticks="xNumTicks"
        :tick-values="xExplicitTicks"
        :min-max-ticks-only="minMaxTicksOnly"
      />
      <VisAxis
        v-if="!hideYAxis"
        type="y"
        :tick-format="yFormatter"
        :label="yLabel"
        :num-ticks="yNumTicks"
        :domain-line="yDomainLine"
        :grid-line="yGridLine"
        :tick-line="yTickLine"
      />
      <VisCrosshair
        v-if="!hideTooltip"
        v-bind="crosshairConfig"
        :template="onCrosshairUpdate"
      />
    </VisXYContainer>
    <div
      v-if="!hideLegend"
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: LegendPositionTop ? '1rem' : undefined,
      }"
    >
      <VisBulletLegend
        :items="
          Object.values(props.categories).map((item) => ({
            ...item,
            color: Array.isArray(item.color) ? item.color[0] : item.color,
          }))
        "
      />
    </div>

    <div ref="slotWrapper" style="display: none">
      <slot v-if="slots.tooltip" name="tooltip" :values="hoverValues" />
      <slot v-else-if="hoverValues" name="fallback">
        <Tooltip
          :data="hoverValues"
          :categories="categories"
          :toolTipTitle="getFirstPropertyValue(hoverValues) ?? ''"
          :yFormatter="props.yFormatter"
        />
      </slot>
    </div>
  </div>
</template>

<!-- Example CSS for custom markers-->
<!-- <style scoped>
/* Stroke maps to color key in categories */
.markers:deep(*[stroke="#156F36"]) {
  marker: url("#circle-marker-desktop");
}
.markers:deep(*[stroke="#4ade80"]) {
  marker: url("#circle-marker-mobile");
}
</style> -->
