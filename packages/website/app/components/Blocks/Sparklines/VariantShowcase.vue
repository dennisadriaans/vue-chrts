<script lang="ts" setup>
import Sparkline from '~/components/lib/Sparkline/Sparkline.vue'

defineOptions({
  tags: ['blocks', 'sparklines', 'variant-showcase']
})

const series = [22, 30, 26, 38, 32, 45, 40, 52, 47, 60, 55, 68]

const variants = [
  { title: 'Line', type: 'line' as const, area: false },
  { title: 'Area', type: 'area' as const, area: false },
  { title: 'Bar', type: 'bar' as const, area: false }
]
</script>

<template>
  <div class="grid w-full gap-4 sm:grid-cols-3">
    <UCard
      v-for="v in variants"
      :key="v.title"
      class="border-default border"
    >
      <div class="space-y-3">
        <div class="text-muted text-sm">
          {{ v.title }}
        </div>
        <Sparkline
          :data="series"
          :type="v.type"
          color="var(--ui-primary)"
          :width="200"
          :height="56"
          class="w-full"
        />
      </div>
    </UCard>
  </div>
</template>
