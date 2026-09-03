<script setup lang="ts">
/**
 * The chart legend.
 *
 * `variant` picks the shape of the swatch beside each label. The outline
 * variants are drawn with a mask that punches out the centre rather than a CSS
 * `border`, so the ring follows the swatch's own corner radius exactly and
 * stays even at the 10px sizes these render at.
 */
import type { LegendIndicatorVariant } from "../../utils/variants";

interface LegendItem {
  value: string;
  color?: string;
  inactive?: boolean;
}

withDefaults(
  defineProps<{
    payload?: LegendItem[];
    variant?: LegendIndicatorVariant;
  }>(),
  { payload: undefined, variant: "rounded-square" },
);
</script>

<template>
  <ul class="vc-legend">
    <li
      v-for="item in payload"
      :key="item.value"
      class="vc-legend__item"
      :class="{ 'vc-legend__item--inactive': item.inactive }"
    >
      <span
        class="vc-legend__dot"
        :class="`vc-legend__dot--${variant}`"
        :style="{ background: item.color }"
      />
      <span class="vc-legend__label">{{ item.value }}</span>
    </li>
  </ul>
</template>
