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
    /**
     * Flat colour per series name, overriding what the chart engine reports.
     *
     * A series painted from a pattern or gradient reports a `url(#…)` SVG paint
     * reference, which cannot paint the indicator's CSS background.
     */
    colors?: Record<string, string>;
  }
>();

const items = computed(() =>
  (props.payload ?? []).filter((p) => p.value !== null && p.value !== undefined),
);

const ui = injectChartUi();

type TooltipItem = NonNullable<TooltipContentProps["payload"]>[number];

/** First CSS-paintable colour for a row; `url(#…)` paint references are skipped. */
function indicatorColor(item: TooltipItem): string | undefined {
  const override = props.colors?.[String(item.name)];
  if (override) return override;
  return [item.color, item.fill, item.stroke].find(
    (paint): paint is string => typeof paint === "string" && !paint.startsWith("url("),
  );
}

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
          :style="{ background: indicatorColor(item) }"
        />
        <span data-slot="tooltipLabel" class="vc-tooltip__name" :class="ui.slot('tooltipLabel')">{{ item.name }}</span>
        <span data-slot="tooltipValue" class="vc-tooltip__value" :class="ui.slot('tooltipValue')">{{ formatValue(item.value, item.dataKey) }}</span>
      </li>
    </ul>
  </div>
</template>
