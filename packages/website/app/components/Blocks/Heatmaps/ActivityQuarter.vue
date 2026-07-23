<script lang="ts" setup>
import ContributionGraph from '~/components/lib/ContributionGraph/ContributionGraph.vue'
import type { ContributionDay } from '~/components/lib/ContributionGraph/types'

defineOptions({
  tags: ['blocks', 'heatmaps', 'activity-quarter']
})

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

// A denser ~90 day window with a custom accent color and tooltip.
const data = computed<ContributionDay[]>(() => {
  const rng = seeded(303)
  const days: ContributionDay[] = []
  const end = new Date()
  const cursor = new Date(end)
  cursor.setDate(cursor.getDate() - 90)
  while (cursor <= end) {
    const r = rng()
    const count = r > 0.25 ? Math.floor(rng() * 20) : 0
    days.push({ date: cursor.toISOString().slice(0, 10), count })
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
})

function tooltipFormatter(day: { date: string, count: number }) {
  const d = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${day.count} events · ${d}`
}
</script>

<template>
  <UCard class="w-full overflow-x-auto">
    <div class="mb-4 min-w-max space-y-1">
      <h3 class="text-highlighted font-semibold">
        Event activity
      </h3>
      <p class="text-muted text-sm">
        Larger cells, a custom accent color and a custom tooltip.
      </p>
    </div>
    <div class="min-w-max">
      <ContributionGraph
        :data="data"
        color="var(--ui-primary)"
        :cell-size="15"
        :cell-gap="4"
        :cell-radius="3"
        :tooltip-formatter="tooltipFormatter"
      />
    </div>
  </UCard>
</template>
