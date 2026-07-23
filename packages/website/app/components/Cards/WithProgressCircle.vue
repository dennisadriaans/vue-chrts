<script lang="ts" setup>
interface VitalItem {
  name: string
  value: number
}

const vitals: VitalItem[] = [
  { name: 'Performance', value: 91 },
  { name: 'Accessibility', value: 65 },
  { name: 'SEO', value: 43 }
]
</script>

<template>
  <UCard
    v-for="(vital, vitalKey) in vitals"
    :key="vitalKey"
    class="!bg-default"
    :name="vital.name"
    :value="vital.value"
  >
    <div class="font-medium">
      {{ vital.name }}
    </div>
    <div class="flex items-center justify-between">
      <div class="text-2xl font-semibold">
        {{ vital.value }}
        <span class="text-muted text-sm"> /100 </span>
      </div>
      <!-- ProgressCircle from CLI see: https://nuxtcharts.com/docs/components/progress-circle -->
      <LibProgressCircle
        :value="vital.value"
        :size="50"
        :stroke-width="5"
      />
    </div>
  </UCard>
</template>
