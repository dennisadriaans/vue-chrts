<script setup lang="ts" generic="T">
/**
 * Heatmap chart.
 *
 * No `vccs` primitive exists for a value grid, so this renders HTML directly:
 * a CSS grid of cells, binned colours, a step legend and a roving-focus grid
 * that keeps the whole chart to one tab stop.
 */
import { computed, ref } from "vue";
import { useChartUi } from "../composables/useChartUi";
import type { HeatmapChartProps } from "../types/charts";
import ChartAccessibility from "./internal/ChartAccessibility.vue";
import ChartEmptyState from "./internal/ChartEmptyState.vue";
import ChartSkeleton from "./internal/ChartSkeleton.vue";
import { DEFAULT_MAX_DATA_POINTS, sampleData, warnDataLimit } from "../utils/data";
import { formatNumber } from "../utils/format";
import { buildHeatmapGrid, heatmapPalette } from "../utils/heatmap";
import type { HeatmapCell } from "../utils/heatmap";
import { themeToVars } from "../utils/theme";

const ROW_HEIGHT = 24;

const props = withDefaults(defineProps<HeatmapChartProps<T>>(), {
  accessibleDataTable: true,
  steps: 5,
  scale: "quantile",
  cellGap: 3,
  cellRadius: 3,
  xLabelEvery: 1,
  legendLowLabel: "Less",
  legendHighLabel: "More",
});
const ui = useChartUi("heatmapChart", props);

defineSlots<{
  tooltip?: (props: { cell: HeatmapCell<T>; label: string; value: string }) => unknown;
}>();

const emit = defineEmits<{
  "cell-click": [cell: HeatmapCell<T>, event: MouseEvent | KeyboardEvent];
}>();

const rows = computed(() => {
  const limit = props.maxDataPoints ?? DEFAULT_MAX_DATA_POINTS;
  warnDataLimit("HeatmapChart", props.data.length, limit);
  return sampleData(props.data, limit);
});

const grid = computed(() =>
  buildHeatmapGrid(rows.value, {
    xKey: props.xAxis,
    yKey: props.yAxis,
    valueKey: props.valueKey,
    xOrder: props.xOrder,
    yOrder: props.yOrder,
    steps: props.steps,
    scale: props.scale,
  }),
);

const palette = computed(() => {
  const [low, high] = props.colorRange ?? [
    "color-mix(in oklab, var(--vc-series-0) 6%, transparent)",
    "var(--vc-series-0)",
  ];
  return heatmapPalette(props.steps, low, high);
});

const plotHeight = computed(() => props.height ?? grid.value.rows.length * ROW_HEIGHT);
const isEmpty = computed(() => grid.value.cells.every((cell) => cell.value === undefined));

function formatValue(value: number): string {
  return props.valueFormatter ? props.valueFormatter(value) : formatNumber(value);
}

function columnLabel(value: string | number, index: number): string {
  return props.xFormatter ? props.xFormatter(value, index) : String(value);
}

function rowLabel(value: string | number, index: number): string {
  return props.yFormatter ? props.yFormatter(value, index) : String(value);
}

function cellColor(cell: HeatmapCell<T>): string {
  if (cell.value === undefined) return "var(--vc-heatmap-empty-color, var(--vc-grid-color))";
  if (props.colorScale) return props.colorScale(cell.value);
  return palette.value[cell.bin] ?? palette.value[palette.value.length - 1] ?? "var(--vc-series-0)";
}

function cellLabel(cell: HeatmapCell<T>): string {
  const column = columnLabel(cell.x, grid.value.columns.indexOf(cell.x));
  const row = rowLabel(cell.y, grid.value.rows.indexOf(cell.y));
  return `${row}, ${column}`;
}

function cellText(cell: HeatmapCell<T>): string {
  return cell.value === undefined ? (props.emptyLabel ?? "No data") : formatValue(cell.value);
}

