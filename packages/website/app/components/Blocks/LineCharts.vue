<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'linecharts']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        LineCharts Charts
      </h2>
      <p class="text-toned dark:text-muted">
        A collection of lineCharts charts showcasing trends and data
        visualization.
      </p>
    </div>
    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="LineCharts Chart One">
          <template #chart>
            <BlocksLineChartsChartOne class="max-w-2xl mx-auto bg-default/75!" />
          </template>
          <PreviewCode
            id="lineCharts-chart-one"
            category="line-charts"
            block="chart-one"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="LineCharts Chart Two">
          <template #chart>
            <BlocksLineChartsChartTwo class="max-w-3xl mx-auto bg-default/75!" />
          </template>
          <PreviewCode
            id="lineCharts-chart-two"
            category="line-charts"
            block="chart-two"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="LineCharts Sales">
          <template #chart>
            <BlocksLineChartsChartSales class="max-w-3xl mx-auto bg-default/75!" />
          </template>
          <PreviewCode
            id="lineCharts-chart-sales"
            category="line-charts"
            block="chart-sales"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="LineCharts Chart Four">
          <template #chart>
            <BlocksLineChartsChartNine class="max-w-3xl mx-auto bg-default/75!" />
          </template>
          <PreviewCode
            id="lineCharts-chart-four"
            category="line-charts"
            block="chart-nine"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="LineCharts Chart Five">
          <template #chart>
            <BlocksLineChartsChartFive class="max-w-3xl mx-auto bg-default/75!" />
          </template>
          <PreviewCode
            id="lineCharts-chart-five"
            category="line-charts"
            block="chart-five"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="LineCharts Chart Six">
          <template #chart>
            <BlocksLineChartsChartSix class="max-w-3xl mx-auto bg-default/75!" />
          </template>
          <PreviewCode
            id="lineCharts-chart-six"
            category="line-charts"
            block="chart-six"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="LineCharts Chart Seven">
          <template #chart>
            <BlocksLineChartsChartSeven class="max-w-3xl mx-auto bg-default/75!" />
          </template>
          <PreviewCode
            id="lineCharts-chart-seven"
            category="line-charts"
            block="chart-seven"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="LineCharts Chart Eight">
          <template #chart>
            <BlocksLineChartsChartEight class="max-w-3xl mx-auto bg-default/75!" />
          </template>
          <PreviewCode
            id="lineCharts-chart-eight"
            category="line-charts"
            block="chart-eight"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Line Chart With Marker">
          <template #chart>
            <BlocksLineChartsWithMarker class="max-w-3xl mx-auto bg-default/75!" />
          </template>
          <PreviewCode
            id="line-chart-with-marker"
            category="line-charts"
            block="with-marker"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="LineCharts Chart Nine">
          <template #chart>
            <BlocksLineChartsChartFour class="max-w-3xl mx-auto bg-default/75!" />
          </template>
          <PreviewCode
            id="lineCharts-chart-nine"
            category="line-charts"
            block="chart-four"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="LineCharts Chart Ten">
          <template #chart>
            <BlocksLineChartsChartTen class="max-w-3xl mx-auto bg-default/75!" />
          </template>
          <PreviewCode
            id="lineCharts-chart-ten"
            category="line-charts"
            block="chart-ten"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
