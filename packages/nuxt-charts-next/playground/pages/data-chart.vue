<script setup lang="ts">
/**
 * The data-aware chart layer, demonstrated end to end.
 *
 * Every chart on this page is handed the *same* 4,587 raw order rows. Nothing
 * is pre-aggregated: the difference between the charts is entirely in the
 * spec object printed beside each one.
 */
import { computed, ref } from "vue";
import { orders } from "../data/orders";
import type { ChartSpec } from "../../src/runtime/spec/types";

/** Anchor the demo to a fixed date so the output does not drift over time. */
const TODAY = "2026-09-13";
const yearAgo = "2025-09-14";

const euro = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const formatEuro = (value: number) => euro.format(value);

/** Monthly revenue, summed, with a year-over-year baseline. */
const monthlyRevenue: ChartSpec = {
  type: "line",
  dimensions: { x: "createdAt", y: "amount" },
  transform: { interval: "month", aggregate: "sum" },
  range: { from: yearAgo, to: TODAY },
  compare: "previous-year",
  label: "Revenue",
};

/** The same rows, counted instead of summed — no `y` field needed. */
const orderVolume: ChartSpec = {
  type: "bar",
  dimensions: { x: "createdAt" },
  transform: { interval: "week", aggregate: "count" },
  range: { from: "2026-06-01", to: TODAY },
  label: "Orders",
};

/** A `series` split: one stacked band per plan. */
const revenueByPlan: ChartSpec = {
  type: "area",
  dimensions: { x: "createdAt", y: "amount", series: "plan" },
  transform: { interval: "month", aggregate: "sum" },
  range: { from: yearAgo, to: TODAY },
};

/** Categorical x: group on a non-temporal field, sorted and capped. */
const revenueByRegion: ChartSpec = {
  type: "bar",
  dimensions: { x: "region", y: "amount" },
  transform: { aggregate: "sum", sort: "desc" },
};

/** Average order value — a different aggregate over identical inputs. */
const averageOrderValue: ChartSpec = {
  type: "line",
  dimensions: { x: "createdAt", y: "amount" },
  transform: { interval: "week", aggregate: "average" },
  range: { from: "2026-03-01", to: TODAY },
  label: "Average order value",
};

const examples = [
  { title: "Monthly revenue, vs. previous year", spec: monthlyRevenue, formatter: formatEuro },
  { title: "Weekly order volume (count — no y field)", spec: orderVolume, formatter: undefined },
  { title: "Monthly revenue by plan (series split)", spec: revenueByPlan, stacked: true, formatter: formatEuro },
  { title: "Revenue by region (categorical x)", spec: revenueByRegion, formatter: formatEuro },
  { title: "Average order value (weekly)", spec: averageOrderValue, formatter: formatEuro },
];

/**
 * The live spec editor. Proves the serialization claim: the chart below is
 * driven by parsing this JSON text, exactly as a spec arriving from a database
 * row or a model would be.
 */
const specText = ref(JSON.stringify(monthlyRevenue, null, 2));

const parsed = computed<{ spec?: ChartSpec; error?: string }>(() => {
  try {
    return { spec: JSON.parse(specText.value) as ChartSpec };
  }
  catch (error) {
    return { error: error instanceof Error ? error.message : "Invalid JSON" };
  }
});
</script>

<template>
  <main class="mx-auto max-w-4xl px-6 py-10">
    <NuxtLink to="/" class="text-sm text-muted">← back</NuxtLink>

    <h1 class="mt-4 text-2xl font-semibold">Data-aware charts</h1>
    <p class="mt-2 max-w-2xl text-muted">
      Every chart on this page receives the same
      <strong class="text-default">{{ orders.length.toLocaleString() }}</strong>
      raw order rows — one row per order, nothing pre-aggregated. The bucketing,
      aggregation and period comparison all come from the serializable spec
      shown beside each chart.
    </p>

    <section class="mt-10">
      <h2 class="text-lg font-medium">A block built on the layer</h2>
      <p class="mt-1 text-sm text-muted">
        Total, % change, range switcher, table view and CSV export all derive
        from one spec and one pass over the data.
      </p>
      <div class="mt-4">
        <RevenueChart
          :data="orders"
          date="createdAt"
          value="amount"
          title="Revenue"
          :today="TODAY"
        />
      </div>
    </section>

    <section class="mt-12">
      <h2 class="text-lg font-medium">The spec drives everything</h2>

      <div
        v-for="example in examples"
        :key="example.title"
        class="mt-6 rounded-xl border border-default p-5"
      >
        <h3 class="text-sm font-medium">{{ example.title }}</h3>
        <div class="mt-4 grid gap-5 lg:grid-cols-[1fr_20rem]">
          <DataChart
            :data="orders"
            :spec="example.spec"
            :height="240"
            :stacked="example.stacked"
            :value-formatter="example.formatter"
          />
          <pre class="overflow-auto rounded-lg bg-elevated p-3 text-xs leading-relaxed"><code>{{ JSON.stringify(example.spec, null, 2) }}</code></pre>
        </div>
      </div>
    </section>

    <section class="mt-12">
      <h2 class="text-lg font-medium">Serializable, by construction</h2>
      <p class="mt-1 text-sm text-muted">
        Edit the JSON — the chart re-renders from the parsed object. This is the
        same path a spec stored in a database, or generated from a natural-language
        question, would take.
      </p>

      <div class="mt-4 grid gap-5 lg:grid-cols-2">
        <textarea
          v-model="specText"
          spellcheck="false"
          rows="18"
          class="w-full rounded-lg border border-default bg-elevated p-3 font-mono text-xs leading-relaxed"
        />
        <div>
          <p v-if="parsed.error" class="rounded-lg border border-error p-3 text-sm text-error">
            {{ parsed.error }}
          </p>
          <DataChart
            v-else-if="parsed.spec"
            :data="orders"
            :spec="parsed.spec"
            :height="300"
            :value-formatter="formatEuro"
          />
        </div>
      </div>
    </section>
  </main>
</template>