const columnTicks = computed(() =>
  grid.value.columns.map((value, index) => ({
    key: String(value),
    label: index % Math.max(1, props.xLabelEvery) === 0 ? columnLabel(value, index) : "",
  })),
);

const legend = computed(() => {
  const { thresholds } = grid.value;
  return palette.value.map((color, index) => {
    const low = index === 0 ? undefined : thresholds[index - 1];
    const high = thresholds[index];
    const range =
      low === undefined && high !== undefined ? `≤ ${formatValue(high)}`
      : high === undefined && low !== undefined ? `> ${formatValue(low)}`
      : low !== undefined && high !== undefined ? `${formatValue(low)} – ${formatValue(high)}`
      : "";
    return { color, range };
  });
});

/** Cell under the pointer or holding keyboard focus; drives the tooltip. */
const activeIndex = ref<number | null>(null);
/** Cell that receives focus when the grid is tabbed into. */
const focusIndex = ref(0);
const gridRef = ref<HTMLElement | null>(null);

const activeCell = computed(() =>
  activeIndex.value === null ? undefined : grid.value.cells[activeIndex.value],
);

const tooltipStyle = computed(() => {
  const cell = activeCell.value;
  if (!cell) return undefined;
  const columns = grid.value.columns.length;
  const column = cell.index % columns;
  const row = Math.floor(cell.index / columns);
  const left = ((column + 0.5) / columns) * 100;
  return {
    left: `${left}%`,
    top: `${(row / grid.value.rows.length) * 100}%`,
    transform: `translate(${left < 15 ? "-10%" : left > 85 ? "-90%" : "-50%"}, calc(-100% - 6px))`,
  };
});

function focusCell(index: number) {
  focusIndex.value = index;
  activeIndex.value = index;
  gridRef.value?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.focus();
}

function onKeydown(event: KeyboardEvent, cell: HeatmapCell<T>) {
  const columns = grid.value.columns.length;
  const last = grid.value.cells.length - 1;
  const rowStart = cell.index - (cell.index % columns);
  const moves: Record<string, number> = {
    ArrowRight: Math.min(cell.index + 1, last),
    ArrowLeft: Math.max(cell.index - 1, 0),
    ArrowDown: cell.index + columns <= last ? cell.index + columns : cell.index,
    ArrowUp: cell.index - columns >= 0 ? cell.index - columns : cell.index,
    Home: event.ctrlKey ? 0 : rowStart,
    End: event.ctrlKey ? last : Math.min(rowStart + columns - 1, last),
  };
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    emit("cell-click", cell, event);
    return;
  }
  const next = moves[event.key];
  if (next === undefined) return;
  event.preventDefault();
  focusCell(next);
}

const ariaLabel = computed(() => props.ariaLabel ?? "Heatmap");

const accessibleRows = computed(() =>
  grid.value.rows.map((row, rowIndex) => ({
    label: rowLabel(row, rowIndex),
    values: grid.value.columns.map((column, columnIndex) => {
      const cell = grid.value.cells[rowIndex * grid.value.columns.length + columnIndex];
      return { label: columnLabel(column, columnIndex), value: cell ? cellText(cell) : "" };
    }),
  })),
);

const rootStyle = computed(() => ({
  ...themeToVars(props.theme, props.colors),
  "--vc-heatmap-gap": `${Math.max(0, props.cellGap)}px`,
  "--vc-heatmap-radius": `${Math.max(0, props.cellRadius)}px`,
}));
</script>

