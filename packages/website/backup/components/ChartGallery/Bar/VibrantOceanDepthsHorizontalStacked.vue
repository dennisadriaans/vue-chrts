<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { channel: 'Organic', views: 4500, clicks: 1200 },
  { channel: 'Paid', views: 3200, clicks: 1800 },
  { channel: 'Social', views: 5100, clicks: 950 }
]
const categories = {
  views: { name: 'Views', color: '#0ea5e9' },
  clicks: { name: 'Clicks', color: '#06b6d4' }
}
</script>

<template>
  <BarChart
    :data="data"
    :height="height"
    :categories="categories"
    :y-axis="['views', 'clicks']"
    :stacked="true"
    :orientation="Orientation.Horizontal"
    :x-formatter="(i: number) => String(i)"
    :y-formatter="createXFormatter(data, 'channel')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="false"
    :x-grid-line="true"
    :radius="8"
    :bar-padding="0.4"
  />
</template>
