<script setup lang="ts">
import type { ContributionGraphProps } from './types'

const {
  data,
  levels = 4,
  color = 'var(--ui-primary)',
  cellSize = 12,
  cellGap = 3,
  cellRadius = 2,
  showWeekdayLabels = true,
  showMonthLabels = true,
  showLegend = true,
  maxCount,
  tooltipFormatter
} = defineProps<ContributionGraphProps>()

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function toKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

const countByDate = computed(() => {
  const map = new Map<string, number>()
  for (const d of data) map.set(d.date, (map.get(d.date) ?? 0) + d.count)
  return map
})

const bounds = computed(() => {
  const keys = data.map(d => d.date).sort()
  const end = keys.length ? new Date(keys[keys.length - 1]!) : new Date()
  const start = keys.length ? new Date(keys[0]!) : new Date(end)
  // Snap start back to Sunday so every column is a full week.
  start.setDate(start.getDate() - start.getDay())
  return { start, end }
})

const scaleMax = computed(() => {
  if (maxCount) return maxCount
  let m = 0
  for (const v of countByDate.value.values()) m = Math.max(m, v)
  return m || 1
})

interface Cell {
  date: string
  count: number
  level: number
  x: number
  y: number
}

const weeks = computed<Cell[][]>(() => {
  const cols: Cell[][] = []
  const cursor = new Date(bounds.value.start)
  const end = bounds.value.end
  let x = 0

  while (cursor <= end) {
    const col: Cell[] = []
    for (let day = 0; day < 7; day++) {
      const key = toKey(cursor)
      const count = countByDate.value.get(key) ?? 0
      const level = count === 0 ? 0 : Math.min(levels, Math.ceil((count / scaleMax.value) * levels))
      col.push({ date: key, count, level, x, y: day })
      cursor.setDate(cursor.getDate() + 1)
    }
    cols.push(col)
    x++
  }
  return cols
})

const width = computed(() => weeks.value.length * (cellSize + cellGap))

const monthLabels = computed(() => {
  const out: { label: string, x: number }[] = []
  let lastMonth = -1
  weeks.value.forEach((col, i) => {
    const firstDay = new Date(col[0]!.date)
    const month = firstDay.getMonth()
    if (month !== lastMonth) {
      out.push({ label: MONTHS[month]!, x: i * (cellSize + cellGap) })
      lastMonth = month
    }
  })
  return out
})

function levelOpacity(level: number) {
  if (level === 0) return 0
  // Ramp from ~0.25 up to 1 across the levels.
  return 0.25 + (level / levels) * 0.75
}

const legendLevels = computed(() => Array.from({ length: levels + 1 }, (_, i) => i))

const tooltip = ref<{ x: number, y: number, text: string }>()

function formatTooltip(cell: Cell) {
  if (tooltipFormatter) return tooltipFormatter({ date: cell.date, count: cell.count })
  const noun = cell.count === 1 ? 'contribution' : 'contributions'
  const d = new Date(cell.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${cell.count} ${noun} on ${d}`
}

function showTooltip(event: MouseEvent, cell: Cell) {
  tooltip.value = { x: event.clientX + 12, y: event.clientY + 12, text: formatTooltip(cell) }
}

function hideTooltip() {
  tooltip.value = undefined
}

const weekdayOffsetY = computed(() => (showMonthLabels ? cellSize + 4 : 0))
</script>

<template>
  <div
    data-testid="contribution-graph"
    class="inline-flex flex-col gap-2"
  >
    <div class="flex gap-2">
      <!-- Weekday labels -->
      <div
        v-if="showWeekdayLabels"
        class="text-dimmed flex flex-col text-[10px] leading-none"
        :style="{ paddingTop: `${weekdayOffsetY}px` }"
      >
        <div
          v-for="(day, i) in WEEKDAYS"
          :key="day"
          class="flex items-center"
          :style="{ height: `${cellSize + cellGap}px` }"
        >
          <span :class="i % 2 === 1 ? '' : 'opacity-0'">{{ day.slice(0, 3) }}</span>
        </div>
      </div>

      <svg
        :width="width"
        :height="(cellSize + cellGap) * 7 + weekdayOffsetY"
        :viewBox="`0 0 ${width} ${(cellSize + cellGap) * 7 + weekdayOffsetY}`"
        role="img"
      >
        <!-- Month labels -->
        <template v-if="showMonthLabels">
          <text
            v-for="m in monthLabels"
            :key="`${m.label}-${m.x}`"
            :x="m.x"
            :y="cellSize - 2"
            class="fill-dimmed text-[10px]"
          >
            {{ m.label }}
          </text>
        </template>

        <g :transform="`translate(0, ${weekdayOffsetY})`">
          <template
            v-for="(col, ci) in weeks"
            :key="ci"
          >
            <rect
              v-for="cell in col"
              :key="cell.date"
              :x="cell.x * (cellSize + cellGap)"
              :y="cell.y * (cellSize + cellGap)"
              :width="cellSize"
              :height="cellSize"
              :rx="cellRadius"
              :fill="cell.level === 0 ? 'var(--ui-bg-elevated)' : color"
              :fill-opacity="cell.level === 0 ? 1 : levelOpacity(cell.level)"
              class="stroke-default/40 transition-opacity hover:stroke-2"
              stroke-width="1"
              @mouseenter="e => showTooltip(e, cell)"
              @mousemove="e => showTooltip(e, cell)"
              @mouseleave="hideTooltip"
            />
          </template>
        </g>
      </svg>
    </div>

    <!-- Legend -->
    <div
      v-if="showLegend"
      class="text-dimmed flex items-center justify-end gap-1 text-[10px]"
    >
      <span>Less</span>
      <svg
        :width="(cellSize + cellGap) * legendLevels.length"
        :height="cellSize"
      >
        <rect
          v-for="lvl in legendLevels"
          :key="lvl"
          :x="lvl * (cellSize + cellGap)"
          :y="0"
          :width="cellSize"
          :height="cellSize"
          :rx="cellRadius"
          :fill="lvl === 0 ? 'var(--ui-bg-elevated)' : color"
          :fill-opacity="lvl === 0 ? 1 : levelOpacity(lvl)"
        />
      </svg>
      <span>More</span>
    </div>

    <!-- Tooltip -->
    <Teleport to="body">
      <div
        v-if="tooltip"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
        class="bg-inverted text-inverted pointer-events-none fixed z-50 rounded px-2 py-1 text-xs shadow"
      >
        {{ tooltip.text }}
      </div>
    </Teleport>
  </div>
</template>
