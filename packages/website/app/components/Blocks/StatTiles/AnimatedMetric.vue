<script lang="ts" setup>
import StatTile from '~/components/lib/StatTile/StatTile.vue'

defineOptions({
  tags: ['blocks', 'stat-tiles', 'animated-metric']
})

const value = ref('128,940')
const sparkline = ref([60, 72, 68, 84, 79, 96, 92, 110, 104, 122, 118, 129])

// Re-trigger the rolling animation on click for the demo.
function shuffle() {
  const n = Math.floor(120000 + Math.random() * 20000)
  value.value = n.toLocaleString('en-US')
  sparkline.value = sparkline.value.map(v => Math.max(40, v + Math.round((Math.random() - 0.4) * 20)))
}
</script>

<template>
  <div class="mx-auto w-full max-w-sm space-y-3">
    <StatTile
      label="Total impressions"
      :value="value"
      icon="i-lucide-eye"
      :trend="{ value: '+18.2%', direction: 'up' }"
      caption="last 30 days"
      :sparkline="sparkline"
      sparkline-type="area"
      animate
    />
    <UButton
      block
      color="neutral"
      variant="soft"
      icon="i-lucide-refresh-cw"
      @click="shuffle"
    >
      Update value
    </UButton>
  </div>
</template>
