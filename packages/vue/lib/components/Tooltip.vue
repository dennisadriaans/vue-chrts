<script lang="ts" setup generic="T">
import { computed } from "vue";
import { axisFormatter, BulletLegendItemInterface } from "../types";
import { getFirstPropertyValue } from "../utils";

const props = defineProps<{
  data: T;
  categories: Record<string, BulletLegendItemInterface>;
  titleFormatter?: (data: T) => string | number;
  yFormatter?: axisFormatter;
}>();

const titleFormat = computed(() =>
  props.titleFormatter
    ? props.titleFormatter(props.data)
    : getFirstPropertyValue(props.data)
);

const keyBlockList = ["_index", "_stacked", "_ending"];

const visibleEntries = computed(() => {
  return Object.entries(props.data ?? []).filter(
    ([key, _]) =>
      !keyBlockList.includes(key) && Object.keys(props.categories).includes(key)
  );
});
</script>

<template>
  <div class="vis-tooltip">
    <div class="vis-tooltip-title">
      {{ titleFormat }}
    </div>
    <div class="vis-tooltip-content">
      <div
        v-for="([key, value], index) in visibleEntries"
        :key="key"
        class="vis-tooltip-entry"
      >
        <span
          class="vis-tooltip-dot"
          :style="{
            backgroundColor:
              typeof categories[key]?.color === 'string' &&
              categories[key]?.color
                ? categories[key].color
                : `var(--vis-color${index})`,
          }"
        ></span>
        <span class="vis-tooltip-label">{{ categories[key].name }}</span>
        <span class="vis-tooltip-value">
          {{ yFormatter ? yFormatter(value) : value }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vis-tooltip {
  display: flex;
  flex-direction: column;
}

.vis-tooltip-title {
  color: var(--vis-tooltip-title-color, #000);
  text-transform: var(--vis-tooltip-title-text-transform, capitalize);
  border-bottom: var(--vis-tooltip-title-border-bottom, 1px solid #e5e7eb);
  padding: var(--vis-tooltip-title-padding, 0.75rem 0.75rem 0.5rem 0.75rem);
  margin: var(--vis-tooltip-title-margin, 0 0 0.25rem 0);
  font-size: var(--vis-tooltip-title-font-size, 0.875rem);
  line-height: var(--vis-tooltip-title-line-height, 100%);
  font-weight: var(--vis-tooltip-title-font-weight, 600);
}

.vis-tooltip-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--vis-tooltip-content-gap, 0.25rem 0.5rem);
  padding: var(--vis-tooltip-content-padding, 0 0.75rem);
}

.vis-tooltip-entry {
  display: contents;
}

.vis-tooltip-dot {
  width: 8px;
  height: 8px;
  aspect-ratio: 1;
  border-radius: var(--vis-tooltip-dot-border-radius, 4px);
  margin: var(--vis-tooltip-dot-margin, 0);
  flex-shrink: 0;
}

.vis-tooltip-label {
  font-weight: var(--vis-tooltip-label-font-weight, 400);
  font-size: var(--vis-tooltip-label-font-size, 0.875rem);
  color: var(--vis-tooltip-label-color, inherit);
  margin: var(--vis-tooltip-label-margin, 0 1rem 0 0);
  white-space: nowrap;
}

.vis-tooltip-value {
  font-size: var(--vis-tooltip-value-font-size, 0.875rem);
  font-weight: var(--vis-tooltip-value-font-weight, 600);
  color: var(--vis-tooltip-value-color, inherit);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
