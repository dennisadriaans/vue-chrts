<script lang="ts" setup>
defineOptions({
  tags: ['areacharts', 'chartfour']
})

interface AreaChartItem {
  date: string
  ['This year']: number
  ['Last year']: number
}

const categories: Record<string, BulletLegendItemInterface> = {
  'This year': { name: 'This year', color: '#577a9d' },
  'Last year': { name: 'Last year', color: '#22c55e' }
}

const AreaChartData: AreaChartItem[] = [
  {
    'date': 'Jan 23',
    'This year': 10200,
    'Last year': 3800
  },
  {
    'date': 'Feb 23',
    'This year': 15100,
    'Last year': 6910
  },
  {
    'date': 'Mar 23',
    'This year': 16100,
    'Last year': 7210
  },
  {
    'date': 'Apr 23',
    'This year': 17100,
    'Last year': 9200
  },
  {
    'date': 'May 23',
    'This year': 24800,
    'Last year': 9100
  },
  {
    'date': 'Jun 23',
    'This year': 20500,
    'Last year': 10210
  },
  {
    'date': 'Jul 23',
    'This year': 22130,
    'Last year': 10810
  },
  {
    'date': 'Aug 23',
    'This year': 28100,
    'Last year': 12120
  },
  {
    'date': 'Sep 23',
    'This year': 31700,
    'Last year': 10620
  },
  {
    'date': 'Oct 23',
    'This year': 32230,
    'Last year': 11350
  },
  {
    'date': 'Nov 23',
    'This year': 42200,
    'Last year': 12550
  },
  {
    'date': 'Dec 23',
    'This year': 59100,
    'Last year': 22150
  }
]

const xFormatter = (tick: number): string => {
  return String(AreaChartData[tick]?.date ?? '')
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const { height } = useResponsiveHeight({
  default: 120,
  sm: 240
})
</script>

<template>
  <UCard class="bg-default/60!">
    <div class="space-y-6">
      <h3 class="text-xl font-semibold">
        Revenue
      </h3>

      <div
        class="grid grid-cols-3"
      >
        <div>
          <p class="text-muted text-sm">
            Actual
          </p>
          <p class="font-semibold text-2xl">
            $255
          </p>
        </div>
        <div>
          <p class="text-muted text-sm">
            Forecasted
          </p>
          <div class="flex items-center gap-2">
            <p class="font-semibold text-2xl">
              $300
            </p>
            <UBadge
              variant="soft"
              size="sm"
            >
              +21%
            </UBadge>
          </div>
        </div>
        <div>
          <p class="text-muted text-sm">
            Last invoice
          </p>
          <p class="font-semibold text-2xl">
            2025-04-12
          </p>
        </div>
      </div>

      <UCard variant="soft">
        <AreaChart
          :data="AreaChartData"
          :height="height"
          :categories="categories"
          :y-grid-line="true"
          :x-formatter="xFormatter"
          :y-formatter="(i: number) => `${formatCurrency(i)}`"
          :x-num-ticks="4"
          :y-num-ticks="4"
          :curve-type="CurveType.MonotoneX"
          :legend-position="LegendPosition.BottomRight"
        />
      </UCard>
    </div>
  </UCard>
</template>
