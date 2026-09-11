<script setup lang="ts" generic="T extends {}">
import { Donut } from "@unovis/ts";
import { ref, useSlots, useTemplateRef, computed } from "vue";
import { DonutType, type DonutChartProps } from "./DonutChart";

import Tooltip from "../Tooltip.vue";

import {
  VisBulletLegend,
  VisDonut,
  VisSingleContainer,
  VisTooltip,
} from "@unovis/vue";
import { LegendPosition } from "../../enums";

const emit = defineEmits<{
  (e: "click", event: MouseEvent, values?: any): void;
}>();

const props = withDefaults(defineProps<DonutChartProps<T>>(), {
  duration: 600,
  legendPosition: LegendPosition.BottomCenter,
  showBackground: true,
  tooltip: () => ({
    followCursor: true,
  }),
});

const slots = useSlots();
const slotWrapperRef = useTemplateRef<HTMLDivElement>("slotWrapper");
const hoverValues = ref();

const value = (d: number) => d;

const isHalf = computed(() => props.type === DonutType.Half);

/**
 * Returns the live slot wrapper element rather than an HTML string.
 *
 * Unovis calls this trigger synchronously, so reading
 * `slotWrapperRef.innerHTML` here would snapshot the DOM *before* Vue has
 * re-rendered for the `hoverValues` assignment above — the tooltip would lag
 * one interaction behind (and be empty on the very first one). That is
 * invisible on desktop, where `mousemove` fires repeatedly and the DOM catches
 * up, but on touch a single tap is a single event, so every tap shows the
 * previous tap's label. `Tooltip.render()` accepts an `HTMLElement` and adopts
 * it into the tooltip container, and Vue keeps patching that element after it
 * has been moved, so the contents stay in sync with `hoverValues`.
 */
function onCrosshairUpdate(d: T): HTMLElement | string {
  const category = categoriesArray.value[(d as any).index];
  if (!category) return "";

  const keyName = category.name;
  hoverValues.value = {
    label: keyName,
    [keyName]: (d as any).data,
  };

  if (typeof window === "undefined" || !slotWrapperRef.value) return "";
  // The wrapper is hidden while it sits in the chart's own DOM; once unovis
  // owns it, it must be visible.
  slotWrapperRef.value.style.display = "";
  return slotWrapperRef.value;
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
    <VisSingleContainer
      :data="data"
      :height="height"
      :duration="duration"
      :margin="{}"
    >
      <VisTooltip
        v-if="!hideTooltip"
        :horizontal-shift="20"
        :vertical-shift="20"
        :followCursor="props.tooltip.followCursor"
        :show-delay="props.tooltip.showDelay"
        :hide-delay="props.tooltip.hideDelay"
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
        :show-background="props.showBackground"
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
          'display: flex; gap: var(--vis-legend-spacing); flex-wrap: wrap; align-items: center; justify-content: ' +
            legendAlignment,
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
