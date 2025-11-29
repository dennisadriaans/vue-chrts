<script lang="ts" setup generic="T">
import { computed } from "vue";
import type { CSSProperties } from "vue";
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

// Style objects

const titleStyle = {
  color: "var(--vis-tooltip-title-color, #000)",
  textTransform: "var(--vis-tooltip-title-text-transform, capitalize)" as CSSProperties["textTransform"],
  borderBottom: "var(--vis-tooltip-title-border-bottom, 1px solid #e5e7eb)",
  marginBottom: "var(--vis-tooltip-title-margin-bottom, 0.25rem)",
  paddingBottom: "var(--vis-tooltip-title-padding-bottom, 0.25rem)",
  padding: "var(--vis-tooltip-title-padding, 0.75rem)",
  fontSize: "var(--vis-tooltip-title-font-size, 0.875rem)",
  lineHeight: "var(--vis-tooltip-title-line-height, 100%)",
  fontWeight: "var(--vis-tooltip-title-font-weight, 600)" as CSSProperties["fontWeight"],
} as CSSProperties;

const entryStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "var(--vis-tooltip-entry-padding-top, 0.25rem) var(--vis-tooltip-entry-padding-right, 0.25rem) var(--vis-tooltip-entry-padding-bottom, 0.5rem) var(--vis-tooltip-entry-padding-left, 0.25rem)",
} as CSSProperties;

const dotStyleBase = {
  width: "var(--vis-tooltip-dot-width, 8px)",
  height: "var(--vis-tooltip-dot-height, 8px)",
  borderRadius: "var(--vis-tooltip-dot-border-radius, 4px)",
  marginRight: "var(--vis-tooltip-dot-margin-right, 8px)",
} as CSSProperties;

const labelStyle = {
  fontWeight: "var(--vis-tooltip-label-font-weight, 400)" as CSSProperties["fontWeight"],
  fontSize: "var(--vis-tooltip-label-font-size, 0.875rem)",
  marginRight: "var(--vis-tooltip-label-margin-right, 1rem)",
  color: "var(--vis-tooltip-label-color)",
} as CSSProperties;

const valueStyle = {
  fontSize: "var(--vis-tooltip-value-font-size, 0.875rem)",
  fontWeight: "var(--vis-tooltip-value-font-weight, 600)" as CSSProperties["fontWeight"],
  color: "var(--vis-tooltip-value-color)",
} as CSSProperties;
</script>

<template>
  <div>
    <div :style="titleStyle">
      {{ titleFormat }}
    </div>
    <div
      v-for="([key, value], index) in visibleEntries"
      :key="key"
      :style="entryStyle"
    >
      <div style="display: flex; align-items: center;">
        <span
          :style="{
            ...dotStyleBase,
            backgroundColor:
              typeof categories[key]?.color === 'string' &&
              categories[key]?.color
                ? categories[key].color
                : `var(--vis-color${index})`,
          }"
        ></span>
        <span :style="labelStyle"> {{ categories[key].name }}: </span>
      </div>
      <div>
        <span :style="valueStyle">
          {{ yFormatter ? yFormatter(value) : value }}
        </span>
      </div>
    </div>
  </div>
</template>
