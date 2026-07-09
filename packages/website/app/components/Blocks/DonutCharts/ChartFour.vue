<script setup lang="ts">
defineOptions({
  tags: ['donutcharts', 'chartfour']
})

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
</script>

<template>
  <div class="mx-auto max-w-2xl py-8">
    <UCard class="!bg-default">
      <template #header>
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-lg font-medium">
              Product Revenue Distribution
            </h2>
            <p class="text-muted text-sm">
              Monthly revenue breakdown by category
            </p>
          </div>
        </div>
      </template>

      <div class="flex flex-col items-center py-8 lg:flex-row lg:gap-8 lg:py-0">
        <div class="relative flex-1">
          <DonutChart
            :legend-position="LegendPosition.BottomCenter"
            :data="data"
            :height="160"
            :categories="categories"
            :hide-legend="true"
            :radius="0"
            :type="DonutType.Full"
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

        <div class="my-4 flex-1 space-y-4">
          <div class="space-y-4">
            <div class="text-muted text-xs tracking-wide uppercase">
              Category Breakdown
            </div>
            <div class="my-4 space-y-4">
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
                  <span class="font-medium">{{ item.name }}</span>
                </div>
                <div class="text-muted flex items-center gap-3">
                  <span>{{ item.monthlyQueries }}</span>
                  <span class="text-default font-medium">{{ item.usage }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div
          class="flex flex-col items-center justify-between gap-4 lg:flex-row lg:gap-0"
        >
          <div class="text-muted flex items-center gap-2 text-sm">
            <div class="h-2 w-2 rounded-full bg-green-500" />
            <span>Real-time data</span>
          </div>
          <div class="flex gap-2">
            <UButton
              variant="outline"
              trailing-icon="i-lucide-settings"
              color="neutral"
            >
              Configure
            </UButton>
            <UButton
              variant="outline"
              trailing-icon="i-lucide-bar-chart-3"
              color="neutral"
            >
              View Analytics
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>
