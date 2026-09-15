<script setup lang="ts" generic="T">
/**
 * An opinionated analytics component: one metric, answered completely.
 *
 * Where `<DataChart>` renders a spec, this renders a *question* — "what is
 * revenue this month, and is it up?" — and assembles the spec itself. That is
 * the whole point of the layer: the things a developer rebuilds around every
 * dashboard chart (a headline total, a delta against the previous period, a
 * range selector, formatting, empty and error states, a CSV export) are here
 * once instead of in every application.
 *
 * Crucially it adds no new maths. The window arithmetic lives in
 * `spec/metric`, the aggregation and the change calculation in
 * `spec/transform`, and the rendering in the existing adapters. This component
 * is composition and chrome:
 *
 * ```text
 * MetricChart  -> header, ranges, table, export
 *   ChartSpec  -> metricSpec()
 *   DataChart  -> transform() + adapters
 * ```
 *
 * @example
 * ```vue
 * <MetricChart
 *   title="Revenue"
 *   :data="orders"
 *   x="createdAt"
 *   y="amount"
 *   aggregate="sum"
 *   compare="previous-period"
 *   format="currency"
 * />
 * ```
 */
import { computed, ref, useId, watch } from "vue";
import DataChart from "./DataChart.vue";
import { transform } from "../spec/transform";
import { formatBucket, seriesLabel } from "../spec/resolve";
import { toCsv } from "../spec/csv";
import {
  DEFAULT_RANGES,
  formatChange,
  formatMetricValue,
  metricDelta,
  metricSpec,
  resolveRange,
  type MetricRange,
} from "../spec/metric";
import type { MetricChartProps } from "../types/charts";

const props = withDefaults(defineProps<MetricChartProps<T>>(), {
  type: "line",
  format: "number",
  currency: "EUR",
  height: 220,
  aggregate: "sum",
});

/**
 * Selected range key.
 *
 * `v-model:range` is optional: without it the component keeps its own
 * selection, so a metric card works as a drop-in without the host having to
 * own state it does not care about. With it, several cards can share one
 * selection — which is what the eventual `MetricGrid` will use.
 */
const rangeModel = defineModel<string | undefined>("range", { default: undefined });

const emit = defineEmits<{
  /** The window changed, whether from a range click or a prop change. */
  "update:window": [window: { from: string; to: string }];
  /** The user asked for the CSV. Fires after the download starts. */
  "export": [csv: string];
}>();

const ranges = computed<readonly MetricRange[]>(() => props.ranges ?? DEFAULT_RANGES);

/**
 * The active range object.
 *
 * Falls back to the first available range when the model holds a key that is
 * not in the list — a stale key from a previous `ranges` prop should show
 * *something* rather than collapsing the window to nothing.
 */
const activeRange = computed<MetricRange | undefined>(() => {
  const list = ranges.value;
  if (!list.length) return undefined;
  return list.find((range) => range.key === rangeModel.value) ?? list[1] ?? list[0];
});

/**
 * The window to aggregate over.
 *
 * An explicit `window` prop wins over the selector, so a page-level date
 * picker can drive the card without the internal buttons fighting it.
 */
const window = computed(() => {
  if (props.window) return props.window;
  const range = activeRange.value;
  if (!range) return undefined;
  return resolveRange(range, props.anchor);
});

watch(window, (value) => {
  if (value) emit("update:window", value);
}, { immediate: true });

/**
 * Bucket width: the explicit prop, else the one the active range considers
 * legible for its span.
 */
const interval = computed(() => props.interval ?? activeRange.value?.interval ?? "day");

/**
 * The spec handed to `<DataChart>`.
 *
 * Assembled through `metricSpec` rather than inline, so the mapping from
 * metric props to spec is a pure function the tests can exercise without
 * mounting anything.
 */
const spec = computed(() =>
  metricSpec({
    type: props.type,
    x: props.x,
    y: props.y,
    series: props.series,
    aggregate: props.aggregate,
    interval: interval.value,
    compare: props.compare,
    // With no ranges and no explicit window, the metric covers all of history:
    // an empty range would filter every row out, which reads as "no data" when
    // the truth is "no window was asked for".
    range: window.value ?? { from: "0000-01-01", to: "9999-12-31" },
    label: props.title,
  }),
);

/**
 * The aggregated result.
 *
 * Run here as well as inside `<DataChart>` because the header needs the total
 * and the change *before* the chart mounts — and because a client-only chart
 * component cannot be read from during SSR. `transform` is pure and memoized
 * by `computed`, so the second run costs one pass over already-filtered rows
 * rather than any correctness risk of two divergent numbers: both calls take
 * the identical `(rows, spec)` input.
 */
const result = computed(() => transform(props.data ?? [], spec.value));

