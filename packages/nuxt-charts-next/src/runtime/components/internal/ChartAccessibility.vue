<script setup lang="ts">
import { computed, useId } from "vue";

interface AccessibleRow { label: string; values: Array<{ label: string; value: unknown }> }
const props = withDefaults(defineProps<{
  label?: string;
  description?: string;
  rows?: AccessibleRow[];
  showTable?: boolean;
}>(), {
  label: undefined,
  description: undefined,
  rows: () => [],
  showTable: true,
});
const descriptionId = useId();
const columns = computed(() => props.rows?.[0]?.values ?? []);
</script>

<template>
  <span v-if="description" :id="descriptionId" class="vc-sr-only">{{ description }}</span>
  <table v-if="showTable !== false && rows?.length" class="vc-sr-only">
    <caption>{{ label ?? "Chart data" }}</caption>
    <thead><tr><th scope="col">Category</th><th v-for="column in columns" :key="column.label" scope="col">{{ column.label }}</th></tr></thead>
    <tbody><tr v-for="(row, index) in rows" :key="index"><th scope="row">{{ row.label }}</th><td v-for="value in row.values" :key="value.label">{{ value.value }}</td></tr></tbody>
  </table>
</template>
