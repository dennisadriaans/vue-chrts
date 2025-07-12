<script setup lang="ts" generic="T">
import { computed, ref, useSlots, useTemplateRef } from "vue";
import { Position } from "@unovis/ts";
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
import { mapDataForChart } from "./mapper";

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
});


const svgDefs = computed(() => {
  if (!props.markerConfig) return '';
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

 type StackedDataRecord = {
  x: number;
  ys: number[];
};


const data = mapDataForChart(props.data, Object.keys(props.categories));

const legendItems = Array(data[0].values.length)
  .fill(0)
  .map((_, i) => ({ name: `Y${i}` }));

const x = (d: StackedDataRecord) => d.idx;
const y = legendItems.map((_, i) => (d: StackedDataRecord) => d.values[i]);


</script>

<template>
  <div
    class="flex flex-col space-y-4"
    :class="{ 'flex-col-reverse': LegendPositionTop }"
  >
    <VisXYContainer :data="data" :padding="padding" :height="height" :svgDefs="svgDefs">
      <VisTooltip
        :horizontal-placement="Position.Right"
        :vertical-placement="Position.Top"
      />
      <VisLine 
        v-for="(category, index) in Object.values(categories)" 
        :key="category.name"
        :x="x" 
        :y="y[index]" 
        :color="category.color"
      />
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
        :minMaxTicksOnly="minMaxTicksOnly"
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
        color="#666"
        :template="onCrosshairUpdate"
      />
    </VisXYContainer>
    <div
      v-if="!hideLegend"
      class="flex items center justify-end"
      :class="{ 'pb-4': LegendPositionTop }"
    >
      <VisBulletLegend :items="Object.values(categories)" />
    </div>

    <div ref="slotWrapper" class="hidden">
      <slot v-if="slots.tooltip" name="tooltip" :values="hoverValues" />
      <slot v-else-if="hoverValues" name="fallback">
        {{ hoverValues }}
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

<style scoped>
:deep(*[stroke="#f00"]) {
  marker: url("#circle-marker-desktop");
}
:deep(*[stroke="#4ade80"]) {
  marker: url("#circle-marker-mobile");
}
</style>
