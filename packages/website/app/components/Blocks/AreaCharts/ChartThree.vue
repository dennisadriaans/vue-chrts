<script lang="ts" setup>
defineOptions({
  tags: ['areacharts', 'chartthree']
})

interface AreaChartItem {
  date: string
  Requests: number
  ['Errors']: number
}

const categories: Record<string, BulletLegendItemInterface> = {
  Requests: { name: 'Success', color: '#4B6A88' },
  Errors: { name: 'Errors', color: '#fb2c36' }
}

const AreaChartData: AreaChartItem[] = [
  {
    date: 'Aug 01',
    Requests: 1040,
    Errors: 0
  },
  {
    date: 'Aug 02',
    Requests: 1200,
    Errors: 0
  },
  {
    date: 'Aug 03',
    Requests: 1130,
    Errors: 0
  },
  {
    date: 'Aug 04',
    Requests: 1050,
    Errors: 0
  },
  {
    date: 'Aug 05',
    Requests: 920,
    Errors: 0
  },
  {
    date: 'Aug 06',
    Requests: 870,
    Errors: 0
  },
  {
    date: 'Aug 07',
    Requests: 790,
    Errors: 0
  },
  {
    date: 'Aug 08',
    Requests: 910,
    Errors: 0
  },
  {
    date: 'Aug 09',
    Requests: 951,
    Errors: 0
  },
  {
    date: 'Aug 10',
    Requests: 1232,
    Errors: 0
  },
  {
    date: 'Aug 11',
    Requests: 1230,
    Errors: 0
  },
  {
    date: 'Aug 12',
    Requests: 1289,
    Errors: 0
  },
  {
    date: 'Aug 13',
    Requests: 1002,
    Errors: 0
  },
  {
    date: 'Aug 14',
    Requests: 1034,
    Errors: 0
  },
  {
    date: 'Aug 15',
    Requests: 1140,
    Errors: 0
  },
  {
    date: 'Aug 16',
    Requests: 1280,
    Errors: 0
  },
  {
    date: 'Aug 17',
    Requests: 1345,
    Errors: 0
  },
  {
    date: 'Aug 18',
    Requests: 1432,
    Errors: 0
  },
  {
    date: 'Aug 19',
    Requests: 1321,
    Errors: 0
  },
  {
    date: 'Aug 20',
    Requests: 1230,
    Errors: 0
  },
  {
    date: 'Aug 21',
    Requests: 1020,
    Errors: 0
  },
  {
    date: 'Aug 22',
    Requests: 1040,
    Errors: 0
  },
  {
    date: 'Aug 23',
    Requests: 610,
    Errors: 81
  },
  {
    date: 'Aug 24',
    Requests: 610,
    Errors: 87
  },
  {
    date: 'Aug 25',
    Requests: 610,
    Errors: 92
  },
  {
    date: 'Aug 26',
    Requests: 501,
    Errors: 120
  },
  {
    date: 'Aug 27',
    Requests: 480,
    Errors: 120
  },
  {
    date: 'Aug 28',
    Requests: 471,
    Errors: 120
  },
  {
    date: 'Aug 29',
    Requests: 610,
    Errors: 89
  },
  {
    date: 'Aug 30',
    Requests: 513,
    Errors: 199
  },
  {
    date: 'Aug 31',
    Requests: 500,
    Errors: 56
  }
]
const xFormatter = (i: number): string | number => `${AreaChartData[i]?.date}`
const sum = (arr: any[], key: string) =>
  arr.reduce((sum: number, obj: any) => sum + obj[key], 0)

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})
</script>

<template>
  <UCard class="bg-default/60!">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold">
          Status Monitor
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
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-medium">
            {{ sum(AreaChartData, 'Errors') }} errors
          </h2>
        </div>
        <AreaChart
          :data="AreaChartData"
          :height="height"
          :categories="categories"
          :y-grid-line="true"
          :x-formatter="xFormatter"
          :x-num-ticks="4"
          :y-num-ticks="4"
          :curve-type="CurveType.MonotoneX"
          :legend-position="LegendPosition.TopRight"
        />
      </UCard>

      <div class="flex justify-end gap-2">
        <UButton
          variant="link"
          trailing-icon="i-lucide-external-link"
          color="neutral"
        >
          View transactions
        </UButton>
      </div>
    </div>
  </UCard>
</template>
