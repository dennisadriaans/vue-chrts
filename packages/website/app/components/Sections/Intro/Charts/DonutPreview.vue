<script setup lang="ts">
interface RevenueData {
  name: string
  usage: number
  color: string
  performance: number
  monthlyQueries: string
}

const revenueData = ref<RevenueData[]>([
  {
    name: 'Product',
    usage: 45,
    color: 'var(--color-indigo-500)',
    performance: 94,
    monthlyQueries: '2.1M'
  },
  {
    name: 'Services',
    usage: 25,
    color: 'var(--color-purple-500)',
    performance: 92,
    monthlyQueries: '1.4M'
  },
  {
    name: 'Support',
    usage: 20,
    color: 'var(--color-pink-500)',
    performance: 88,
    monthlyQueries: '850K'
  },
  {
    name: 'Other',
    usage: 10,
    color: 'var(--color-rose-500)',
    performance: 85,
    monthlyQueries: '420K'
  }
])

const data = computed(() => revenueData.value.map(i => i.usage))

const categories = computed(() => {
  return revenueData.value.reduce((acc, curr, index) => {
    acc[index] = {
      name: curr.name,
      color: curr.color
    }
    return acc
  }, {} as Record<number, { name: string, color: string }>)
})

const { height } = useResponsiveHeight({
  default: 160,
  lg: 208
})
</script>

<template>
  <div class="flex flex-col items-center lg:flex-row lg:gap-8 lg:py-4">
    <div class="relative flex-1">
      <DonutChart
        :legend-position="LegendPosition.BottomCenter"
        :data="data"
        :height="height"
        :categories="categories"
        :arc-width="20"
        :hide-legend="true"
        :radius="0"
      >
        <div class="text-center">
          <div class="text-2xl font-bold">
            45%
          </div>
          <div class="text-dimmed text-xs">
            Product
          </div>
        </div>
      </DonutChart>
    </div>

    <div class="w-full flex-1 hidden lg:flex">
      <div class="space-y-6 w-full pr-8">
        <div class="text-muted text-xs tracking-wide uppercase">
          Category Breakdown
        </div>
        <div class="grid grid-cols-2 gap-3 lg:flex lg:flex-col">
          <div
            v-for="(item, index) in revenueData"
            :key="index"
            class="flex flex-col items-center justify-between text-sm lg:flex-row"
          >
            <div class="flex items-center gap-2">
              <div
                class="h-3 w-3 rounded-full"
                :style="{ backgroundColor: item.color }"
              />
              <span class="font-medium text-default">
                {{ item.name }}
              </span>
            </div>
            <div class="text-muted flex items-center gap-3">
              <span>{{ item.monthlyQueries }}</span>
              <span class="text-default font-medium">
                {{ item.usage }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
