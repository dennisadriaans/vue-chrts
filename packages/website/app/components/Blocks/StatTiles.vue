<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'stat-tiles']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Stat Tiles
      </h2>
      <p class="text-toned dark:text-muted">
        KPI cards that pair a headline metric with a trend delta and an inline
        sparkline — the top row of every analytics dashboard.
      </p>
    </div>

    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="KPI Row">
          <template #chart>
            <BlocksStatTilesKpiRow />
          </template>
          <PreviewCode
            id="stat-tiles-kpi-row"
            category="stat-tiles"
            block="kpi-row"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Animated Metric">
          <template #chart>
            <BlocksStatTilesAnimatedMetric />
          </template>
          <PreviewCode
            id="stat-tiles-animated-metric"
            category="stat-tiles"
            block="animated-metric"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Bar KPIs">
          <template #chart>
            <BlocksStatTilesBarKpis />
          </template>
          <PreviewCode
            id="stat-tiles-bar-kpis"
            category="stat-tiles"
            block="bar-kpis"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
