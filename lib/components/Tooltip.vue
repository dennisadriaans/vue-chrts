<script lang="ts" setup generic="T">
import { BulletLegendItemInterface } from "@unovis/ts";
import { computed } from "vue";

const props = defineProps<{
  data: T;
  categories: Record<string, BulletLegendItemInterface>;
}>();

const keyBlockList = ["_index", "_stacked", "_ending"];

const visibleEntries = computed(() => {
  return Object.entries(props.data ?? []).filter(
    ([key, _]) => !keyBlockList.includes(key) && props.categories[key]?.color
  );
});
</script>

<template>
  <div>
    <div v-for="[key, value] in visibleEntries" :key="key" style="display: flex; align-items: center; margin-bottom: 4px;">
      <span
        style="width: 8px; height: 8px; border-radius: 4px; margin-right: 8px;"
        :style="{ backgroundColor: categories[key].color }"
      ></span>
      <div>
        <span style="font-weight: 600; margin-right: 8px;" :style="{ color: 'var(--tooltip-label-color)' }">{{ key }}:</span>
        <span style="font-weight: 400;" :style="{ color: 'var(--tooltip-value-color)' }">{{ value }}</span>
      </div>
    </div>
  </div>
</template>
