<script lang="ts" setup>
import { useResponsiveHeight } from '~/composables/useResponsiveHeight'

defineOptions({
  tags: ['areacharts', 'cardinalmulti']
})

const colorMode = useColorMode()

interface TrafficDataItem {
  hour: string
  organic: number
  paid: number
  social: number
  direct: number
}

const TrafficData: TrafficDataItem[] = [
  { hour: '06:00', organic: 120, paid: 45, social: 30, direct: 85 },
  { hour: '09:00', organic: 280, paid: 90, social: 65, direct: 150 },
  { hour: '12:00', organic: 450, paid: 180, social: 120, direct: 220 },
  { hour: '15:00', organic: 380, paid: 165, social: 95, direct: 190 },
  { hour: '18:00', organic: 520, paid: 200, social: 140, direct: 260 },
  { hour: '21:00', organic: 320, paid: 130, social: 80, direct: 170 }
]

const TrafficCategories = computed(() => ({
  organic: {
    name: 'Organic',
    color: 'var(--color-green-500)'
  },
  paid: {
    name: 'Paid',
    color: 'var(--color-blue-500)'
  },
  social: {
    name: 'Social',
    color: 'var(--color-purple-500)'
  },
  direct: {
    name: 'Direct',
    color: 'var(--color-amber-500)'
  }
}))

const { height } = useResponsiveHeight({
  default: 120,
  sm: 280
})

const xFormatter = (i: number): string => `${TrafficData[i]?.hour}`
const yFormatter = (value: number): string => `${value}`
</script>

<template>
  <UCard class="bg-default/60!">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold">
          Area Chart
        </h3>
        <NuxtLink
          to="/blocks"
          target="_blank"
        >
          <UButton
            icon="i-hugeicons:sparkles"
            variant="ghost"
            color="neutral"
          />
        </NuxtLink>
      </div>
      <UCard variant="soft">
        <AreaChart
          :key="colorMode.value"
          class="dashed mx-auto max-w-3xl"
          :data="TrafficData"
          :height="height"
          :categories="TrafficCategories"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :curve-type="CurveType.Cardinal"
          :legend-position="LegendPosition.TopRight"
          :hide-legend="false"
          :x-grid-line="false"
          :y-grid-line="true"
          :x-domain-line="false"
          :y-domain-line="false"
          stacked
          :x-num-ticks="6"
          x-label="Time of Day"
          y-label="Visitors"
        />
      </UCard>
    </div>
  </UCard>
</template>

<style>
.dashed {
  --vis-axis-grid-line-dasharray: 5 5;
}
</style>
