<script lang="ts" setup>
const vital = {
  name: "Performance",
  value: 91,
};
</script>

<template>
  <UCard>
    <div class="font-medium">
      {{ vital.name }}
    </div>
    <div class="flex items-center justify-between">
      <div class="text-2xl font-semibold">
        {{ vital.value }}
        <span class="text-muted text-sm"> /100 </span>
      </div>
      <LibProgressCircle :value="vital.value" :size="50" :stroke-width="5" />
    </div>
  </UCard>
</template>
