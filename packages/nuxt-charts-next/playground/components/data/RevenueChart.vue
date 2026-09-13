<script setup lang="ts" generic="T">
/**
 * A higher-level analytics block built on `<DataChart>`.
 *
 * Demonstrates the point of the spec layer: this component takes raw rows and
 * two field names, and everything else — the total, the % change, the range
 * switcher, the table view, the CSV export — falls out of the same spec-driven
 * computation. None of it needs a second pass over the data or knowledge of
 * how the chart is drawn.
 *
 * It lives in the playground rather than the module because it is an example
 * of what the layer makes buildable, not (yet) a shipped API.
 */
import { computed, ref } from "vue";
import type { ChartSpec, SpecInterval } from "../../../src/runtime/spec/types";
import { transform } from "../../../src/runtime/spec/transform";
import { formatBucket, seriesLabel } from "../../../src/runtime/spec/resolve";
import { toCsv } from "../../../src/runtime/spec/csv";
import { COMPARE_KEY, VALUE_KEY } from "../../../src/runtime/spec/types";

const props = withDefaults(
  defineProps<{
    /** Raw application rows — one per order/event, not pre-aggregated. */
    data: T[];
    /** Field holding the row's timestamp. */
    date: string;
    /** Field holding the numeric value to sum. */
    value: string;
    /** Card heading. */
    title?: string;
    /** ISO currency code used to format totals and ticks. */
    currency?: string;
    /** Anchor for the ranges, so the demo is not tied to the wall clock. */
    today?: string;
  }>(),
  { title: "Revenue", currency: "EUR" },
);

/** The selectable windows, each with the bucket width that suits its length. */
const RANGES = [
  { key: "7d", label: "7D", days: 7, interval: "day" },
  { key: "30d", label: "30D", days: 30, interval: "day" },
  { key: "3m", label: "3M", days: 90, interval: "week" },
  { key: "1y", label: "1Y", days: 365, interval: "month" },
] as const satisfies readonly { key: string; label: string; days: number; interval: SpecInterval }[];

const activeRange = ref<(typeof RANGES)[number]["key"]>("30d");
const view = ref<"chart" | "table">("chart");

const range = computed(() => RANGES.find((r) => r.key === activeRange.value)!);

const anchor = computed(() => (props.today ? new Date(props.today) : new Date()));

/**
 * The spec. This is the whole configuration of the block — change the range
 * buttons and only this object moves; the chart, header, table and export all
 * follow from it.
 */
const spec = computed<ChartSpec>(() => {
  const to = anchor.value;
  const from = new Date(to.getTime() - (range.value.days - 1) * 86_400_000);
  return {
    type: "area",
    dimensions: { x: props.date, y: props.value },
    transform: { interval: range.value.interval, aggregate: "sum" },
    range: { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) },
    compare: "previous-period",
    label: props.title,
  };
});

/**
 * Run the spec once, here, and read the header numbers off the same result the
 * chart renders. Computing the total separately is how the headline figure and
 * the plotted line drift apart.
 */
const result = computed(() => transform(props.data ?? [], spec.value));

const money = computed(() =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: props.currency,
    maximumFractionDigits: 0,
  }),
);

const formattedTotal = computed(() => money.value.format(result.value.total));

const change = computed(() => result.value.change);

const changeLabel = computed(() => {
  const value = change.value;
  if (value === undefined) return "No prior data";
  const percent = new Intl.NumberFormat(undefined, {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(Math.abs(value));
  return `${value >= 0 ? "↑" : "↓"} ${percent} vs previous period`;
});

/** Rows with their bucket keys formatted, shared by the table and the export. */
const rows = computed(() =>
  result.value.data.map((datum) => ({
    label: formatBucket(datum.x, spec.value.transform?.interval),
    current: Number(datum[VALUE_KEY] ?? 0),
    previous: Number(datum[COMPARE_KEY] ?? 0),
  })),
);

const headers = computed(() =>
  Object.fromEntries(result.value.series.map((key) => [key, seriesLabel(key, spec.value)])),
);

/**
 * Export the aggregated rows, not the raw ones — the CSV should match what the
 * chart shows, which is the point of downloading it.
 */
function exportCsv() {
  const csv = toCsv(result.value.data, result.value.series, headers.value, "Period");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${props.title.toLowerCase().replace(/\s+/g, "-")}-${activeRange.value}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="rounded-xl border border-default bg-default p-5">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-sm text-muted">{{ title }}</p>
        <p class="mt-1 text-3xl font-semibold tabular-nums">{{ formattedTotal }}</p>
        <p
          class="mt-1 text-sm"
          :class="change === undefined ? 'text-muted' : change >= 0 ? 'text-success' : 'text-error'"
        >
          {{ changeLabel }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          v-for="r in RANGES"
          :key="r.key"
          size="xs"
          :color="activeRange === r.key ? 'primary' : 'neutral'"
          :variant="activeRange === r.key ? 'solid' : 'ghost'"
          @click="activeRange = r.key"
        >
          {{ r.label }}
        </UButton>
      </div>
    </div>

    <div class="mt-4">
      <DataChart
        v-if="view === 'chart'"
        :data="data"
        :spec="spec"
        :height="260"
        :value-formatter="(v: number) => money.format(v)"
      />

      <div v-else class="max-h-[260px] overflow-auto">
        <table class="w-full text-sm">
          <thead class="sticky top-0 bg-default">
            <tr class="text-left text-muted">
              <th class="py-1 font-medium">Period</th>
              <th class="py-1 text-right font-medium">{{ headers[VALUE_KEY] ?? "Current" }}</th>
              <th class="py-1 text-right font-medium">Previous</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.label" class="border-t border-default">
              <td class="py-1">{{ row.label }}</td>
              <td class="py-1 text-right tabular-nums">{{ money.format(row.current) }}</td>
              <td class="py-1 text-right tabular-nums text-muted">{{ money.format(row.previous) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <div class="flex gap-1">
        <UButton
          size="xs"
          :variant="view === 'chart' ? 'solid' : 'ghost'"
          :color="view === 'chart' ? 'primary' : 'neutral'"
          @click="view = 'chart'"
        >
          Chart
        </UButton>
        <UButton
          size="xs"
          :variant="view === 'table' ? 'solid' : 'ghost'"
          :color="view === 'table' ? 'primary' : 'neutral'"
          @click="view = 'table'"
        >
          Table
        </UButton>
      </div>
      <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-download" @click="exportCsv">
        Export
      </UButton>
    </div>
  </div>
</template>
