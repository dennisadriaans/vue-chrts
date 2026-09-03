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

const props = withDefaults(
  defineProps<{
    payload?: LegendItem[];
    variant?: LegendIndicatorVariant;
    /**
     * Flat colour per legend label, overriding what the chart engine reports.
     *
     * A series painted from a variant pattern reports its `fill` — a
     * `url(#…)` SVG paint reference — as its legend colour. That is meaningless
     * as a CSS background and would render the swatch invisible, so charts
     * using a patterned fill pass the underlying colours through here.
     */
    colors?: Record<string, string>;
  }>(),
  { payload: undefined, variant: "rounded-square", colors: undefined },
);

/** An SVG paint reference cannot paint a CSS background; fall back to the map. */
function swatchColor(item: LegendItem): string | undefined {
  const override = props.colors?.[item.value];
  if (override) return override;
  return item.color?.startsWith("url(") ? undefined : item.color;
}
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
        :style="{ background: swatchColor(item) }"
      />
      <span class="vc-legend__label">{{ item.value }}</span>
    </li>
  </ul>
</template>
