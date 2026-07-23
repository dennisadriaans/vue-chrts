<script setup lang="ts">
import ContributionGraph from '~/components/lib/ContributionGraph/ContributionGraph.vue'
import type { ContributionDay } from '~/components/lib/ContributionGraph/types'

// Deterministic pseudo-random so SSR and client render identically.
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

const data = computed<ContributionDay[]>(() => {
  const rng = seeded(42)
  const days: ContributionDay[] = []
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - 364)

  const cursor = new Date(start)
  while (cursor <= end) {
    const weekend = cursor.getDay() === 0 || cursor.getDay() === 6
    const r = rng()
    // Sparser on weekends, occasional zero days everywhere.
    let count = 0
    if (r > (weekend ? 0.75 : 0.35)) {
      count = Math.floor(rng() * (weekend ? 6 : 12))
    }
    days.push({ date: cursor.toISOString().slice(0, 10), count })
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
})
</script>

<template>
  <UCard class="w-full overflow-x-auto">
    <div class="min-w-max">
      <ContributionGraph
        :data="data"
        color="var(--ui-success)"
      />
    </div>
  </UCard>
</template>