/** Formats one value for the headline, the axis and the table. */
const formatValue = computed(() => {
  if (props.valueFormatter) return props.valueFormatter;
  return (value: number) =>
    formatMetricValue(value, {
      format: props.format,
      currency: props.currency,
      locale: props.locale,
      options: props.formatOptions,
    });
});

/**
 * The headline number.
 *
 * An `average` metric is averaged over its buckets rather than summed: the
 * sum of a series of averages is a number with no meaning, whereas the mean
 * of them answers "what was the typical value over this window". Same for a
 * rate, which arrives as an average. `min` and `max` reduce the same way they
 * aggregate, so the headline matches what the chart's extremes show.
 */
const headline = computed(() => {
  const { total, data, series } = result.value;
  const aggregate = props.aggregate;
  if (aggregate === "sum" || aggregate === "count") return total;

  const primary = series.find((key) => key !== "compare");
  if (!primary) return total;
  const values = data
    .map((datum) => datum[primary])
    .filter((value): value is number => typeof value === "number");
  if (!values.length) return 0;
  if (aggregate === "min") return Math.min(...values);
  if (aggregate === "max") return Math.max(...values);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
});

const headlineText = computed(() => formatValue.value(headline.value));

/**
 * The delta, as text plus the direction and sentiment that colour it.
 *
 * `undefined` whenever the transform declined to compute a change — no
 * comparison requested, or a zero baseline, where a percentage would be a
 * fabrication rather than a fact.
 */
const delta = computed(() => {
  const change = result.value.change;
  const text = formatChange(change, props.locale);
  if (text === undefined) return undefined;
  return { text, ...metricDelta(change, props.inverseSentiment) };
});

/** `vs previous period` / `vs previous year`, matching the comparison asked for. */
const compareLabel = computed(() =>
  props.compare === "previous-year" ? "vs previous year" : "vs previous period",
);

/**
 * The absolute movement, shown beside the percentage.
 *
 * A percentage alone hides scale — 12% of a rounding error and 12% of the
 * quarter's revenue read identically — so the raw difference is offered in
 * the same formatting as the headline.
 */
const absoluteChange = computed(() => {
  const { total, compareTotal } = result.value;
  if (compareTotal === undefined) return undefined;
  const difference = total - compareTotal;
  const sign = difference > 0 ? "+" : difference < 0 ? "−" : "";
  return `${sign}${formatValue.value(Math.abs(difference))}`;
});

/** Whether the chart has anything to draw, after filtering to the window. */
const isEmpty = computed(() =>
  !props.loading && !props.error && result.value.data.length === 0,
);

/* ---- table view ---- */

const showingTable = ref(false);

/** Series keys in render order, with the labels the legend uses. */
const tableColumns = computed(() =>
  result.value.series.map((key) => ({ key, label: seriesLabel(key, spec.value) })),
);

/** Aggregated rows with their bucket keys formatted for display. */
const tableRows = computed(() =>
  result.value.data.map((datum) => ({
    x: formatBucket(datum.x, interval.value, props.locale),
    values: result.value.series.map((key) => {
      const value = datum[key];
      return typeof value === "number" ? formatValue.value(value) : "—";
    }),
  })),
);

/* ---- CSV export ---- */

/** `Revenue by plan` -> `revenue-by-plan`. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "metric";
}

/**
 * Serialize the aggregated rows and hand them to the browser as a download.
 *
 * The CSV carries the *aggregated* rows, not the raw input: it is the data the
 * chart is showing, which is what someone clicking "export" under a chart is
 * asking for. `toCsv` lives in the data layer so a server route can produce a
 * byte-identical file.
 */
