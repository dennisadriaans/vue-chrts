<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'sparklines']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Sparklines
      </h2>
      <p class="text-toned dark:text-muted">
        Compact, axis-free charts that show a trend at a glance — perfect for KPI
        rows, tables and dense dashboards.
      </p>
    </div>

    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Trend Rows">
          <template #chart>
            <BlocksSparklinesTrendRows />
          </template>
          <PreviewCode
            id="sparkline-trend-rows"
            category="sparklines"
            block="trend-rows"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Variants">
          <template #chart>
            <BlocksSparklinesVariantShowcase />
          </template>
          <PreviewCode
            id="sparkline-variants"
            category="sparklines"
            block="variant-showcase"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Table Cells">
          <template #chart>
            <BlocksSparklinesTableCells />
          </template>
          <PreviewCode
            id="sparkline-table-cells"
            category="sparklines"
            block="table-cells"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
