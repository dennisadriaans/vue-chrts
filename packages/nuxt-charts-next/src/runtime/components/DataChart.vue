<script setup lang="ts" generic="T">
/**
 * Data-aware chart primitive.
 *
 * Takes raw application rows plus a serializable `ChartSpec` and renders
 * a finished chart. The spec decides which fields to plot, how to bucket and
 * aggregate them, and what to compare against; this component runs that spec
 * and hands the result to the existing Area / Bar / Line adapters.
 *
 * The split matters: the adapters stay purely presentational, and the spec
 * stays plain JSON, so the same description can come from a config file, a
 * database row, or (later) a model — without this component changing.
 *
 * @example
 * ```vue
 * <DataChart
 *   :data="orders"
 *   :spec="{
 *     type: 'line',
 *     dimensions: { x: 'createdAt', y: 'amount' },
 *     transform: { interval: 'month' },
 *   }"
 *   :height="240"
 * />
 * ```
 */
import { computed } from "vue";
import AreaChart from "./AreaChart.vue";
import BarChart from "./BarChart.vue";
import LineChart from "./LineChart.vue";
import { transform } from "../spec/transform";
import { formatBucket, specCategories, seriesLabel, validateSpec } from "../spec/resolve";
import { VALUE_KEY, type SpecDatum } from "../spec/types";
import type { DataChartProps, NumericKeys } from "../types/charts";
import type { TransformResult } from "../spec/transform";

const props = withDefaults(defineProps<DataChartProps<T>>(), { height: 260 });

/**
 * A spec that cannot render is surfaced through the adapters' own `error`
 * prop rather than thrown, so a bad spec degrades to an error card in place
 * of breaking the surrounding page.
 */
const specError = computed(() => validateSpec(props.spec));

const result = computed<TransformResult>(() => {
  if (specError.value) return { data: [], series: [], total: 0 };
  return transform(props.data ?? [], props.spec);
});

/**
 * Bucket keys are replaced with their display labels up front rather than
 * through an `xFormatter`, because the renderer treats the x value as an
 * opaque category — formatting it here keeps the tooltip title, the axis tick
 * and the accessible data table showing the same string.
 */
const chartData = computed<SpecDatum[]>(() =>
  result.value.data.map((datum) => ({
    ...datum,
    x: formatBucket(datum.x, props.spec.transform?.interval, props.locale),
  })),
);

const categories = computed(() => specCategories(result.value.series, props.spec));

const yFormatter = computed(() =>
  props.valueFormatter ? (tick: number) => props.valueFormatter!(tick) : undefined,
);

/**
 * Props every renderer accepts, bound once and spread into each branch below.
 *
 * `<BarChart>` additionally needs `yAxis` — an explicit list of the numeric
 * keys to plot — which area and line infer from `categories`. That prop is
 * bound only on the bar branch rather than passed to all three, because its
 * `NumericKeys<T>` constraint cannot be satisfied by the open-ended index
 * signature on `SpecDatum`.
 */
const common = computed(() => ({
  data: chartData.value,
  height: props.height,
  categories: categories.value,
  xAxis: "x" as const,
  stacked: props.stacked,
  hideLegend: props.hideLegend,
  yFormatter: yFormatter.value,
  theme: props.theme,
  error: specError.value ?? props.error,
  loading: props.loading,
  loadingLabel: props.loadingLabel,
  emptyLabel: props.emptyLabel,
  ariaLabel: props.ariaLabel ?? props.spec.label ?? seriesLabel(VALUE_KEY, props.spec),
  ariaDescription: props.ariaDescription,
  legendVariant: props.legendVariant,
  tooltipVariant: props.tooltipVariant,
  tooltipRoundness: props.tooltipRoundness,
}));

/**
 * The series keys, typed for `<BarChart>`'s `yAxis`.
 *
 * `NumericKeys<SpecDatum>` collapses to `never`: the datum's index signature
 * has to admit the `string` x bucket alongside the numeric series values, so
 * no key is *declared* purely numeric even though every series key is numeric
 * in practice. `BarChart` only ever does `String(key)` on these, so the cast
 * describes the real contract rather than papering over a mismatch.
 */
const barSeriesKeys = computed(() => result.value.series as NumericKeys<SpecDatum>[]);

/**
 * The aggregated rows and summary numbers, exposed so a parent can render its
 * own header (total, % change) or an export button over the same computation
 * instead of running the transform a second time.
 */
defineExpose({ result });

defineSlots<{
  tooltip?: (props: { values: SpecDatum | undefined }) => unknown;
}>();
</script>

<template>
  <BarChart
    v-if="spec.type === 'bar'"
    v-bind="common"
    :y-axis="barSeriesKeys"
  >
    <template v-if="$slots.tooltip" #tooltip="scope">
      <slot name="tooltip" v-bind="scope" />
    </template>
  </BarChart>

  <AreaChart v-else-if="spec.type === 'area'" v-bind="common">
    <template v-if="$slots.tooltip" #tooltip="scope">
      <slot name="tooltip" v-bind="scope" />
    </template>
  </AreaChart>

  <LineChart v-else v-bind="common">
    <template v-if="$slots.tooltip" #tooltip="scope">
      <slot name="tooltip" v-bind="scope" />
    </template>
  </LineChart>
</template>
