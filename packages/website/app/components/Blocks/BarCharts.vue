<script setup lang="ts">
defineOptions({
  tags: ['blocks', 'barcharts']
})
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold">
        Bar Charts
      </h2>
      <p class="text-toned dark:text-muted">
        Explore the collection of high quality bar charts.
      </p>
    </div>
    <ClientOnly>
      <div class="mt-12 space-y-24 lg:mt-0">
        <PreviewExample title="Bar Chart One">
          <template #chart>
            <BlocksBarChartsChartOne class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="bar-chart-one"
            category="bar-charts"
            block="chart-one"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Bar Chart Two">
          <template #chart>
            <BlocksBarChartsChartTwo class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="bar-chart-two"
            category="bar-charts"
            block="chart-two"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Developer Salaries">
          <template #chart>
            <BlocksBarChartsChartFifteen class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="bar-chart-fifteen"
            category="bar-charts"
            block="chart-fifteen"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Project Progress">
          <template #chart>
            <BlocksBarChartsChartFourteen class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="bar-chart-fourteen"
            category="bar-charts"
            block="chart-fourteen"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Bar Chart Three">
          <template #chart>
            <BlocksBarChartsChartThree class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="bar-chart-three"
            category="bar-charts"
            block="chart-three"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Bar Chart Four">
          <template #chart>
            <BlocksBarChartsChartFour class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="bar-chart-four"
            category="bar-charts"
            block="chart-four"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Bar Chart Five">
          <template #chart>
            <BlocksBarChartsChartFive class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="bar-chart-five"
            category="bar-charts"
            block="chart-five"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Bar Chart Six">
          <template #chart>
            <BlocksBarChartsChartSix class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="bar-chart-six"
            category="bar-charts"
            block="chart-six"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Bar Chart Seven">
          <template #chart>
            <BlocksBarChartsChartSeven class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="bar-chart-seven"
            category="bar-charts"
            block="chart-seven"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Bar Chart Eight">
          <template #chart>
            <BlocksBarChartsChartEight class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="bar-chart-eight"
            category="bar-charts"
            block="chart-eight"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Bar Chart Nine">
          <template #chart>
            <BlocksBarChartsChartNine class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="bar-chart-nine"
            category="bar-charts"
            block="chart-nine"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Bar Chart Ten">
          <template #chart>
            <BlocksBarChartsChartTen class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="bar-chart-ten"
            category="bar-charts"
            block="chart-ten"
            :lock-code="true"
          />
        </PreviewExample>

        <PreviewExample title="Bar Chart Eleven">
          <template #chart>
            <BlocksBarChartsChartEleven class="max-w-2xl mx-auto bg-default!" />
          </template>
          <PreviewCode
            id="bar-chart-eleven"
            category="bar-charts"
            block="chart-eleven"
            :lock-code="true"
          />
        </PreviewExample>
      </div>
    </ClientOnly>
  </div>
</template>
