<script setup lang="ts" generic="T extends {}">
import { Donut } from "@unovis/ts";
import { ref, useSlots, useTemplateRef, computed } from "vue";
import { DonutType, type DonutChartProps } from "./types";

import Tooltip from "../Tooltip.vue";

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

const props = withDefaults(defineProps<DonutChartProps<T>>(), {
  legendPosition: LegendPosition.BottomCenter,
});

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverValues = ref();

const value = (d: number) => d;

const isHalf = props.type === DonutType.Half;

function onCrosshairUpdate(d: T): string {
  const keyName = Object.values(props.categories)[(d as any).index].name;
  hoverValues.value = {
    label: keyName,
    [keyName]: (d as any).data,
  };
  return generateTooltipContent();
}

function generateTooltipContent(): string {
  if (typeof window === "undefined") {
    return "";
  }
  if (slotWrapperRef.value) {
    return slotWrapperRef.value.innerHTML;
  }
  return "";
}

const isLegendTop = computed(() => props.legendPosition.includes("top"));

const legendAlignment = computed(() => {
  if (props.legendPosition.includes("left")) return "flex-start";
  if (props.legendPosition.includes("right")) return "flex-end";
  return "center";
});

const normalizeColor = (
  color: string | string[] | undefined,
  fallback = "#ccc"
): string => {
  if (!color) return fallback;
  return Array.isArray(color) ? color[0] || fallback : color;
};

const categoriesArray = computed(() => Object.values(props.categories));

const colors = (_: number, i: number) => {
  const cat = categoriesArray.value[i];
  if (!cat) return undefined;
  return normalizeColor(cat.color);
};
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
          [Donut.selectors.segment]: onCrosshairUpdate,
        }"
      />

      <VisDonut
        :value="value"
        :corner-radius="radius"
        :arc-width="arcWidth ?? 20"
        :color="colors"
        :angle-range="isHalf ? [-1.5707963267948966, 1.5707963267948966] : []"
        :pad-angle="props.padAngle || 0"
      />

      <div
        :style="{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }"
      >
        <slot />
      </div>
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
        :items="
          categoriesArray.map((item) => ({
            ...item,
            color: normalizeColor(item.color),
          }))
        "
      />
    </div>

    <div ref="slotWrapper" style="display: none">
      <slot v-if="slots.tooltip" name="tooltip" :values="hoverValues" />
      <slot v-else-if="hoverValues" name="fallback">
        <Tooltip
          :data="hoverValues"
          :categories="props.categories"
          :title-formatter="props.tooltipTitleFormatter"
        />
      </slot>
    </div>
  </div>
</template>
