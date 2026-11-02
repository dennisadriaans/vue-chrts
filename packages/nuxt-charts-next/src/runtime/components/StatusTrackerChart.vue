<script setup lang="ts" generic="T extends StatusTrackerDatum">
import { useChartUi } from "../composables/useChartUi";
import { computed, onMounted, onUnmounted, ref } from "vue";
import type {
  StatusTrackerChartProps,
  StatusTrackerDatum,
} from "../types/charts";
import { categoriesToSeries } from "../utils/categories";
import ChartAccessibility from "./internal/ChartAccessibility.vue";
import ChartEmptyState from "./internal/ChartEmptyState.vue";
import ChartSkeleton from "./internal/ChartSkeleton.vue";
import { toFiniteNumber } from "../utils/data";
import { formatNumber } from "../utils/format";

const props = withDefaults(defineProps<StatusTrackerChartProps<T>>(), {
  accessibleDataTable: true,
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
const ui = useChartUi("statusTrackerChart", props);

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
      const value = toFiniteNumber(props.valueAccessor?.(datum, dataIndex) ?? datum.value);
      const label = props.labelAccessor?.(datum, dataIndex) ?? datum.label ?? category?.name ?? status;
      const formattedValue =
        typeof value === "number"
          ? props.valueFormatter?.(value, datum, dataIndex) ?? formatNumber(value)
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
  if (props.ariaLabel) return props.ariaLabel;
  const prefix = props.title ? `${props.title}: ` : "";
  const samples = props.data.length === 1 ? "1 status sample" : `${props.data.length} status samples`;
  return `${prefix}${samples}`;
});
const accessibleRows = computed(() => visibleBars.value.filter((bar) => !bar.isEmpty).map((bar) => ({
  label: bar.label,
  values: [{ label: "Status", value: bar.status }],
})));

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
  <section class="vc-status-tracker vue-chrts" :class="ui.rootClass" :aria-label="ariaLabel">
    <ChartAccessibility :label="ariaLabel" :description="ariaDescription" :rows="accessibleRows" :show-table="accessibleDataTable !== false" />
    <header v-if="!hideHeader && (title || summary !== undefined)" data-slot="header" class="vc-status-tracker__header" :class="ui.slot('header')">
      <h3 v-if="title" data-slot="title" class="vc-status-tracker__title" :class="ui.slot('title')">
        {{ title }}
      </h3>
      <p v-if="summary !== undefined" data-slot="summary" class="vc-status-tracker__summary" :class="ui.slot('summary')">
        {{ summary }}
      </p>
    </header>

    <ChartSkeleton v-if="loading" :height="height" shape="bars" :label="loadingLabel ?? 'Loading'" />
    <ChartEmptyState v-else-if="error || data.length === 0" :height="height" :message="error || emptyLabel" />
    <div
      v-else
      ref="containerRef"
      data-slot="track"
      class="vc-status-tracker__track"
      :class="ui.slot('track')"
      role="list"
      :style="trackerStyle"
    >
      <span
        v-for="(bar, index) in visibleBars"
        :key="bar.key"
        data-slot="bar"
        :data-empty="bar.isEmpty || undefined"
        :data-rounded="rounded ? (visibleBars.length === 1 ? 'both' : index === 0 ? 'start' : index === visibleBars.length - 1 ? 'end' : undefined) : undefined"
        class="vc-status-tracker__bar"
        :class="[{
          'vc-status-tracker__bar--rounded-start': rounded && index === 0,
          'vc-status-tracker__bar--rounded-end': rounded && index === visibleBars.length - 1,
          'vc-status-tracker__bar--empty': bar.isEmpty,
        }, ui.slot('bar')]"
        :style="{ ...barStyle, backgroundColor: bar.color }"
        :title="hideTooltip ? undefined : bar.title"
        :aria-label="bar.title"
        :tabindex="bar.isEmpty ? undefined : 0"
        role="listitem"
      />
    </div>

    <div v-if="!loading && !error && data.length && (startLabel || endLabel)" data-slot="labels" class="vc-status-tracker__labels" :class="ui.slot('labels')">
      <span>{{ startLabel }}</span>
      <span>{{ endLabel }}</span>
    </div>

    <ul v-if="!loading && !error && data.length && !hideLegend && legendItems.length" data-slot="statusLegend" class="vc-status-tracker__legend" :class="ui.slot('statusLegend')">
      <li v-for="item in legendItems" :key="item.dataKey" data-slot="statusLegendItem" class="vc-status-tracker__legend-item" :class="ui.slot('statusLegendItem')">
        <span data-slot="statusLegendIndicator" class="vc-status-tracker__legend-dot" :class="ui.slot('statusLegendIndicator')" :style="{ backgroundColor: item.color }" />
        <span data-slot="legendLabel" :class="ui.slot('legendLabel')" :style="ui.themeStyle.legendLabel">{{ item.name }}</span>
      </li>
    </ul>
  </section>
</template>
