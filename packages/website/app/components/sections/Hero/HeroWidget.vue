<script setup lang="ts">
/**
 * Hero widget — shared dataset rendered through the chart type the visitor picks.
 * Icon toggle switches Area/Bar; arrows cycle style variants for the active type.
 */
withDefaults(
  defineProps<{
    height?: number;
  }>(),
  {
    height: 260,
  },
);

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

/**
 * Dense daily series shaped like the cube-grid reference (single metric, 0–100).
 * Deterministic so SSR/client and demos stay stable.
 */
const cubeTrendData = (() => {
  const start = Date.UTC(2026, 2, 1);
  const values = [
    12, 18, 8, 22, 35, 28, 15, 42, 55, 38, 20, 14, 48, 62, 71, 45, 30, 18, 25, 40,
    58, 66, 52, 34, 22, 16, 28, 44, 60, 75, 82, 68, 50, 36, 24, 19, 31, 47, 63, 78,
    88, 70, 54, 41, 29, 21, 33, 49, 65, 80, 92, 74, 56, 38, 26, 17, 27, 28, 45, 61,
    72, 85, 64, 48, 32, 23, 37, 51, 67, 79, 90, 73, 55, 39, 28, 20, 34, 46, 59, 70,
  ];
  return values.map((value, i) => {
    const date = new Date(start + i * 86_400_000);
    return {
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
      value,
    };
  });
})();

const cubeTrendCategories = {
  value: { name: "Failed executions", color: "#f97316" },
};

type HeroChartType = "area" | "bar";

const heroChartType = ref<HeroChartType>("area");

const areaVariants = [
  { label: "Gradient", dither: undefined as undefined },
  { label: "Bayer dither", dither: "bayer" as const },
  { label: "Noise dither", dither: "noise" as const },
  { label: "Fade dither", dither: "fade" as const },
];

const barVariants = [
  { label: "Solid", variant: "solid" as const, stacked: false, mode: "revenue" as const },
  { label: "Cubes", variant: "cubes" as const, stacked: false, mode: "trend" as const },
  { label: "Cubes grouped", variant: "cubes" as const, stacked: false, mode: "revenue" as const },
];

const heroVariantIndex = ref(0);

const heroVariants = computed(() =>
  heroChartType.value === "area" ? areaVariants : barVariants,
);

const heroVariant = computed(() => heroVariants.value[heroVariantIndex.value]!);

const areaFill = computed(() =>
  heroChartType.value === "area"
    ? (heroVariant.value as (typeof areaVariants)[number])
    : areaVariants[0]!,
);

const activeBarVariant = computed(() =>
  heroChartType.value === "bar"
    ? (heroVariant.value as (typeof barVariants)[number])
    : barVariants[0]!,
);

const isCubeTrend = computed(
  () => activeBarVariant.value.mode === "trend",
);

function setChartType(type: HeroChartType) {
  if (heroChartType.value === type) return;
  heroChartType.value = type;
  heroVariantIndex.value = 0;
}

function stepVariant(delta: number) {
  const len = heroVariants.value.length;
  heroVariantIndex.value = (heroVariantIndex.value + delta + len) % len;
}

const heroXFormatter = (i: number) => heroData[i]?.month ?? "";
const heroYFormatter = (value: number) => `$${(value / 1000).toFixed(1)}k`;

const cubeTrendXFormatter = (i: number) => {
  const row = cubeTrendData[i];
  if (!row) return "";
  if (i === 0 || i === cubeTrendData.length - 1 || i % 20 === 0) return row.label;
  return "";
};
const cubeTrendYFormatter = (value: number) => String(value);
</script>

<template>
  <UCard :ui="{ root: 'rounded-2xl bg-[#0e0e0e]! z-10 relative', body: 'p-5 sm:p-6' }">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-highlighted text-sm font-medium">
          {{ isCubeTrend ? "Performance trend" : "Monthly revenue" }}
        </p>
        <p class="text-muted dark:text-dimmed text-xs">
          {{ isCubeTrend ? "Failed executions · last 80 days" : "Last 6 months" }}
        </p>
      </div>

      <div class="flex items-center gap-1 rounded-full bg-elevated/40 px-1 py-1">
        <div class="flex items-center">
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="`Previous style, currently ${heroVariant.label}`"
            @click="stepVariant(-1)"
          />
          <span class="text-muted w-28 text-center text-xs tabular-nums">
            {{ heroVariant.label }}
          </span>
          <UButton
            icon="i-lucide-arrow-right"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="`Next style, currently ${heroVariant.label}`"
            @click="stepVariant(1)"
          />
        </div>

        <div class="bg-accented/40 mx-0.5 h-4 w-px" />

        <div class="flex items-center gap-0.5">
          <UButton
            icon="i-lucide-chart-area"
            color="neutral"
            :variant="heroChartType === 'area' ? 'soft' : 'ghost'"
            size="xs"
            aria-label="Area chart"
            :aria-pressed="heroChartType === 'area'"
            @click="setChartType('area')"
          />
          <UButton
            icon="i-lucide-chart-column"
            color="neutral"
            :variant="heroChartType === 'bar' ? 'soft' : 'ghost'"
            size="xs"
            aria-label="Bar chart"
            :aria-pressed="heroChartType === 'bar'"
            @click="setChartType('bar')"
          />
        </div>
      </div>
    </div>

    <ClientOnly>
      <AreaChart
        v-if="heroChartType === 'area'"
        :data="heroData"
        :height="height"
        :categories="heroCategories"
        x-axis="month"
        :x-formatter="heroXFormatter"
        :y-formatter="heroYFormatter"
        :curve-type="CurveType.Cardinal"
        :dither="areaFill.dither"
        :x-grid-line="false"
        :y-grid-line="true"
        :x-domain-line="false"
        :y-domain-line="false"
        :x-num-ticks="6"
        :y-num-ticks="4"
        stacked
      />
      <BarChart
        v-else-if="isCubeTrend"
        :key="'cubes-trend'"
        :data="cubeTrendData"
        :height="height"
        :categories="cubeTrendCategories"
        :y-axis="['value']"
        x-axis="date"
        :x-formatter="cubeTrendXFormatter"
        :y-formatter="cubeTrendYFormatter"
        variant="cubes"
        :cube-size="8"
        :cube-gap="2"
        :y-domain="[0, 100]"
        :x-grid-line="false"
        :y-grid-line="false"
        :x-domain-line="false"
        :y-domain-line="false"
        :x-num-ticks="5"
        :y-num-ticks="4"
        :y-explicit-ticks="[25, 50, 75, 100]"
        hide-legend
      />
      <BarChart
        v-else
        :key="`${activeBarVariant.variant}-${activeBarVariant.mode}`"
        :data="heroData"
        :height="height"
        :categories="heroCategories"
        :y-axis="['revenue', 'expenses']"
        x-axis="month"
        :x-formatter="heroXFormatter"
        :y-formatter="heroYFormatter"
        :variant="activeBarVariant.variant"
        :stacked="activeBarVariant.stacked"
        :cube-size="14"
        :x-grid-line="false"
        :y-grid-line="activeBarVariant.variant !== 'cubes'"
        :x-domain-line="false"
        :y-domain-line="false"
        :x-num-ticks="6"
        :y-num-ticks="4"
        :radius="4"
      />

      <template #fallback>
        <div :style="{ height: `${height}px` }" />
      </template>
    </ClientOnly>
  </UCard>
</template>
