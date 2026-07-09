<script lang="ts" setup>
defineOptions({
  tags: ['linecharts', 'chartfour']
})

const categories: Record<string, BulletLegendItemInterface> = {
  Adyen: { name: 'Adyen', color: '#22c55e' },
  Booking: { name: 'Booking.com', color: '#41B883' },
  Mollie: { name: 'Mollie', color: '#34495E' }
}

const InvestmentData = [
  {
    date: 'Aug 01',
    Adyen: 2100.2,
    Booking: 4434.1,
    Mollie: 7943.2
  },
  {
    date: 'Aug 02',
    Adyen: 2943.0,
    Booking: 4954.1,
    Mollie: 8954.1
  },
  {
    date: 'Aug 03',
    Adyen: 4889.5,
    Booking: 6100.2,
    Mollie: 9123.7
  },
  {
    date: 'Aug 04',
    Adyen: 3909.8,
    Booking: 4909.7,
    Mollie: 7478.4
  },
  {
    date: 'Aug 05',
    Adyen: 5778.7,
    Booking: 7103.1,
    Mollie: 9504.3
  },
  {
    date: 'Aug 06',
    Adyen: 5900.9,
    Booking: 7534.3,
    Mollie: 9943.4
  },
  {
    date: 'Aug 07',
    Adyen: 4129.4,
    Booking: 7412.1,
    Mollie: 10112.2
  },
  {
    date: 'Aug 08',
    Adyen: 6021.2,
    Booking: 7834.4,
    Mollie: 10290.2
  },
  {
    date: 'Aug 09',
    Adyen: 6279.8,
    Booking: 8159.1,
    Mollie: 10349.6
  },
  {
    date: 'Aug 10',
    Adyen: 6224.5,
    Booking: 8260.6,
    Mollie: 10415.4
  },
  {
    date: 'Aug 11',
    Adyen: 6380.6,
    Booking: 8965.3,
    Mollie: 10636.3
  },
  {
    date: 'Aug 12',
    Adyen: 6414.4,
    Booking: 7989.3,
    Mollie: 10900.5
  },
  {
    date: 'Aug 13',
    Adyen: 6540.1,
    Booking: 7839.6,
    Mollie: 11040.4
  },
  {
    date: 'Aug 14',
    Adyen: 6634.4,
    Booking: 7343.8,
    Mollie: 11390.5
  },
  {
    date: 'Aug 15',
    Adyen: 7124.6,
    Booking: 6903.7,
    Mollie: 11423.1
  },
  {
    date: 'Aug 16',
    Adyen: 7934.5,
    Booking: 6273.6,
    Mollie: 12134.4
  },
  {
    date: 'Aug 17',
    Adyen: 10287.8,
    Booking: 5900.3,
    Mollie: 12034.4
  },
  {
    date: 'Aug 18',
    Adyen: 10323.2,
    Booking: 5732.1,
    Mollie: 11011.7
  },
  {
    date: 'Aug 19',
    Adyen: 10511.4,
    Booking: 5523.1,
    Mollie: 11834.8
  },
  {
    date: 'Aug 20',
    Adyen: 11043.9,
    Booking: 5422.3,
    Mollie: 12387.1
  },
  {
    date: 'Aug 21',
    Adyen: 6700.7,
    Booking: 5334.2,
    Mollie: 11032.2
  },
  {
    date: 'Aug 22',
    Adyen: 6900.8,
    Booking: 4943.4,
    Mollie: 10134.2
  },
  {
    date: 'Aug 23',
    Adyen: 7934.5,
    Booking: 4812.1,
    Mollie: 9921.2
  },
  {
    date: 'Aug 24',
    Adyen: 9021.0,
    Booking: 2729.1,
    Mollie: 10549.8
  },
  {
    date: 'Aug 25',
    Adyen: 9198.2,
    Booking: 2178.0,
    Mollie: 10968.4
  },
  {
    date: 'Aug 26',
    Adyen: 9557.1,
    Booking: 2158.3,
    Mollie: 11059.1
  },
  {
    date: 'Aug 27',
    Adyen: 9959.8,
    Booking: 2100.8,
    Mollie: 11903.6
  },
  {
    date: 'Aug 28',
    Adyen: 10034.6,
    Booking: 2934.4,
    Mollie: 12143.3
  },
  {
    date: 'Aug 29',
    Adyen: 10243.8,
    Booking: 3223.4,
    Mollie: 12930.1
  },
  {
    date: 'Aug 30',
    Adyen: 10078.5,
    Booking: 3779.1,
    Mollie: 13420.5
  },
  {
    date: 'Aug 31',
    Adyen: 11134.6,
    Booking: 4190.3,
    Mollie: 14443.2
  },
  {
    date: 'Sep 01',
    Adyen: 12347.2,
    Booking: 4839.1,
    Mollie: 14532.1
  },
  {
    date: 'Sep 02',
    Adyen: 12593.8,
    Booking: 5153.3,
    Mollie: 14283.5
  },
  {
    date: 'Sep 03',
    Adyen: 12043.4,
    Booking: 5234.8,
    Mollie: 14078.9
  },
  {
    date: 'Sep 04',
    Adyen: 12144.9,
    Booking: 5478.4,
    Mollie: 13859.7
  },
  {
    date: 'Sep 05',
    Adyen: 12489.5,
    Booking: 5741.1,
    Mollie: 13539.2
  },
  {
    date: 'Sep 06',
    Adyen: 12748.7,
    Booking: 6743.9,
    Mollie: 13643.2
  },
  {
    date: 'Sep 07',
    Adyen: 12933.2,
    Booking: 7832.8,
    Mollie: 14629.2
  },
  {
    date: 'Sep 08',
    Adyen: 13028.8,
    Booking: 8943.2,
    Mollie: 13611.2
  },
  {
    date: 'Sep 09',
    Adyen: 13412.4,
    Booking: 9932.2,
    Mollie: 12515.2
  },
  {
    date: 'Sep 10',
    Adyen: 13649.0,
    Booking: 10139.2,
    Mollie: 11143.8
  },
  {
    date: 'Sep 11',
    Adyen: 13748.5,
    Booking: 10441.2,
    Mollie: 8929.2
  },
  {
    date: 'Sep 12',
    Adyen: 13148.1,
    Booking: 10933.8,
    Mollie: 8943.2
  },
  {
    date: 'Sep 13',
    Adyen: 12839.6,
    Booking: 11073.4,
    Mollie: 7938.3
  },
  {
    date: 'Sep 14',
    Adyen: 12428.2,
    Booking: 11128.3,
    Mollie: 7533.4
  },
  {
    date: 'Sep 15',
    Adyen: 12012.8,
    Booking: 11412.3,
    Mollie: 7100.4
  },
  {
    date: 'Sep 16',
    Adyen: 11801.3,
    Booking: 10501.1,
    Mollie: 6532.1
  },
  {
    date: 'Sep 17',
    Adyen: 10102.9,
    Booking: 8923.3,
    Mollie: 4332.8
  },
  {
    date: 'Sep 18',
    Adyen: 12132.5,
    Booking: 10212.1,
    Mollie: 7847.4
  },
  {
    date: 'Sep 19',
    Adyen: 12901.1,
    Booking: 10101.7,
    Mollie: 7223.3
  },
  {
    date: 'Sep 20',
    Adyen: 13132.6,
    Booking: 12132.3,
    Mollie: 6900.2
  },
  {
    date: 'Sep 21',
    Adyen: 14132.2,
    Booking: 13212.5,
    Mollie: 5932.2
  },
  {
    date: 'Sep 22',
    Adyen: 14245.8,
    Booking: 12163.4,
    Mollie: 5577.1
  },
  {
    date: 'Sep 23',
    Adyen: 14328.3,
    Booking: 10036.1,
    Mollie: 5439.2
  },
  {
    date: 'Sep 24',
    Adyen: 14949.9,
    Booking: 8985.1,
    Mollie: 4463.1
  },
  {
    date: 'Sep 25',
    Adyen: 15967.5,
    Booking: 9700.1,
    Mollie: 4123.2
  },
  {
    date: 'Sep 26',
    Adyen: 17349.3,
    Booking: 10943.4,
    Mollie: 3935.1
  }
]

