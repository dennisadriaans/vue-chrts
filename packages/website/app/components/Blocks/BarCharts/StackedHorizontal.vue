<script lang="ts" setup>
const data = Array.from({ length: 6 }).map((_, i) => ({
  day: i,

  Marketing: Math.floor(Math.random() * 15) + 5,
  Sales: Math.floor(Math.random() * 15) + 5,
  Design: Math.floor(Math.random() * 15) + 5,
  Development: Math.floor(Math.random() * 20) + 10,
  Testing: Math.floor(Math.random() * 15) + 5,
  Security: Math.floor(Math.random() * 15) + 5,
  Monitoring: Math.floor(Math.random() * 15) + 5
}))

const categories = {

  Development: { name: 'Development', color: 'var(--color-violet-600)' },
  Security: { name: 'Security', color: 'var(--color-indigo-500)' },

  Testing: { name: 'Testing', color: 'var(--color-emerald-400)' },
  Monitoring: { name: 'Monitoring', color: 'var(--color-cyan-500)' },

  Marketing: { name: 'Marketing', color: 'var(--color-orange-400)' },
  Sales: { name: 'Sales', color: 'var(--color-amber-500)' },
  Design: { name: 'Design', color: 'var(--color-rose-400)' }
}

const yAxis: (keyof (typeof data)[number])[] = [

  'Marketing',
  'Sales',
  'Design',
  'Development',
  'Testing', 'Security', 'Monitoring'
]

const xFormatter = (i: number): string => {
  if (i === 0) return 'Jan 1'
  return ''
}
</script>

<template>
  <BarChart
    :data="data"
    :stacked="true"
    :height="120"
    :categories="categories"
    :orientation="Orientation.Horizontal"
    :y-axis="yAxis"
    :group-padding="0"
    :bar-padding="0.4"
    :radius="1"
    :x-formatter="xFormatter"
    :y-grid-line="false"
    :x-grid-line="false"
    x-label="Time of Day"
    y-label="Visitors"
  />
</template>
