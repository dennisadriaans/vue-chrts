<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'combo-charts']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Combo Charts
      </h2>
      <p class="text-toned dark:text-muted">
        Combine bars and lines on a dual axis to compare metrics with different
        scales in a single chart.
      </p>
    </div>

    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Revenue & Growth">
          <template #chart>
            <BlocksComboChartsRevenueGrowth />
          </template>
          <PreviewCode
            id="combo-revenue-growth"
            category="combo-charts"
            block="revenue-growth"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Traffic & Conversion">
          <template #chart>
            <BlocksComboChartsTrafficConversion />
          </template>
          <PreviewCode
            id="combo-traffic-conversion"
            category="combo-charts"
            block="traffic-conversion"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
