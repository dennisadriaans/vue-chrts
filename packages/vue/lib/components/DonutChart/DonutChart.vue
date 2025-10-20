<script setup lang="ts" generic="T extends Record<string, any> = any">
import { Donut } from "@unovis/ts";
import { ref, useSlots, useTemplateRef, computed } from "vue";
import { type DonutChartProps, DonutType } from "./types";

import {
  VisBulletLegend,
  VisDonut,
  VisSingleContainer,
  VisTooltip,
} from "@unovis/vue";
import { LegendPosition } from "../../types";

const emit = defineEmits<{
  (e: "click", event: MouseEvent, values?: any): void;
}>();

const props = withDefaults(defineProps<DonutChartProps>(), {
  legendPosition: LegendPosition.BottomCenter,
})

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverValues = ref();

const value = (d: number) => d;

const isHalf = props.type === DonutType.Half;

function onCrosshairUpdate(d: T) {
  hoverValues.value = d;
}

const isLegendTop = computed(() => props.legendPosition.includes("top"));

const legendAlignment = computed(() => {
  if (props.legendPosition.includes("left")) return "flex-start";
  if (props.legendPosition.includes("right")) return "flex-end";
  return "center";
});
</script>

<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: isLegendTop ? 'column-reverse' : 'column',
      gap: 'var(--vis-legend-spacing)',
    }"
    @click="emit('click', $event, hoverValues)"
  >
    <VisSingleContainer :data="data" :height="height" :margin="{}">
      <VisTooltip
        :horizontal-shift="20"
        :vertical-shift="20"
        :triggers="{
          [Donut.selectors.segment]: (d: T) => {
            onCrosshairUpdate(d);
            return d ? slotWrapperRef?.innerHTML : '';
          },
        }"
      />

      <VisDonut
        :value="value"
        :corner-radius="radius"
        :arc-width="arcWidth ?? 20"
        :color="props.labels.map((l) => l.color)"
        :angle-range="isHalf ? [-1.5707963267948966, 1.5707963267948966] : []"
        :pad-angle="props.padAngle || 0"
      />
    </VisSingleContainer>

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
        :items="labels"
      />
    </div>

    <slot />

    <div ref="slotWrapper" style="display: none">
      <slot v-if="slots.tooltip" name="tooltip" :values="hoverValues" />
      <slot v-else-if="hoverValues" name="fallback">
        <div style="display: flex; align-items: center; padding: 10px 15px">
          <div
            :style="{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '9999px',
              marginRight: '0.5rem',
              backgroundColor: props.labels[hoverValues.index].color,
            }"
          ></div>
          <div>{{ hoverValues.data }}</div>
        </div>
      </slot>
    </div>
  </div>
</template>
