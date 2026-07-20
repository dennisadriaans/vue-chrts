<script setup lang="ts">
/**
 * Hero widget — shared dataset rendered through the chart type the visitor picks.
 * Mock data: swap for real numbers before launch.
 */
 const heroData = [
  { month: "Jan", revenue: 4200, expenses: 2400 },
  { month: "Feb", revenue: 5100, expenses: 2900 },
  { month: "Mar", revenue: 4800, expenses: 3100 },
  { month: "Apr", revenue: 6400, expenses: 3300 },
  { month: "May", revenue: 7200, expenses: 3800 },
  { month: "Jun", revenue: 8100, expenses: 4100 },
];

const heroCategories = {
  revenue: { name: "Revenue", color: "var(--color-green-500)" },
  expenses: { name: "Expenses", color: "var(--color-blue-500)" },
};

const heroChartTypes = [
  { label: "Area", value: "area" as const },
  { label: "Line", value: "line" as const },
  { label: "Bar", value: "bar" as const },
];

const heroChartType = ref<"area" | "line" | "bar">("area");

const heroXFormatter = (i: number) => heroData[i]?.month ?? "";
const heroYFormatter = (value: number) => `$${(value / 1000).toFixed(1)}k`;
</script>

<template>
    <!-- Live chart widget -->
    <UCard :ui="{ root: 'rounded-2xl', body: 'p-5 sm:p-6' }">
            <div
              class="mb-6 flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <p class="text-highlighted text-sm font-medium">
                  Monthly revenue
                </p>
                <p class="text-muted dark:text-dimmed text-xs">
                  Last 6 months
                </p>
              </div>

              <UTabs
                v-model="heroChartType"
                :items="heroChartTypes"
                variant="pill"
                size="xs"
                :content="false"
                :ui="{ list: 'bg-elevated' }"
              />
            </div>

            <ClientOnly>
              <AreaChart
                v-if="heroChartType === 'area'"
                :data="heroData"
                :height="260"
                :categories="heroCategories"
                :x-formatter="heroXFormatter"
                :y-formatter="heroYFormatter"
                :curve-type="CurveType.Cardinal"
                :x-grid-line="false"
                :y-grid-line="true"
                :x-domain-line="false"
                :y-domain-line="false"
                :x-num-ticks="6"
                :y-num-ticks="4"
                stacked
              />
              <LineChart
                v-else-if="heroChartType === 'line'"
                :data="heroData"
                :height="260"
                :categories="heroCategories"
                :x-formatter="heroXFormatter"
                :y-formatter="heroYFormatter"
                :curve-type="CurveType.Cardinal"
                :x-grid-line="false"
                :y-grid-line="true"
                :x-domain-line="false"
                :y-domain-line="false"
                :x-num-ticks="6"
                :y-num-ticks="4"
              />
              <BarChart
                v-else
                :data="heroData"
                :height="260"
                :categories="heroCategories"
                :y-axis="['revenue', 'expenses']"
                :x-formatter="heroXFormatter"
                :y-formatter="heroYFormatter"
                :x-grid-line="false"
                :y-grid-line="true"
                :x-domain-line="false"
                :y-domain-line="false"
                :x-num-ticks="6"
                :y-num-ticks="4"
              />

              <template #fallback>
                <div class="h-[260px]" />
              </template>
            </ClientOnly>
          </UCard>
</template>