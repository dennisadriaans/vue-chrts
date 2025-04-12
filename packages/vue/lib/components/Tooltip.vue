<script lang="ts" setup generic="T">
import { computed } from "vue";
import { BulletLegendItemInterface } from "../types";

const props = defineProps<{
  data: T;
  categories: Record<string, BulletLegendItemInterface>;
  xValue: string | number;
}>();

const keyBlockList = ["_index", "_stacked", "_ending"];

const visibleEntries = computed(() => {
  return Object.entries(props.data ?? []).filter(
    ([key, _]) =>
      !keyBlockList.includes(key) && Object.keys(props.categories).includes(key)
  );
});
</script>

<template>
  <div>
    <div
      class="capitalize border-b mb-1 pb-1"
      :style="{
        color: 'var(--tooltip-value-color)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
      }"
    >
      {{ xValue }}
    </div>
    <div
      v-for="([key, value], idx) in visibleEntries"
      :key="key"
      style="display: flex; align-items: center; margin-bottom: 4px"
    >
      <span
        style="width: 8px; height: 8px; border-radius: 4px; margin-right: 8px"
        :style="{
          backgroundColor: categories[key].color
            ? categories[key].color
            : `var(--vis-color${idx})`,
        }"
      ></span>
      <div>
        <span
          style="font-weight: 600; margin-right: 8px"
          :style="{ color: 'var(--tooltip-label-color)' }"
          >{{ key }}:</span
        >
        <span
          style="font-weight: 400"
          :style="{ color: 'var(--tooltip-value-color)' }"
          >{{ value }}</span
        >
      </div>
    </div>
  </div>
</template>
