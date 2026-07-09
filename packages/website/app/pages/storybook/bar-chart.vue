<script lang="ts" setup>
import { provideLicenseCheck } from '~/composables/useBlockCode'

definePageMeta({
  layout: 'storybook',
  middleware: ['storybook']
})

provideLicenseCheck()

useSeoMeta({
  title: 'Nuxt Charts - BarChart Storybook',
  description: 'Test BarChart component with a beautiful interface.'
})

const showCode = ref(false)
const settingsVisible = ref(true)

const data = [
  { month: 'Jan', sales: 100, profit: 50 },
  { month: 'Feb', sales: 120, profit: 55 },
  { month: 'Mar', sales: 180, profit: 80 },
  { month: 'Apr', sales: 110, profit: 40 },
  { month: 'May', sales: 90, profit: 30 }
]

const categories = {
  sales: { name: 'Sales', color: '#3b82f6' },
  profit: { name: 'Profit', color: '#10b981' }
}

const yAxisValue = ref(Object.keys(categories))
const xLabel = ref('Month')
const yLabel = ref('Value')
const hideLegend = ref(false)
const xDomainLine = ref(true)
const yDomainLine = ref(true)
const xTickLine = ref(true)
const yTickLine = ref(true)
const xGridLine = ref(true)
const yGridLine = ref(true)
const minMaxTicksOnly = ref(false)
const orientationValue = ref(Orientation.Vertical)
const isStacked = ref(false)
const barRadius = ref(8)
const legendPosition = ref(LegendPosition.TopRight)

const activeCategories = computed(() =>
  yAxisValue.value.reduce((acc, key) => {
    if (categories.hasOwnProperty(key)) {
      acc[key] = categories[key]
    }
    return acc
  }, {})
)

const xFormatter = (i: number) => `${data[i]?.month}`
const yFormatter = (i: number | string) => i

const toggleYAxisValue = (label: string) => {
  const index = yAxisValue.value.indexOf(label)
  if (index === -1) {
    yAxisValue.value.push(label)
  } else {
    yAxisValue.value.splice(index, 1)
  }
}

const chartOptions = computed(() => ({
  height: 400,
  data,
  categories: activeCategories.value,
  xFormatter: orientationValue.value === Orientation.Horizontal ? yFormatter : xFormatter,
  orientation: orientationValue.value,
  yAxis: yAxisValue.value,
  yLabel: yLabel.value,
  xLabel: xLabel.value,
  legendPosition: legendPosition.value,
  hideLegend: !!hideLegend.value,
  stacked: isStacked.value,
  radius: barRadius.value,
  xDomainLine: xDomainLine.value,
  yDomainLine: yDomainLine.value,
  xTickLine: xTickLine.value,
  yTickLine: yTickLine.value,
  xGridLine: xGridLine.value,
  yGridLine: yGridLine.value,
  minMaxTicksOnly: minMaxTicksOnly.value
}))

const chartCode = computed(() => {
  const options = chartOptions.value
  return `<BarChart
  :data="data"
  :categories='${JSON.stringify(options.categories, null, 2)}'
  orientation="${options.orientation}"
  :stacked="${options.stacked}"
  :radius="${options.radius}"
  :y-axis='${JSON.stringify(options.yAxis)}'
  x-label="${options.xLabel}"
  y-label="${options.yLabel}"
  legend-position="${options.legendPosition}"
  :hide-legend="${options.hideLegend}"
  :x-domain-line="${options.xDomainLine}"
  :y-domain-line="${options.yDomainLine}"
  :x-tick-line="${options.xTickLine}"
  :y-tick-line="${options.yTickLine}"
  :x-grid-line="${options.xGridLine}"
  :y-grid-line="${options.yGridLine}"
  :min-max-ticks-only="${options.minMaxTicksOnly}"
/>`
})
</script>

<template>
  <StorybookPage title="BarChart">
    <div class="flex items-start gap-6">
      <StorybookControls class="w-full lg:w-100 shrink-0">
        <StorybookInputControl
          v-model="xLabel"
          label="X-Axis Label"
        />
        <StorybookInputControl
          v-model="yLabel"
          label="Y-Axis Label"
        />

        <StorybookCustomControl label="Axis values">
          <div class="flex flex-col gap-2">
            <UCheckbox
              v-for="labelKey in Object.keys(categories)"
              :key="labelKey"
              :label="labelKey"
              :model-value="yAxisValue.includes(labelKey)"
              @update:model-value="() => toggleYAxisValue(labelKey)"
            />
          </div>
        </StorybookCustomControl>

        <StorybookSelectControl
          v-model="orientationValue"
          label="Orientation"
          :options="[{ label: 'Horizontal', value: Orientation.Horizontal }, { label: 'Vertical', value: Orientation.Vertical }]"
        />

        <StorybookSwitchControl
          v-model="isStacked"
          label="Stacked"
        />

        <StorybookSliderControl
          v-model="barRadius"
          label="Bar Radius"
          :min="0"
          :max="20"
          unit="px"
        />

        <StorybookSwitchControl
          v-model="xDomainLine"
          label="X Domain Line"
        />
        <StorybookSwitchControl
          v-model="yDomainLine"
          label="Y Domain Line"
        />
        <StorybookSwitchControl
          v-model="xTickLine"
          label="X Tick Line"
        />
        <StorybookSwitchControl
          v-model="yTickLine"
          label="Y Tick Line"
        />
        <StorybookSwitchControl
          v-model="xGridLine"
          label="X Grid Line"
        />
        <StorybookSwitchControl
          v-model="yGridLine"
          label="Y Grid Line"
        />
        <StorybookSwitchControl
          v-model="minMaxTicksOnly"
          label="Min/Max Ticks"
        />
        <StorybookSwitchControl
          v-model="hideLegend"
          label="Hide Legend"
        />

        <StorybookSelectControl
          v-model="legendPosition"
          label="Legend Position"
          :options="Object.values(LegendPosition).map(v => ({ label: v, value: v }))"
        />
      </StorybookControls>

      <StorybookPreview
        resizable
        :code="chartCode"
      >
        <DynamicChart
          chart-type="BarChart"
          v-bind="chartOptions"
          :code="chartCode"
          class="w-full"
        />
      </StorybookPreview>
    </div>
  </StorybookPage>
</template>
