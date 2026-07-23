<script lang="ts" setup>
defineOptions({
  tags: ['areacharts', 'chartwithdata']
})

interface Props {
  height?: number
  actOnResponsiveHeight?: boolean
}

const { height, actOnResponsiveHeight = true } = defineProps<Props>()

const colorMode = useColorMode()
const { height: responsiveHeight } = useResponsiveHeight({
  default: 120,
  sm: 240
})

const chartHeight = computed(() => {
  if (actOnResponsiveHeight) {
    return responsiveHeight.value
  }

  return height ?? responsiveHeight.value
})

interface RevenueDataItem {
  period: string
  subscriptions: number
  services: number
  products: number
}

const RevenueData: RevenueDataItem[] = [
  {
    period: 'Q1',
    subscriptions: 4200,
    services: 3100,
    products: 2400
  },
  {
    period: 'Q2',
    subscriptions: 5800,
    services: 4200,
    products: 3800
  },
  {
    period: 'Q3',
    subscriptions: 7200,
    services: 5500,
    products: 4600
  },
  {
    period: 'Q4',
    subscriptions: 6800,
    services: 4800,
    products: 4200
  },
  {
    period: 'Q1',
    subscriptions: 8400,
    services: 6200,
    products: 5100
  },
  {
    period: 'Q2',
    subscriptions: 9600,
    services: 7400,
    products: 6300
  }
]

const RevenueCategories = computed(() => ({
  subscriptions: {
    name: 'Subscriptions',
    color: colorMode.value === 'dark' ? '#a78bfa' : '#8b5cf6'
  },
  services: {
    name: 'Services',
    color: colorMode.value === 'dark' ? '#34d399' : '#10b981'
  },
  products: {
    name: 'Products',
    color: colorMode.value === 'dark' ? '#fbbf24' : '#f59e0b'
  }
}))

const xFormatter = (i: number): string => `${RevenueData[i]?.period}`
const yFormatter = (value: number): string => `$${(value / 1000).toFixed(1)}k`
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
            icon="i-hugeicons:ai-chat-02"
            variant="ghost"
            color="neutral"
          />
        </NuxtLink>
      </div>
      <UCard variant="soft">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2 text-lg">
            <span class="text-toned">vs Last Year</span>
            <UBadge
              variant="soft"
              color="primary"
              leading-icon="i-lucide-arrow-up"
            >
              45%
            </UBadge>
          </div>
        </div>
        <AreaChart
          :key="colorMode.value"
          class="dashed"
          :data="RevenueData"
          :height="chartHeight"
          :categories="RevenueCategories"
          :curve-type="CurveType.Natural"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :legend-position="LegendPosition.BottomCenter"
          :hide-legend="true"
          :y-grid-line="false"
          :x-grid-line="true"
          :y-domain-line="false"
          :x-domain-line="false"
          :x-tick-line="false"
          :y-tick-line="false"
          :x-num-ticks="6"
          :y-num-ticks="6"
          x-label="Quarter"
          y-label="Revenue"
        />
      </UCard>

      <div class="flex items-center justify-center gap-6 text-sm font-medium">
        <div
          v-for="(category, key) in RevenueCategories"
          :key="key"
          class="flex items-center gap-1.5"
        >
          <div
            class="size-2 rounded-full"
            :style="{ backgroundColor: category.color }"
          />
          <span class="text-[var(--ui-text-toned)]">{{ category.name }}</span>
        </div>
      </div>
    </div>
  </UCard>
</template>

<style>
.dashed {
  --vis-axis-grid-line-dasharray: 5 5;
}
</style>
