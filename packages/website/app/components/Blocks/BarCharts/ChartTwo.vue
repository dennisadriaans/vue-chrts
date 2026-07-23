<script setup lang="ts">
defineOptions({
  tags: ['barcharts', 'charttwo']
})

interface DailyData {
  day: string
  Income: number
  Expense: number
}

const chartData = ref<DailyData[]>([
  { day: '01', Income: 85, Expense: 40 },
  { day: '02', Income: 65, Expense: 90 },
  { day: '03', Income: 75, Expense: 35 },
  { day: '04', Income: 58, Expense: 70 },
  { day: '05', Income: 92, Expense: 65 },
  { day: '06', Income: 98, Expense: 45 },
  { day: '07', Income: 50, Expense: 85 },
  { day: '08', Income: 50, Expense: 35 },
  { day: '09', Income: 75, Expense: 85 },
  { day: '10', Income: 58, Expense: 90 },
  { day: '11', Income: 92, Expense: 85 },
  { day: '12', Income: 85, Expense: 40 }
])

const chartCategories: Record<string, BulletLegendItemInterface> = {
  Income: {
    name: 'Income',
    color: '#10b981'
  },
  Expense: {
    name: 'Expense',
    color: '#f59e0b'
  }
}

const xAxisFormatter = (index: number): string => {
  if (index >= 0 && index < chartData.value.length) {
    return chartData.value[index]?.day || String(index + 1).padStart(2, '0')
  }
  return String(index + 1).padStart(2, '0')
}

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})
</script>

<template>
  <UCard class="bg-default!">
    <template #header>
      <h3 class="text-lg font-semibold">
        Revenue
      </h3>
    </template>

    <div class="w-full">
      <ClientOnly>
        <BarChart
          :data="chartData"
          :categories="chartCategories"
          :y-axis="['Income', 'Expense']"
          :x-formatter="xAxisFormatter"
          :height="height"
          :stacked="false"
          :radius="3"
          :group-padding="0.25"
          :bar-padding="0.1"
          :hide-legend="false"
          :legend-position="LegendPosition.TopRight"
          :x-domain-line="false"
          :y-domain-line="false"
          :x-tick-line="false"
          :y-tick-line="false"
          :x-grid-line="false"
          :y-grid-line="true"
          :x-num-ticks="4"
          :y-num-ticks="4"
        />
      </ClientOnly>
    </div>
  </UCard>
</template>
