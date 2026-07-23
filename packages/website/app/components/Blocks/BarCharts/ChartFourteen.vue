<script setup lang="ts">
defineOptions({
  tags: ['barcharts', 'chartfourteen']
})

interface ProgressData {
  date: string
  expenses: number
}

const chartData = ref<ProgressData[]>([
  { date: 'Apr 14', expenses: 300 },
  { date: 'Apr 15', expenses: 500 },
  { date: 'Apr 16', expenses: 700 },
  { date: 'Apr 17', expenses: 900 },
  { date: 'Apr 18', expenses: 1100 },
  { date: 'Apr 19', expenses: 1300 },
  { date: 'Apr 20', expenses: 1500 },
  { date: 'Apr 21', expenses: 1900 },
  { date: 'Apr 22', expenses: 2100 },
  { date: 'Apr 23', expenses: 2500 },
  { date: 'Apr 24', expenses: 2800 },
  { date: 'Apr 25', expenses: 3200 },
  { date: 'Apr 26', expenses: 3600 },
  { date: 'Apr 27', expenses: 3900 },
  { date: 'Apr 28', expenses: 4100 },
  { date: 'Apr 29', expenses: 4400 }
])

const categories = computed(() => ({
  expenses: { name: 'Expenses', color: 'var(--ui-primary)' }
}))

const xFormatter = (i: number): string => `${chartData.value[i]?.date}`

const { height } = useResponsiveHeight({
  default: 260,
  sm: 260
})

const formatCurrency = (value: number) => {
  if (value === 0) return '0'
  return `${(value / 1000).toFixed(0)}k`
}
</script>

<template>
  <UCard class="bg-default!">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-default">
          Project progress
        </h3>
        <UBadge
          color="success"
          variant="subtle"
          class="rounded-full"
        >
          <template #leading>
            <div class="h-1.5 w-1.5 rounded-full bg-success" />
          </template>
          On track
        </UBadge>
      </div>
    </template>

    <UCard
      class="mt-4"
      variant="soft"
    >
      <BarChart
        :data="chartData"
        :categories="categories"
        :height="height"
        :y-axis="['expenses']"
        :y-formatter="formatCurrency"
        :x-formatter="xFormatter"
        :y-grid-line="true"
        :hide-legend="true"
        :x-num-ticks="8"
        :radius="4"
        class="h-full w-full"
      />
    </UCard>
    <div class="flex items-center justify-center gap-4 mt-4">
      <div
        v-for="(category, key) in categories"
        :key="key"
        class="flex items-center gap-1.5"
      >
        <div
          class="h-1.5 w-1.5 rounded-full"
          :style="{ backgroundColor: category.color }"
        />
        <span class="text-xs text-muted-foreground whitespace-nowrap">
          {{ category.name }}
        </span>
      </div>
    </div>
  </UCard>
</template>
