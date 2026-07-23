<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'donutcharts']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Donut Charts
      </h2>
      <p class="text-toned dark:text-muted">
        Explore the collection of high quality donut charts.
      </p>
    </div>
    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="With Radius and Spacing">
          <template #chart>
            <BlocksDonutChartsWithRadiusAndSpacing />
          </template>
          <PreviewCode
            id="donut-chart-with-radius-and-spacing"
            category="donut-charts"
            block="with-radius-and-spacing"
            :lock-code="true"
          />
        </PreviewExample>
        <PreviewExample title="Interactive Monochrome">
          <template #chart>
            <BlocksDonutChartsInteractive />
          </template>
          <PreviewCode
            id="donut-chart-interactive"
            category="donut-charts"
            block="interactive"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Visitors Analytics">
          <template #chart>
            <BlocksDonutChartsVisitors />
          </template>
          <PreviewCode
            id="donut-chart-visitors"
            category="donut-charts"
            block="visitors"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Donut Chart One">
          <template #chart>
            <BlocksDonutChartsChartOne />
          </template>
          <PreviewCode
            id="donut-chart-one"
            category="donut-charts"
            block="chart-one"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Donut Chart Two">
          <template #chart>
            <BlocksDonutChartsChartTwo />
          </template>
          <PreviewCode
            id="donut-chart-two"
            category="donut-charts"
            block="chart-two"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Donut Chart Three">
          <template #chart>
            <BlocksDonutChartsChartThree />
          </template>
          <PreviewCode
            id="donut-chart-three"
            category="donut-charts"
            block="chart-three"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Donut Chart Four">
          <template #chart>
            <BlocksDonutChartsChartFour />
          </template>
          <PreviewCode
            id="donut-chart-four"
            category="donut-charts"
            block="chart-four"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
