<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'statusuptime']
})

const statusData = computed(() => {
  const statusHistory = Array.from({ length: 300 }, () => ({
    status: 'online'
  }))
  statusHistory[74]!.status = 'offline'
  return statusHistory
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Status & Update
      </h2>
      <p class="text-toned dark:text-muted">
        Explore the collection of status and update UI components, perfect for
        keeping users engaged.
      </p>
    </div>
    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Tracker">
          <template #chart>
            <DocsExamplesStatusTracker
              :bar-width="6"
              :bar-gap="1"
              :operational-status="true"
              domain="example.com"
              uptime="99.9%"
              :status-data="statusData"
              class="!bg-default"
            />
          </template>
          <PreviewCode
            id="status-tracker"
            category="status"
            block="tracker"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Contribution Graph">
          <template #chart>
            <BlocksStatusUptimeContributionGraph
              size="lg"
              :show-legend="true"
            />
          </template>
          <PreviewCode
            id="status-contribution-graph"
            category="status"
            block="contribution-graph"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Stepper">
          <template #chart>
            <BlocksStatusUptimeStepper
              class="p-24"
              :steps="[
                { label: 'Shopping basket', status: 'completed' },
                { label: 'Personal details', status: 'completed' },
                { label: 'Shipping details', status: 'completed' },
                { label: 'Confirmation', status: 'future' }
              ]"
            />
          </template>
          <PreviewCode
            id="status-stepper"
            category="status"
            block="stepper"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Spark Line Inline Metrics">
          <template #chart>
            <BlocksStatusUptimeSparklinesRealtimeSparklines />
          </template>
          <PreviewCode
            id="status-sparkline-realtime"
            category="status"
            block="sparklines/realtime-sparklines"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Spark Line Inline Metrics">
          <template #chart>
            <BlocksStatusUptimeSparklinesTableSparklines />
          </template>
          <PreviewCode
            id="status-sparklines-table"
            category="status"
            block="sparklines/table-sparklines"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Server Performance Heatmap">
          <template #chart>
            <BlocksStatusUptimeHeatMapServerPerformanceHeatmap />
          </template>
          <PreviewCode
            id="status-server-performance-heatmap"
            category="status"
            block="heat-map/server-performance-heatmap"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
