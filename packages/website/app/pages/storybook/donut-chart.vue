<script lang="ts" setup>
import { provideLicenseCheck } from '~/composables/useBlockCode'

definePageMeta({
  layout: 'storybook',
  middleware: ['storybook']
})

provideLicenseCheck()

useSeoMeta({
  title: 'Nuxt Charts - DonutChart Storybook',
  description: 'Test DonutChart component with a beautiful interface.'
})

const showCode = ref(false)

const data = ref([65.2, 18.7, 4.3, 3.2, 0.6])
const categories = {
  chrome: { name: 'Chrome', color: '#3b82f6' },
  safari: { name: 'Safari', color: '#10b981' },
  edge: { name: 'Edge', color: '#f59e0b' },
  firefox: { name: 'Firefox', color: '#ef4444' },
  brave: { name: 'Brave', color: '#8b5cf6' }
}

const donutType = ref(DonutType.Full)
const radius = ref(0)
const arcWidth = ref(40)
const padAngle = ref(0.02)
const hideLegend = ref(false)
const legendPosition = ref(LegendPosition.BottomCenter)

const chartOptions = computed(() => ({
  height: 320,
  data: data.value,
  categories,
  type: donutType.value,
  radius: radius.value,
  arcWidth: arcWidth.value,
  padAngle: padAngle.value,
  hideLegend: hideLegend.value,
  legendPosition: legendPosition.value
}))

const chartCode = computed(() => {
  const options = chartOptions.value
  return `<DonutChart
  :data="data"
  :categories='${JSON.stringify(options.categories, null, 2)}'
  type="${options.type}"
  :radius="${options.radius}"
  :arc-width="${options.arcWidth}"
  :pad-angle="${options.padAngle}"
  :hide-legend="${options.hideLegend}"
  legend-position="${options.legendPosition}"
/>`
})
</script>

<template>
  <StorybookPage title="DonutChart">
    <div class="flex items-start gap-6">
      <StorybookControls class="w-full lg:w-100 shrink-0">
        <StorybookSelectControl
          v-model="donutType"
          label="Donut Type"
          :options="[{ label: 'Full', value: DonutType.Full }, { label: 'Half', value: DonutType.Half }]"
        />

        <StorybookSliderControl
          v-model="radius"
          label="Radius (0=auto)"
          :min="0"
          :max="200"
          unit="px"
        />

        <StorybookSliderControl
          v-model="arcWidth"
          label="Arc Width"
          :min="0"
          :max="100"
          unit="px"
        />

        <StorybookSliderControl
          v-model="padAngle"
          label="Pad Angle"
          :min="0"
          :max="0.1"
          :step="0.01"
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
        <div class="flex h-80 items-center justify-center">
          <DynamicChart
            chart-type="DonutChart"
            v-bind="chartOptions"
            :code="chartCode"
          />
        </div>
      </StorybookPreview>
    </div>
  </StorybookPage>
</template>
