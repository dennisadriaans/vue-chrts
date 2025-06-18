<template>
  <div class="chart-page">
    <h1>Bubble Chart Demo</h1>

    <section class="chart-section">
      <h2>Basic Bubble Chart</h2>
      <Card>
        <BubbleChart :data="sampleBubbleData" :width="600" :height="400" />
      </Card>
      <pre>&lt;BubbleChart :data="sampleBubbleData" :width="600" :height="400" /&gt;</pre>
    </section>

    <section class="chart-section">
      <h2>Bubble Chart with Custom Options</h2>
      <Card>
        <BubbleChart
          :data="customBubbleData"
          :width="700"
          :height="500"
          :xAxisOptions="{ show: true, label: 'X-Axis Value', gridlines: true }"
          :yAxisOptions="{ show: true, label: 'Y-Axis Value', gridlines: true }"
          :labelOptions="{ show: true, fontSize: 10, color: '#333' }"
          :sizeOptions="{ minRadius: 5, maxRadius: 50, scale: 'sqrt' }"
          chartTitle="Customized Bubble Chart"
          :showLegend="true"
        />
      </Card>
      <pre>
&lt;BubbleChart
  :data="customBubbleData"
  :width="700"
  :height="500"
  :xAxisOptions="{ show: true, label: 'X-Axis Value', gridlines: true }"
  :yAxisOptions="{ show: true, label: 'Y-Axis Value', gridlines: true }"
  :labelOptions="{ show: true, fontSize: 10, color: '#333' }"
  :sizeOptions="{ minRadius: 5, maxRadius: 50, scale: 'sqrt' }"
  chartTitle="Customized Bubble Chart"
  :showLegend="true"
/&gt;
      </pre>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { BubbleChart, BubbleDataItem } from '../lib'; // Assuming BubbleChart is exported from lib
import Card from './elements/Card.vue'; // Assuming Card component exists

export default defineComponent({
  name: 'BubbleChartPage',
  components: {
    BubbleChart,
    Card,
  },
  setup() {
    const sampleBubbleData = ref<BubbleDataItem[]>([
      { id: '1', xValue: 10, yValue: 20, sizeValue: 30, label: 'A', category: 'Cat1' },
      { id: '2', xValue: 15, yValue: 25, sizeValue: 50, label: 'B', category: 'Cat1' },
      { id: '3', xValue: 22, yValue: 10, sizeValue: 20, label: 'C', category: 'Cat2' },
      { id: '4', xValue: 30, yValue: 35, sizeValue: 70, label: 'D', category: 'Cat2' },
      { id: '5', xValue: 8,  yValue: 18, sizeValue: 40, label: 'E', category: 'Cat3' },
    ]);

    const customBubbleData = ref<BubbleDataItem[]>([
      { id: 'alpha', xValue: 50, yValue: 60, sizeValue: 100, label: 'Alpha', color: '#FF6384', category: 'Group X' },
      { id: 'beta',  xValue: 70, yValue: 80, sizeValue: 150, label: 'Beta',  color: '#36A2EB', category: 'Group X' },
      { id: 'gamma', xValue: 90, yValue: 40, sizeValue: 80,  label: 'Gamma', color: '#FFCE56', category: 'Group Y' },
      { id: 'delta', xValue: 60, yValue: 75, sizeValue: 120, label: 'Delta', color: '#4BC0C0', category: 'Group Y' },
      { id: 'epsilon', xValue: 80,yValue: 55, sizeValue: 90,  label: 'Epsilon',color: '#9966FF', category: 'Group Z' },
    ]);

    return {
      sampleBubbleData,
      customBubbleData,
    };
  },
});
</script>

<style scoped>
.chart-page {
  padding: 20px;
  font-family: Arial, sans-serif;
}
.chart-section {
  margin-bottom: 40px;
}
.chart-section h2 {
  margin-bottom: 10px;
  color: #333;
}
pre {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9em;
  margin-top: 10px;
}
</style>
