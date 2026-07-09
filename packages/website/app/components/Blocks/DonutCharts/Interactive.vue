<script setup lang="ts">
defineOptions({
  tags: ['donutcharts', 'interactive', 'monochrome']
})

const dataPoints = ref([
  { name: 'Desktop', value: 45, color: '#06b6d4' },
  { name: 'Mobile', value: 35, color: '#8b5cf6' },
  { name: 'Tablet', value: 20, color: '#f97316' }
])

const total = computed(() => dataPoints.value.reduce((acc, curr) => acc + curr.value, 0))

const categories = computed(() => {
  return Object.fromEntries(
    dataPoints.value.map(item => [
      item.name,
      {
        name: item.name,
        color: item.color,
        percentage: item.value
      }
    ])
  )
})

const randomizeData = () => {
  dataPoints.value = dataPoints.value.map(item => ({
    ...item,
    value: Math.floor(Math.random() * 80) + 10
  }))
}

const increaseDesktop = () => {
  dataPoints.value[0].value += 10
}

const decreaseDesktop = () => {
  if (dataPoints.value[0].value > 10) {
    dataPoints.value[0].value -= 10
  }
}
</script>

<template>
  <div class="p-4">
    <UCard class="bg-default! mx-auto max-w-sm">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-medium text-highlighted">
              Device Usage
            </h3>
            <p class="text-sm text-muted">
              Distribution across platforms
            </p>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-refresh-cw"
            size="sm"
            @click="randomizeData"
          />
        </div>
      </template>

      <div class="flex flex-col gap-8 py-2">
        <div class="relative flex justify-center">
          <DonutChart
            :data="dataPoints.map(d => d.value)"
            :categories="categories"
            :height="180"
            :arc-width="20"
            :pad-angle="0.05"
            :radius="4"
            :hide-legend="true"
          >
            <div class="flex flex-col items-center justify-center">
              <span class="text-3xl font-bold text-highlighted">{{ total }}</span>
              <span class="text-xs text-muted uppercase tracking-wider font-medium mt-1">Total</span>
            </div>
          </DonutChart>
        </div>

        <div class="space-y-3">
          <div
            v-for="(item, index) in dataPoints"
            :key="item.name"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                class="size-2.5 rounded-full"
                :style="{ backgroundColor: item.color }"
              />
              <span class="text-sm font-medium text-toned">{{ item.name }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm text-muted font-mono w-10 text-right">{{ Math.round((item.value / total) * 100) }}%</span>
              <div
                v-if="index === 0"
                class="flex items-center gap-1 bg-muted/50 rounded-md p-0.5"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-minus"
                  size="xs"
                  :ui="{ rounded: 'rounded-md' }"
                  @click="decreaseDesktop"
                />
                <span class="w-8 text-center text-sm font-mono font-medium">{{ item.value }}</span>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-plus"
                  size="xs"
                  :ui="{ rounded: 'rounded-md' }"
                  @click="increaseDesktop"
                />
              </div>
              <span
                v-else
                class="w-[84px] text-right text-sm font-mono font-medium text-toned"
              >{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
