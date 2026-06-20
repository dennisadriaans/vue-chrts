<script setup lang="ts" generic="T extends StatusTrackerDatum">
import { computed, onMounted, onUnmounted, ref } from "vue";
import type {
  StatusTrackerChartProps,
  StatusTrackerDatum,
} from "../types/charts";
import { categoriesToSeries } from "../utils/categories";

const props = withDefaults(defineProps<StatusTrackerChartProps<T>>(), {
  height: 28,
  barWidth: 8,
  barGap: 3,
  emptyStatus: "empty",
  emptyColor: "var(--chart-empty-color, #e5e7eb)",
  hideHeader: false,
  hideLegend: false,
  hideTooltip: false,
  rounded: true,
});

const containerRef = ref<HTMLDivElement | null>(null);
const containerWidth = ref(0);
let resizeObserver: ResizeObserver | undefined;

const categoryMap = computed(() => {
  const entries = categoriesToSeries(props.categories);
  return new Map(entries.map((item) => [item.dataKey, item]));
});

const legendItems = computed(() =>
  categoriesToSeries(props.categories).filter((item) => !item.hidden),
);

const resolvedVisibleBars = computed(() => {
  if (props.visibleBars !== undefined) return Math.max(0, props.visibleBars);
  if (!containerWidth.value) return props.data.length;

  const barWidth = Math.max(1, props.barWidth);
  const gap = Math.max(0, props.barGap);
  return Math.max(1, Math.floor((containerWidth.value + gap) / (barWidth + gap)));
});

const visibleBars = computed(() => {
  const count = resolvedVisibleBars.value;
  if (count === 0) return [];

  const start = Math.max(0, props.data.length - count);
  const visibleData = props.data.slice(start);
  const emptyCount = Math.max(0, count - visibleData.length);

  return [
    ...Array.from({ length: emptyCount }, (_, index) => ({
      key: `empty-${index}`,
      status: props.emptyStatus,
      color: props.emptyColor,
      label: "No data",
      title: "No data",
      isEmpty: true,
    })),
    ...visibleData.map((datum, visibleIndex) => {
      const dataIndex = start + visibleIndex;
      const status = props.statusAccessor?.(datum, dataIndex) ?? datum.status;
      const category = categoryMap.value.get(status);
      const value = props.valueAccessor?.(datum, dataIndex) ?? datum.value;
      const label = props.labelAccessor?.(datum, dataIndex) ?? datum.label ?? category?.name ?? status;
      const formattedValue =
        typeof value === "number"
          ? props.valueFormatter?.(value, datum, dataIndex) ?? value.toLocaleString()
          : undefined;

      return {
        key: `${dataIndex}-${status}`,
        status,
        color: category?.color ?? props.emptyColor,
        label,
        title: formattedValue ? `${label}: ${formattedValue}` : label,
        isEmpty: false,
      };
    }),
  ];
});

const trackerStyle = computed(() => ({
  gap: `${Math.max(0, props.barGap)}px`,
  height: `${Math.max(1, props.height)}px`,
}));

const barStyle = computed(() => ({
  width: `${Math.max(1, props.barWidth)}px`,
}));

const ariaLabel = computed(() => {
  const prefix = props.title ? `${props.title}: ` : "";
  const samples = props.data.length === 1 ? "1 status sample" : `${props.data.length} status samples`;
  return `${prefix}${samples}`;
});

function updateContainerWidth() {
  containerWidth.value = containerRef.value?.offsetWidth ?? 0;
}

onMounted(() => {
  updateContainerWidth();

  if (typeof ResizeObserver === "undefined") return;
  resizeObserver = new ResizeObserver(updateContainerWidth);
  if (containerRef.value) resizeObserver.observe(containerRef.value);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <section class="status-tracker-chart" :aria-label="ariaLabel">
    <header v-if="!hideHeader && (title || summary !== undefined)" class="status-tracker-chart__header">
      <h3 v-if="title" class="status-tracker-chart__title">
        {{ title }}
      </h3>
      <p v-if="summary !== undefined" class="status-tracker-chart__summary">
        {{ summary }}
      </p>
    </header>

    <div
      ref="containerRef"
      class="status-tracker-chart__track"
      role="img"
      :aria-label="ariaLabel"
      :style="trackerStyle"
    >
      <span
        v-for="(bar, index) in visibleBars"
        :key="bar.key"
        class="status-tracker-chart__bar"
        :class="{
          'status-tracker-chart__bar--rounded-start': rounded && index === 0,
          'status-tracker-chart__bar--rounded-end': rounded && index === visibleBars.length - 1,
          'status-tracker-chart__bar--empty': bar.isEmpty,
        }"
        :style="{ ...barStyle, backgroundColor: bar.color }"
        :title="hideTooltip ? undefined : bar.title"
        :aria-label="bar.title"
      />
    </div>

    <div v-if="startLabel || endLabel" class="status-tracker-chart__labels">
      <span>{{ startLabel }}</span>
      <span>{{ endLabel }}</span>
    </div>

    <ul v-if="!hideLegend && legendItems.length" class="status-tracker-chart__legend">
      <li v-for="item in legendItems" :key="item.dataKey" class="status-tracker-chart__legend-item">
        <span class="status-tracker-chart__legend-dot" :style="{ backgroundColor: item.color }" />
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.status-tracker-chart {
  width: 100%;
  color: hsl(var(--foreground, 222.2 84% 4.9%));
  font-family: inherit;
}

.status-tracker-chart__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.status-tracker-chart__title,
.status-tracker-chart__summary {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.status-tracker-chart__title {
  font-weight: 600;
}

.status-tracker-chart__summary {
  color: hsl(var(--muted-foreground, 215.4 16.3% 46.9%));
  font-variant-numeric: tabular-nums;
}

.status-tracker-chart__track {
  display: flex;
  width: 100%;
  overflow: hidden;
}

.status-tracker-chart__bar {
  display: block;
  height: 100%;
  flex: 0 0 auto;
  min-width: 1px;
  transition: opacity 160ms ease;
}

.status-tracker-chart__bar:hover {
  opacity: 0.78;
}

.status-tracker-chart__bar--rounded-start {
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
}

.status-tracker-chart__bar--rounded-end {
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}

.status-tracker-chart__bar--empty:hover {
  opacity: 1;
}

.status-tracker-chart__labels {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
  color: hsl(var(--muted-foreground, 215.4 16.3% 46.9%));
  font-size: 0.75rem;
  line-height: 1rem;
}

.status-tracker-chart__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
  color: hsl(var(--muted-foreground, 215.4 16.3% 46.9%));
  font-size: 0.75rem;
  line-height: 1rem;
}

.status-tracker-chart__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.status-tracker-chart__legend-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  flex: 0 0 auto;
}
</style>