<template>
  <section class="vc-heatmap vue-chrts" :class="ui.rootClass" :aria-label="ariaLabel" :style="rootStyle">
    <ChartAccessibility
      :label="ariaLabel"
      :description="ariaDescription"
      :rows="accessibleRows"
      :show-table="accessibleDataTable !== false"
    />

    <ChartSkeleton v-if="loading" :height="plotHeight" shape="bars" :label="loadingLabel ?? 'Loading'" />
    <ChartEmptyState v-else-if="error || isEmpty" :height="plotHeight" :message="error || emptyLabel" />

    <template v-else>
      <div
        class="vc-heatmap__body"
        :class="{ 'vc-heatmap__body--no-y': hideYAxis }"
      >
        <div v-if="!hideYAxis" class="vc-heatmap__rows" aria-hidden="true" :style="{ height: `${plotHeight}px` }">
          <span v-for="(row, index) in grid.rows" :key="String(row)" class="vc-heatmap__tick">
            {{ rowLabel(row, index) }}
          </span>
        </div>

        <div class="vc-heatmap__plot">
          <div
            ref="gridRef"
            role="grid"
            :aria-label="ariaLabel"
            :aria-rowcount="grid.rows.length"
            :aria-colcount="grid.columns.length"
            class="vc-heatmap__grid"
            :style="{
              height: `${plotHeight}px`,
              gridTemplateColumns: `repeat(${grid.columns.length}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${grid.rows.length}, minmax(0, 1fr))`,
            }"
            @mouseleave="activeIndex = null"
            @focusout="activeIndex = null"
          >
            <div
              v-for="(row, rowIndex) in grid.rows"
              :key="String(row)"
              role="row"
              :aria-rowindex="rowIndex + 1"
              class="vc-heatmap__row"
            >
              <span
                v-for="cell in grid.cells.slice(rowIndex * grid.columns.length, (rowIndex + 1) * grid.columns.length)"
                :key="cell.index"
                role="gridcell"
                :data-index="cell.index"
                :aria-label="`${cellLabel(cell)}: ${cellText(cell)}`"
                :tabindex="cell.index === focusIndex ? 0 : -1"
                class="vc-heatmap__cell"
                :class="{
                  'vc-heatmap__cell--empty': cell.value === undefined,
                  'vc-heatmap__cell--active': cell.index === activeIndex,
                }"
                :style="{ background: cellColor(cell) }"
                @mouseenter="activeIndex = cell.index"
                @focus="activeIndex = cell.index; focusIndex = cell.index"
                @keydown="onKeydown($event, cell)"
                @click="emit('cell-click', cell, $event)"
              />
            </div>
          </div>

          <div
            v-if="!hideTooltip && activeCell"
            data-slot="tooltip"
            class="vc-tooltip vc-heatmap__tooltip"
            :class="[
              tooltipVariant === 'frosted-glass' ? 'vc-tooltip--frosted-glass' : undefined,
              tooltipRoundness ? `vc-tooltip--${tooltipRoundness}` : undefined,
              ui.slot('tooltip'),
            ]"
            aria-hidden="true"
            :style="[ui.themeStyle.tooltip, tooltipStyle]"
          >
            <slot name="tooltip" :cell="activeCell" :label="cellLabel(activeCell)" :value="cellText(activeCell)">
              <div data-slot="tooltipLabel" class="vc-heatmap__tooltip-label" :class="ui.slot('tooltipLabel')">{{ cellLabel(activeCell) }}</div>
              <div data-slot="tooltipValue" class="vc-heatmap__tooltip-value" :class="ui.slot('tooltipTitle')">{{ cellText(activeCell) }}</div>
            </slot>
          </div>

          <div
            v-if="!hideXAxis"
            class="vc-heatmap__columns"
            aria-hidden="true"
            :style="{ gridTemplateColumns: `repeat(${grid.columns.length}, minmax(0, 1fr))` }"
          >
            <span v-for="tick in columnTicks" :key="tick.key" class="vc-heatmap__tick">{{ tick.label }}</span>
          </div>
        </div>
      </div>

      <div v-if="!hideLegend && !colorScale" class="vc-heatmap__legend" aria-hidden="true">
        <span>{{ legendLowLabel }}</span>
        <span
          v-for="entry in legend"
          :key="entry.color"
          class="vc-heatmap__swatch"
          :title="entry.range"
          :style="{ background: entry.color }"
        />
        <span>{{ legendHighLabel }}</span>
      </div>
    </template>
  </section>
</template>
