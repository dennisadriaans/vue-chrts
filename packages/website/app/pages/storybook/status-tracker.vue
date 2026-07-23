<script setup lang="ts">
definePageMeta({
  layout: 'storybook',
  middleware: ['storybook']
})

const dataPoints = ref(500)
const refreshKey = ref(0)

function generateData(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const isOffline = index === 3 || index === count - 2
    return { status: isOffline ? 'offline' : 'online' }
  })
}

const statusData = computed(() => {
  void refreshKey.value
  return generateData(dataPoints.value)
})

const data = ref({
  domain: 'example.com',
  uptime: '99.9%',
  operationalStatus: true,
  barWidth: 4,
  barGap: 2,
  startLabel: '90 days ago',
  endLabel: 'Today'
})

const componentCode = computed(() => `<StatusTracker
  domain="${data.value.domain}"
  uptime="${data.value.uptime}"
  :operational-status="${data.value.operationalStatus}"
  :status-data="statusData"
  :bar-width="${data.value.barWidth}"
  :bar-gap="${data.value.barGap}"
  start-label="${data.value.startLabel}"
  end-label="${data.value.endLabel}"
/>`)
</script>

<template>
  <StorybookPage title="StatusTracker">
    <div class="flex items-start gap-6">
      <StorybookControls class="w-full lg:w-100 shrink-0">
        <StorybookInputControl
          v-model="data.domain"
          label="Domain"
          description="Service endpoint name"
          input-class="w-48"
        />
        <StorybookInputControl
          v-model="data.uptime"
          label="Uptime"
          description="Availability percentage"
          input-class="w-24"
        />
        <StorybookSwitchControl
          v-model="data.operationalStatus"
          label="Operational"
          description="Current status"
        />
        <StorybookSliderControl
          v-model="data.barWidth"
          label="Bar Width"
          description="Status bar thickness"
          :min="2"
          :max="10"
          unit="px"
        />
        <StorybookSliderControl
          v-model="data.barGap"
          label="Bar Gap"
          description="Space between bars"
          :min="0"
          :max="6"
          unit="px"
        />
        <StorybookSliderControl
          v-model="dataPoints"
          label="Data Points"
          description="Number of days tracked (test sparse data)"
          :min="1"
          :max="180"
          unit="days"
        />
      </StorybookControls>

      <StorybookPreview
        resizable
        :default-width="600"
        class="w-full"
        :code="componentCode"
      >
        <div class="flex h-full w-full items-center justify-center">
          <DynamicChart
            chart-type="StatusTracker"
            :domain="data.domain"
            :uptime="data.uptime"
            :operational-status="data.operationalStatus"
            :status-data="statusData"
            :bar-width="data.barWidth"
            :bar-gap="data.barGap"
            :start-label="data.startLabel"
            :end-label="data.endLabel"
            :code="componentCode"
          />
        </div>
      </StorybookPreview>
    </div>
  </StorybookPage>
</template>
