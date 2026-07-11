<script lang="ts" setup>
import ContributionGraph from '~/components/lib/ContributionGraph/ContributionGraph.vue'
import type { ContributionDay } from '~/components/lib/ContributionGraph/types'

defineOptions({
  tags: ['blocks', 'heatmaps', 'contribution-year']
})

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

const data = computed<ContributionDay[]>(() => {
  const rng = seeded(101)
  const days: ContributionDay[] = []
  const end = new Date()
  const cursor = new Date(end)
  cursor.setDate(cursor.getDate() - 364)
  while (cursor <= end) {
    const weekend = cursor.getDay() === 0 || cursor.getDay() === 6
    const r = rng()
    const count = r > (weekend ? 0.75 : 0.35) ? Math.floor(rng() * (weekend ? 6 : 12)) : 0
    days.push({ date: cursor.toISOString().slice(0, 10), count })
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
})

const total = computed(() => data.value.reduce((sum, d) => sum + d.count, 0))
</script>

<template>
  <UCard class="w-full overflow-x-auto">
    <div class="mb-4 min-w-max space-y-1">
      <h3 class="text-highlighted font-semibold">
        {{ total.toLocaleString() }} contributions in the last year
      </h3>
      <p class="text-muted text-sm">
        Daily activity across weeks and months.
      </p>
    </div>
    <div class="min-w-max">
      <ContributionGraph
        :data="data"
        color="var(--ui-success)"
      />
    </div>
  </UCard>
</template>
