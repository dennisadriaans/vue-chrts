<script setup lang="ts">
/**
 * Nuxt UI parity: nuxt-charts next to Nuxt UI's own `UChart` (TanStack
 * Charts), on the same data. Both read the `--ui-chart-*` palette and Nuxt UI
 * semantic tokens, both take `colors` with theme colour names, and both are
 * restyled by `ui` / `class` / `app.config` — see `app.config.ts`, whose
 * `ui.chart.slots.tooltip` override styles both tooltips at once.
 */
import { monthly } from "../data";
// MetricChart is not registered by the module yet, so import it directly.
import MetricChart from "../../src/runtime/components/MetricChart.vue";
import { orders } from "../data/orders";

const uchartCategories = [
  { key: "desktop", label: "Desktop" },
  { key: "mobile", label: "Mobile" },
] as const;

const categories: Record<string, BulletLegendItemInterface> = {
  desktop: { name: "Desktop" },
  mobile: { name: "Mobile" },
};

const browsers = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
];
const donutCategories = Object.fromEntries(browsers.map((b) => [b.browser, { name: b.browser }]));

const ranges = [
  { key: "30d", label: "30D", title: "Last 30 days", days: 30, interval: "day" },
  { key: "90d", label: "90D", title: "Last 90 days", days: 90, interval: "week" },
] as const;
const range = ref("30d");
</script>

<template>
  <UContainer class="py-10 flex flex-col gap-10">
    <div class="flex flex-col gap-1">
      <ULink to="/" class="text-sm text-muted">← back</ULink>
      <h1 class="text-2xl font-semibold text-highlighted">Nuxt UI parity</h1>
      <p class="text-sm text-muted">
        Left: Nuxt UI <code>UChart</code> (TanStack Charts). Right: nuxt-charts. Same data, same tokens,
        same <code>app.config</code>.
      </p>
    </div>

    <section class="grid gap-6 md:grid-cols-2">
      <UCard>
        <template #header><span class="text-sm font-medium">UChart · area</span></template>
        <UChart type="area" :data="monthly" index="month" :categories="[...uchartCategories]" curve="monotone" :height="240" />
      </UCard>
      <UCard>
        <template #header><span class="text-sm font-medium">AreaChart</span></template>
        <AreaChart :data="monthly" :categories="categories" x-axis="month" :curve-type="CurveType.MonotoneX" :height="240" />
      </UCard>

      <UCard>
        <template #header><span class="text-sm font-medium">UChart · bar, colors=['success','warning']</span></template>
        <UChart type="bar" :data="monthly" index="month" :categories="[...uchartCategories]" :colors="['success', 'warning']" :height="240" />
      </UCard>
      <UCard>
        <template #header><span class="text-sm font-medium">BarChart, colors=['success','warning']</span></template>
        <BarChart
          :data="monthly"
          :categories="categories"
          :y-axis="['desktop', 'mobile']"
          x-axis="month"
          :colors="['success', 'warning']"
          :height="240"
        />
      </UCard>

      <UCard>
        <template #header><span class="text-sm font-medium">UChart · donut</span></template>
        <UChart type="donut" :data="browsers" index="browser" :categories="['visitors']" :height="240" />
      </UCard>
      <UCard>
        <template #header><span class="text-sm font-medium">DonutChart</span></template>
        <DonutChart :data="browsers.map((b) => b.visitors)" :categories="donutCategories" :height="240" />
      </UCard>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-highlighted">Restyled with the <code>ui</code> prop</h2>
      <p class="text-sm text-muted">
        <code>:ui="{ tooltip: 'bg-inverted text-inverted ring-0', tooltipLabel: 'text-dimmed', legendLabel: 'text-highlighted font-medium' }"</code>
        and a root utility overriding an engine token.
      </p>
      <UCard>
        <LineChart
          :data="monthly"
          :categories="categories"
          x-axis="month"
          :colors="['primary', 'neutral']"
          :height="240"
          :ui="{
            root: '[--vc-grid-color:var(--ui-border-muted)]',
            tooltip: 'bg-inverted text-inverted ring-0',
            tooltipLabel: 'text-dimmed',
            tooltipValue: 'text-inverted',
            legendLabel: 'text-highlighted font-medium',
          }"
        />
      </UCard>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-lg font-semibold text-highlighted">MetricChart, themed with Nuxt UI tokens</h2>
      <UCard>
        <ClientOnly>
          <MetricChart
          v-model:range="range"
          :data="orders"
          title="Revenue"
          description="Paid orders, previous period compared"
          x="createdAt"
          y="amount"
          format="currency"
          currency="EUR"
          compare="previous-period"
          :ranges="ranges"
          anchor="2025-06-30"
          show-table
          exportable
          :height="200"
          />
        </ClientOnly>
      </UCard>
    </section>
  </UContainer>
</template>
