<script lang="ts" setup>
defineOptions({
  tags: ['statustrackercharts', 'basic']
})

interface StatusSample {
  status: string
  label: string
}

const statusCategories: Record<string, BulletLegendItemInterface> = {
  operational: { name: 'Operational', color: 'var(--color-green-500)' },
  degraded: { name: 'Degraded', color: 'var(--color-amber-400)' },
  outage: { name: 'Outage', color: 'var(--color-red-500)' }
}

// 90 days of synthetic uptime history, oldest → newest.
const statusHistory: StatusSample[] = Array.from({ length: 90 }, (_, i) => {
  const day = i + 1
  let status = 'operational'
  if (day === 34 || day === 71) status = 'outage'
  else if (day % 17 === 0) status = 'degraded'
  return { status, label: `Day ${day}` }
})
</script>

<template>
  <StatusTrackerChart
    :data="statusHistory"
    :categories="statusCategories"
    title="api.example.com"
    summary="99.94% uptime"
    start-label="90 days ago"
    end-label="Today"
    :height="30"
    :bar-width="7"
    :bar-gap="3"
  />
</template>
