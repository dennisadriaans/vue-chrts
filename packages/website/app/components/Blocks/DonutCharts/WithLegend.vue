<script setup lang="ts">
defineOptions({
  tags: ['donutcharts', 'withlegend']
})

const donutData = ref([35, 25, 20, 15, 5])

const marketShareLabels = {
  'Product A': {
    name: 'Product A',
    color: 'var(--ui-primary)'
  },
  'Product B': {
    name: 'Product B',
    color: 'var(--ui-info)'
  },
  'Product C': {
    name: 'Product C',
    color: 'var(--ui-success)'
  },
  'Product D': {
    name: 'Product D',
    color: 'var(--ui-warning)'
  },
  'Other': {
    name: 'Other',
    color: 'var(--ui-error)'
  }
}
</script>

<template>
  <DonutChart
    :data="donutData"
    :categories="marketShareLabels"
    :height="160"
    :radius="80"
    :pad-angle="0.1"
    :arc-width="20"
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