const xFormatter = (i: number) => `${InvestmentData[i]?.date}`

const actual = ref('8,110.15')
const forecasted = ref('10,230.25')
const lastInvoiceDate = ref('Sept 20, 2024')

const tableVisible = ref(false)

const dayOptions = [
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 },
  { label: '60 days', value: 60 },
  { label: '90 days', value: 90 }
]
const selectedDays = ref(7)
const tableRows = computed(() => selectedDays.value)
const legendItems = computed(() => Object.values(categories))

function onSelectDays(val: unknown) {
  const num = typeof val === 'number' ? val : Number(val)
  selectedDays.value = num > 0 ? num : 30
}

function toggleTable() {
  tableVisible.value = !tableVisible.value
}

const { height } = useResponsiveHeight({
  default: 120,
  sm: 360
})
</script>

<template>
  <UCard>
    <div
      class=" mb-4 flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-2">
        <div class="flex flex-col items-start">
          <p class="text-muted mb-1 text-sm">
            Actual
          </p>
          <p class="text-base font-medium sm:text-lg">
            ${{ actual }}
          </p>
        </div>
        <div class="flex flex-col items-start">
          <p class="text-muted mb-1 text-sm">
            Forecasted
          </p>
          <p class="text-base font-medium sm:text-lg">
            ${{ forecasted }}
          </p>
        </div>
        <div class="flex flex-col items-start">
          <p class="text-muted mb-1 text-sm">
            Last invoice
          </p>
          <p class="text-base font-medium sm:text-lg">
            {{ lastInvoiceDate }}
          </p>
        </div>
      </div>
      <div class="flex w-full justify-end sm:w-auto">
        <USelect
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
          class="w-full sm:w-32"
          :model-value="selectedDays"
          :items="dayOptions"
          option-attribute="label"
          value-attribute="value"
          @update:model-value="onSelectDays"
        />
      </div>
    </div>

    <UCard variant="subtle">
      <div class="-mx-2 sm:mx-0">
        <LineChart
          class="dashed"
          :data="InvestmentData"
          :height="height"
          :legend-position="LegendPosition.BottomRight"
          :categories="categories"
          :y-num-ticks="4"
          :x-formatter="xFormatter"
          :hide-legend="true"
          :curve-type="CurveType.MonotoneX"
        />
      </div>
    </UCard>

    <div class="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      <div
        v-for="item in legendItems"
        :key="item.name"
        class="flex items-center gap-2"
      >
        <span
          class="inline-block h-1 w-8 rounded-full"
          :style="`background-color: ${Array.isArray(item.color) ? item.color[0] : item.color}`"
        />
        <span class="text-sm text-muted">
          {{ item.name }}
        </span>
      </div>
    </div>

    <div class="mt-6 flex items-center justify-center">
      <UButton
        :icon="tableVisible ? 'i-lucide:chevron-up' : 'i-lucide:chevron-down'"
        color="neutral"
        variant="outline"
        class="w-full sm:w-auto"
        @click="toggleTable"
      >
        {{ tableVisible ? 'Hide table' : 'Show table' }}
      </UButton>
    </div>

    <UCard
      v-if="tableVisible"
      class="mt-4"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr
              class="border-b"
              style="border-color: var(--ui-border)"
            >
              <th
                class="px-4 py-3 text-left text-sm font-medium"
                style="color: var(--ui-text)"
              >
                Date
              </th>
              <th
                class="px-4 py-3 text-right text-sm font-medium"
                style="color: var(--ui-text)"
              >
                Adyen
              </th>
              <th
                class="px-4 py-3 text-right text-sm font-medium"
                style="color: var(--ui-text)"
              >
                Booking.com
              </th>
              <th
                class="px-4 py-3 text-right text-sm font-medium"
                style="color: var(--ui-text)"
              >
                Mollie
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in InvestmentData.slice(0, tableRows)"
              :key="index"
              class="border-b last:border-b-0"
              style="border-color: var(--ui-border-muted)"
            >
              <td
                class="px-4 py-3 text-sm"
                style="color: var(--ui-text)"
              >
                {{ row.date }}
              </td>
              <td
                class="px-4 py-3 text-right text-sm"
                style="color: var(--ui-text-dimmed)"
              >
                ${{
                  row.Adyen.toLocaleString('en-US', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                  })
                }}
              </td>
              <td
                class="px-4 py-3 text-right text-sm"
                style="color: var(--ui-text-dimmed)"
              >
                ${{
                  row.Booking.toLocaleString('en-US', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                  })
                }}
              </td>
              <td
                class="px-4 py-3 text-right text-sm"
                style="color: var(--ui-text-dimmed)"
              >
                ${{
                  row.Mollie.toLocaleString('en-US', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                  })
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </UCard>
</template>

<style>
.dashed {
  --vis-axis-grid-line-dasharray: 5 5;
}
</style>
