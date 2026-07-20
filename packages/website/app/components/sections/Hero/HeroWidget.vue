<script setup lang="ts">
/**
 * Hero widget — shared dataset rendered through the chart type the visitor picks.
 * Mock data: swap for real numbers before launch.
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

const heroChartTypes = [
  { label: "Area", value: "area" as const },
  { label: "Line", value: "line" as const },
  { label: "Bar", value: "bar" as const },
];

const heroChartType = ref<"area" | "line" | "bar">("area");

/**
 * Fill treatments for the area chart, cycled with the prev/next arrows.
 * `gradient` is the shipped default; the rest are the dithered halftone fills.
 */
const heroFills = [
  { label: "Gradient", dither: undefined },
  { label: "Bayer dither", dither: "bayer" as const },
  { label: "Noise dither", dither: "noise" as const },
  { label: "Fade dither", dither: "fade" as const },
];

const heroFillIndex = ref(0);
const heroFill = computed(() => heroFills[heroFillIndex.value]!);

/** Wrap around at both ends so the carousel never dead-ends. */
function stepFill(delta: number) {
  heroFillIndex.value = (heroFillIndex.value + delta + heroFills.length) % heroFills.length;
}

const heroXFormatter = (i: number) => heroData[i]?.month ?? "";
const heroYFormatter = (value: number) => `$${(value / 1000).toFixed(1)}k`;
</script>

<template>
  <!-- Live chart widget -->
  <UCard :ui="{ root: 'rounded-2xl bg-[#0e0e0e]! z-10 relative', body: 'p-5 sm:p-6' }">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-highlighted text-sm font-medium">Monthly revenue</p>
        <p class="text-muted dark:text-dimmed text-xs">Last 6 months</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Fill-treatment carousel; area chart only, since it is the only filled type. -->
        <div v-if="heroChartType === 'area'" class="flex items-center gap-1">
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="`Previous fill style, currently ${heroFill.label}`"
            @click="stepFill(-1)"
          />
          <span class="text-muted w-24 text-center text-xs tabular-nums">
            {{ heroFill.label }}
          </span>
          <UButton
            icon="i-lucide-arrow-right"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="`Next fill style, currently ${heroFill.label}`"
            @click="stepFill(1)"
          />
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
        :dither="heroFill.dither"
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
        :height="height"
        :categories="heroCategories"
        x-axis="month"
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
        :height="height"
        :categories="heroCategories"
        :y-axis="['revenue', 'expenses']"
        x-axis="month"
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
        <div :style="{ height: `${height}px` }" />
      </template>
    </ClientOnly>
  </UCard>
</template>
