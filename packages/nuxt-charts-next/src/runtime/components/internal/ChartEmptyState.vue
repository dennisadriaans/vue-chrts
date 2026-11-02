<script setup lang="ts">
import { injectChartUi } from "../../composables/useChartUi";

defineProps<{ height: number; message?: string }>();
const ui = injectChartUi();
</script>

<template>
  <div data-slot="empty" class="vc-empty-state" :class="ui.slot('empty')" :style="{ height: `${height}px` }" role="status">
    {{ message ?? "No valid data" }}
  </div>
</template>
