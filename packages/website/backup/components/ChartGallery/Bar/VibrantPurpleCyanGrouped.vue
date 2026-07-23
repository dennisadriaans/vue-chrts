<script setup lang="ts">
interface Props {
  height: number
}

defineProps<Props>()

const data = [
  { month: 'Jan', desktop: 340, mobile: 180 },
  { month: 'Feb', desktop: 420, mobile: 240 },
  { month: 'Mar', desktop: 380, mobile: 320 }
]
const categories = {
  desktop: { name: 'Desktop', color: '#8b5cf6' },
  mobile: { name: 'Mobile', color: '#06b6d4' }
}
</script>

<template>
  <BarChart
    :data="data"
    :height="height"
    :categories="categories"
    :y-axis="['desktop', 'mobile']"
    :x-formatter="createXFormatter(data, 'month')"
    :legend-position="LegendPosition.BottomCenter"
    :hide-legend="false"
    :y-grid-line="false"
    :x-grid-line="false"
    :y-domain-line="true"
    :x-domain-line="true"
    :radius="4"
    :group-padding="0.3"
    :bar-padding="0.1"
  />
</template>
