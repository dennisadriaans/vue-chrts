<script lang="ts" setup generic="T">
import { computed, type CSSProperties } from "vue";
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
    : getFirstPropertyValue(props.data),
);

const keyBlockList = ["_index", "_stacked", "_ending"];

const visibleEntries = computed(() => {
  return Object.entries(props.data ?? []).filter(
    ([key, _]) =>
      !keyBlockList.includes(key) &&
      Object.keys(props.categories).includes(key),
  );
});

const hasEntries = computed(() => visibleEntries.value.length > 0);

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const titleStyle = computed<CSSProperties>(() => ({
  color: "var(--vis-tooltip-title-color, #000)",
  textTransform:
    "var(--vis-tooltip-title-text-transform, capitalize)" as CSSProperties["textTransform"],
  borderBottom: hasEntries.value
    ? "var(--vis-tooltip-title-border-bottom, 1px solid #e5e7eb)"
    : "none",
  padding: "var(--vis-tooltip-title-padding, 0.75rem 0.75rem 0.5rem 0.75rem)",
  margin: hasEntries.value
    ? "var(--vis-tooltip-title-margin, 0 0 0.25rem 0)"
    : "0",
  fontSize: "var(--vis-tooltip-title-font-size, 0.875rem)",
  lineHeight: "var(--vis-tooltip-title-line-height, 100%)",
  fontWeight:
    "var(--vis-tooltip-title-font-weight, 600)" as CSSProperties["fontWeight"],
}));

const contentStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "center",
  gap: "var(--vis-tooltip-content-gap, 0.25rem 0.5rem)",
  padding: "var(--vis-tooltip-content-padding, 0 0.75rem 0.5rem 0.75rem)",
};

const labelStyle: CSSProperties = {
  fontWeight:
    "var(--vis-tooltip-label-font-weight, 400)" as CSSProperties["fontWeight"],
  fontSize: "var(--vis-tooltip-label-font-size, 0.875rem)",
  color: "var(--vis-tooltip-label-color, inherit)",
  margin: "var(--vis-tooltip-label-margin, 0 1rem 0 0)",
  whiteSpace: "nowrap",
};

const valueStyle: CSSProperties = {
  fontSize: "var(--vis-tooltip-value-font-size, 0.875rem)",
  fontWeight:
    "var(--vis-tooltip-value-font-weight, 600)" as CSSProperties["fontWeight"],
  color: "var(--vis-tooltip-value-color, inherit)",
  textAlign: "right",
  fontVariantNumeric: "tabular-nums",
};

const getDotStyle = (key: string, index: number): CSSProperties => ({
  width: "8px",
  height: "8px",
  aspectRatio: "1",
  borderRadius: "var(--vis-tooltip-dot-border-radius, 4px)",
  margin: "var(--vis-tooltip-dot-margin, 0)",
  flexShrink: "0",
  backgroundColor:
    typeof props.categories[key]?.color === "string" &&
    props.categories[key]?.color
      ? props.categories[key].color
      : `var(--vis-color${index})`,
});
</script>

<template>
  <div :style="containerStyle">
    <div :style="titleStyle">
      {{ titleFormat }}
    </div>
    <div :style="contentStyle" v-if="hasEntries">
      <template v-for="([key, value], index) in visibleEntries" :key="key">
        <span :style="getDotStyle(key, index)"></span>
        <span :style="labelStyle">
          {{ categories[key].name }}
        </span>
        <span :style="valueStyle">
          {{ yFormatter ? yFormatter(value) : value }}
        </span>
      </template>
    </div>
  </div>
</template>
