<script setup lang="ts">
import { formatNumber } from "../../utils/format";
import { computed } from "vue";
import type { TooltipContentProps } from "vccs";
import type { TooltipRoundness, TooltipVariant } from "../../utils/variants";
import { injectChartUi } from "../../composables/useChartUi";

defineOptions({ name: "ChartTooltip", inheritAttrs: false });

const props = defineProps<
  TooltipContentProps & {
    /** Surface treatment. `frosted-glass` blurs what sits behind the tooltip. */
    variant?: TooltipVariant;
    /** Corner radius preset. Falls back to the `--vc-tooltip-radius` token. */
    roundness?: TooltipRoundness;
    /** Value formatter per series `dataKey`, e.g. from the series' y-axis. */
    formatters?: Record<string, (value: unknown) => string>;
  }
>();

const items = computed(() =>
  (props.payload ?? []).filter((p) => p.value !== null && p.value !== undefined),
);

const ui = injectChartUi();

function formatValue(value: unknown, dataKey: unknown): string {
  const format = props.formatters?.[String(dataKey)];
  if (format) return format(value);
  if (typeof value === "number") return formatNumber(value);
  return String(value);
}
</script>

<template>
  <div
    v-if="active && items.length"
    data-slot="tooltip"
    class="vc-tooltip"
    :class="[
      variant === 'frosted-glass' && 'vc-tooltip--frosted-glass',
      roundness && `vc-tooltip--${roundness}`,
      ui.slot('tooltip'),
    ]"
    :style="ui.themeStyle.tooltip"
  >
    <p v-if="label !== undefined && label !== ''" data-slot="tooltipTitle" class="vc-tooltip__label" :class="ui.slot('tooltipTitle')">
      {{ label }}
    </p>
    <ul data-slot="tooltipList" class="vc-tooltip__list" :class="ui.slot('tooltipList')">
      <li v-for="(item, index) in items" :key="index" data-slot="tooltipRow" class="vc-tooltip__item" :class="ui.slot('tooltipRow')">
        <span
          data-slot="tooltipIndicator"
          class="vc-tooltip__dot"
          :class="ui.slot('tooltipIndicator')"
          :style="{ background: item.color ?? item.fill ?? item.stroke }"
        />
        <span data-slot="tooltipLabel" class="vc-tooltip__name" :class="ui.slot('tooltipLabel')">{{ item.name }}</span>
        <span data-slot="tooltipValue" class="vc-tooltip__value" :class="ui.slot('tooltipValue')">{{ formatValue(item.value, item.dataKey) }}</span>
      </li>
    </ul>
  </div>
</template>
