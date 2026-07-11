<script setup lang="ts">
import type { SparklineProps } from './types'

const {
  data,
  type = 'line',
  color = 'var(--ui-primary)',
  width = 120,
  height = 32,
  strokeWidth = 2,
  showArea = false,
  showLastPoint = false,
  min,
  max
} = defineProps<SparklineProps>()

const gradientId = `sparkline-gradient-${Math.random().toString(36).slice(2, 9)}`

const scale = computed(() => {
  const values = data.length ? data : [0]
  const lo = min ?? Math.min(...values)
  const hi = max ?? Math.max(...values)
  // Avoid a zero range so a flat series renders as a centered line.
  const range = hi - lo || 1
  const pad = strokeWidth
  const innerW = width - pad * 2
  const innerH = height - pad * 2

  const x = (i: number) =>
    values.length <= 1 ? width / 2 : pad + (i / (values.length - 1)) * innerW
  const y = (v: number) => pad + innerH - ((v - lo) / range) * innerH

  return { x, y, values }
})

const points = computed(() =>
  scale.value.values.map((v, i) => ({ x: scale.value.x(i), y: scale.value.y(v) }))
)

const linePath = computed(() =>
  points.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
)

const areaPath = computed(() => {
  if (!points.value.length) return ''
  const first = points.value[0]!
  const last = points.value[points.value.length - 1]!
  return `${linePath.value} L${last.x.toFixed(2)},${height} L${first.x.toFixed(2)},${height} Z`
})

const bars = computed(() => {
  const n = scale.value.values.length
  if (!n) return []
  const gap = 2
  const barW = Math.max(1, (width - gap * (n - 1)) / n)
  const base = height - strokeWidth
  return scale.value.values.map((v, i) => {
    const top = scale.value.y(v)
    return {
      x: i * (barW + gap),
      y: top,
      width: barW,
      height: Math.max(1, base - top)
    }
  })
})

const lastPoint = computed(() => points.value[points.value.length - 1])
</script>

<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    fill="none"
    preserveAspectRatio="none"
    class="overflow-visible"
    role="img"
  >
    <defs v-if="type === 'area' || showArea">
      <linearGradient
        :id="gradientId"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop
          offset="0%"
          :stop-color="color"
          stop-opacity="0.35"
        />
        <stop
          offset="100%"
          :stop-color="color"
          stop-opacity="0"
        />
      </linearGradient>
    </defs>

    <template v-if="type === 'bar'">
      <rect
        v-for="(bar, i) in bars"
        :key="i"
        :x="bar.x"
        :y="bar.y"
        :width="bar.width"
        :height="bar.height"
        :fill="color"
        rx="1"
      />
    </template>

    <template v-else>
      <path
        v-if="type === 'area' || showArea"
        :d="areaPath"
        :fill="`url(#${gradientId})`"
      />
      <path
        :d="linePath"
        :stroke="color"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        v-if="showLastPoint && lastPoint"
        :cx="lastPoint.x"
        :cy="lastPoint.y"
        :r="strokeWidth + 1"
        :fill="color"
      />
    </template>
  </svg>
</template>
