<script lang="ts" setup>
defineOptions({
  tags: ['donutcharts', 'basic']
})

const data = [
  { name: 'Product', percentage: 45 },
  { name: 'Services', percentage: 25 },
  { name: 'Support', percentage: 20 },
  { name: 'Other', percentage: 10 }
]

const categories = {
  Product: {
    name: 'Product',
    color: 'var(--color-indigo-500)'
  },
  Services: {
    name: 'Services',
    color: 'var(--color-purple-500)'
  },
  Support: {
    name: 'Support',
    color: 'var(--color-pink-500)'
  },
  Other: {
    name: 'Other',
    color: 'var(--color-rose-400)'
  }
}
</script>

<template>
  <DonutChart
    :data="data.map((i) => i.percentage)"
    :height="160"
    :categories="categories"
    :hide-legend="true"
    :type="DonutType.Full"
    :radius="0"
  >
    <div class="text-center">
      <div class="font-semibold">
        Label
      </div>
      <div class="text-muted">
        2 seconds ago
      </div>
    </div>
  </DonutChart>
</template>
