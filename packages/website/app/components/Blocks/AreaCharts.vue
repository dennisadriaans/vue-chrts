<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'areacharts']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Area Charts
      </h2>
      <p class="text-toned dark:text-muted">
        Explore the collection of high quality area charts.
      </p>
    </div>
    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Area Chart Preview">
          <template #chart>
            <BlocksAreaChartsChartPreview class="max-w-3xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="area-chart-preview"
            category="area-charts"
            block="chart-preview"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Area Chart One">
          <template #chart>
            <BlocksAreaChartsChartOne class="max-w-3xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="area-chart-one"
            category="area-charts"
            block="chart-one"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Area Chart Data">
          <template #chart>
            <BlocksAreaChartsChartWithData class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="area-chart-data"
            category="area-charts"
            block="chart-with-data"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Area Chart Two">
          <template #chart>
            <BlocksAreaChartsChartTwo class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="area-chart-two"
            category="area-charts"
            block="chart-two"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Area Chart Three">
          <template #chart>
            <BlocksAreaChartsChartThree class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="area-chart-three"
            category="area-charts"
            block="chart-three"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Area Chart Four">
          <template #chart>
            <BlocksAreaChartsChartFour class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="area-chart-four"
            category="area-charts"
            block="chart-four"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Area Chart Five">
          <template #chart>
            <BlocksAreaChartsChartFive class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="area-chart-five"
            category="area-charts"
            block="chart-five"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Area Chart Six">
          <template #chart>
            <BlocksAreaChartsChartSix class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="area-chart-six"
            category="area-charts"
            block="chart-six"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Area Chart Seven">
          <template #chart>
            <BlocksAreaChartsChartSeven class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="area-chart-seven"
            category="area-charts"
            block="chart-seven"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Area Chart Eight">
          <template #chart>
            <BlocksAreaChartsChartEight class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="area-chart-eight"
            category="area-charts"
            block="chart-eight"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Area Chart Nine">
          <template #chart>
            <BlocksAreaChartsChartNine class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="area-chart-nine"
            category="area-charts"
            block="chart-nine"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Area Chart Ten">
          <template #chart>
            <BlocksAreaChartsChartTen class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="area-chart-ten"
            category="area-charts"
            block="chart-ten"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