function exportCsv() {
  const headers = Object.fromEntries(
    tableColumns.value.map((column) => [column.key, column.label]),
  );
  const csv = toCsv(result.value.data, result.value.series, headers, props.x);
  emit("export", csv);

  // Guarded because the component is client-only but may still be imported in
  // a non-DOM context (a test, a server-side render of a parent).
  if (typeof document === "undefined") return;
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = props.exportFilename ?? `${slugify(props.title ?? "metric")}.csv`;
  link.click();
  // Released on the next task so the click has been dispatched first; revoking
  // synchronously cancels the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/* ---- accessibility ---- */

const titleId = useId();
const valueId = useId();

/**
 * The headline restated for screen readers.
 *
 * The visual header conveys the delta through an arrow glyph and colour,
 * neither of which reads aloud usefully, so the same information is spelled
 * out in one sentence on the value's accessible label.
 */
const valueLabel = computed(() => {
  const parts = [props.title, headlineText.value].filter(Boolean);
  if (delta.value) {
    const direction = delta.value.direction === "up" ? "up" : delta.value.direction === "down" ? "down" : "unchanged";
    parts.push(`${direction} ${delta.value.text} ${compareLabel.value}`);
  }
  return parts.join(", ");
});

defineExpose({ result, spec, exportCsv });

defineSlots<{
  /** Replaces the whole header (title, description, value, delta). */
  header?: () => unknown;
  /** Replaces the headline value and its delta only. */
  value?: (props: { value: number; formatted: string; change: number | undefined }) => unknown;
  /** Extra controls in the footer, beside the table and export buttons. */
  actions?: () => unknown;
}>();
</script>

<template>
  <section
    class="vc-metric"
    :aria-labelledby="title ? titleId : undefined"
    :aria-busy="loading ? 'true' : undefined"
  >
    <header class="vc-metric__header">
      <slot name="header">
        <div class="vc-metric__heading">
          <h3 v-if="title" :id="titleId" class="vc-metric__title">{{ title }}</h3>
          <p v-if="description" class="vc-metric__description">{{ description }}</p>
        </div>

        <slot
          name="value"
          :value="headline"
          :formatted="headlineText"
          :change="result.change"
        >
          <div v-if="!hideValue" class="vc-metric__value-row">
            <!--
              The skeleton stands in for the number rather than showing a stale
              or zero total while data is in flight: a headline that renders
              "€0" and then jumps is worse than one that visibly waits.
            -->
            <div v-if="loading" class="vc-metric__value-skeleton" aria-hidden="true" />
            <template v-else>
              <p :id="valueId" class="vc-metric__value" :aria-label="valueLabel">
                {{ headlineText }}
              </p>
              <p
                v-if="delta"
                class="vc-metric__delta"
                :data-sentiment="delta.sentiment"
                aria-hidden="true"
              >
                <span class="vc-metric__delta-arrow">{{
                  delta.direction === "up" ? "↑" : delta.direction === "down" ? "↓" : "→"
                }}</span>
                <span>{{ delta.text }}</span>
                <span v-if="absoluteChange" class="vc-metric__delta-absolute">({{ absoluteChange }})</span>
                <span class="vc-metric__delta-label">{{ compareLabel }}</span>
              </p>
            </template>
          </div>
        </slot>
      </slot>
    </header>

    <!--
      The table replaces the chart rather than sitting beside it, so the two
      never disagree about how much vertical space the card takes — a card that
      grows on toggle shoves everything below it down the page.
    -->
    <div v-if="showingTable" class="vc-metric__table-wrap" :style="{ minHeight: `${height}px` }">
      <table class="vc-metric__table">
        <caption class="vc-sr-only">{{ title ?? "Metric data" }}</caption>
        <thead>
          <tr>
            <th scope="col">{{ x }}</th>
            <th v-for="column in tableColumns" :key="column.key" scope="col">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableRows" :key="index">
            <th scope="row">{{ row.x }}</th>
            <td v-for="(value, column) in row.values" :key="column">{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <DataChart
      v-else
      :data="data"
      :spec="spec"
      :height="height"
      :locale="locale"
      :stacked="stacked"
      :hide-legend="hideLegend ?? !compare && !series"
      :theme="theme"
      :value-formatter="formatValue"
      :loading="loading"
      :loading-label="loadingLabel"
      :error="error"
      :empty-label="emptyLabel"
      :aria-label="ariaLabel ?? title"
      :aria-description="ariaDescription ?? (delta ? valueLabel : undefined)"
      :accessible-data-table="accessibleDataTable"
      :max-data-points="maxDataPoints"
      :legend-variant="legendVariant"
      :tooltip-variant="tooltipVariant"
      :tooltip-roundness="tooltipRoundness"
    />

    <footer v-if="ranges.length || showTable || exportable || $slots.actions" class="vc-metric__footer">
      <!--
        A radiogroup rather than a row of buttons: the ranges are one mutually
        exclusive choice, and that is what lets a screen reader announce
        "30D, selected, 2 of 4" instead of four unrelated buttons.
      -->
      <div
        v-if="ranges.length && !window"
        class="vc-metric__ranges"
        role="radiogroup"
        aria-label="Time range"
      >
        <button
          v-for="range in ranges"
          :key="range.key"
          type="button"
          role="radio"
          class="vc-metric__range"
          :aria-checked="range.key === activeRange?.key"
          :aria-label="range.title ?? range.label"
          :data-active="range.key === activeRange?.key ? 'true' : undefined"
          @click="rangeModel = range.key"
        >
          {{ range.label }}
        </button>
      </div>

      <div class="vc-metric__actions">
        <slot name="actions" />
        <button
          v-if="showTable"
          type="button"
          class="vc-metric__action"
          :aria-pressed="showingTable"
          @click="showingTable = !showingTable"
        >
          {{ showingTable ? "Chart" : "Table" }}
        </button>
        <button
          v-if="exportable"
          type="button"
          class="vc-metric__action"
          :disabled="isEmpty"
          @click="exportCsv"
        >
          Export
        </button>
      </div>
    </footer>
  </section>
</template>
