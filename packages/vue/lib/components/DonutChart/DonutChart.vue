<script setup lang="ts" generic="T extends {}">
import { Donut } from "@unovis/ts";
import { ref, useSlots, useTemplateRef } from "vue";
import { type DonutChartProps, DonutType } from "./types";

import {
  VisBulletLegend,
  VisDonut,
  VisSingleContainer,
  VisTooltip,
} from "@unovis/vue";

const props = defineProps<DonutChartProps>();
// Provide default for hideTooltip if not set

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverValues = ref();

const value = (d: number) => d;

const isHalf = props.type === DonutType.Half;

function onCrosshairUpdate(d: T): string {
  hoverValues.value = d;
  return generateTooltipContent(d);
}

function generateTooltipContent(d: T): string {
  if (typeof window === "undefined") {
    return "";
  }
  if (slotWrapperRef.value) {
    return slotWrapperRef.value.innerHTML;
  }
  return "";
}
</script>

<template>
  <div class="flex items-center justify-center">
    <VisSingleContainer :data="data" :height="height" :margin="{}">
      <VisTooltip
        :horizontal-shift="20"
        :vertical-shift="20"
        :triggers="{
          [Donut.selectors.segment]: onCrosshairUpdate,
        }"
      />

    <VisDonut
      :value="value"
      :corner-radius="radius"
      :color="props.labels.map((l) => l.color)"
      :angle-range="isHalf ? [-1.5707963267948966, 1.5707963267948966] : []"
      :pad-angle="props.padAngle || 0"
    />
    </VisSingleContainer>

    <slot />
    <div ref="slotWrapper" class="hidden">
      <slot v-if="slots.tooltip" name="tooltip" :values="hoverValues" />
      <slot v-else-if="hoverValues" name="fallback">
        <div class="flex items-center">
          <div
            class="w-2 h-2 rounded-full mr-2"
            :style="`background-color: ${ props.labels[hoverValues.index].color } ;`"
          ></div>
          <div>{{ hoverValues.data }}</div>
        </div>
      </slot>
    </div>
  </div>

  <div v-if="!hideLegend" class="flex items-center justify-center mt-4">
    <VisBulletLegend :items="labels" />
  </div>
</template>
